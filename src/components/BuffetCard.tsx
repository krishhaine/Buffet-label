import React, { useState, useRef } from 'react';
import { BuffetItem, DesignSettings, AllergenKey } from '../types/buffet';
import { ALLERGEN_MAP, COMMON_ALLERGEN_KEYS, getAllergenInfo, getDietaryDisplayText } from '../utils/allergens';
import { QrCodeSvg } from './QrCodeSvg';
import {
  Trash2,
  Copy,
  Tag,
  Download,
  RotateCw,
  Wine,
  Clock,
  User,
  Thermometer,
  ArrowUp,
  ArrowDown,
  AArrowUp,
  AArrowDown,
  Sparkles,
} from 'lucide-react';
import { toPng } from 'html-to-image';

interface BuffetCardProps {
  item: BuffetItem;
  settings: DesignSettings;
  isPrint?: boolean;
  isBackFace?: boolean; // When printing duplex back page
  onUpdate?: (updated: BuffetItem) => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
}

export const BuffetCard: React.FC<BuffetCardProps> = ({
  item,
  settings,
  isPrint = false,
  isBackFace = false,
  onUpdate,
  onDelete,
  onDuplicate,
}) => {
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [viewingBack, setViewingBack] = useState(isBackFace);
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    shape,
    widthIn,
    heightIn,
    cornerRadius,
    theme,
    font,
    textAlign,
    accentColor,
    secondaryColor,
    titleColor,
    descriptionColor,
    badgeTextColor,
    priceColor,
    cardBgColor,
    highlightColor,
    highlightMode,
    logoUrl,
    logoHeight,
    logoPosition,
    showLogo,
    showAccentLine,
    showDescription,
    showStationBadge,
    showAllergenBadges,
    badgeDisplayMode,
    borderStyle,
    showCutGuides,
    tentMirrorTitle,
    showQrCode,
    qrCodeUrl,
    showPrice,
    titleFontSize,
    titleFontScale,
    verticalAlign,
    verticalOffset,
    titleUppercase,
    centerText,
    printSides,
    backShowIngredients,
    backShowWinePairing,
    showGuestName,
    showPrepDate,
    showUseByDate,
    showStorageNote,
    showChefName,
    showDualLanguage,
    dualLanguageStyle,
    showLanguageBadges,
    showSecondaryDesc,
  } = settings;

  const isActuallyBack = isPrint ? isBackFace : viewingBack;

  // Determine active text alignment
  const effectiveAlign = textAlign || (centerText ? 'center' : 'left');

  // Determine vertical alignment strategy
  const isCurvedShape = shape === 'circle' || shape === 'oval' || shape === 'semi-circle';
  const effectiveVerticalAlign = verticalAlign && verticalAlign !== 'auto'
    ? verticalAlign
    : (isCurvedShape ? 'center' : 'space-between');

  // Calculate cumulative vertical offset (global + per-item)
  const totalYOffset = (verticalOffset || 0) + (item.verticalOffsetOverride || 0);

  // Toggle tag
  const handleToggleTag = (tagKey: string) => {
    if (!onUpdate) return;
    const exists = item.tags.includes(tagKey);
    const newTags = exists
      ? item.tags.filter((t) => t !== tagKey)
      : [...item.tags, tagKey];
    onUpdate({ ...item, tags: newTags });
  };

  // Adjust per-item font scale
  const handleItemFontAdjust = (deltaPercent: number) => {
    if (!onUpdate) return;
    const currentScale = item.titleScaleOverride || 100;
    const newScale = Math.max(60, Math.min(220, currentScale + deltaPercent));
    onUpdate({ ...item, titleScaleOverride: newScale });
  };

  // Adjust per-item description font scale
  const handleItemDescFontAdjust = (deltaPercent: number) => {
    if (!onUpdate) return;
    const currentScale = item.descScaleOverride || 100;
    const newScale = Math.max(60, Math.min(220, currentScale + deltaPercent));
    onUpdate({ ...item, descScaleOverride: newScale });
  };

  // Adjust per-item vertical position offset
  const handleItemPositionNudge = (deltaPx: number) => {
    if (!onUpdate) return;
    const currentOffset = item.verticalOffsetOverride || 0;
    onUpdate({ ...item, verticalOffsetOverride: currentOffset + deltaPx });
  };

  // Export individual card as high-res PNG image
  const handleExportCardPng = async () => {
    if (!cardRef.current || isExporting) return;
    try {
      setIsExporting(true);
      setShowTagPicker(false);
      await new Promise((r) => setTimeout(r, 60));

      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        cacheBust: true,
      });

      const a = document.createElement('a');
      const sideLabel = isActuallyBack ? '-back' : '-front';
      const cleanTitle = (item.name || 'label').toLowerCase().replace(/[^a-z0-9]/g, '-');
      const filename = `${cleanTitle}${sideLabel}.png`;
      a.href = dataUrl;
      a.download = filename;
      a.click();
    } catch (err) {
      console.error('Failed to export card image:', err);
    } finally {
      setIsExporting(false);
    }
  };

  // Shape CSS classes
  const getShapeClasses = () => {
    switch (shape) {
      case 'circle':
        return 'rounded-full aspect-square text-center items-center justify-center p-4 sm:p-5';
      case 'oval':
        return 'shape-oval text-center items-center justify-center px-5 py-3 sm:px-6 sm:py-4';
      case 'semi-circle':
        return 'shape-arch-dome text-center p-4';
      case 'square':
        return 'aspect-square p-3';
      case 'rounded-rect':
        return 'p-3';
      case 'sticker-compact':
        return 'p-1.5';
      case 'tent':
        return 'p-0';
      case 'rectangle':
      default:
        return 'p-3';
    }
  };

  // Inline styling for dimensions & custom colors & radius
  const getCardStyle = (): React.CSSProperties => {
    const style: React.CSSProperties = {
      width: `${widthIn}in`,
      height: `${heightIn}in`,
      minWidth: `${widthIn}in`,
      minHeight: `${heightIn}in`,
    };

    if (cardBgColor && cardBgColor !== 'auto') {
      style.backgroundColor = cardBgColor;
    }

    if (shape === 'rounded-rect' && cornerRadius) {
      style.borderRadius = `${cornerRadius}px`;
    } else if (shape === 'square' && cornerRadius) {
      style.borderRadius = `${cornerRadius}px`;
    }

    return style;
  };

  // Theme Styling
  const getThemeStyles = () => {
    switch (theme) {
      case 'wedding':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? '' : 'bg-[#fdfaf7] text-stone-900',
          border: 'border-[#e0b4a4]/60',
          titleColor: titleColor && titleColor !== 'auto' ? '' : 'text-[#5c3a33]',
          descColor: 'text-[#82645d]',
          subBorder: 'border-[#f2ded8]',
          badgeBg: 'bg-[#fcf3f0] text-[#7a483e] border-[#eed1c8]',
        };
      case 'corporate':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? '' : 'bg-white text-slate-900',
          border: 'border-slate-300',
          titleColor: titleColor && titleColor !== 'auto' ? '' : 'text-[#0f233a]',
          descColor: 'text-slate-600',
          subBorder: 'border-slate-200',
          badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
        };
      case 'vineyard':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? '' : 'bg-[#faf6f0] text-[#2c1f14]',
          border: 'border-[#8c4830]/40',
          titleColor: titleColor && titleColor !== 'auto' ? '' : 'text-[#632214]',
          descColor: 'text-[#5c4434]',
          subBorder: 'border-[#ded4c5]',
          badgeBg: 'bg-[#f0e7d8] text-[#4a2618] border-[#cbbca8]',
        };
      case 'tropical':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? '' : 'bg-[#f3faf8] text-slate-900',
          border: 'border-[#0d9488]/40',
          titleColor: titleColor && titleColor !== 'auto' ? '' : 'text-[#0f766e]',
          descColor: 'text-[#134e4a]/75',
          subBorder: 'border-[#99f6e4]/60',
          badgeBg: 'bg-[#ccfbf1] text-[#115e59] border-[#5eead4]',
        };
      case 'gatsby':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? '' : 'bg-[#18181b] text-amber-100',
          border: 'border-[#d4af37]',
          titleColor: titleColor && titleColor !== 'auto' ? '' : 'text-[#fef08a]',
          descColor: 'text-zinc-300',
          subBorder: 'border-[#d4af37]/40',
          badgeBg: 'bg-[#27272a] text-amber-200 border-[#d4af37]/50',
        };
      case 'holiday':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? '' : 'bg-[#fdfbf7] text-stone-900',
          border: 'border-[#991b1b]/50',
          titleColor: titleColor && titleColor !== 'auto' ? '' : 'text-[#991b1b]',
          descColor: 'text-[#166534]',
          subBorder: 'border-[#fecaca]',
          badgeBg: 'bg-[#fef2f2] text-[#991b1b] border-[#f87171]',
        };
      case 'noir':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? '' : 'bg-zinc-900 text-zinc-100',
          border: 'border-amber-400/40',
          titleColor: titleColor && titleColor !== 'auto' ? '' : 'text-amber-100',
          descColor: 'text-zinc-400',
          subBorder: 'border-zinc-800',
          badgeBg: 'bg-zinc-800 text-zinc-200 border-zinc-700',
        };
      case 'botanical':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? '' : 'bg-[#f6f9f6] text-stone-900',
          border: 'border-emerald-700/20',
          titleColor: titleColor && titleColor !== 'auto' ? '' : 'text-emerald-950',
          descColor: 'text-emerald-950/70',
          subBorder: 'border-emerald-200/60',
          badgeBg: 'bg-emerald-50 text-emerald-900 border-emerald-200',
        };
      case 'bistro':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? '' : 'bg-[#fffdf9] text-stone-900',
          border: 'border-stone-900',
          titleColor: titleColor && titleColor !== 'auto' ? '' : 'text-stone-900',
          descColor: 'text-stone-600',
          subBorder: 'border-stone-300',
          badgeBg: 'bg-amber-100/60 text-amber-950 border-amber-300',
        };
      case 'kraft':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? '' : 'bg-[#e8decb] text-[#2c221a]',
          border: 'border-[#8c745d]',
          titleColor: titleColor && titleColor !== 'auto' ? '' : 'text-[#241a12]',
          descColor: 'text-[#4d3c2e]',
          subBorder: 'border-[#b8a38d]',
          badgeBg: 'bg-[#d8ccb6] text-[#2c221a] border-[#a8937d]',
        };
      case 'industrial':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? '' : 'bg-white text-black',
          border: 'border-black',
          titleColor: titleColor && titleColor !== 'auto' ? '' : 'text-black',
          descColor: 'text-zinc-700',
          subBorder: 'border-black',
          badgeBg: 'bg-zinc-100 text-black border-zinc-400',
        };
      case 'contemporary':
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? '' : 'bg-white text-slate-900',
          border: 'border-slate-300',
          titleColor: titleColor && titleColor !== 'auto' ? '' : 'text-slate-900',
          descColor: 'text-slate-600',
          subBorder: 'border-slate-100',
          badgeBg: 'bg-slate-100 text-slate-800 border-slate-200',
        };
      case 'heritage':
      default:
        return {
          bg: cardBgColor && cardBgColor !== 'auto' ? '' : 'bg-white text-stone-900',
          border: 'border-[#d4af37]/60',
          titleColor: titleColor && titleColor !== 'auto' ? '' : 'text-stone-900',
          descColor: 'text-stone-600',
          subBorder: 'border-stone-200',
          badgeBg: 'bg-amber-50 text-stone-900 border-amber-200',
        };
    }
  };

  const themeConfig = getThemeStyles();

  // Border formatting
  const getBorderClass = () => {
    // For pre-cut oval / circle templates or when printing, prevent unwanted border interference
    if (shape === 'oval' || shape === 'circle') {
      if (borderStyle === 'minimal' || borderStyle === 'none' || isPrint) {
        return 'border border-transparent';
      }
    }
    if (isPrint && !showCutGuides && (borderStyle === 'dashed' || borderStyle === 'minimal')) {
      return 'border border-transparent';
    }
    switch (borderStyle) {
      case 'hairline':
        return 'border border-slate-200';
      case 'double':
        return 'border-4 border-double border-stone-800';
      case 'corner':
        return 'border border-stone-400 relative';
      case 'dashed':
        return 'border border-dashed border-slate-300';
      case 'sticker-cut':
        return 'border border-slate-300 shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]';
      case 'none':
        return 'border border-transparent';
      case 'minimal':
      default:
        return isPrint ? 'border border-transparent' : 'border border-slate-200/80';
    }
  };

  // Precise Title Font Sizing with Per-Item & Global Scaling
  const getComputedTitleFontSizePx = () => {
    const activeSizeKey = (item.fontSizeOverride && item.fontSizeOverride !== 'auto')
      ? item.fontSizeOverride
      : (titleFontSize || 'md');

    const baseSizesMap: Record<string, number> = {
      xs: 10.5,
      sm: 12.0,
      md: 14.5,
      lg: 17.0,
      xl: 20.5,
      '2xl': 24.0,
    };

    let basePt = baseSizesMap[activeSizeKey] || 14.5;

    // Small cards/stickers dimension safety
    if (heightIn <= 1.1) {
      basePt = Math.min(basePt, 11);
    } else if (widthIn <= 2.2) {
      basePt = Math.min(basePt, 12);
    } else if (widthIn >= 3.8 && activeSizeKey === 'md') {
      basePt = 16;
    }

    // Auto-adjust slightly for very long dish names if not manually overridden
    if (!item.fontSizeOverride && !item.titleScaleOverride) {
      if (item.name.length > 36) basePt *= 0.88;
      else if (item.name.length > 26) basePt *= 0.94;
    }

    const globalScale = (titleFontScale || 100) / 100;
    const itemScale = (item.titleScaleOverride || 100) / 100;

    return Math.max(8, basePt * globalScale * itemScale);
  };

  // Precise Description Font Sizing with Per-Item & Global Scaling
  const getComputedDescFontSizePx = () => {
    const activeSizeKey = (item.descriptionFontSizeOverride && item.descriptionFontSizeOverride !== 'auto')
      ? item.descriptionFontSizeOverride
      : (settings.descriptionFontSize || 'sm');

    const baseDescSizesMap: Record<string, number> = {
      xs: 7.5,
      sm: 9.0,
      md: 10.5,
      lg: 12.0,
      xl: 14.0,
    };

    let basePt = baseDescSizesMap[activeSizeKey] || 9.0;

    if (heightIn <= 1.1) {
      basePt = Math.min(basePt, 7.5);
    } else if (widthIn <= 2.2) {
      basePt = Math.min(basePt, 8.0);
    }

    const globalScale = (settings.descriptionFontScale || 100) / 100;
    const itemScale = (item.descScaleOverride || 100) / 100;

    return Math.max(6.5, basePt * globalScale * itemScale);
  };

  // Allergen Position & Nudge Configuration
  const effectiveAllergenPos = item.allergenPositionOverride || settings.allergenPosition || 'bottom';
  const effectiveAllergenOffset = item.allergenOffsetOverride ?? settings.allergenVerticalOffset ?? 0;
  const allergenScale = (settings.allergenScale || 100) / 100;

  // Render Allergen Badges
  const renderAllergenBadges = (customAlignClass?: string) => {
    if (!showAllergenBadges || item.tags.length === 0) return null;

    const alignClass = customAlignClass || (
      effectiveAlign === 'center' || isCurvedShape
        ? 'justify-center'
        : effectiveAlign === 'right'
        ? 'justify-end'
        : 'justify-start'
    );

    const customBadgeTextStyle = badgeTextColor && badgeTextColor !== 'auto'
      ? { color: badgeTextColor }
      : undefined;

    const badgeContainerStyle: React.CSSProperties = {};
    if (allergenScale !== 1) {
      badgeContainerStyle.transform = `scale(${allergenScale})`;
      badgeContainerStyle.transformOrigin = effectiveAlign === 'right' ? 'right center' : effectiveAlign === 'center' || isCurvedShape ? 'center center' : 'left center';
    }

    return (
      <div
        style={Object.keys(badgeContainerStyle).length > 0 ? badgeContainerStyle : undefined}
        className={`flex flex-wrap items-center gap-1 ${alignClass}`}
      >
        {item.tags.map((code) => {
          const info = getAllergenInfo(code);
          const displayText = getDietaryDisplayText(info, settings.dietaryNameFormat || 'code');

          if (badgeDisplayMode === 'icon-only') {
            return (
              <span
                key={code}
                title={info.fullTitle}
                className="text-[9.5px] leading-none px-1 py-0.5 bg-slate-100 rounded border border-slate-200"
              >
                {info.icon}
              </span>
            );
          }

          if (badgeDisplayMode === 'text') {
            return (
              <span
                key={code}
                style={customBadgeTextStyle}
                className="text-[8.5px] font-semibold tracking-wider uppercase text-slate-600 after:content-[','] last:after:content-[''] mr-0.5"
              >
                {displayText}
              </span>
            );
          }

          if (badgeDisplayMode === 'compact' || widthIn <= 2.2 || heightIn <= 1.2) {
            return (
              <span
                key={code}
                title={info.fullTitle}
                style={customBadgeTextStyle}
                className="inline-flex items-center text-[7.5px] font-bold px-1 py-0.2 rounded border uppercase tracking-wider bg-slate-100 border-slate-300 text-slate-800"
              >
                {displayText}
              </span>
            );
          }

          // Default 'pill' mode
          return (
            <span
              key={code}
              title={info.fullTitle}
              style={customBadgeTextStyle}
              className={`inline-flex items-center gap-0.5 text-[8.5px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${info.badgeClass}`}
            >
              <span className="text-[9px] leading-none">{info.icon}</span>
              <span>{displayText}</span>
            </span>
          );
        })}
      </div>
    );
  };

  // Render Front Face
  const renderFrontFace = (isFoldTop = false) => {
    const isCentered = effectiveAlign === 'center' || isCurvedShape;
    const isRight = effectiveAlign === 'right';
    const isCompactSticker = heightIn <= 1.2;

    const alignClass = isCentered ? 'text-center items-center' : isRight ? 'text-right items-end' : 'text-left items-start';

    // Title Inline Style (with exact font size and color)
    const computedSizePx = getComputedTitleFontSizePx();
    const titleStyle: React.CSSProperties = {
      fontSize: `${computedSizePx}px`,
      lineHeight: '1.2',
    };

    if (titleColor && titleColor !== 'auto') {
      titleStyle.color = titleColor;
    }
    if (highlightMode === 'title-badge' && highlightColor) {
      titleStyle.backgroundColor = highlightColor;
      titleStyle.padding = '2px 6px';
      titleStyle.borderRadius = '4px';
    }

    // Centered Vertical Layout (Ideal for Oval, Circle, and User-Selected Center Alignment)
    if (effectiveVerticalAlign === 'center' || effectiveVerticalAlign === 'top' || effectiveVerticalAlign === 'bottom') {
      const vJustifyClass = effectiveVerticalAlign === 'center'
        ? 'justify-center'
        : effectiveVerticalAlign === 'top'
        ? 'justify-start pt-1.5'
        : 'justify-end pb-1.5';

      return (
        <div
          className={`flex flex-col ${vJustifyClass} ${alignClass} flex-1 w-full relative overflow-hidden transition-transform duration-75 ${
            isFoldTop ? 'rotate-180 bg-slate-50/50 p-3' : ''
          }`}
          style={totalYOffset ? { transform: `translateY(${totalYOffset}px)` } : undefined}
        >
          {/* Centered Content Cluster */}
          <div className="w-full flex flex-col items-center justify-center max-w-[92%] mx-auto space-y-1">
            {/* Boxed Lunch Guest Name Header (if enabled) */}
            {showGuestName && (item.guestName || !isPrint) && (
              <div className="mb-0.5 pb-0.5 border-b border-dashed border-slate-200 flex items-center justify-center gap-1 w-full">
                <User className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                <span
                  contentEditable={!isPrint}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    if (onUpdate && e.currentTarget.innerText !== item.guestName) {
                      onUpdate({ ...item, guestName: e.currentTarget.innerText.trim() });
                    }
                  }}
                  className={`text-[8.5px] font-bold tracking-wide uppercase text-slate-700 truncate outline-none ${
                    !isPrint ? 'hover:bg-amber-50 rounded px-0.5 cursor-text' : ''
                  }`}
                >
                  {item.guestName ? `For: ${item.guestName}` : (!isPrint ? 'Add Guest Name...' : '')}
                </span>
              </div>
            )}

            {/* Header: Logo / Station / Language / Accent Flourish */}
            {(showLogo || showAccentLine || (showStationBadge && item.station) || (showPrice && item.price) || showLanguageBadges || item.cardLanguage || (effectiveAllergenPos === 'top_right' && showAllergenBadges && item.tags.length > 0)) && (
              <div className="flex flex-col items-center justify-center gap-0.5 w-full mb-0.5">
                {showLogo && logoUrl && (
                  <img
                    src={logoUrl}
                    alt="Logo"
                    style={{ height: `${logoHeight || 16}px` }}
                    className="object-contain max-w-[1.2in] mb-0.5"
                  />
                )}

                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  {(showLanguageBadges || item.cardLanguage) && (
                    <span className={`text-[7px] font-bold uppercase tracking-wider px-1 py-0.2 rounded shrink-0 border ${
                      item.isTranslatedCard
                        ? 'bg-amber-100/90 text-amber-900 border-amber-300'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}>
                      {item.cardLanguage ? item.cardLanguage : (item.isTranslatedCard ? (settings.targetLanguage?.toUpperCase() || 'ES') : (settings.primaryLanguage?.toUpperCase() || 'EN'))}
                    </span>
                  )}

                  {showStationBadge && item.station && (
                    <span className="text-[7.5px] font-bold tracking-widest uppercase px-1.5 py-0.2 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0 truncate max-w-[1.1in]">
                      {item.station}
                    </span>
                  )}

                  {effectiveAllergenPos === 'top_right' && (
                    <div className="shrink-0">
                      {renderAllergenBadges('justify-center')}
                    </div>
                  )}

                  {showPrice && item.price && (
                    <span
                      style={priceColor && priceColor !== 'auto' ? { color: priceColor } : undefined}
                      className="text-[9.5px] font-bold text-slate-800 shrink-0"
                    >
                      {item.price}
                    </span>
                  )}
                </div>

                {showAccentLine && (
                  <div
                    className="h-[1.5px] w-12 mx-auto rounded-full mt-0.5"
                    style={{ backgroundColor: accentColor || '#d4af37' }}
                  />
                )}
              </div>
            )}

            {/* Primary Dish / Label Title */}
            <div className="flex items-center justify-center gap-1.5 flex-wrap w-full">
              <h3
                contentEditable={!isPrint}
                suppressContentEditableWarning={true}
                style={titleStyle}
                onBlur={(e) => {
                  if (onUpdate && e.currentTarget.innerText !== item.name) {
                    onUpdate({ ...item, name: e.currentTarget.innerText.trim() });
                  }
                }}
                className={`font-bold outline-none select-text text-center ${effectiveAllergenPos === 'inline_title' ? 'inline-block' : 'w-full'} px-1 ${themeConfig.titleColor} ${
                  titleUppercase ? 'uppercase tracking-wide' : ''
                } ${!isPrint ? 'hover:bg-amber-50/60 focus:bg-amber-50/80 rounded px-0.5 transition-colors cursor-text' : ''}`}
              >
                {showDualLanguage && settings.dualLanguageMode === 'single_dual' && dualLanguageStyle === 'side_by_side' && item.translationName
                  ? `${item.name} / ${item.translationName}`
                  : item.name}
              </h3>

              {effectiveAllergenPos === 'inline_title' && showAllergenBadges && item.tags.length > 0 && (
                <div className="shrink-0 inline-flex">
                  {renderAllergenBadges()}
                </div>
              )}
            </div>

            {/* Dual-Language Subtitle Translation */}
            {showDualLanguage && settings.dualLanguageMode === 'single_dual' && (item.translationName || !isPrint) && dualLanguageStyle === 'sub_title' && (
              <div
                contentEditable={!isPrint}
                suppressContentEditableWarning={true}
                style={descriptionColor && descriptionColor !== 'auto' ? { color: descriptionColor } : undefined}
                onBlur={(e) => {
                  if (onUpdate && e.currentTarget.innerText !== item.translationName) {
                    onUpdate({ ...item, translationName: e.currentTarget.innerText.trim() });
                  }
                }}
                className={`text-[11px] font-serif italic text-amber-900/85 leading-tight outline-none text-center w-full px-1 ${
                  !isPrint ? 'hover:bg-amber-50/60 rounded px-0.5 transition-colors cursor-text' : ''
                }`}
              >
                {item.translationName || (!isPrint ? 'Secondary translation...' : '')}
              </div>
            )}

            {/* Dietary & Allergen Badges (Placed Directly Below Title to never get cut off) */}
            {effectiveAllergenPos === 'below_title' && showAllergenBadges && item.tags.length > 0 && (
              <div
                style={effectiveAllergenOffset ? { transform: `translateY(${effectiveAllergenOffset}px)` } : undefined}
                className="py-0.5 w-full flex items-center justify-center"
              >
                {renderAllergenBadges()}
              </div>
            )}

            {/* Dual-Language Stacked Block translation */}
            {showDualLanguage && settings.dualLanguageMode === 'single_dual' && dualLanguageStyle === 'stacked_blocks' && (item.translationName || !isPrint) && (
              <div className="w-full pt-1 border-t border-slate-200/80 text-center">
                <div
                  contentEditable={!isPrint}
                  suppressContentEditableWarning={true}
                  style={descriptionColor && descriptionColor !== 'auto' ? { color: descriptionColor } : undefined}
                  onBlur={(e) => {
                    if (onUpdate && e.currentTarget.innerText !== item.translationName) {
                      onUpdate({ ...item, translationName: e.currentTarget.innerText.trim() });
                    }
                  }}
                  className={`text-[11px] font-serif font-bold italic text-amber-900/90 leading-tight outline-none ${
                    !isPrint ? 'hover:bg-amber-50/60 rounded px-0.5 cursor-text' : ''
                  }`}
                >
                  {item.translationName || (!isPrint ? 'Secondary translation...' : '')}
                </div>
              </div>
            )}

            {/* Description / Notes */}
            {showDescription && !isCompactSticker && (item.description || !isPrint) && (
              <p
                contentEditable={!isPrint}
                suppressContentEditableWarning={true}
                style={{
                  fontSize: `${getComputedDescFontSizePx()}px`,
                  lineHeight: '1.25',
                  ...(descriptionColor && descriptionColor !== 'auto' ? { color: descriptionColor } : {}),
                }}
                onBlur={(e) => {
                  if (onUpdate && e.currentTarget.innerText !== item.description) {
                    onUpdate({ ...item, description: e.currentTarget.innerText.trim() });
                  }
                }}
                className={`italic leading-tight text-center max-w-[95%] outline-none ${themeConfig.descColor} ${
                  !isPrint
                    ? 'hover:bg-amber-50/60 focus:bg-amber-50/80 rounded px-0.5 transition-colors cursor-text min-h-[14px]'
                    : ''
                }`}
              >
                {item.description || (!isPrint ? 'Add details or ingredients...' : '')}
              </p>
            )}

            {/* Dietary & Allergen Badges (Standard Bottom in Centered Cluster) */}
            {effectiveAllergenPos === 'bottom' && showAllergenBadges && item.tags.length > 0 && (
              <div
                style={effectiveAllergenOffset ? { transform: `translateY(${effectiveAllergenOffset}px)` } : undefined}
                className="pt-1 w-full flex items-center justify-center"
              >
                {renderAllergenBadges()}
              </div>
            )}

            {/* QR Code (if enabled) */}
            {showQrCode && qrCodeUrl && (
              <div className="pt-1 flex items-center justify-center">
                <QrCodeSvg url={qrCodeUrl} size={18} color="#0f172a" />
              </div>
            )}
          </div>
        </div>
      );
    }

    // Standard Distributed Layout (Header at top, Badges at bottom)
    return (
      <div
        className={`flex flex-col justify-between flex-1 relative overflow-hidden w-full ${alignClass} ${
          isFoldTop ? 'rotate-180 bg-slate-50/50 p-3' : ''
        }`}
        style={totalYOffset ? { transform: `translateY(${totalYOffset}px)` } : undefined}
      >
        {/* Top Section */}
        <div className="w-full">
          {/* Boxed Lunch Guest Name Header */}
          {showGuestName && (item.guestName || !isPrint) && (
            <div className="mb-1 pb-1 border-b border-dashed border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1 min-w-0">
                <User className="w-2.5 h-2.5 text-amber-600 shrink-0" />
                <span
                  contentEditable={!isPrint}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => {
                    if (onUpdate && e.currentTarget.innerText !== item.guestName) {
                      onUpdate({ ...item, guestName: e.currentTarget.innerText.trim() });
                    }
                  }}
                  className={`text-[8.5px] font-bold tracking-wide uppercase text-slate-700 truncate outline-none ${
                    !isPrint ? 'hover:bg-amber-50 rounded px-0.5 cursor-text' : ''
                  }`}
                >
                  {item.guestName ? `For: ${item.guestName}` : (!isPrint ? 'Add Guest Name...' : '')}
                </span>
              </div>
              {item.orderNumber && (
                <span className="text-[7.5px] font-bold text-slate-500 bg-slate-100 px-1 py-0.2 rounded shrink-0">
                  {item.orderNumber}
                </span>
              )}
            </div>
          )}

          {/* Header Row: Logo / Station / Language / Accent / Price */}
          {(showLogo || showAccentLine || (showStationBadge && item.station) || (showPrice && item.price) || showLanguageBadges || item.cardLanguage) && (
            <div
              className={`flex items-center gap-1.5 mb-1.5 w-full ${
                isCentered
                  ? 'justify-center'
                  : isRight
                  ? 'justify-end flex-row-reverse'
                  : logoPosition === 'center'
                  ? 'justify-center'
                  : logoPosition === 'right'
                  ? 'flex-row-reverse justify-between'
                  : 'justify-between'
              }`}
            >
              {showLogo && logoUrl && (
                <img
                  src={logoUrl}
                  alt="Logo"
                  style={{ height: `${logoHeight || 16}px` }}
                  className="object-contain shrink-0 max-w-[1.1in]"
                />
              )}

              {(showLanguageBadges || item.cardLanguage) && (
                <span className={`text-[7px] font-bold uppercase tracking-wider px-1 py-0.2 rounded shrink-0 border ${
                  item.isTranslatedCard
                    ? 'bg-amber-100/90 text-amber-900 border-amber-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {item.cardLanguage ? item.cardLanguage : (item.isTranslatedCard ? (settings.targetLanguage?.toUpperCase() || 'ES') : (settings.primaryLanguage?.toUpperCase() || 'EN'))}
                </span>
              )}

              {showStationBadge && item.station && (
                <span className="text-[7.5px] font-bold tracking-widest uppercase px-1 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0 truncate max-w-[0.9in]">
                  {item.station}
                </span>
              )}

              {showAccentLine && !isCentered && (
                <div
                  className="h-[2px] flex-1 rounded-full shrink-0"
                  style={{ backgroundColor: accentColor || '#d4af37' }}
                />
              )}

              {showPrice && item.price && (
                <span
                  style={priceColor && priceColor !== 'auto' ? { color: priceColor } : undefined}
                  className="text-[9.5px] font-bold text-slate-800 shrink-0"
                >
                  {item.price}
                </span>
              )}
            </div>
          )}

          {/* Accent Line for Centered */}
          {showAccentLine && isCentered && (
            <div
              className="h-[2px] w-12 mx-auto rounded-full mb-1.5"
              style={{ backgroundColor: accentColor || '#d4af37' }}
            />
          )}

          {/* Primary Dish / Label Title */}
          <h3
            contentEditable={!isPrint}
            suppressContentEditableWarning={true}
            style={titleStyle}
            onBlur={(e) => {
              if (onUpdate && e.currentTarget.innerText !== item.name) {
                onUpdate({ ...item, name: e.currentTarget.innerText.trim() });
              }
            }}
            className={`font-bold outline-none select-text ${themeConfig.titleColor} ${
              titleUppercase ? 'uppercase tracking-wide' : ''
            } ${!isPrint ? 'hover:bg-amber-50/60 focus:bg-amber-50/80 rounded px-0.5 transition-colors cursor-text' : ''}`}
          >
            {showDualLanguage && settings.dualLanguageMode === 'single_dual' && dualLanguageStyle === 'side_by_side' && item.translationName
              ? `${item.name} / ${item.translationName}`
              : item.name}
          </h3>

          {/* Dual-Language Subtitle Translation */}
          {showDualLanguage && settings.dualLanguageMode === 'single_dual' && (item.translationName || !isPrint) && dualLanguageStyle === 'sub_title' && (
            <div
              contentEditable={!isPrint}
              suppressContentEditableWarning={true}
              style={descriptionColor && descriptionColor !== 'auto' ? { color: descriptionColor } : undefined}
              onBlur={(e) => {
                if (onUpdate && e.currentTarget.innerText !== item.translationName) {
                  onUpdate({ ...item, translationName: e.currentTarget.innerText.trim() });
                }
              }}
              className={`text-[10.5px] font-serif italic text-amber-900/85 leading-tight mt-0.5 outline-none ${
                !isPrint ? 'hover:bg-amber-50/60 rounded px-0.5 transition-colors cursor-text' : ''
              }`}
            >
              {item.translationName || (!isPrint ? 'Secondary translation...' : '')}
            </div>
          )}

          {/* Description */}
          {showDescription && !isCompactSticker && (
            <p
              contentEditable={!isPrint}
              suppressContentEditableWarning={true}
              style={{
                fontSize: `${getComputedDescFontSizePx()}px`,
                lineHeight: '1.25',
                ...(descriptionColor && descriptionColor !== 'auto' ? { color: descriptionColor } : {}),
              }}
              onBlur={(e) => {
                if (onUpdate && e.currentTarget.innerText !== item.description) {
                  onUpdate({ ...item, description: e.currentTarget.innerText.trim() });
                }
              }}
              className={`italic leading-tight mt-1 outline-none ${themeConfig.descColor} ${
                !isPrint
                  ? 'hover:bg-amber-50/60 focus:bg-amber-50/80 rounded px-0.5 transition-colors cursor-text min-h-[14px]'
                  : ''
              }`}
            >
              {item.description || (!isPrint ? 'Add notes, ingredients or details...' : '')}
            </p>
          )}

          {/* Dual-Language Description */}
          {showDualLanguage && settings.dualLanguageMode === 'single_dual' && (settings.showSecondaryDesc !== false) && item.translationDesc && showDescription && !isCompactSticker && (
            <p
              contentEditable={!isPrint}
              suppressContentEditableWarning={true}
              style={{
                fontSize: `${Math.max(6.5, getComputedDescFontSizePx() * 0.95)}px`,
                lineHeight: '1.25',
                ...(descriptionColor && descriptionColor !== 'auto' ? { color: descriptionColor } : {}),
              }}
              onBlur={(e) => {
                if (onUpdate && e.currentTarget.innerText !== item.translationDesc) {
                  onUpdate({ ...item, translationDesc: e.currentTarget.innerText.trim() });
                }
              }}
              className="italic text-slate-500 leading-tight mt-0.5 outline-none"
            >
              {item.translationDesc}
            </p>
          )}

          {/* Sticker Prep / Storage Metadata Row */}
          {(showPrepDate || showUseByDate || showStorageNote || showChefName) && (
            <div className={`flex flex-wrap items-center gap-1.5 mt-1.5 text-[7.5px] text-slate-600 ${isCentered ? 'justify-center' : isRight ? 'justify-end' : 'justify-start'}`}>
              {showPrepDate && (item.prepDate || !isPrint) && (
                <span className="inline-flex items-center gap-0.5 bg-slate-100 px-1 py-0.2 rounded border border-slate-200">
                  <Clock className="w-2 h-2 text-slate-500" />
                  <span
                    contentEditable={!isPrint}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      if (onUpdate) onUpdate({ ...item, prepDate: e.currentTarget.innerText.trim() });
                    }}
                    className="outline-none"
                  >
                    {item.prepDate ? item.prepDate : (!isPrint ? 'Prep: Today' : '')}
                  </span>
                </span>
              )}
              {showUseByDate && (item.useByDate || !isPrint) && (
                <span className="inline-flex items-center gap-0.5 bg-rose-50 text-rose-800 px-1 py-0.2 rounded border border-rose-200 font-semibold">
                  <span
                    contentEditable={!isPrint}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      if (onUpdate) onUpdate({ ...item, useByDate: e.currentTarget.innerText.trim() });
                    }}
                    className="outline-none"
                  >
                    {item.useByDate ? item.useByDate : (!isPrint ? 'Exp: +3 Days' : '')}
                  </span>
                </span>
              )}
              {showStorageNote && (item.storageNote || !isPrint) && (
                <span className="inline-flex items-center gap-0.5 bg-sky-50 text-sky-800 px-1 py-0.2 rounded border border-sky-200">
                  <Thermometer className="w-2 h-2 text-sky-600" />
                  <span
                    contentEditable={!isPrint}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      if (onUpdate) onUpdate({ ...item, storageNote: e.currentTarget.innerText.trim() });
                    }}
                    className="outline-none"
                  >
                    {item.storageNote || (!isPrint ? 'Keep Chilled' : '')}
                  </span>
                </span>
              )}
              {showChefName && (item.chefName || !isPrint) && (
                <span className="inline-flex items-center gap-0.5 bg-amber-50 text-amber-900 px-1 py-0.2 rounded border border-amber-200">
                  <span
                    contentEditable={!isPrint}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      if (onUpdate) onUpdate({ ...item, chefName: e.currentTarget.innerText.trim() });
                    }}
                    className="outline-none"
                  >
                    {item.chefName ? `Prep: ${item.chefName}` : (!isPrint ? 'Prep Staff Name' : '')}
                  </span>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Bottom Row: Allergen Badges & QR Code */}
        <div className={`mt-1.5 pt-1 border-t ${themeConfig.subBorder} flex items-center justify-between gap-1 w-full ${isCentered ? 'justify-center' : ''}`}>
          <div className="flex-1 min-w-0">{renderAllergenBadges()}</div>

          {showQrCode && qrCodeUrl && !isCentered && (
            <div className="shrink-0 flex items-center gap-1">
              <QrCodeSvg url={qrCodeUrl} size={widthIn <= 2.5 || heightIn <= 1.2 ? 18 : 22} color="#0f172a" />
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render Back Face (Duplex / Double-Sided)
  const renderBackFace = () => {
    const isCentered = effectiveAlign === 'center' || isCurvedShape;
    const isDualLangBack = showDualLanguage && dualLanguageStyle === 'back_face' && item.translationName;

    return (
      <div className={`flex flex-col justify-between flex-1 relative overflow-hidden p-3 bg-slate-50/90 text-slate-800 ${isCentered ? 'text-center' : 'text-left'}`}>
        <div>
          {/* Back Header */}
          <div className="flex items-center justify-between pb-1 mb-1.5 border-b border-slate-200">
            <span className="text-[8px] font-bold uppercase tracking-widest text-slate-500">
              {isDualLangBack ? item.translationName : `${item.name} • Details`}
            </span>
            {showLogo && logoUrl && (
              <img src={logoUrl} alt="Logo" className="h-3 object-contain opacity-70" />
            )}
          </div>

          {isDualLangBack ? (
            <div className="space-y-1.5 py-1">
              <h4 className="text-sm font-bold text-slate-900">{item.translationName}</h4>
              {item.translationDesc && (
                <p className="text-[9px] italic text-slate-600">{item.translationDesc}</p>
              )}
            </div>
          ) : (
            <div className="space-y-1.5">
              {/* Back Ingredients / Recipe Breakdown */}
              {backShowIngredients && (
                <div>
                  <span className="text-[8px] font-bold uppercase tracking-wider text-slate-600 block mb-0.5">
                    Ingredients & Dietary Notes:
                  </span>
                  <p
                    contentEditable={!isPrint}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      if (onUpdate && e.currentTarget.innerText !== item.backIngredients) {
                        onUpdate({ ...item, backIngredients: e.currentTarget.innerText.trim() });
                      }
                    }}
                    className={`text-[8.5px] leading-tight text-slate-700 outline-none ${
                      !isPrint ? 'hover:bg-amber-50/60 focus:bg-amber-50/80 rounded px-0.5 transition-colors cursor-text' : ''
                    }`}
                  >
                    {item.backIngredients || item.description || (!isPrint ? 'Detailed culinary ingredients...' : '')}
                  </p>
                </div>
              )}

              {/* Sommelier / Wine Pairing */}
              {backShowWinePairing && (
                <div className="pt-1">
                  <span className="text-[8px] font-bold uppercase tracking-wider text-rose-800 flex items-center gap-1">
                    <Wine className="w-2.5 h-2.5" />
                    Recommended Beverage Pairing:
                  </span>
                  <p
                    contentEditable={!isPrint}
                    suppressContentEditableWarning={true}
                    onBlur={(e) => {
                      if (onUpdate && e.currentTarget.innerText !== item.backWinePairing) {
                        onUpdate({ ...item, backWinePairing: e.currentTarget.innerText.trim() });
                      }
                    }}
                    className={`text-[8.5px] italic text-slate-600 outline-none ${
                      !isPrint ? 'hover:bg-amber-50/60 focus:bg-amber-50/80 rounded px-0.5 transition-colors cursor-text' : ''
                    }`}
                  >
                    {item.backWinePairing || (!isPrint ? 'E.g. 2022 Napa Valley Chardonnay' : '')}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Back Footer: QR Code & Allergen Matrix */}
        <div className="mt-1.5 pt-1 border-t border-slate-200 flex items-center justify-between gap-1">
          <div className="text-[8px] text-slate-500">
            {item.tags.length > 0 ? (
              <span>Dietary: {item.tags.join(', ')}</span>
            ) : (
              <span>Standard Recipe</span>
            )}
          </div>
          {qrCodeUrl && (
            <div className="shrink-0 flex items-center gap-1">
              <QrCodeSvg url={qrCodeUrl} size={18} color="#0f172a" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div
      ref={cardRef}
      style={getCardStyle()}
      className={`print-card-box relative group ${font} ${themeConfig.bg} ${getBorderClass()} ${getShapeClasses()} flex flex-col justify-between overflow-hidden transition-all ${
        !isPrint ? 'shadow-xs hover:shadow-md' : ''
      }`}
    >
      {/* On-Screen Action Overlay (Hidden on Print) */}
      {!isPrint && (
        <div className="no-print absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center gap-0.5 bg-white/95 backdrop-blur-xs p-1 rounded-md shadow-md border border-slate-200">
          {/* Flip Side (If Double-Sided mode enabled) */}
          {printSides === 'double' && (
            <button
              onClick={() => setViewingBack(!viewingBack)}
              title={viewingBack ? 'Show Front Face' : 'Show Back Face (Duplex)'}
              className={`p-1 rounded transition flex items-center gap-0.5 text-[9px] font-bold ${
                viewingBack ? 'bg-amber-500 text-slate-950' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <RotateCw className="w-3 h-3" />
              <span>{viewingBack ? 'Back' : 'Front'}</span>
            </button>
          )}

          {/* Quick Per-Item Title Font Size Controls */}
          <button
            onClick={() => handleItemFontAdjust(-10)}
            title="Title font smaller (Title -10%)"
            className="p-1 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded transition flex items-center"
          >
            <AArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleItemFontAdjust(+10)}
            title="Title font larger (Title +10%)"
            className="p-1 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded transition flex items-center"
          >
            <AArrowUp className="w-3.5 h-3.5" />
          </button>

          {/* Quick Per-Item Description Font Size Controls */}
          {showDescription && item.description && (
            <div className="flex items-center border-l border-slate-200 pl-0.5">
              <button
                onClick={() => handleItemDescFontAdjust(-10)}
                title="Description font smaller (Desc -10%)"
                className="px-1 py-0.5 text-[9px] font-bold text-amber-700 hover:text-amber-950 hover:bg-amber-50 rounded transition flex items-center"
              >
                D-
              </button>
              <button
                onClick={() => handleItemDescFontAdjust(+10)}
                title="Description font larger (Desc +10%)"
                className="px-1 py-0.5 text-[9px] font-bold text-amber-700 hover:text-amber-950 hover:bg-amber-50 rounded transition flex items-center"
              >
                D+
              </button>
            </div>
          )}

          {/* Quick Per-Item Vertical Position Controls */}
          <button
            onClick={() => handleItemPositionNudge(-3)}
            title="Nudge this item UP"
            className="p-1 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded transition flex items-center"
          >
            <ArrowUp className="w-3 h-3" />
          </button>
          <button
            onClick={() => handleItemPositionNudge(+3)}
            title="Nudge this item DOWN"
            className="p-1 text-slate-600 hover:text-slate-950 hover:bg-slate-100 rounded transition flex items-center"
          >
            <ArrowDown className="w-3 h-3" />
          </button>

          <button
            onClick={() => setShowTagPicker(!showTagPicker)}
            title="Edit Dietary Tags"
            className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition"
          >
            <Tag className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handleExportCardPng}
            disabled={isExporting}
            title="Download Single Label as High-Res PNG"
            className="p-1 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded transition"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          {onDuplicate && (
            <button
              onClick={onDuplicate}
              title="Duplicate Item"
              className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded transition"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>
          )}

          {onDelete && (
            <button
              onClick={onDelete}
              title="Delete Item"
              className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Tag Picker Popover */}
      {!isPrint && showTagPicker && (
        <div className="no-print absolute right-2 top-8 w-56 bg-white border border-slate-300 rounded-lg shadow-xl p-2.5 z-30 space-y-1.5 animate-in fade-in zoom-in-95 duration-100">
          <div className="flex items-center justify-between pb-1 border-b border-slate-200">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
              Dietary & Allergens
            </span>
            <button
              onClick={() => setShowTagPicker(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              &times;
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1 max-h-48 overflow-y-auto pt-1">
            {COMMON_ALLERGEN_KEYS.map((code) => {
              const info = getAllergenInfo(code);
              const isSelected = item.tags.includes(code);
              return (
                <button
                  key={code}
                  onClick={() => handleToggleTag(code)}
                  className={`text-left text-[10px] px-2 py-1 rounded flex items-center justify-between border transition ${
                    isSelected
                      ? 'bg-amber-50 border-amber-300 text-amber-900 font-semibold'
                      : 'border-slate-100 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate">
                    {info.icon} {code}
                  </span>
                  {isSelected && <span className="text-amber-700 font-bold ml-1">✓</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* TENT CARD: TOP FOLD */}
      {shape === 'tent' && !isActuallyBack && (
        <div className="h-1/2 border-b border-dashed border-slate-300/80 relative flex flex-col justify-between overflow-hidden">
          {tentMirrorTitle ? (
            renderFrontFace(true)
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-3 opacity-40 select-none">
              {showLogo && logoUrl && (
                <img
                  src={logoUrl}
                  alt="Logo Fold"
                  className="h-3 object-contain grayscale opacity-60 mb-1"
                />
              )}
              <span className="text-[8px] font-semibold tracking-widest uppercase text-slate-400">
                --- Fold Line Guide ---
              </span>
            </div>
          )}
        </div>
      )}

      {/* CARD MAIN BODY */}
      <div className={shape === 'tent' ? 'h-1/2 flex flex-col justify-between p-3' : 'h-full flex flex-col justify-between w-full'}>
        {isActuallyBack ? renderBackFace() : renderFrontFace(false)}
      </div>
    </div>
  );
};
