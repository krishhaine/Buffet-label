import React, { useRef, useState } from 'react';
import { BuffetItem, DesignSettings } from '../types/buffet';
import { QrCodeSvg } from './QrCodeSvg';
import { toPng } from 'html-to-image';
import {
  Download,
  Utensils,
  Sparkles,
  Wine,
  Award,
  Trash2,
  Plus,
  LayoutGrid,
  FileText,
  Columns,
  Square,
  Tag,
  Eye,
  EyeOff,
  Settings2,
  Sliders,
  Check,
} from 'lucide-react';
import { getAllergenInfo } from '../utils/allergens';

interface FullMenuSheetViewProps {
  items: BuffetItem[];
  settings: DesignSettings;
  isPrint?: boolean;
  onUpdateItem?: (updated: BuffetItem) => void;
  onDeleteItem?: (id: string) => void;
  onAddItem?: () => void;
  onUpdateFullMenuSettings?: (menuSettings: Partial<DesignSettings['fullMenuSettings']>) => void;
}

export const FullMenuSheetView: React.FC<FullMenuSheetViewProps> = ({
  items,
  settings,
  isPrint = false,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onUpdateFullMenuSettings,
}) => {
  const sheetRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [showAdvancedHeaders, setShowAdvancedHeaders] = useState(false);

  const {
    font,
    theme,
    accentColor,
    titleColor,
    cardBgColor,
    textAlign,
    showLogo,
    logoUrl,
    logoHeight,
    showQrCode,
    qrCodeUrl,
    fullMenuSettings,
  } = settings;

  const {
    sheetType = 'full_menu',
    eyebrowText = 'Dinner & Banquet Menu',
    showEyebrow = true,
    eventTitle = 'Dinner Menu',
    eventSubtitle = 'Multi-Course Seasonal Banquet',
    showSubtitle = true,
    eventDate = 'Saturday, August 15, 2026',
    showDate = true,
    hostName = '',
    showHostName = false,
    menuColumns = 2,
    spacingDensity = 'normal',
    showDietaryBadges = true,
    showDietaryLegend = true,
    footerNote = 'Please inform our service staff of any severe allergies or dietary preferences.',
  } = fullMenuSettings || {};

  // Group items by station / course
  const stationGroups: Record<string, BuffetItem[]> = {};
  for (const item of items) {
    const station = item.station || 'Chef Selection';
    if (!stationGroups[station]) stationGroups[station] = [];
    stationGroups[station].push(item);
  }
  const stationEntries = Object.entries(stationGroups);

  // Apply Quick Header Presets
  const applyHeaderPreset = (preset: 'bar' | 'dinner' | 'buffet' | 'minimal') => {
    if (!onUpdateFullMenuSettings) return;
    if (preset === 'bar') {
      onUpdateFullMenuSettings({
        eyebrowText: 'Craft Beverage Service',
        showEyebrow: true,
        eventTitle: 'Bar Menu',
        eventSubtitle: 'Cocktails, Fine Wine, Beer & Spirits',
        showSubtitle: true,
        eventDate: 'Saturday, August 15, 2026',
        showDate: true,
        hostName: '',
        showHostName: false,
      });
    } else if (preset === 'dinner') {
      onUpdateFullMenuSettings({
        eyebrowText: 'Dinner & Banquet Menu',
        showEyebrow: true,
        eventTitle: 'Dinner Menu',
        eventSubtitle: 'Executive Multi-Course Banquet',
        showSubtitle: true,
        eventDate: 'Saturday, August 15, 2026',
        showDate: true,
        hostName: '',
        showHostName: false,
      });
    } else if (preset === 'buffet') {
      onUpdateFullMenuSettings({
        eyebrowText: 'Buffet Service',
        showEyebrow: true,
        eventTitle: 'Buffet & Station Menu',
        eventSubtitle: 'Seasonal Culinary Selections',
        showSubtitle: true,
        eventDate: 'Saturday, August 15, 2026',
        showDate: true,
        hostName: '',
        showHostName: false,
      });
    } else if (preset === 'minimal') {
      onUpdateFullMenuSettings({
        eyebrowText: '',
        showEyebrow: false,
        eventTitle: 'Menu',
        eventSubtitle: '',
        showSubtitle: false,
        eventDate: '',
        showDate: false,
        hostName: '',
        showHostName: false,
      });
    }
  };

  // Export 8.5" x 11" Menu Sheet as high-res PNG image
  const handleExportPng = async () => {
    if (!sheetRef.current || isExporting) return;
    try {
      setIsExporting(true);
      await new Promise((r) => setTimeout(r, 60));
      const dataUrl = await toPng(sheetRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `menu-sheet-8.5x11-${sheetType}-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
    } catch (err) {
      console.error('Failed to export menu sheet PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Theme Specific Palette
  const getThemePalette = () => {
    switch (theme) {
      case 'wedding':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? cardBgColor : '#fdfaf7',
          border: 'border-[#e0b4a4]',
          headerText: titleColor && titleColor !== 'auto' ? titleColor : '#5c3a33',
          subText: '#82645d',
          accent: accentColor || '#d49887',
          cardInner: 'bg-[#fffefe]/80 border-[#eed1c8]',
        };
      case 'gatsby':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? cardBgColor : '#18181b',
          border: 'border-[#d4af37]',
          headerText: titleColor && titleColor !== 'auto' ? titleColor : '#fef08a',
          subText: '#d4d4d8',
          accent: accentColor || '#d4af37',
          cardInner: 'bg-zinc-900/90 border-[#d4af37]/40 text-zinc-100',
        };
      case 'noir':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? cardBgColor : '#09090b',
          border: 'border-amber-400/40',
          headerText: titleColor && titleColor !== 'auto' ? titleColor : '#fef3c7',
          subText: '#a1a1aa',
          accent: accentColor || '#fbbf24',
          cardInner: 'bg-zinc-900 border-zinc-800 text-zinc-100',
        };
      case 'botanical':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? cardBgColor : '#f6f9f6',
          border: 'border-emerald-700/30',
          headerText: titleColor && titleColor !== 'auto' ? titleColor : '#064e3b',
          subText: '#374151',
          accent: accentColor || '#059669',
          cardInner: 'bg-white/90 border-emerald-200',
        };
      case 'vineyard':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? cardBgColor : '#faf6f0',
          border: 'border-[#8c4830]/40',
          headerText: titleColor && titleColor !== 'auto' ? titleColor : '#632214',
          subText: '#5c4434',
          accent: accentColor || '#9c381f',
          cardInner: 'bg-[#fffcf7] border-[#ded4c5]',
        };
      case 'corporate':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? cardBgColor : '#ffffff',
          border: 'border-slate-300',
          headerText: titleColor && titleColor !== 'auto' ? titleColor : '#0f233a',
          subText: '#475569',
          accent: accentColor || '#0284c7',
          cardInner: 'bg-slate-50/70 border-slate-200',
        };
      case 'bistro':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? cardBgColor : '#fffdf9',
          border: 'border-stone-900',
          headerText: titleColor && titleColor !== 'auto' ? titleColor : '#1c1917',
          subText: '#57534e',
          accent: accentColor || '#b45309',
          cardInner: 'bg-white border-stone-300',
        };
      case 'heritage':
      default:
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? cardBgColor : '#ffffff',
          border: 'border-[#d4af37]',
          headerText: titleColor && titleColor !== 'auto' ? titleColor : '#1c1917',
          subText: '#44403c',
          accent: accentColor || '#d4af37',
          cardInner: 'bg-amber-50/30 border-amber-200/70',
        };
    }
  };

  const palette = getThemePalette();

  // Spacing Density Styles
  const getDensityClass = () => {
    switch (spacingDensity) {
      case 'relaxed':
        return {
          itemPadding: 'py-3.5',
          titleSize: 'text-base font-bold',
          descSize: 'text-sm mt-1',
          gapSize: 'gap-6',
        };
      case 'compact':
        return {
          itemPadding: 'py-1.5',
          titleSize: 'text-xs font-bold',
          descSize: 'text-[11px] mt-0.5',
          gapSize: 'gap-3',
        };
      case 'normal':
      default:
        return {
          itemPadding: 'py-2.5',
          titleSize: 'text-sm font-bold',
          descSize: 'text-xs mt-0.5',
          gapSize: 'gap-4',
        };
    }
  };

  const density = getDensityClass();

  // Render a Single Item Row
  const renderItemRow = (item: BuffetItem) => (
    <div
      key={item.id}
      className={`group relative ${density.itemPadding} border-b border-dashed border-slate-200/80 last:border-0`}
    >
      <div className="flex items-baseline justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span
              contentEditable={!isPrint}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                if (onUpdateItem && e.currentTarget.innerText !== item.name) {
                  onUpdateItem({ ...item, name: e.currentTarget.innerText.trim() });
                }
              }}
              className={`${density.titleSize} leading-tight text-slate-900 outline-none hover:bg-amber-50/60 rounded px-0.5`}
              style={{ color: palette.headerText }}
            >
              {item.name}
            </span>

            {/* Dual Language Subtitle in Full Menu */}
            {settings.showDualLanguage && item.translationName && (
              <span className="text-[11px] font-serif italic text-amber-900/80 font-normal ml-1">
                ({item.translationName})
              </span>
            )}

            {/* Dietary Tags */}
            {showDietaryBadges && item.tags && item.tags.length > 0 && (
              <div className="inline-flex items-center gap-1">
                {item.tags.map((code) => {
                  const info = getAllergenInfo(code);
                  return (
                    <span
                      key={code}
                      title={info.fullTitle}
                      className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-700 border border-slate-300 uppercase tracking-tight"
                    >
                      {code}
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {item.description && (
            <p
              contentEditable={!isPrint}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                if (onUpdateItem && e.currentTarget.innerText !== item.description) {
                  onUpdateItem({ ...item, description: e.currentTarget.innerText.trim() });
                }
              }}
              className={`${density.descSize} italic leading-relaxed outline-none hover:bg-amber-50/60 rounded px-0.5`}
              style={{ color: palette.subText }}
            >
              {item.description}
            </p>
          )}

          {/* Dual Language Secondary Description in Full Menu */}
          {settings.showDualLanguage && item.translationDesc && (settings.showSecondaryDesc !== false) && (
            <p
              contentEditable={!isPrint}
              suppressContentEditableWarning={true}
              onBlur={(e) => {
                if (onUpdateItem && e.currentTarget.innerText !== item.translationDesc) {
                  onUpdateItem({ ...item, translationDesc: e.currentTarget.innerText.trim() });
                }
              }}
              className="text-[10px] italic text-slate-500 leading-tight mt-0.5 outline-none hover:bg-amber-50/60 rounded px-0.5"
            >
              {item.translationDesc}
            </p>
          )}
        </div>

        {item.price && (
          <span
            contentEditable={!isPrint}
            suppressContentEditableWarning={true}
            onBlur={(e) => {
              if (onUpdateItem && e.currentTarget.innerText !== item.price) {
                onUpdateItem({ ...item, price: e.currentTarget.innerText.trim() });
              }
            }}
            className="text-xs font-bold text-slate-800 shrink-0 outline-none hover:bg-amber-50/60 rounded px-1"
          >
            {item.price}
          </span>
        )}
      </div>

      {!isPrint && onDeleteItem && (
        <div className="no-print absolute -right-2 top-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onDeleteItem(item.id)}
            className="p-1 text-rose-500 hover:text-rose-700 rounded bg-white shadow-xs border border-slate-200"
            title="Delete menu item"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );

  // Single Feature Dish Poster Layout
  const renderSingleItemPoster = () => {
    const featureItem = items[0] || {
      id: 'default-feat',
      name: "Chef's Signature Prime Tomahawk",
      description:
        '45-Day Dry-Aged Prime Ribeye, served with roasted bone marrow butter, crispy rosemary fingerlings, and port wine reduction',
      tags: ['GF'],
      price: '$120.00',
      backWinePairing: '2021 Caymus Napa Valley Cabernet Sauvignon',
    };

    return (
      <div className="flex-1 flex flex-col justify-center items-center text-center max-w-2xl mx-auto py-8">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-4">
          <Award className="w-8 h-8 text-amber-600" />
        </div>

        <span
          className="text-xs font-bold uppercase tracking-[0.3em] block mb-2"
          style={{ color: palette.accent }}
        >
          Chef's Daily Feature Dish
        </span>

        <h2
          contentEditable={!isPrint}
          suppressContentEditableWarning={true}
          onBlur={(e) => {
            if (onUpdateItem) onUpdateItem({ ...featureItem, name: e.currentTarget.innerText.trim() });
          }}
          className="text-3xl sm:text-4xl font-bold tracking-tight mb-4 outline-none hover:bg-amber-50/60 rounded px-2"
          style={{ color: palette.headerText }}
        >
          {featureItem.name}
        </h2>

        <div className="w-24 h-[2px] mx-auto rounded-full mb-6" style={{ backgroundColor: palette.accent }} />

        <p
          contentEditable={!isPrint}
          suppressContentEditableWarning={true}
          onBlur={(e) => {
            if (onUpdateItem) onUpdateItem({ ...featureItem, description: e.currentTarget.innerText.trim() });
          }}
          className="text-base sm:text-lg italic leading-relaxed max-w-xl mb-6 outline-none hover:bg-amber-50/60 rounded px-2"
          style={{ color: palette.subText }}
        >
          {featureItem.description}
        </p>

        {/* Dietary tags */}
        {showDietaryBadges && featureItem.tags && featureItem.tags.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-6">
            {featureItem.tags.map((code) => {
              const info = getAllergenInfo(code);
              return (
                <span
                  key={code}
                  className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-800 border border-slate-300"
                >
                  <span>{info.icon}</span>
                  <span>
                    {info.fullTitle} ({code})
                  </span>
                </span>
              );
            })}
          </div>
        )}

        {/* Price & Wine Pairing Box */}
        <div className={`p-4 rounded-xl border ${palette.cardInner} max-w-lg w-full space-y-2 mb-4`}>
          {featureItem.price && <div className="text-2xl font-bold text-slate-900">{featureItem.price}</div>}
          {featureItem.backWinePairing && (
            <div className="text-xs italic text-rose-800 flex items-center justify-center gap-1.5">
              <Wine className="w-3.5 h-3.5" />
              <span>Recommended Pairing: {featureItem.backWinePairing}</span>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Full Banquet Menu Sheet Layout (1-Col or Balanced 2-Col)
  const renderFullMenuBanquet = () => {
    // 1-COLUMN LAYOUT (Spanning full width, centered elegant structure)
    if (menuColumns === 1) {
      return (
        <div className="relative z-10 flex-1 space-y-6 max-w-3xl mx-auto w-full">
          {stationEntries.map(([stName, stItems]) => (
            <div key={stName} className={`p-5 rounded-2xl border ${palette.cardInner} shadow-xs`}>
              {stationEntries.length > 1 && (
                <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-200/80">
                  <Utensils className="w-4 h-4 text-amber-600 shrink-0" />
                  <h4
                    className="text-sm font-bold uppercase tracking-wider"
                    style={{ color: palette.headerText }}
                  >
                    {stName}
                  </h4>
                  <div className="flex-1 h-[1px] bg-slate-200 ml-2" />
                </div>
              )}
              <div className="space-y-1">{stItems.map(renderItemRow)}</div>
            </div>
          ))}
        </div>
      );
    }

    // 2-COLUMN BALANCED LAYOUT
    // Case A: If multiple stations exist, balance stations between Left and Right columns
    if (stationEntries.length > 1) {
      const mid = Math.ceil(stationEntries.length / 2);
      const leftStations = stationEntries.slice(0, mid);
      const rightStations = stationEntries.slice(mid);

      return (
        <div className={`relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 ${density.gapSize}`}>
          {/* Left Column */}
          <div className="space-y-4">
            {leftStations.map(([stName, stItems]) => (
              <div key={stName} className={`p-4 rounded-xl border ${palette.cardInner} shadow-xs`}>
                <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-200/80">
                  <Utensils className="w-4 h-4 text-amber-600 shrink-0" />
                  <h4
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: palette.headerText }}
                  >
                    {stName}
                  </h4>
                  <div className="flex-1 h-[1px] bg-slate-200 ml-2" />
                </div>
                <div>{stItems.map(renderItemRow)}</div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {rightStations.map(([stName, stItems]) => (
              <div key={stName} className={`p-4 rounded-xl border ${palette.cardInner} shadow-xs`}>
                <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-200/80">
                  <Utensils className="w-4 h-4 text-amber-600 shrink-0" />
                  <h4
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: palette.headerText }}
                  >
                    {stName}
                  </h4>
                  <div className="flex-1 h-[1px] bg-slate-200 ml-2" />
                </div>
                <div>{stItems.map(renderItemRow)}</div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Case B: Only 1 station or ungrouped list of items — split items evenly 50/50 so NO half-page empty space!
    const midIndex = Math.ceil(items.length / 2);
    const leftItems = items.slice(0, midIndex);
    const rightItems = items.slice(midIndex);

    return (
      <div className={`relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 ${density.gapSize}`}>
        <div className={`p-4 rounded-xl border ${palette.cardInner} shadow-xs`}>
          <div>{leftItems.map(renderItemRow)}</div>
        </div>
        <div className={`p-4 rounded-xl border ${palette.cardInner} shadow-xs`}>
          <div>{rightItems.map(renderItemRow)}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Toolbar (Hidden on Print) */}
      {!isPrint && (
        <div className="no-print w-full max-w-[8.5in] mb-4 bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-3">
          {/* Row 1: Primary Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* 1 Col vs 2 Col Switcher */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Columns:</span>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  onClick={() => onUpdateFullMenuSettings?.({ menuColumns: 1 })}
                  className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                    menuColumns === 1
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="1-Column Full Width Elegant Banquet Layout"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>1 Col (Full Width)</span>
                </button>
                <button
                  onClick={() => onUpdateFullMenuSettings?.({ menuColumns: 2 })}
                  className={`px-2.5 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                    menuColumns === 2
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                  title="2-Column Balanced Grid (Left & Right evenly distributed)"
                >
                  <Columns className="w-3.5 h-3.5" />
                  <span>2 Cols (Balanced)</span>
                </button>
              </div>
            </div>

            {/* Density / Height Scaling */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Spacing:</span>
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                {(['compact', 'normal', 'relaxed'] as const).map((d) => (
                  <button
                    key={d}
                    onClick={() => onUpdateFullMenuSettings?.({ spacingDensity: d })}
                    className={`px-2 py-1 rounded-md font-semibold capitalize transition ${
                      spacingDensity === d
                        ? 'bg-slate-900 text-amber-400 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {onAddItem && (
                <button
                  onClick={onAddItem}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-lg transition flex items-center gap-1.5 border border-slate-200"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>+ Add Item</span>
                </button>
              )}
              <button
                onClick={handleExportPng}
                disabled={isExporting}
                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 shadow-xs"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" />
                <span>Save 8.5×11 PNG</span>
              </button>
            </div>
          </div>

          {/* Row 2: Header Presets & Customization Drawer Toggle */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mr-1">
                Header Presets:
              </span>
              <button
                onClick={() => applyHeaderPreset('bar')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 text-xs font-medium border border-slate-200 transition"
              >
                🍸 Default Bar Menu
              </button>
              <button
                onClick={() => applyHeaderPreset('dinner')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 text-xs font-medium border border-slate-200 transition"
              >
                🍽️ Default Dinner Menu
              </button>
              <button
                onClick={() => applyHeaderPreset('buffet')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 text-xs font-medium border border-slate-200 transition"
              >
                🥗 Buffet & Station
              </button>
              <button
                onClick={() => applyHeaderPreset('minimal')}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium border border-slate-200 transition"
              >
                ✨ Minimal / Clean
              </button>
            </div>

            <button
              onClick={() => setShowAdvancedHeaders(!showAdvancedHeaders)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
            >
              <Settings2 className="w-3.5 h-3.5 text-amber-600" />
              <span>{showAdvancedHeaders ? 'Hide Header Settings' : 'Edit Header Fields'}</span>
            </button>
          </div>

          {/* Advanced Header & Footer Fields Drawer */}
          {showAdvancedHeaders && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in duration-150">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Eyebrow Tagline:
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={eyebrowText || ''}
                    onChange={(e) => onUpdateFullMenuSettings?.({ eyebrowText: e.target.value })}
                    placeholder="e.g. Dinner & Banquet Menu"
                    className="flex-1 p-1.5 bg-white border border-slate-300 rounded font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateFullMenuSettings?.({ showEyebrow: !showEyebrow })}
                    className={`p-1.5 rounded border ${showEyebrow ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-400'}`}
                    title={showEyebrow ? 'Showing Eyebrow' : 'Eyebrow Hidden'}
                  >
                    {showEyebrow ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Main Event Title:</label>
                <input
                  type="text"
                  value={eventTitle || ''}
                  onChange={(e) => onUpdateFullMenuSettings?.({ eventTitle: e.target.value })}
                  placeholder="e.g. Dinner Menu / Gala Banquet"
                  className="w-full p-1.5 bg-white border border-slate-300 rounded font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subtitle / Theme:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={eventSubtitle || ''}
                    onChange={(e) => onUpdateFullMenuSettings?.({ eventSubtitle: e.target.value })}
                    placeholder="e.g. Multi-Course Seasonal Banquet"
                    className="flex-1 p-1.5 bg-white border border-slate-300 rounded font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateFullMenuSettings?.({ showSubtitle: !showSubtitle })}
                    className={`p-1.5 rounded border ${showSubtitle ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-400'}`}
                    title={showSubtitle ? 'Showing Subtitle' : 'Subtitle Hidden'}
                  >
                    {showSubtitle ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Event Date & Time:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={eventDate || ''}
                    onChange={(e) => onUpdateFullMenuSettings?.({ eventDate: e.target.value })}
                    placeholder="e.g. Saturday, August 15, 2026"
                    className="flex-1 p-1.5 bg-white border border-slate-300 rounded font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateFullMenuSettings?.({ showDate: !showDate })}
                    className={`p-1.5 rounded border ${showDate ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-400'}`}
                    title={showDate ? 'Showing Date' : 'Date Hidden'}
                  >
                    {showDate ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Presented / Hosted By:
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={hostName || ''}
                    onChange={(e) =>
                      onUpdateFullMenuSettings?.({ hostName: e.target.value, showHostName: true })
                    }
                    placeholder="e.g. Executive Chef & Culinary Team"
                    className="flex-1 p-1.5 bg-white border border-slate-300 rounded font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateFullMenuSettings?.({ showHostName: !showHostName })}
                    className={`p-1.5 rounded border ${showHostName ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-400'}`}
                    title={showHostName ? 'Showing Host' : 'Host Hidden'}
                  >
                    {showHostName ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDietaryBadges}
                    onChange={(e) => onUpdateFullMenuSettings?.({ showDietaryBadges: e.target.checked })}
                    className="rounded border-slate-300 text-amber-600"
                  />
                  <span className="font-medium text-slate-700">Dietary Badges (GF, DF)</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showDietaryLegend}
                    onChange={(e) => onUpdateFullMenuSettings?.({ showDietaryLegend: e.target.checked })}
                    className="rounded border-slate-300 text-amber-600"
                  />
                  <span className="font-medium text-slate-700">Footer Dietary Key</span>
                </label>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 8.5" x 11" Physical Paper Canvas */}
      <div
        ref={sheetRef}
        style={{
          width: '8.5in',
          minHeight: '11.0in',
          backgroundColor: palette.bg,
        }}
        className={`relative ${font} border ${palette.border} p-8 sm:p-10 flex flex-col justify-between shadow-lg print:shadow-none print:border-none print:m-0 print:p-8`}
      >
        {/* Double Framing / Architectural Border */}
        <div className="pointer-events-none absolute inset-3.5 border border-dashed border-slate-300/80 rounded-2xl" />
        <div className="pointer-events-none absolute inset-5 border border-slate-200/90 rounded-xl" />

        {/* HEADER SECTION */}
        <div className="relative z-10 text-center pb-4 mb-4 border-b border-slate-200">
          {showLogo && logoUrl && (
            <div className="flex justify-center mb-3">
              <img
                src={logoUrl}
                alt="Logo"
                style={{ height: `${(logoHeight || 18) * 1.5}px` }}
                className="object-contain max-w-[2.5in]"
              />
            </div>
          )}

          {showEyebrow && eyebrowText && (
            <span
              contentEditable={!isPrint}
              suppressContentEditableWarning={true}
              onBlur={(e) => onUpdateFullMenuSettings?.({ eyebrowText: e.currentTarget.innerText.trim() })}
              className="text-[10px] font-bold uppercase tracking-[0.25em] block mb-1 outline-none hover:bg-amber-50/60 rounded px-1 inline-block"
              style={{ color: palette.accent }}
            >
              {eyebrowText}
            </span>
          )}

          <h1
            contentEditable={!isPrint}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateFullMenuSettings?.({ eventTitle: e.currentTarget.innerText.trim() })}
            className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 outline-none hover:bg-amber-50/60 rounded px-2 inline-block"
            style={{ color: palette.headerText }}
          >
            {eventTitle}
          </h1>

          {(showSubtitle || showDate) && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-600 mt-1 flex-wrap">
              {showSubtitle && eventSubtitle && (
                <span
                  contentEditable={!isPrint}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onUpdateFullMenuSettings?.({ eventSubtitle: e.currentTarget.innerText.trim() })}
                  className="outline-none hover:bg-amber-50/60 rounded px-1"
                >
                  {eventSubtitle}
                </span>
              )}
              {showSubtitle && showDate && eventSubtitle && eventDate && <span>&bull;</span>}
              {showDate && eventDate && (
                <span
                  contentEditable={!isPrint}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onUpdateFullMenuSettings?.({ eventDate: e.currentTarget.innerText.trim() })}
                  className="outline-none hover:bg-amber-50/60 rounded px-1"
                >
                  {eventDate}
                </span>
              )}
            </div>
          )}

          {showHostName && hostName && (
            <div className="mt-2 text-xs italic text-slate-500">
              Presented by:{' '}
              <strong
                contentEditable={!isPrint}
                suppressContentEditableWarning={true}
                onBlur={(e) => onUpdateFullMenuSettings?.({ hostName: e.currentTarget.innerText.trim() })}
                className="outline-none hover:bg-amber-50/60 rounded px-1"
              >
                {hostName}
              </strong>
            </div>
          )}
        </div>

        {/* MAIN BODY */}
        {sheetType === 'single_item_poster' ? renderSingleItemPoster() : renderFullMenuBanquet()}

        {/* FOOTER SECTION */}
        <div className="relative z-10 mt-6 pt-3 border-t border-slate-200 space-y-2">
          {/* Dietary Key / Legend if enabled */}
          {showDietaryLegend && (
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[9.5px] font-medium text-slate-500 bg-slate-50/80 py-1.5 px-3 rounded-lg border border-slate-200/70">
              <span className="font-bold text-slate-700">Dietary Guide:</span>
              <span><strong>GF</strong> = Gluten-Free</span>
              <span>&bull;</span>
              <span><strong>DF</strong> = Dairy-Free</span>
              <span>&bull;</span>
              <span><strong>V</strong> = Vegetarian</span>
              <span>&bull;</span>
              <span><strong>VE</strong> = Vegan</span>
              <span>&bull;</span>
              <span><strong>NF</strong> = Nut-Free</span>
              <span>&bull;</span>
              <span><strong>HAL</strong> = Halal</span>
            </div>
          )}

          <div className="flex items-center justify-between text-[10px] text-slate-500">
            <div>
              <p
                contentEditable={!isPrint}
                suppressContentEditableWarning={true}
                onBlur={(e) => onUpdateFullMenuSettings?.({ footerNote: e.currentTarget.innerText.trim() })}
                className="italic outline-none hover:bg-amber-50/60 rounded px-1"
              >
                {footerNote}
              </p>
              <p className="text-[9px] text-slate-400 mt-0.5">
                Seasonal culinary selections curated for banquet and hospitality service.
              </p>
            </div>

            {showQrCode && qrCodeUrl && (
              <div className="shrink-0 flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="text-right">
                  <span className="font-bold text-[9px] uppercase tracking-wider text-slate-700 block">
                    Digital Menu
                  </span>
                  <span className="text-[8px] text-slate-400">Scan to View</span>
                </div>
                <QrCodeSvg url={qrCodeUrl} size={36} color="#0f172a" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
