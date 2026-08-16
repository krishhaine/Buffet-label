import React, { useRef, useState } from 'react';
import { BuffetItem, DesignSettings, BarType } from '../types/buffet';
import { QrCodeSvg } from './QrCodeSvg';
import { toPng } from 'html-to-image';
import {
  Download,
  Wine,
  GlassWater,
  Beer,
  Sparkles,
  UserCheck,
  DollarSign,
  HeartHandshake,
  Plus,
  Trash2,
  Columns,
  Square,
  Eye,
  EyeOff,
  Settings2,
  Flame,
} from 'lucide-react';
import { getAllergenInfo } from '../utils/allergens';

interface BarMenuViewProps {
  items: BuffetItem[];
  settings: DesignSettings;
  isPrint?: boolean;
  onUpdateItem?: (updated: BuffetItem) => void;
  onDeleteItem?: (id: string) => void;
  onAddItem?: () => void;
  onUpdateBarSettings?: (barSettings: Partial<DesignSettings['barSettings']>) => void;
}

export const BarMenuView: React.FC<BarMenuViewProps> = ({
  items,
  settings,
  isPrint = false,
  onUpdateItem,
  onDeleteItem,
  onAddItem,
  onUpdateBarSettings,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
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
    barSettings,
  } = settings;

  const {
    barType = 'host',
    eyebrowText = 'Beverage Service',
    showEyebrow = true,
    eventTitle = 'Bar Menu',
    eventSubtitle = 'Cocktails, Fine Wine, Beer & Spirits',
    showSubtitle = true,
    eventDate = 'Saturday, August 15, 2026',
    showDate = true,
    barHours = '5:00 PM – 11:30 PM',
    showBarHours = false,
    hostName = '',
    showHostName = false,
    subsidizedPriceText = '$3.00 per cocktail / $2.00 beer & wine (Remaining balance hosted by sponsor)',
    gratuityNote = 'Hospitality service & gratuity are graciously hosted',
    showPricing = true,
    menuColumns = 2,
    spacingDensity = 'normal',
    showDietaryLegend = false,
  } = barSettings || {};

  // Group items by category
  const spirits = items.filter(
    (i) =>
      i.drinkCategory === 'spirit' ||
      i.station?.toLowerCase().includes('spirit') ||
      i.station?.toLowerCase().includes('liquor')
  );
  const cocktails = items.filter(
    (i) =>
      i.drinkCategory === 'cocktail' ||
      i.station?.toLowerCase().includes('cocktail') ||
      i.station?.toLowerCase().includes('signature')
  );
  const wines = items.filter(
    (i) =>
      i.drinkCategory === 'wine' ||
      i.station?.toLowerCase().includes('wine') ||
      i.station?.toLowerCase().includes('sommelier')
  );
  const beers = items.filter(
    (i) =>
      i.drinkCategory === 'beer' ||
      i.station?.toLowerCase().includes('beer') ||
      i.station?.toLowerCase().includes('cider')
  );
  const mocktails = items.filter(
    (i) =>
      i.drinkCategory === 'mocktail' ||
      i.station?.toLowerCase().includes('mocktail') ||
      i.station?.toLowerCase().includes('zero-proof') ||
      i.station?.toLowerCase().includes('soft') ||
      i.station?.toLowerCase().includes('soda')
  );

  // Leftover uncategorized items
  const otherItems = items.filter(
    (i) =>
      !spirits.includes(i) &&
      !cocktails.includes(i) &&
      !wines.includes(i) &&
      !beers.includes(i) &&
      !mocktails.includes(i)
  );

  const hasCategorizedDrinks =
    spirits.length > 0 ||
    cocktails.length > 0 ||
    wines.length > 0 ||
    beers.length > 0 ||
    mocktails.length > 0;

  // Station fallback
  const stationGroups: Record<string, BuffetItem[]> = {};
  for (const item of items) {
    const station = item.station || 'Beverage Selection';
    if (!stationGroups[station]) stationGroups[station] = [];
    stationGroups[station].push(item);
  }
  const stationEntries = Object.entries(stationGroups);

  // Apply Quick Header Presets
  const applyHeaderPreset = (preset: 'default_bar' | 'wedding' | 'corporate' | 'clean') => {
    if (!onUpdateBarSettings) return;
    if (preset === 'default_bar') {
      onUpdateBarSettings({
        eyebrowText: 'Craft Beverage Service',
        showEyebrow: true,
        eventTitle: 'Bar Menu',
        eventSubtitle: 'Cocktails, Fine Wine, Beer & Spirits',
        showSubtitle: true,
        eventDate: 'Saturday, August 15, 2026',
        showDate: false,
        barHours: '',
        showBarHours: false,
        hostName: '',
        showHostName: false,
      });
    } else if (preset === 'wedding') {
      onUpdateBarSettings({
        eyebrowText: 'Wedding Celebration Bar',
        showEyebrow: true,
        eventTitle: 'Host Bar Menu',
        eventSubtitle: 'Signature Cocktails & Fine Wine Selection',
        showSubtitle: true,
        eventDate: 'Saturday, August 15, 2026',
        showDate: true,
        hostName: 'The Happy Couple',
        showHostName: true,
      });
    } else if (preset === 'corporate') {
      onUpdateBarSettings({
        eyebrowText: 'Executive Gala Reception',
        showEyebrow: true,
        eventTitle: 'Cocktails & Libations',
        eventSubtitle: 'Grand Ballroom & Terrace Bar',
        showSubtitle: true,
        eventDate: 'Saturday, August 15, 2026',
        showDate: true,
        hostName: '',
        showHostName: false,
      });
    } else if (preset === 'clean') {
      onUpdateBarSettings({
        eyebrowText: '',
        showEyebrow: false,
        eventTitle: 'Bar Menu',
        eventSubtitle: '',
        showSubtitle: false,
        eventDate: '',
        showDate: false,
        barHours: '',
        showBarHours: false,
        hostName: '',
        showHostName: false,
      });
    }
  };

  // Export 8.5" x 11" Bar Menu as high-res PNG image
  const handleExportPng = async () => {
    if (!menuRef.current || isExporting) return;
    try {
      setIsExporting(true);
      await new Promise((r) => setTimeout(r, 60));
      const dataUrl = await toPng(menuRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = `bar-menu-8.5x11-${barType}-${new Date().toISOString().slice(0, 10)}.png`;
      a.click();
    } catch (err) {
      console.error('Failed to export bar menu PNG:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Get Theme Specific Colors
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
      case 'bistro':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? cardBgColor : '#fffdf9',
          border: 'border-stone-900',
          headerText: titleColor && titleColor !== 'auto' ? titleColor : '#1c1917',
          subText: '#57534e',
          accent: accentColor || '#b45309',
          cardInner: 'bg-white border-stone-300',
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

  // Spacing Density
  const getDensityClass = () => {
    switch (spacingDensity) {
      case 'relaxed':
        return {
          itemPadding: 'py-3.5 mb-2',
          titleSize: 'text-base font-bold',
          descSize: 'text-sm mt-1',
          gapSize: 'gap-6',
        };
      case 'compact':
        return {
          itemPadding: 'py-1.5 mb-1',
          titleSize: 'text-xs font-bold',
          descSize: 'text-[11px] mt-0.5',
          gapSize: 'gap-3',
        };
      case 'normal':
      default:
        return {
          itemPadding: 'py-2.5 mb-1.5',
          titleSize: 'text-sm font-bold',
          descSize: 'text-xs mt-0.5',
          gapSize: 'gap-4',
        };
    }
  };

  const density = getDensityClass();

  const renderDrinkItem = (item: BuffetItem) => {
    // Determine displayed price
    let displayPrice = item.price || item.drinkPrice;
    if (barType === 'host' || item.isHosted) {
      displayPrice = 'Hosted';
    }

    return (
      <div
        key={item.id}
        className={`group relative ${density.itemPadding} border-b border-dashed border-slate-200/80 last:border-0 last:mb-0 last:pb-0`}
      >
        <div className="flex items-baseline justify-between gap-2.5">
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

              {item.drinkAbv && (
                <span className="text-[9.5px] font-bold px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                  {item.drinkAbv}
                </span>
              )}

              {/* Dietary tags */}
              {item.tags?.map((code) => {
                const info = getAllergenInfo(code);
                return (
                  <span
                    key={code}
                    className="text-[8.5px] font-bold px-1 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {info.icon} {code}
                  </span>
                );
              })}
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
          </div>

          {/* Pricing */}
          {showPricing && (
            <div className="shrink-0 flex items-center gap-1.5">
              <span
                contentEditable={!isPrint && barType !== 'host'}
                suppressContentEditableWarning={true}
                onBlur={(e) => {
                  if (onUpdateItem && e.currentTarget.innerText !== displayPrice) {
                    onUpdateItem({
                      ...item,
                      price: e.currentTarget.innerText.trim(),
                      drinkPrice: e.currentTarget.innerText.trim(),
                    });
                  }
                }}
                className={`text-xs font-bold px-2 py-0.5 rounded outline-none ${
                  barType === 'host'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 uppercase tracking-wider text-[10px]'
                    : barType === 'subsidized'
                    ? 'bg-amber-50 text-amber-900 border border-amber-200'
                    : 'bg-slate-100 text-slate-900 border border-slate-200'
                }`}
              >
                {displayPrice || (barType === 'host' ? 'Hosted' : '$12.00')}
              </span>
            </div>
          )}
        </div>

        {/* Delete item action */}
        {!isPrint && onDeleteItem && (
          <div className="no-print absolute -right-2 top-0 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onDeleteItem(item.id)}
              className="p-1 text-rose-500 hover:text-rose-700 rounded bg-white shadow-xs border border-slate-200"
              title="Delete drink item"
            >
              <Trash2 className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderCategoryBlock = (title: string, icon: React.ReactNode, categoryItems: BuffetItem[]) => {
    if (categoryItems.length === 0) return null;
    return (
      <div className={`p-4 rounded-xl border ${palette.cardInner} shadow-xs`}>
        <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-200/80">
          <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-700">{icon}</div>
          <h4
            className="text-xs font-bold uppercase tracking-wider"
            style={{ color: palette.headerText }}
          >
            {title}
          </h4>
          <div className="flex-1 h-[1px] bg-slate-200 ml-2" />
        </div>
        <div>{categoryItems.map(renderDrinkItem)}</div>
      </div>
    );
  };

  // Render Bar Menu Grid (1-Col or Balanced 2-Col)
  const renderBarGrid = () => {
    // 1-COLUMN LAYOUT (Full width, centered)
    if (menuColumns === 1) {
      if (hasCategorizedDrinks) {
        return (
          <div className="relative z-10 flex-1 space-y-4 max-w-3xl mx-auto w-full">
            {renderCategoryBlock('Liquors & Spirits', <Flame className="w-4 h-4" />, spirits)}
            {renderCategoryBlock('Signature Cocktails', <GlassWater className="w-4 h-4" />, cocktails)}
            {renderCategoryBlock('Craft Beers & Ciders', <Beer className="w-4 h-4" />, beers)}
            {renderCategoryBlock('Sommelier Wine Selection', <Wine className="w-4 h-4" />, wines)}
            {renderCategoryBlock('Zero-Proof & Mocktails', <Sparkles className="w-4 h-4" />, mocktails)}
            {otherItems.length > 0 &&
              renderCategoryBlock('Additional Selections', <Wine className="w-4 h-4" />, otherItems)}
          </div>
        );
      }

      return (
        <div className="relative z-10 flex-1 space-y-4 max-w-3xl mx-auto w-full">
          {stationEntries.map(([stName, stItems]) => (
            <div key={stName} className={`p-5 rounded-2xl border ${palette.cardInner} shadow-xs`}>
              <div className="flex items-center gap-2 pb-2 mb-3 border-b border-slate-200/80">
                <GlassWater className="w-4 h-4 text-amber-600 shrink-0" />
                <h4
                  className="text-sm font-bold uppercase tracking-wider"
                  style={{ color: palette.headerText }}
                >
                  {stName}
                </h4>
                <div className="flex-1 h-[1px] bg-slate-200 ml-2" />
              </div>
              <div>{stItems.map(renderDrinkItem)}</div>
            </div>
          ))}
        </div>
      );
    }

    // 2-COLUMN BALANCED LAYOUT
    if (hasCategorizedDrinks) {
      return (
        <div className={`relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 ${density.gapSize}`}>
          {/* Left Column */}
          <div className="space-y-4">
            {renderCategoryBlock('Liquors & Spirits', <Flame className="w-4 h-4" />, spirits)}
            {renderCategoryBlock('Signature Cocktails', <GlassWater className="w-4 h-4" />, cocktails)}
            {renderCategoryBlock('Craft Beers & Ciders', <Beer className="w-4 h-4" />, beers)}
          </div>

          {/* Right Column */}
          <div className="space-y-4">
            {renderCategoryBlock('Sommelier Wine Selection', <Wine className="w-4 h-4" />, wines)}
            {renderCategoryBlock('Zero-Proof & Mocktails', <Sparkles className="w-4 h-4" />, mocktails)}
            {otherItems.length > 0 &&
              renderCategoryBlock('Additional Selections', <Wine className="w-4 h-4" />, otherItems)}
          </div>
        </div>
      );
    }

    // Fallback: If only 1 station group or general list, split items evenly 50/50 so NO blank half-page!
    if (stationEntries.length === 1) {
      const midIndex = Math.ceil(items.length / 2);
      const leftItems = items.slice(0, midIndex);
      const rightItems = items.slice(midIndex);

      return (
        <div className={`relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 ${density.gapSize}`}>
          <div className={`p-4 rounded-xl border ${palette.cardInner} shadow-xs`}>
            <div>{leftItems.map(renderDrinkItem)}</div>
          </div>
          <div className={`p-4 rounded-xl border ${palette.cardInner} shadow-xs`}>
            <div>{rightItems.map(renderDrinkItem)}</div>
          </div>
        </div>
      );
    }

    // Multiple stations: distribute stations across 2 columns
    const mid = Math.ceil(stationEntries.length / 2);
    const leftStations = stationEntries.slice(0, mid);
    const rightStations = stationEntries.slice(mid);

    return (
      <div className={`relative z-10 flex-1 grid grid-cols-1 md:grid-cols-2 ${density.gapSize}`}>
        <div className="space-y-4">
          {leftStations.map(([stName, stItems]) => (
            <div key={stName} className={`p-4 rounded-xl border ${palette.cardInner} shadow-xs`}>
              <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-200/80">
                <GlassWater className="w-4 h-4 text-amber-600 shrink-0" />
                <h4
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: palette.headerText }}
                >
                  {stName}
                </h4>
                <div className="flex-1 h-[1px] bg-slate-200 ml-2" />
              </div>
              <div>{stItems.map(renderDrinkItem)}</div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          {rightStations.map(([stName, stItems]) => (
            <div key={stName} className={`p-4 rounded-xl border ${palette.cardInner} shadow-xs`}>
              <div className="flex items-center gap-2 pb-2 mb-2 border-b border-slate-200/80">
                <GlassWater className="w-4 h-4 text-amber-600 shrink-0" />
                <h4
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: palette.headerText }}
                >
                  {stName}
                </h4>
                <div className="flex-1 h-[1px] bg-slate-200 ml-2" />
              </div>
              <div>{stItems.map(renderDrinkItem)}</div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Top Toolbar (Hidden on Print) */}
      {!isPrint && (
        <div className="no-print w-full max-w-[8.5in] mb-4 bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs space-y-3">
          {/* Row 1: High-Contrast Bar Service Model Selector */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Bar Service Model:
              </span>
              <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs flex-wrap gap-1">
                {[
                  { id: 'host', label: '🥂 Host Bar (Complimentary)' },
                  { id: 'cash', label: '💵 Cash Bar (Guest Paid)' },
                  { id: 'subsidized', label: '🎟️ Subsidized Bar (Ticket / Partial)' },
                  { id: 'open', label: '🍹 Open Bar' },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => onUpdateBarSettings?.({ barType: b.id as BarType })}
                    className={`px-3 py-1.5 rounded-lg font-bold transition ${
                      barType === b.id
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200/70'
                    }`}
                  >
                    {b.label}
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
                  <span>+ Add Drink</span>
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

          {/* Row 2: Layout Columns & Presets */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
            <div className="flex items-center gap-3 flex-wrap">
              {/* Columns Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">Columns:</span>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => onUpdateBarSettings?.({ menuColumns: 1 })}
                    className={`px-2 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                      menuColumns === 1
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Square className="w-3.5 h-3.5" />
                    <span>1 Col</span>
                  </button>
                  <button
                    onClick={() => onUpdateBarSettings?.({ menuColumns: 2 })}
                    className={`px-2 py-1 rounded-md font-semibold transition flex items-center gap-1 ${
                      menuColumns === 2
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Columns className="w-3.5 h-3.5" />
                    <span>2 Cols (Balanced)</span>
                  </button>
                </div>
              </div>

              {/* Spacing Density */}
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-600">Spacing:</span>
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  {(['compact', 'normal', 'relaxed'] as const).map((d) => (
                    <button
                      key={d}
                      onClick={() => onUpdateBarSettings?.({ spacingDensity: d })}
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

              {/* Presets */}
              <div className="flex items-center gap-1 flex-wrap">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Presets:
                </span>
                <button
                  onClick={() => applyHeaderPreset('default_bar')}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 text-xs font-medium border border-slate-200 transition"
                >
                  Default Bar Menu
                </button>
                <button
                  onClick={() => applyHeaderPreset('wedding')}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-amber-100 hover:text-amber-900 text-slate-700 text-xs font-medium border border-slate-200 transition"
                >
                  Wedding Host Bar
                </button>
                <button
                  onClick={() => applyHeaderPreset('clean')}
                  className="px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-medium border border-slate-200 transition"
                >
                  Clean / Blank
                </button>
              </div>
            </div>

            <button
              onClick={() => setShowAdvancedHeaders(!showAdvancedHeaders)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-900 flex items-center gap-1"
            >
              <Settings2 className="w-3.5 h-3.5 text-amber-600" />
              <span>{showAdvancedHeaders ? 'Hide Fields' : 'Edit Header Fields'}</span>
            </button>
          </div>

          {/* Advanced Header & Subsidized Fields Drawer */}
          {showAdvancedHeaders && (
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs animate-in fade-in duration-150">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Eyebrow Tagline:
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={eyebrowText || ''}
                    onChange={(e) => onUpdateBarSettings?.({ eyebrowText: e.target.value })}
                    placeholder="e.g. Craft Beverage Service"
                    className="flex-1 p-1.5 bg-white border border-slate-300 rounded font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateBarSettings?.({ showEyebrow: !showEyebrow })}
                    className={`p-1.5 rounded border ${showEyebrow ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-400'}`}
                    title={showEyebrow ? 'Showing Eyebrow' : 'Eyebrow Hidden'}
                  >
                    {showEyebrow ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Main Bar Title:</label>
                <input
                  type="text"
                  value={eventTitle || ''}
                  onChange={(e) => onUpdateBarSettings?.({ eventTitle: e.target.value })}
                  placeholder="e.g. Bar Menu / Bar & Libations"
                  className="w-full p-1.5 bg-white border border-slate-300 rounded font-medium"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Subtitle / Bar Description:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={eventSubtitle || ''}
                    onChange={(e) => onUpdateBarSettings?.({ eventSubtitle: e.target.value })}
                    placeholder="e.g. Cocktails, Fine Wine, Beer & Spirits"
                    className="flex-1 p-1.5 bg-white border border-slate-300 rounded font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateBarSettings?.({ showSubtitle: !showSubtitle })}
                    className={`p-1.5 rounded border ${showSubtitle ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-400'}`}
                    title={showSubtitle ? 'Showing Subtitle' : 'Subtitle Hidden'}
                  >
                    {showSubtitle ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Host Name / Sponsor:</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="text"
                    value={hostName || ''}
                    onChange={(e) => onUpdateBarSettings?.({ hostName: e.target.value, showHostName: true })}
                    placeholder="e.g. The Gala Host / Sponsor"
                    className="flex-1 p-1.5 bg-white border border-slate-300 rounded font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => onUpdateBarSettings?.({ showHostName: !showHostName })}
                    className={`p-1.5 rounded border ${showHostName ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-white text-slate-400'}`}
                    title={showHostName ? 'Showing Host Banner' : 'Host Banner Hidden'}
                  >
                    {showHostName ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {barType === 'subsidized' && (
                <div className="sm:col-span-2">
                  <label className="font-semibold text-slate-700 block mb-1">
                    Subsidized / Ticket Bar Price Note:
                  </label>
                  <input
                    type="text"
                    value={subsidizedPriceText || ''}
                    onChange={(e) => onUpdateBarSettings?.({ subsidizedPriceText: e.target.value })}
                    placeholder="e.g. $3.00 per cocktail (Remaining balance hosted by sponsor)"
                    className="w-full p-1.5 bg-white border border-slate-300 rounded font-medium"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 8.5" x 11" Physical Paper Canvas */}
      <div
        ref={menuRef}
        style={{
          width: '8.5in',
          minHeight: '11.0in',
          backgroundColor: palette.bg,
        }}
        className={`relative ${font} border ${palette.border} p-8 sm:p-10 flex flex-col justify-between shadow-lg print:shadow-none print:border-none print:m-0 print:p-8`}
      >
        {/* Double Framing / Elegant Border */}
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
              onBlur={(e) => onUpdateBarSettings?.({ eyebrowText: e.currentTarget.innerText.trim() })}
              className="text-[10px] font-bold uppercase tracking-[0.25em] block mb-1 outline-none hover:bg-amber-50/60 rounded px-1 inline-block"
              style={{ color: palette.accent }}
            >
              {eyebrowText}
            </span>
          )}

          <h1
            contentEditable={!isPrint}
            suppressContentEditableWarning={true}
            onBlur={(e) => onUpdateBarSettings?.({ eventTitle: e.currentTarget.innerText.trim() })}
            className="text-2xl sm:text-3xl font-bold tracking-tight mb-1 outline-none hover:bg-amber-50/60 rounded px-2 inline-block"
            style={{ color: palette.headerText }}
          >
            {eventTitle}
          </h1>

          {(showSubtitle || showDate || (showBarHours && barHours)) && (
            <div className="flex items-center justify-center gap-2 text-xs text-slate-600 mt-1 flex-wrap">
              {showSubtitle && eventSubtitle && (
                <span
                  contentEditable={!isPrint}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onUpdateBarSettings?.({ eventSubtitle: e.currentTarget.innerText.trim() })}
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
                  onBlur={(e) => onUpdateBarSettings?.({ eventDate: e.currentTarget.innerText.trim() })}
                  className="outline-none hover:bg-amber-50/60 rounded px-1"
                >
                  {eventDate}
                </span>
              )}
              {showBarHours && barHours && (
                <>
                  <span>&bull;</span>
                  <span
                    contentEditable={!isPrint}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => onUpdateBarSettings?.({ barHours: e.currentTarget.innerText.trim() })}
                    className="outline-none hover:bg-amber-50/60 rounded px-1"
                  >
                    {barHours}
                  </span>
                </>
              )}
            </div>
          )}

          {/* Bar Type Notification / Host Banner */}
          {barType === 'host' && (showHostName || hostName) && (
            <div className="mt-3 py-1.5 px-4 bg-emerald-50/80 border border-emerald-200 rounded-full inline-flex items-center gap-2 text-xs font-semibold text-emerald-900 shadow-2xs">
              <UserCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span>
                Complimentary bar service hosted by:{' '}
                <strong
                  contentEditable={!isPrint}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => onUpdateBarSettings?.({ hostName: e.currentTarget.innerText.trim() })}
                  className="outline-none underline decoration-emerald-400 underline-offset-2"
                >
                  {hostName || 'Event Host'}
                </strong>
              </span>
            </div>
          )}

          {barType === 'subsidized' && (
            <div className="mt-3 py-1.5 px-4 bg-amber-50/90 border border-amber-300 rounded-full inline-flex items-center gap-2 text-xs font-semibold text-amber-950 shadow-2xs">
              <HeartHandshake className="w-3.5 h-3.5 text-amber-700 shrink-0" />
              <span
                contentEditable={!isPrint}
                suppressContentEditableWarning={true}
                onBlur={(e) => onUpdateBarSettings?.({ subsidizedPriceText: e.currentTarget.innerText.trim() })}
                className="outline-none"
              >
                {subsidizedPriceText}
              </span>
            </div>
          )}

          {barType === 'cash' && (
            <div className="mt-3 py-1.5 px-4 bg-slate-100/90 border border-slate-300 rounded-full inline-flex items-center gap-2 text-xs font-semibold text-slate-800 shadow-2xs">
              <DollarSign className="w-3.5 h-3.5 text-slate-700 shrink-0" />
              <span>Full service cash & card bar &bull; Pricing listed per selection below</span>
            </div>
          )}
        </div>

        {/* MAIN BODY: 1-COLUMN OR BALANCED 2-COLUMN GRID */}
        {renderBarGrid()}

        {/* FOOTER SECTION */}
        <div className="relative z-10 mt-6 pt-3 border-t border-slate-200 flex items-center justify-between text-[10px] text-slate-500">
          <div>
            <p
              contentEditable={!isPrint}
              suppressContentEditableWarning={true}
              onBlur={(e) => onUpdateBarSettings?.({ gratuityNote: e.currentTarget.innerText.trim() })}
              className="italic outline-none hover:bg-amber-50/60 rounded px-1"
            >
              {gratuityNote}
            </p>
            <p className="text-[9px] text-slate-400 mt-0.5">
              Must be of legal drinking age with valid ID to consume alcoholic beverages. Please enjoy responsibly.
            </p>
          </div>

          {showQrCode && qrCodeUrl && (
            <div className="shrink-0 flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="text-right">
                <span className="font-bold text-[9px] uppercase tracking-wider text-slate-700 block">
                  Digital Bar Menu
                </span>
                <span className="text-[8px] text-slate-400">Scan on Mobile</span>
              </div>
              <QrCodeSvg url={qrCodeUrl} size={36} color="#0f172a" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
