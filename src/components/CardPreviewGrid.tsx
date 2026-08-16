import React, { useState, useRef } from 'react';
import { BuffetItem, DesignSettings, AllergenKey } from '../types/buffet';
import { BuffetCard } from './BuffetCard';
import { BarMenuView } from './BarMenuView';
import { FullMenuSheetView } from './FullMenuSheetView';
import { ALLERGEN_MAP, COMMON_ALLERGEN_KEYS } from '../utils/allergens';
import { getTemplateById, calculateSheetLayout } from '../utils/templates';
import { generateProcessedItemsForPrint } from '../utils/translator';
import {
  Plus,
  Layers,
  Filter,
  ZoomIn,
  ZoomOut,
  Tag,
  Download,
  Printer,
  FileArchive,
  ChevronLeft,
  ChevronRight,
  FileText,
  Grid,
  Sparkles,
  RotateCw,
  Eye,
  Check,
  ArrowUp,
  ArrowDown,
  AArrowUp,
  AArrowDown,
  MoveVertical,
  Sliders,
  Compass,
  FileCheck,
  Type,
  Pin,
  PinOff,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { downloadMultiPagePdf, downloadPdfSheetsZip } from '../utils/pdfGenerator';

interface CardPreviewGridProps {
  items: BuffetItem[];
  settings: DesignSettings;
  onUpdateItem: (updated: BuffetItem) => void;
  onDeleteItem: (id: string) => void;
  onDuplicateItem: (item: BuffetItem) => void;
  onAddItem: () => void;
  onClearAll: () => void;
  onBatchAddTag: (tag: AllergenKey, stationFilter?: string) => void;
  onTriggerPrint: (specificSheetIndex?: number) => void;
  onUpdateBarSettings?: (barSettings: Partial<DesignSettings['barSettings']>) => void;
  onUpdateFullMenuSettings?: (fullMenuSettings: Partial<DesignSettings['fullMenuSettings']>) => void;
  onUpdateSettings?: (settings: Partial<DesignSettings>) => void;
}

export const CardPreviewGrid: React.FC<CardPreviewGridProps> = ({
  items,
  settings,
  onUpdateItem,
  onDeleteItem,
  onDuplicateItem,
  onAddItem,
  onClearAll,
  onBatchAddTag,
  onTriggerPrint,
  onUpdateBarSettings,
  onUpdateFullMenuSettings,
  onUpdateSettings,
}) => {
  const [viewMode, setViewMode] = useState<'sheet' | 'cards'>('sheet');
  const [activeSheetIndex, setActiveSheetIndex] = useState<number>(0);
  const [selectedStation, setSelectedStation] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(95);
  const [showBatchTools, setShowBatchTools] = useState<boolean>(false);
  const [globalPreviewSide, setGlobalPreviewSide] = useState<'front' | 'back'>('front');
  const [isExportingZip, setIsExportingZip] = useState<boolean>(false);
  const [exportProgress, setExportProgress] = useState<string>('');
  const [isExportingSheetImg, setIsExportingSheetImg] = useState<boolean>(false);
  const [isFloatingPreview, setIsFloatingPreview] = useState<boolean>(false);
  const [isFloatingMinimized, setIsFloatingMinimized] = useState<boolean>(false);

  const sheetRef = useRef<HTMLDivElement>(null);

  // If in Bar Menu Mode or 8.5x11 Bar Template
  if (settings.mode === 'bar_menu' || settings.templateId === 'sheet-bar-8.5x11') {
    return (
      <div className="space-y-4">
        <BarMenuView
          items={items}
          settings={settings}
          onUpdateItem={onUpdateItem}
          onDeleteItem={onDeleteItem}
          onAddItem={onAddItem}
          onUpdateBarSettings={onUpdateBarSettings}
        />
      </div>
    );
  }

  // If in Full Menu Sheet Mode or 8.5x11 Full Sheet Template
  if (settings.mode === 'full_menu_sheet' || settings.templateId === 'sheet-full-8.5x11') {
    return (
      <div className="space-y-4">
        <FullMenuSheetView
          items={items}
          settings={settings}
          onUpdateItem={onUpdateItem}
          onDeleteItem={onDeleteItem}
          onAddItem={onAddItem}
          onUpdateFullMenuSettings={onUpdateFullMenuSettings}
        />
      </div>
    );
  }

  // Extract unique stations
  const stations = Array.from(new Set(items.map((i) => i.station || 'General Menu'))).filter(Boolean);

  const filteredItems = selectedStation === 'all'
    ? items
    : items.filter((i) => (i.station || 'General Menu') === selectedStation);

  // Process items for Dual-Language Separate Cards or Combined Cards
  const processedLanguageItems = generateProcessedItemsForPrint(
    filteredItems,
    settings.showDualLanguage,
    settings.dualLanguageMode || 'single_dual',
    settings.targetLanguage || 'es',
    settings.primaryLanguage || 'en'
  );

  const template = getTemplateById(settings.templateId);
  const layout = template.id !== 'custom-template'
    ? { columns: template.columns, rows: template.rows, cardsPerSheet: template.cardsPerSheet }
    : calculateSheetLayout(settings.widthIn, settings.heightIn);

  const cardsPerSheet = layout.cardsPerSheet || 10;
  const copiesCount = Math.max(1, settings.menuCopies || 1);

  // Expand items for copies
  const expandedItems: BuffetItem[] = [];
  for (let c = 0; c < copiesCount; c++) {
    for (const item of processedLanguageItems) {
      expandedItems.push({
        ...item,
        id: c === 0 ? item.id : `${item.id}_copy_${c}`,
      });
    }
  }

  const totalCardsToPrint = expandedItems.length;
  const totalSheets = Math.max(1, Math.ceil(totalCardsToPrint / cardsPerSheet));
  const currentSheetNumber = Math.min(activeSheetIndex, totalSheets - 1);

  // Slice items for current sheet view
  const currentSheetItems = expandedItems.slice(
    currentSheetNumber * cardsPerSheet,
    (currentSheetNumber + 1) * cardsPerSheet
  );

  const isDoubleSided = settings.printSides === 'double';

  // Handle in-place card editing for primary or separate translated cards
  const handleItemInPlaceUpdate = (updatedCard: BuffetItem) => {
    if (updatedCard.parentItemId) {
      const parent = items.find((i) => i.id === updatedCard.parentItemId);
      if (parent) {
        if (updatedCard.isTranslatedCard) {
          onUpdateItem({
            ...parent,
            translationName: updatedCard.name,
            translationDesc: updatedCard.description,
            tags: updatedCard.tags,
            station: updatedCard.station,
            price: updatedCard.price,
          });
        } else {
          onUpdateItem({
            ...parent,
            name: updatedCard.name,
            description: updatedCard.description,
            tags: updatedCard.tags,
            station: updatedCard.station,
            price: updatedCard.price,
          });
        }
        return;
      }
    }
    onUpdateItem(updatedCard);
  };

  // --- Multi-Page PDF Export (All Sheets) ---
  const handleDownloadAllPdf = async () => {
    if (items.length === 0 || isExportingZip) return;
    try {
      setIsExportingZip(true);
      setExportProgress('Preparing 8.5" × 11" pages for PDF...');
      
      const sheetUnits = Array.from(document.querySelectorAll('.page-sheet-unit')) as HTMLElement[];
      const targets = sheetUnits.length > 0 ? sheetUnits : (sheetRef.current ? [sheetRef.current] : []);

      if (targets.length === 0) {
        onTriggerPrint();
        return;
      }

      await downloadMultiPagePdf(
        targets,
        `buffet_labels_${template.code || 'sheet'}_${items.length}items.pdf`,
        (msg) => setExportProgress(msg)
      );
    } catch (err) {
      console.error('Failed to export PDF:', err);
    } finally {
      setIsExportingZip(false);
      setExportProgress('');
    }
  };

  // --- PDF Sheets ZIP Archive (1 PDF file per sheet) ---
  const handleDownloadPdfZip = async () => {
    if (items.length === 0 || isExportingZip) return;
    try {
      setIsExportingZip(true);
      setExportProgress('Creating PDF per sheet archive...');
      
      const sheetUnits = Array.from(document.querySelectorAll('.page-sheet-unit')) as HTMLElement[];
      const targets = sheetUnits.length > 0 ? sheetUnits : (sheetRef.current ? [sheetRef.current] : []);

      if (targets.length === 0) {
        onTriggerPrint();
        return;
      }

      await downloadPdfSheetsZip(
        targets,
        `buffet_pdf_sheets_${template.code || 'export'}.zip`,
        `sheet_${template.code || 'page'}`,
        (msg) => setExportProgress(msg)
      );
    } catch (err) {
      console.error('Failed to export PDF zip:', err);
    } finally {
      setIsExportingZip(false);
      setExportProgress('');
    }
  };

  // --- High-Res Sheet Image PNG Export ---
  const handleDownloadSheetImage = async () => {
    if (!sheetRef.current || isExportingSheetImg) return;
    try {
      setIsExportingSheetImg(true);
      await new Promise((r) => setTimeout(r, 80));

      const dataUrl = await toPng(sheetRef.current, {
        pixelRatio: 2.5,
        cacheBust: true,
        backgroundColor: '#ffffff',
      });

      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `sheet_${currentSheetNumber + 1}_of_${totalSheets}_${template.code}.png`;
      a.click();
    } catch (err) {
      console.error('Failed to export sheet image:', err);
    } finally {
      setIsExportingSheetImg(false);
    }
  };

  const handlePrintCurrentSheetOnly = () => {
    if (onUpdateSettings) {
      onUpdateSettings({ printSelectedSheetOnly: currentSheetNumber + 1 });
    }
    setTimeout(() => {
      onTriggerPrint(currentSheetNumber + 1);
    }, 50);
  };

  const handlePrintAllSheets = () => {
    if (onUpdateSettings) {
      onUpdateSettings({ printSelectedSheetOnly: 0 });
    }
    setTimeout(() => {
      onTriggerPrint(0);
    }, 50);
  };

  return (
    <div className="space-y-4">
      {/* Top Header Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
              Live Interactive Preview
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300/60">
              {items.length} {items.length === 1 ? 'Item' : 'Items'}
            </span>
            <span className="px-2 py-0.5 rounded-md text-[10.5px] font-semibold bg-slate-900 text-amber-400 border border-slate-800">
              {template.name} ({layout.columns} &times; {layout.rows})
            </span>
            {isDoubleSided && (
              <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-blue-50 text-blue-800 border border-blue-200">
                Duplex 2-Sided
              </span>
            )}
            {settings.showDualLanguage && (
              <span className="px-2 py-0.5 rounded-md text-[10.5px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Bilingual Mode
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {viewMode === 'sheet'
              ? `Real 8.5" × 11" Paper Stock Layout • Sheet ${currentSheetNumber + 1} of ${totalSheets} (${cardsPerSheet} labels/sheet)`
              : `Interactive Individual Card Grid • Click any label to edit in place`}
          </p>
        </div>

        {/* View Mode & Export Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sheet View vs Free Grid View Switcher */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('sheet')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
                viewMode === 'sheet'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Paper Sheet (8.5&times;11")</span>
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1.5 ${
                viewMode === 'cards'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Cards Grid</span>
            </button>
          </div>

          {/* Duplex Side Flipper */}
          {isDoubleSided && (
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
              <button
                onClick={() => setGlobalPreviewSide('front')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  globalPreviewSide === 'front'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Front
              </button>
              <button
                onClick={() => setGlobalPreviewSide('back')}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
                  globalPreviewSide === 'back'
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Back
              </button>
            </div>
          )}

          {/* Zoom Controls */}
          <div className="hidden sm:flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-slate-600">
            <button
              onClick={() => setZoomLevel(Math.max(50, zoomLevel - 15))}
              disabled={zoomLevel <= 50}
              className="p-1 hover:text-slate-900 disabled:opacity-40"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="text-[11px] font-mono px-1.5 min-w-[3rem] text-center">
              {zoomLevel}%
            </span>
            <button
              onClick={() => setZoomLevel(Math.min(130, zoomLevel + 15))}
              disabled={zoomLevel >= 130}
              className="p-1 hover:text-slate-900 disabled:opacity-40"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Floating Live Preview Pin/Popout Toggle */}
          <button
            onClick={() => setIsFloatingPreview(!isFloatingPreview)}
            className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border transition flex items-center gap-1.5 ${
              isFloatingPreview
                ? 'bg-amber-100 text-amber-950 border-amber-300 ring-2 ring-amber-400/40'
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
            }`}
            title={isFloatingPreview ? 'Hide Floating Picture-in-Picture Preview' : 'Float preview sheet in a persistent window while editing'}
          >
            {isFloatingPreview ? <PinOff className="w-3.5 h-3.5 text-amber-700" /> : <Pin className="w-3.5 h-3.5 text-slate-600" />}
            <span className="hidden sm:inline">{isFloatingPreview ? 'Floating ON' : 'Float Sheet'}</span>
          </button>

          {/* Multi-Page PDF Download */}
          <button
            onClick={handleDownloadAllPdf}
            disabled={isExportingZip || items.length === 0}
            title="Download all sheets as an 8.5 x 11 multi-page PDF document"
            className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span>{isExportingZip ? 'Exporting PDF...' : 'Download PDF'}</span>
          </button>

          {/* Primary Print / PDF */}
          <button
            onClick={handlePrintAllSheets}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-slate-950" />
            <span>Print All ({totalSheets} {totalSheets === 1 ? 'Sheet' : 'Sheets'})</span>
          </button>
        </div>
      </div>

      {/* Export progress toast if active */}
      {isExportingZip && exportProgress && (
        <div className="bg-amber-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold flex items-center justify-between shadow-md animate-pulse">
          <span>{exportProgress}</span>
          <span className="text-[11px] font-mono">Please wait...</span>
        </div>
      )}

      {/* Sub-bar: Stations & Batch Tags */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Stations */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setSelectedStation('all')}
            className={`px-3 py-1 text-xs font-semibold rounded-full whitespace-nowrap transition ${
              selectedStation === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Items ({items.length})
          </button>
          {stations.map((st) => {
            const count = items.filter((i) => (i.station || 'General Menu') === st).length;
            return (
              <button
                key={st}
                onClick={() => setSelectedStation(st)}
                className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition ${
                  selectedStation === st
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {st} ({count})
              </button>
            );
          })}
        </div>

        {/* Secondary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowBatchTools(!showBatchTools)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition flex items-center gap-1 ${
              showBatchTools
                ? 'bg-slate-800 text-white border-slate-800'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Tag className="w-3 h-3" />
            <span>Batch Tags</span>
          </button>
          <button
            onClick={onAddItem}
            className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 text-xs font-semibold rounded-lg shadow-2xs transition flex items-center gap-1"
          >
            <Plus className="w-3 h-3 text-amber-600" />
            <span>+ Add Label</span>
          </button>
        </div>
      </div>

      {/* Batch Tools Panel */}
      {showBatchTools && (
        <div className="bg-amber-50/70 border border-amber-200/80 p-3.5 rounded-xl space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-900">
              Bulk Tag Applicator (Apply to {selectedStation === 'all' ? 'All Cards' : `"${selectedStation}"`})
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {COMMON_ALLERGEN_KEYS.map((code) => {
              const info = ALLERGEN_MAP[code];
              return (
                <button
                  key={code}
                  onClick={() => onBatchAddTag(code, selectedStation === 'all' ? undefined : selectedStation)}
                  className="px-2 py-1 bg-white hover:bg-amber-100/80 border border-amber-300 text-amber-900 text-[11px] font-medium rounded-md transition shadow-2xs flex items-center gap-1"
                >
                  <span>{info?.icon || '🏷️'}</span>
                  <span>+ {code}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* MAIN PREVIEW CANVAS */}
      {viewMode === 'sheet' ? (
        /* REALISTIC 8.5" x 11" PAPER TEMPLATE SHEET VIEW */
        <div className="bg-slate-200/90 rounded-2xl border border-slate-300 flex flex-col overflow-hidden shadow-inner">
          {/* DEDICATED DOCKED SHEET NAVIGATION BAR (Non-overlapping, placed above scroll canvas) */}
          <div className="bg-white/95 border-b border-slate-200 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-800">
            {/* Sheet Switcher Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveSheetIndex(Math.max(0, currentSheetNumber - 1))}
                disabled={currentSheetNumber === 0}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 transition"
                title="Previous Sheet"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalSheets }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSheetIndex(idx)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold transition ${
                      currentSheetNumber === idx
                        ? 'bg-slate-900 text-amber-400 shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Sheet {idx + 1}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setActiveSheetIndex(Math.min(totalSheets - 1, currentSheetNumber + 1))}
                disabled={currentSheetNumber >= totalSheets - 1}
                className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-30 transition"
                title="Next Sheet"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Actions for Current Sheet & Quick Adjustments */}
            <div className="flex flex-wrap items-center gap-2">
              {onUpdateSettings && (
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-slate-700">
                  <span className="text-[10.5px] font-semibold text-slate-500 flex items-center gap-1 pl-1">
                    <MoveVertical className="w-3 h-3 text-amber-600" />
                    Position:
                  </span>
                  <button
                    onClick={() => onUpdateSettings({ verticalOffset: (settings.verticalOffset || 0) - 3 })}
                    title="Nudge text content UP (-3px)"
                    className="p-1 hover:bg-white hover:text-slate-950 rounded transition text-xs flex items-center"
                  >
                    <ArrowUp className="w-3 h-3" />
                  </button>
                  <span className="text-[10.5px] font-mono font-bold min-w-[2.2rem] text-center">
                    {settings.verticalOffset ? `${settings.verticalOffset > 0 ? '+' : ''}${settings.verticalOffset}px` : '0px'}
                  </span>
                  <button
                    onClick={() => onUpdateSettings({ verticalOffset: (settings.verticalOffset || 0) + 3 })}
                    title="Nudge text content DOWN (+3px)"
                    className="p-1 hover:bg-white hover:text-slate-950 rounded transition text-xs flex items-center"
                  >
                    <ArrowDown className="w-3 h-3" />
                  </button>

                  <div className="h-3.5 w-px bg-slate-300 mx-0.5" />

                  <span className="text-[10.5px] font-semibold text-slate-500 flex items-center gap-1">
                    <AArrowUp className="w-3 h-3 text-amber-600" />
                    Title:
                  </span>
                  <button
                    onClick={() => onUpdateSettings({ titleFontScale: Math.max(70, (settings.titleFontScale || 100) - 10) })}
                    title="Decrease title font size (-10%)"
                    className="p-1 hover:bg-white hover:text-slate-950 rounded transition text-xs flex items-center"
                  >
                    <AArrowDown className="w-3 h-3" />
                  </button>
                  <span className="text-[10.5px] font-mono font-bold min-w-[2.5rem] text-center">
                    {settings.titleFontScale || 100}%
                  </span>
                  <button
                    onClick={() => onUpdateSettings({ titleFontScale: Math.min(180, (settings.titleFontScale || 100) + 10) })}
                    title="Increase title font size (+10%)"
                    className="p-1 hover:bg-white hover:text-slate-950 rounded transition text-xs flex items-center"
                  >
                    <AArrowUp className="w-3 h-3" />
                  </button>

                  <div className="h-3.5 w-px bg-slate-300 mx-0.5" />

                  <span className="text-[10.5px] font-semibold text-slate-500 flex items-center gap-1">
                    <Type className="w-3 h-3 text-amber-600" />
                    Desc:
                  </span>
                  <button
                    onClick={() => onUpdateSettings({ descriptionFontScale: Math.max(70, (settings.descriptionFontScale || 100) - 10) })}
                    title="Decrease description font size (-10%)"
                    className="p-1 hover:bg-white hover:text-slate-950 rounded transition text-xs flex items-center"
                  >
                    <AArrowDown className="w-3 h-3" />
                  </button>
                  <span className="text-[10.5px] font-mono font-bold min-w-[2.5rem] text-center">
                    {settings.descriptionFontScale || 100}%
                  </span>
                  <button
                    onClick={() => onUpdateSettings({ descriptionFontScale: Math.min(180, (settings.descriptionFontScale || 100) + 10) })}
                    title="Increase description font size (+10%)"
                    className="p-1 hover:bg-white hover:text-slate-950 rounded transition text-xs flex items-center"
                  >
                    <AArrowUp className="w-3 h-3" />
                  </button>
                </div>
              )}

              {/* Printer Calibration Offset & Overlay Toggle */}
              <button
                onClick={() => {
                  if (onUpdateSettings) {
                    onUpdateSettings({ showCalibrationGrid: !settings.showCalibrationGrid });
                  }
                }}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition flex items-center gap-1.5 ${
                  settings.showCalibrationGrid
                    ? 'bg-blue-50 text-blue-700 border-blue-300 ring-2 ring-blue-400/30'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300'
                }`}
                title="Toggle visual physical alignment grid and printer margin calibration"
              >
                <Compass className="w-3.5 h-3.5 text-blue-600" />
                <span>Calibration {settings.showCalibrationGrid ? 'ON' : 'Tool'}</span>
              </button>

              <button
                onClick={handleDownloadAllPdf}
                disabled={isExportingZip}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-950 transition flex items-center gap-1 shadow-2xs"
                title="Download all sheets compiled into a single 8.5 x 11 multi-page PDF"
              >
                <FileText className="w-3.5 h-3.5 text-amber-700" />
                <span>{isExportingZip ? 'Exporting PDF...' : 'Download PDF (All Sheets)'}</span>
              </button>

              <button
                onClick={handleDownloadPdfZip}
                disabled={isExportingZip}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition flex items-center gap-1"
                title="Download a ZIP archive containing separate PDF files for each 8.5 x 11 sheet"
              >
                <FileArchive className="w-3.5 h-3.5 text-emerald-600" />
                <span>PDFs per Sheet (ZIP)</span>
              </button>

              <button
                onClick={handlePrintCurrentSheetOnly}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 transition flex items-center gap-1"
                title="Print only this current sheet"
              >
                <Printer className="w-3.5 h-3.5 text-slate-700" />
                <span>Print Sheet {currentSheetNumber + 1}</span>
              </button>
            </div>
          </div>

          {/* Floating Calibration Controls Bar (When Calibration Overlay is ON) */}
          {settings.showCalibrationGrid && (
            <div className="mx-4 mt-2 p-3 bg-blue-50/90 border border-blue-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs text-blue-950">
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-900 flex items-center gap-1">
                  📐 Printer Alignment Calibration:
                </span>
                <span className="text-[11px] text-blue-700 hidden md:inline">
                  Hold a printed test page up to the light against your label sheet to calibrate physical offsets.
                </span>
              </div>

              <div className="flex items-center gap-4 flex-wrap">
                {/* Horizontal X Nudge */}
                <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-blue-200">
                  <span className="text-[11px] font-semibold text-slate-600">Offset X:</span>
                  <button
                    onClick={() => onUpdateSettings && onUpdateSettings({ calibrationOffsetX: Math.round(((settings.calibrationOffsetX || 0) - 0.05) * 100) / 100 })}
                    className="w-5 h-5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold min-w-[2.8rem] text-center text-[11px]">
                    {settings.calibrationOffsetX ? `${settings.calibrationOffsetX > 0 ? '+' : ''}${settings.calibrationOffsetX}in` : '0.00in'}
                  </span>
                  <button
                    onClick={() => onUpdateSettings && onUpdateSettings({ calibrationOffsetX: Math.round(((settings.calibrationOffsetX || 0) + 0.05) * 100) / 100 })}
                    className="w-5 h-5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Vertical Y Nudge */}
                <div className="flex items-center gap-1.5 bg-white px-2 py-1 rounded-lg border border-blue-200">
                  <span className="text-[11px] font-semibold text-slate-600">Offset Y:</span>
                  <button
                    onClick={() => onUpdateSettings && onUpdateSettings({ calibrationOffsetY: Math.round(((settings.calibrationOffsetY || 0) - 0.05) * 100) / 100 })}
                    className="w-5 h-5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded font-bold"
                  >
                    -
                  </button>
                  <span className="font-mono font-bold min-w-[2.8rem] text-center text-[11px]">
                    {settings.calibrationOffsetY ? `${settings.calibrationOffsetY > 0 ? '+' : ''}${settings.calibrationOffsetY}in` : '0.00in'}
                  </span>
                  <button
                    onClick={() => onUpdateSettings && onUpdateSettings({ calibrationOffsetY: Math.round(((settings.calibrationOffsetY || 0) + 0.05) * 100) / 100 })}
                    className="w-5 h-5 flex items-center justify-center bg-slate-100 hover:bg-slate-200 rounded font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Reset Offsets */}
                <button
                  onClick={() => onUpdateSettings && onUpdateSettings({ calibrationOffsetX: 0, calibrationOffsetY: 0 })}
                  className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 rounded-lg text-[11px] font-semibold"
                >
                  Reset (0,0)
                </button>
              </div>
            </div>
          )}

          {/* Scrollable Paper Canvas Area */}
          <div className="p-6 sm:p-10 flex flex-col items-center justify-start overflow-auto min-h-[620px] max-h-[820px]">
            <div
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'top center' }}
              className="transition-transform duration-100"
            >
              <div
                ref={sheetRef}
                style={{
                  width: '8.5in',
                  minHeight: '11.0in',
                  height: '11.0in',
                  padding: '0.4in 0.35in',
                }}
                className={`bg-white rounded-xs shadow-2xl border border-slate-300 relative flex flex-col justify-between select-none box-border ${
                  settings.showCalibrationGrid ? 'calibration-grid-bg' : ''
                }`}
              >
                {/* Visual Calibration Rulers on Overlay */}
                {settings.showCalibrationGrid && (
                  <div className="absolute inset-0 pointer-events-none border border-blue-400/40 rounded-xs">
                    <div className="absolute top-1 left-2 text-[8px] font-mono text-blue-600 font-bold bg-white/90 px-1 rounded">
                      0.4" Top Margin
                    </div>
                    <div className="absolute bottom-1 left-2 text-[8px] font-mono text-blue-600 font-bold bg-white/90 px-1 rounded">
                      0.4" Bottom Margin
                    </div>
                    <div className="absolute top-1/2 left-1 -translate-y-1/2 text-[8px] font-mono text-blue-600 font-bold bg-white/90 px-1 rounded rotate-90">
                      0.35" Left
                    </div>
                    <div className="absolute top-1/2 right-1 -translate-y-1/2 text-[8px] font-mono text-blue-600 font-bold bg-white/90 px-1 rounded -rotate-90">
                      0.35" Right
                    </div>
                  </div>
                )}

                {/* Paper Stock Header Watermark */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 text-[8.5px] font-mono uppercase tracking-widest text-slate-400">
                  <span>Standard 8.5" &times; 11" Letter &bull; {template.name}</span>
                  <span>Sheet {currentSheetNumber + 1} of {totalSheets} &bull; {template.cardsPerSheet} per sheet</span>
                </div>

                {/* Grid of Card Slots */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
                    gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
                    gap: '0.12in',
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyItems: 'center',
                    transform: (settings.calibrationOffsetX || settings.calibrationOffsetY)
                      ? `translate(${settings.calibrationOffsetX || 0}in, ${settings.calibrationOffsetY || 0}in)`
                      : undefined,
                  }}
                  className="flex-1"
                >
                  {Array.from({ length: cardsPerSheet }).map((_, slotIdx) => {
                    const cardItem = currentSheetItems[slotIdx];

                    if (cardItem) {
                      return (
                        <div key={cardItem.id} className="relative group/slot">
                          <BuffetCard
                            item={cardItem}
                            settings={settings}
                            isPrint={false}
                            isBackFace={globalPreviewSide === 'back'}
                            onUpdate={handleItemInPlaceUpdate}
                            onDelete={() => onDeleteItem(cardItem.parentItemId || cardItem.id.split('_copy_')[0])}
                            onDuplicate={() => onDuplicateItem(cardItem)}
                          />
                          {settings.showCalibrationGrid && (
                            <div className="absolute inset-0 pointer-events-none border border-blue-400/50 flex items-center justify-center">
                              <span className="text-blue-500/70 font-mono text-[10px] select-none font-bold">+</span>
                            </div>
                          )}
                        </div>
                      );
                    }

                    // Clean Empty Slot on this sheet (no disruptive dotted lines)
                    return (
                      <div
                        key={`empty-${slotIdx}`}
                        style={{
                          width: `${settings.widthIn}in`,
                          height: `${settings.heightIn}in`,
                        }}
                        className="border border-slate-200 rounded-sm flex flex-col items-center justify-center text-center p-2 text-slate-300 hover:border-amber-300 hover:text-amber-600 transition cursor-pointer bg-slate-50/40"
                        onClick={onAddItem}
                        title="Click to add a label into this slot"
                      >
                        <Plus className="w-4 h-4 mb-0.5 text-slate-400" />
                        <span className="text-[9px] font-medium text-slate-400">Empty Slot</span>
                      </div>
                    );
                  })}
                </div>

                {/* Paper Stock Footer */}
                <div className="pt-2 mt-2 border-t border-slate-100 flex items-center justify-between text-[8px] text-slate-400 font-mono">
                  <span>Print safe margins (0.4") &bull; Center aligned</span>
                  <span>Clean peel / cut guidelines calibrated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* INDIVIDUAL CARDS FREE GRID VIEW */
        <div className="bg-slate-200/80 p-6 sm:p-8 rounded-2xl border border-slate-300 min-h-[500px] max-h-[780px] overflow-y-auto shadow-inner">
          {processedLanguageItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center p-6 bg-white/70 rounded-xl border border-dashed border-slate-300">
              <Layers className="w-10 h-10 text-slate-300 mb-2" />
              <h3 className="text-sm font-semibold text-slate-700">No labels in this view</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                Paste menu text in the left panel, or click below to add a label manually.
              </p>
              <button
                onClick={onAddItem}
                className="mt-3 px-4 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition"
              >
                + Create First Label
              </button>
            </div>
          ) : (
            <div
              className="flex flex-wrap gap-5 justify-center origin-top transition-transform duration-100"
              style={{ transform: `scale(${zoomLevel / 100})` }}
            >
              {processedLanguageItems.map((item) => (
                <div key={item.id} className="transition-transform">
                  <BuffetCard
                    item={item}
                    settings={settings}
                    isPrint={false}
                    isBackFace={globalPreviewSide === 'back'}
                    onUpdate={handleItemInPlaceUpdate}
                    onDelete={() => onDeleteItem(item.parentItemId || item.id)}
                    onDuplicate={() => onDuplicateItem(item)}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FLOATING LIVE SHEET PREVIEW (PiP / Floating Window) */}
      {isFloatingPreview && (
        <div className="fixed bottom-4 right-4 z-50 shadow-2xl rounded-2xl border border-slate-300 bg-white/95 backdrop-blur-md overflow-hidden animate-in slide-in-from-bottom-5 duration-200 w-80 sm:w-96">
          {/* Floating Header */}
          <div className="bg-slate-900 text-white px-3 py-2 flex items-center justify-between text-xs font-semibold select-none">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Floating Sheet ({currentSheetNumber + 1}/{totalSheets})</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setIsFloatingMinimized(!isFloatingMinimized)}
                className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
                title={isFloatingMinimized ? 'Expand Floating Preview' : 'Minimize to Mini-Pill'}
              >
                {isFloatingMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => setIsFloatingPreview(false)}
                className="p-1 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800 transition"
                title="Close Floating Preview"
              >
                <PinOff className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {!isFloatingMinimized ? (
            <div className="p-2.5 bg-slate-100 flex flex-col space-y-2 max-h-[420px] overflow-y-auto">
              {/* Sheet Switcher & Quick Font Adjust */}
              <div className="flex items-center justify-between gap-1 text-[11px]">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setActiveSheetIndex(Math.max(0, currentSheetNumber - 1))}
                    disabled={currentSheetNumber === 0}
                    className="px-1.5 py-0.5 rounded bg-white border border-slate-300 disabled:opacity-40"
                  >
                    &lt;
                  </button>
                  <span className="font-bold text-slate-800">
                    Sheet {currentSheetNumber + 1}
                  </span>
                  <button
                    onClick={() => setActiveSheetIndex(Math.min(totalSheets - 1, currentSheetNumber + 1))}
                    disabled={currentSheetNumber >= totalSheets - 1}
                    className="px-1.5 py-0.5 rounded bg-white border border-slate-300 disabled:opacity-40"
                  >
                    &gt;
                  </button>
                </div>

                {onUpdateSettings && (
                  <div className="flex items-center gap-1 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                    <span className="text-slate-500 font-semibold">Desc:</span>
                    <button
                      onClick={() => onUpdateSettings({ descriptionFontScale: Math.max(70, (settings.descriptionFontScale || 100) - 10) })}
                      title="Smaller description"
                      className="px-1 font-bold hover:text-amber-700"
                    >
                      D-
                    </button>
                    <span className="font-mono font-bold text-slate-800">
                      {settings.descriptionFontScale || 100}%
                    </span>
                    <button
                      onClick={() => onUpdateSettings({ descriptionFontScale: Math.min(180, (settings.descriptionFontScale || 100) + 10) })}
                      title="Larger description"
                      className="px-1 font-bold hover:text-amber-700"
                    >
                      D+
                    </button>
                  </div>
                )}
              </div>

              {/* Scaled Mini Sheet View */}
              <div className="bg-white rounded-lg border border-slate-300 p-2 shadow-xs flex justify-center overflow-hidden">
                <div
                  className="origin-top"
                  style={{
                    transform: 'scale(0.38)',
                    transformOrigin: 'top center',
                    width: '8.5in',
                    marginBottom: '-4.8in',
                  }}
                >
                  <div
                    style={{
                      width: '8.5in',
                      minHeight: '11in',
                      padding: '0.4in',
                      display: 'grid',
                      gridTemplateColumns: `repeat(${layout.columns}, minmax(0, 1fr))`,
                      gridTemplateRows: `repeat(${layout.rows}, minmax(0, 1fr))`,
                      gap: '0.12in',
                    }}
                    className="bg-white border border-slate-200"
                  >
                    {currentSheetItems.map((item) => (
                      <div key={item.id} className="flex items-center justify-center">
                        <BuffetCard
                          item={item}
                          settings={settings}
                          isPrint={false}
                          isBackFace={globalPreviewSide === 'back'}
                          onUpdate={handleItemInPlaceUpdate}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Quick Print & Close */}
              <div className="flex items-center justify-between pt-1 text-[11px]">
                <button
                  onClick={handlePrintCurrentSheetOnly}
                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-md flex items-center gap-1 transition"
                >
                  <Printer className="w-3 h-3" /> Print Sheet
                </button>
                <button
                  onClick={handleDownloadAllPdf}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-md flex items-center gap-1 transition"
                >
                  <FileText className="w-3 h-3 text-amber-400" /> Export PDF
                </button>
              </div>
            </div>
          ) : (
            <div className="p-2 bg-slate-50 flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">{totalCardsToPrint} labels &bull; {totalSheets} sheets</span>
              <button
                onClick={() => setIsFloatingMinimized(false)}
                className="text-amber-700 font-bold hover:underline text-[11px]"
              >
                Expand Preview
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
