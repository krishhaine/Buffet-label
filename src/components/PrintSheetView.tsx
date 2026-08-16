import React from 'react';
import { BuffetItem, DesignSettings } from '../types/buffet';
import { BuffetCard } from './BuffetCard';
import { BarMenuView } from './BarMenuView';
import { FullMenuSheetView } from './FullMenuSheetView';
import { getTemplateById, calculateSheetLayout } from '../utils/templates';
import { generateProcessedItemsForPrint } from '../utils/translator';

interface PrintSheetViewProps {
  items: BuffetItem[];
  settings: DesignSettings;
}

export const PrintSheetView: React.FC<PrintSheetViewProps> = ({ items, settings }) => {
  if (!items || items.length === 0) {
    return (
      <div className="print-only-container">
        <p className="p-8 text-center text-slate-400">No items to print</p>
      </div>
    );
  }

  // If in Bar Menu mode or full 8.5x11 sheet template
  if (settings.mode === 'bar_menu' || settings.templateId === 'sheet-bar-8.5x11') {
    return (
      <div className="print-only-container">
        <div className="page-sheet-unit relative bg-white mx-auto">
          <BarMenuView items={items} settings={settings} isPrint={true} />
        </div>
      </div>
    );
  }

  // If in Full Menu Sheet mode or full 8.5x11 sheet template
  if (settings.mode === 'full_menu_sheet' || settings.templateId === 'sheet-full-8.5x11') {
    return (
      <div className="print-only-container">
        <div className="page-sheet-unit relative bg-white mx-auto">
          <FullMenuSheetView items={items} settings={settings} isPrint={true} />
        </div>
      </div>
    );
  }

  // Process items for Dual-Language Separate Cards or Combined Cards
  const processedItems = generateProcessedItemsForPrint(
    items,
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

  // Multiply items if user specified multiple copies of the menu
  let allItemsToPrint: BuffetItem[] = [];
  for (let c = 0; c < copiesCount; c++) {
    allItemsToPrint = allItemsToPrint.concat(processedItems);
  }

  // Chunk items into sheets
  let pages: BuffetItem[][] = [];
  for (let i = 0; i < allItemsToPrint.length; i += cardsPerSheet) {
    pages.push(allItemsToPrint.slice(i, i + cardsPerSheet));
  }

  // If user selected to print a specific sheet only (e.g. Sheet 1 or Sheet 2)
  if (settings.printSelectedSheetOnly && settings.printSelectedSheetOnly > 0) {
    const targetIdx = settings.printSelectedSheetOnly - 1;
    if (pages[targetIdx]) {
      pages = [pages[targetIdx]];
    }
  }

  const isDoubleSided = settings.printSides === 'double';

  const offsetX = settings.calibrationOffsetX || 0;
  const offsetY = settings.calibrationOffsetY || 0;

  // CSS Grid template string for custom column widths
  const gridStyle: React.CSSProperties = {
    display: 'grid',
    gridTemplateColumns: `repeat(${layout.columns}, ${settings.widthIn}in)`,
    gridAutoRows: `${settings.heightIn}in`,
    columnGap: '0.12in',
    rowGap: layout.rows <= 3 ? '0.35in' : '0.12in',
    justifyContent: 'center',
    alignContent: layout.rows <= 3 ? 'center' : 'start',
    margin: '0 auto',
    width: '100%',
    height: '100%',
    transform: (offsetX !== 0 || offsetY !== 0) ? `translate(${offsetX}in, ${offsetY}in)` : undefined,
  };

  /**
   * For Duplex Back Pages:
   * Horizontally mirror columns per row for long-edge flip
   */
  const getDuplexMirroredRowItems = (pageItems: BuffetItem[]): BuffetItem[] => {
    const cols = layout.columns;
    const mirrored: BuffetItem[] = [];

    for (let r = 0; r < pageItems.length; r += cols) {
      const rowSlice = pageItems.slice(r, r + cols);
      const reversedSlice = [...rowSlice].reverse();
      mirrored.push(...reversedSlice);
    }

    return mirrored;
  };

  return (
    <div className="print-only-container">
      {pages.map((pageItems, pageIndex) => {
        const pageNumber = pageIndex + 1;
        const totalPages = pages.length * (isDoubleSided ? 2 : 1);

        return (
          <React.Fragment key={`print-group-${pageIndex}`}>
            {/* FRONT PAGE */}
            <div className="page-sheet-unit relative bg-white mx-auto flex flex-col justify-between">
              {/* Sheet Header Metadata */}
              <div className="text-[7.5px] text-slate-400 font-mono text-right pb-1 mb-1 border-b border-slate-100 uppercase tracking-wider">
                {template.name} ({template.code}) &bull; {isDoubleSided ? `Front Sheet ${pageIndex * 2 + 1} of ${totalPages}` : `Sheet ${pageNumber} of ${pages.length}`} &bull; {copiesCount > 1 ? `(${copiesCount}x Copies Run)` : ''}
              </div>

              {/* Grid of Front Cards */}
              <div style={gridStyle} className="flex-1">
                {pageItems.map((item, idx) => (
                  <div key={`front-${pageIndex}-${item.id || idx}`} className="avoid-break flex justify-center items-center">
                    <BuffetCard item={item} settings={settings} isPrint={true} isBackFace={false} />
                  </div>
                ))}
              </div>

              {/* Sheet Footer */}
              <div className="text-[7px] text-slate-300 font-mono pt-1 mt-1 border-t border-slate-100 flex justify-between">
                <span>Buffet Label Studio &bull; Precision Print Engine</span>
                <span>Calibrated 8.5" &times; 11" Paper Stock</span>
              </div>
            </div>

            {/* DUPLEX BACK PAGE (If double-sided printing enabled) */}
            {isDoubleSided && (
              <div className="page-sheet-unit relative bg-white mx-auto flex flex-col justify-between">
                <div className="text-[7.5px] text-slate-400 font-mono text-right pb-1 mb-1 border-b border-slate-100 uppercase tracking-wider">
                  {template.name} ({template.code}) &bull; Duplex Back Sheet {pageIndex * 2 + 2} of {totalPages} (Mirrored for Long-Edge Binding)
                </div>

                {/* Grid of Back Cards (Horizontally mirrored per row) */}
                <div style={gridStyle} className="flex-1">
                  {getDuplexMirroredRowItems(pageItems).map((item, idx) => (
                    <div key={`back-${pageIndex}-${item.id || idx}`} className="avoid-break flex justify-center items-center">
                      <BuffetCard item={item} settings={settings} isPrint={true} isBackFace={true} />
                    </div>
                  ))}
                </div>

                <div className="text-[7px] text-slate-300 font-mono pt-1 mt-1 border-t border-slate-100 flex justify-between">
                  <span>Buffet Label Studio &bull; Duplex Reverse</span>
                  <span>Mirrored for perfect alignment</span>
                </div>
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};
