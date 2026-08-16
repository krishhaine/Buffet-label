import React, { useRef, useState } from 'react';
import {
  CardShape,
  DesignSettings,
  FontOption,
  ThemeStyle,
  BadgeDisplayMode,
  BorderStyle,
  PrintSides,
  StudioMode,
  TextAlignOption,
  HighlightMode,
  BarType,
} from '../types/buffet';
import { TEMPLATES, getTemplateById } from '../utils/templates';
import { PRESET_LOGOS } from '../utils/presetLogos';
import {
  Sliders,
  Palette,
  Type,
  Image as ImageIcon,
  QrCode,
  Sparkles,
  Check,
  Upload,
  Trash2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  FileCheck,
  Layers,
  Wine,
  RefreshCw,
  Tag,
  Clock,
  User,
  ShieldCheck,
  Box,
  Utensils,
  Ban,
  Highlighter,
  Paintbrush,
  DollarSign,
  GlassWater,
  MoveVertical,
  ArrowUp,
  ArrowDown,
  AArrowUp,
  AArrowDown,
  Search,
} from 'lucide-react';

interface StylingControlsProps {
  settings: DesignSettings;
  onUpdateSettings: (newSettings: Partial<DesignSettings>) => void;
}

const LUXURY_PALETTE = [
  { name: 'Champagne Gold', hex: '#d4af37' },
  { name: 'Warm Amber', hex: '#b45309' },
  { name: 'Deep Emerald', hex: '#0f5132' },
  { name: 'Bordeaux Red', hex: '#722f37' },
  { name: 'Royal Navy', hex: '#1e3a8a' },
  { name: 'Slate Charcoal', hex: '#334155' },
  { name: 'Rose Gold', hex: '#b76e79' },
  { name: 'Forest Sage', hex: '#059669' },
];

const TITLE_COLOR_SWATCHES = [
  { name: 'Default / Auto', hex: 'auto' },
  { name: 'Charcoal Dark', hex: '#1e293b' },
  { name: 'Pure Black', hex: '#000000' },
  { name: 'Luxury Gold', hex: '#b45309' },
  { name: 'Deep Burgundy', hex: '#7f1d1d' },
  { name: 'Midnight Navy', hex: '#0f233a' },
  { name: 'Forest Green', hex: '#064e3b' },
  { name: 'Warm Rose', hex: '#881337' },
];

const DESC_COLOR_SWATCHES = [
  { name: 'Default / Auto', hex: 'auto' },
  { name: 'Slate Gray', hex: '#475569' },
  { name: 'Dark Charcoal', hex: '#1e293b' },
  { name: 'Warm Cocoa', hex: '#57301c' },
  { name: 'Navy Blue', hex: '#1e3a8a' },
  { name: 'Muted Olive', hex: '#3f6212' },
  { name: 'Burgundy', hex: '#881337' },
  { name: 'Pure Black', hex: '#000000' },
];

const BADGE_PRICE_COLOR_SWATCHES = [
  { name: 'Default / Auto', hex: 'auto' },
  { name: 'Emerald Forest', hex: '#047857' },
  { name: 'Amber Gold', hex: '#b45309' },
  { name: 'Royal Navy', hex: '#1e3a8a' },
  { name: 'Crimson Red', hex: '#b91c1c' },
  { name: 'Charcoal Slate', hex: '#334155' },
  { name: 'Rose Plum', hex: '#831843' },
];

const CARD_BG_SWATCHES = [
  { name: 'Default / Theme', hex: 'auto' },
  { name: 'Crisp White', hex: '#ffffff' },
  { name: 'Warm Cream', hex: '#fdfbf7' },
  { name: 'Pale Ivory', hex: '#faf7f0' },
  { name: 'Champagne Pearl', hex: '#fcf8f2' },
  { name: 'Soft Slate', hex: '#f8fafc' },
  { name: 'Pale Sage', hex: '#f6f9f6' },
  { name: 'Luxe Dark Noir', hex: '#18181b' },
];

const HIGHLIGHT_COLOR_SWATCHES = [
  { name: 'Soft Gold Glow', hex: '#fef08a' },
  { name: 'Champagne Yellow', hex: '#fde68a' },
  { name: 'Rose Blush', hex: '#fecdd3' },
  { name: 'Mint Leaf', hex: '#bbf7d0' },
  { name: 'Sky Azure', hex: '#bae6fd' },
  { name: 'Lavender Mist', hex: '#e9d5ff' },
];

export const StylingControls: React.FC<StylingControlsProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDraggingLogo, setIsDraggingLogo] = useState(false);
  const [templateSearchQuery, setTemplateSearchQuery] = useState('');
  const [templateCategoryFilter, setTemplateCategoryFilter] = useState<'all' | 'cards' | 'sheets' | 'stickers' | 'shapes' | 'tents' | 'custom'>('all');
  const [showCustomDim, setShowCustomDim] = useState(settings.templateId === 'custom-template');

  const handleSelectTemplate = (templateId: string) => {
    const template = getTemplateById(templateId);
    if (templateId === 'custom-template') {
      setShowCustomDim(true);
      onUpdateSettings({
        templateId,
        shape: 'custom',
      });
    } else {
      setShowCustomDim(false);
      onUpdateSettings({
        templateId,
        shape: template.shape,
        widthIn: template.widthIn,
        heightIn: template.heightIn,
        cornerRadius: template.cornerRadius,
      });
    }
  };

  const handleProcessLogoFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        onUpdateSettings({
          logoUrl: ev.target.result as string,
          showLogo: true,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessLogoFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingLogo(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessLogoFile(file);
  };

  const filteredTemplates = TEMPLATES.filter((t) => {
    const categoryMatches =
      templateCategoryFilter === 'all' ||
      t.category === templateCategoryFilter ||
      (templateCategoryFilter === 'custom' && t.id === 'custom-template');

    if (!templateSearchQuery.trim()) return categoryMatches;

    const q = templateSearchQuery.toLowerCase();
    const queryMatches =
      t.name.toLowerCase().includes(q) ||
      t.code.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q)) ||
      t.shape.toLowerCase().includes(q) ||
      `${t.widthIn}x${t.heightIn}`.includes(q) ||
      `${t.heightIn}x${t.widthIn}`.includes(q) ||
      `${t.widthIn}`.includes(q) ||
      `${t.heightIn}`.includes(q);

    return categoryMatches && queryMatches;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Panel Header */}
      <div className="px-5 py-3.5 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-amber-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Design & Paper Calibration
          </h2>
        </div>
      </div>

      <div className="p-5 space-y-6">
        {/* Template Catalog & Shapes */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 block">
              Paper & Sticker Stock Size
            </label>
            <span className="text-[10px] font-bold text-slate-800 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
              8.5" &times; 11" Standard
            </span>
          </div>

          {/* Quick Search for Brand / Product Number / Dimensions */}
          <div className="relative mb-2">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search product code (e.g. 012365, oval, 5.33x2.33)..."
              value={templateSearchQuery}
              onChange={(e) => setTemplateSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500 focus:bg-white transition"
            />
            {templateSearchQuery && (
              <button
                onClick={() => setTemplateSearchQuery('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
              >
                &times;
              </button>
            )}
          </div>

          {/* Template Category Filters */}
          <div className="flex items-center gap-1 overflow-x-auto pb-2 mb-2">
            {[
              { id: 'all', label: 'All Sizes' },
              { id: 'cards', label: 'Buffet Cards' },
              { id: 'sheets', label: '8.5"×11" Sheets' },
              { id: 'stickers', label: 'Stickers & Seals' },
              { id: 'tents', label: 'Tent Cards' },
              { id: 'shapes', label: 'Shapes & Badges' },
              { id: 'custom', label: 'Custom' },
            ].map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setTemplateCategoryFilter(cat.id as any)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md whitespace-nowrap transition ${
                  templateCategoryFilter === cat.id
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1">
            {filteredTemplates.map((tmpl) => {
              const isSelected = settings.templateId === tmpl.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl.id)}
                  className={`p-2.5 rounded-lg border-2 text-left transition ${
                    isSelected
                      ? 'border-amber-600 bg-amber-50/50 text-slate-900 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold truncate pr-1">{tmpl.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-amber-600 shrink-0" />}
                  </div>
                  <span className="text-[10px] text-slate-500 block mt-0.5 leading-tight">
                    {tmpl.widthIn}" &times; {tmpl.heightIn}" ({tmpl.cardsPerSheet}/sheet)
                  </span>
                </button>
              );
            })}
          </div>

          {/* Custom Shape & Dimension Controls (When Custom is selected) */}
          {(showCustomDim || settings.templateId === 'custom-template') && (
            <div className="mt-3 p-3.5 bg-amber-50/60 rounded-xl border border-amber-200 space-y-3 animate-in fade-in duration-150">
              <span className="text-xs font-bold text-amber-950 block">
                Custom Shape & Dimension Geometry
              </span>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                    Width (Inches)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.0"
                    max="8.5"
                    value={settings.widthIn}
                    onChange={(e) => onUpdateSettings({ widthIn: Number(e.target.value) })}
                    className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded-md font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                    Height (Inches)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.8"
                    max="11.0"
                    value={settings.heightIn}
                    onChange={(e) => onUpdateSettings({ heightIn: Number(e.target.value) })}
                    className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded-md font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                    Corner Radius (px)
                  </label>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    max="40"
                    value={settings.cornerRadius || 0}
                    onChange={(e) => onUpdateSettings({ cornerRadius: Number(e.target.value) })}
                    className="w-full text-xs p-1.5 bg-white border border-slate-300 rounded-md font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold text-slate-600 block mb-1">
                  Shape Geometry
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {(['rectangle', 'rounded-rect', 'square', 'circle', 'oval', 'semi-circle', 'tent'] as CardShape[]).map((sh) => (
                    <button
                      key={sh}
                      type="button"
                      onClick={() => onUpdateSettings({ shape: sh })}
                      className={`py-1 text-[10px] font-medium rounded border uppercase ${
                        settings.shape === sh
                          ? 'bg-slate-900 text-white border-slate-900 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {sh}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* TEXT & VERTICAL POSITIONING CONTROLS */}
        <div className="pt-2 border-t border-slate-200 space-y-3">
          <label className="text-xs font-bold text-slate-700 block flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-amber-600" />
              Content Alignment & Vertical Placement
            </span>
            <span className="text-[10px] text-slate-500 font-mono">
              Y: {settings.verticalOffset || 0}px
            </span>
          </label>

          {/* Horizontal Text Alignment */}
          <div>
            <span className="text-[10px] font-semibold text-slate-500 block mb-1">
              Horizontal Text Align:
            </span>
            <div className="grid grid-cols-3 gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => onUpdateSettings({ textAlign: 'left', centerText: false })}
                className={`py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  (settings.textAlign === 'left' || (!settings.textAlign && !settings.centerText))
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <AlignLeft className="w-3.5 h-3.5" />
                <span>Left</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ textAlign: 'center', centerText: true })}
                className={`py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  (settings.textAlign === 'center' || settings.centerText)
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <AlignCenter className="w-3.5 h-3.5" />
                <span>Center</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ textAlign: 'right', centerText: false })}
                className={`py-1.5 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  settings.textAlign === 'right'
                    ? 'bg-white text-slate-900 shadow-xs border border-slate-300'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <AlignRight className="w-3.5 h-3.5" />
                <span>Right</span>
              </button>
            </div>
          </div>

          {/* Vertical Alignment (Center / Distributed / Top / Bottom) */}
          <div>
            <span className="text-[10px] font-semibold text-slate-500 block mb-1">
              Vertical Content Alignment:
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                { id: 'center', label: '🎯 Center (Oval)', desc: 'Balanced middle cluster' },
                { id: 'space-between', label: '↕️ Distributed', desc: 'Top header, bottom badges' },
                { id: 'top', label: '⬆️ Top Weighted', desc: 'Grouped near top' },
                { id: 'bottom', label: '⬇️ Bottom Weighted', desc: 'Grouped near base' },
              ].map((vMode) => {
                const isActive = (settings.verticalAlign || 'auto') === vMode.id ||
                  ((!settings.verticalAlign || settings.verticalAlign === 'auto') && vMode.id === (settings.shape === 'oval' || settings.shape === 'circle' ? 'center' : 'space-between'));

                return (
                  <button
                    key={vMode.id}
                    type="button"
                    onClick={() => onUpdateSettings({ verticalAlign: vMode.id as any })}
                    className={`p-2 rounded-lg border text-left transition ${
                      isActive
                        ? 'border-amber-600 bg-amber-50/60 font-semibold text-slate-900 ring-1 ring-amber-500 shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                    }`}
                  >
                    <span className="text-[11px] block">{vMode.label}</span>
                    <span className="text-[9px] text-slate-400 block leading-tight">{vMode.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vertical Offset Nudge Slider */}
          <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="font-semibold text-slate-700 flex items-center gap-1">
                <MoveVertical className="w-3.5 h-3.5 text-amber-600" />
                Vertical Position Nudge (Move Up / Down):
              </span>
              <span className="font-mono font-bold text-slate-800">
                {settings.verticalOffset ? `${settings.verticalOffset > 0 ? '+' : ''}${settings.verticalOffset}px` : '0px (Center)'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-400">Up</span>
              <input
                type="range"
                min="-35"
                max="35"
                step="1"
                value={settings.verticalOffset || 0}
                onChange={(e) => onUpdateSettings({ verticalOffset: Number(e.target.value) })}
                className="flex-1 accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Down</span>
            </div>

            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => onUpdateSettings({ verticalOffset: Math.max(-35, (settings.verticalOffset || 0) - 4) })}
                className="px-2 py-0.5 text-[10px] font-semibold bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-1"
              >
                <ArrowUp className="w-2.5 h-2.5" /> Nudge Up (-4px)
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ verticalOffset: 0 })}
                className="px-2 py-0.5 text-[10px] font-semibold text-slate-500 hover:text-slate-800"
              >
                Reset Position
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ verticalOffset: Math.min(35, (settings.verticalOffset || 0) + 4) })}
                className="px-2 py-0.5 text-[10px] font-semibold bg-white border border-slate-200 rounded hover:bg-slate-100 text-slate-700 flex items-center gap-1"
              >
                <ArrowDown className="w-2.5 h-2.5" /> Nudge Down (+4px)
              </button>
            </div>
          </div>

          {/* DISH TITLE FONT SIZING & SCALE */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <AArrowUp className="w-3.5 h-3.5 text-amber-600" />
                Dish Title Font Size & Scaling
              </span>
              <span className="text-[10px] text-amber-700 font-mono font-bold">
                Scale: {settings.titleFontScale || 100}%
              </span>
            </div>

            {/* Discrete Size Presets */}
            <div className="grid grid-cols-6 gap-1">
              {[
                { id: 'xs', label: 'XS', pt: '10.5pt' },
                { id: 'sm', label: 'SM', pt: '12pt' },
                { id: 'md', label: 'MD', pt: '14.5pt' },
                { id: 'lg', label: 'LG', pt: '17pt' },
                { id: 'xl', label: 'XL', pt: '20.5pt' },
                { id: '2xl', label: '2XL', pt: '24pt' },
              ].map((sz) => {
                const isSelected = (settings.titleFontSize || 'md') === sz.id;
                return (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => onUpdateSettings({ titleFontSize: sz.id as any })}
                    className={`py-1.5 rounded-md text-center border transition ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-[11px] block leading-none">{sz.label}</span>
                    <span className={`text-[8px] block mt-0.5 ${isSelected ? 'text-slate-950 font-medium' : 'text-slate-400'}`}>
                      {sz.pt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Granular Slider for Font Scale */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-slate-400">Smaller (70%)</span>
              <input
                type="range"
                min="70"
                max="160"
                step="5"
                value={settings.titleFontScale || 100}
                onChange={(e) => onUpdateSettings({ titleFontScale: Number(e.target.value) })}
                className="flex-1 accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Larger (160%)</span>
            </div>
          </div>

          {/* DESCRIPTION & SUBTITLE FONT SIZING & SCALE */}
          <div className="space-y-2 pt-2 border-t border-dashed border-slate-200">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Type className="w-3.5 h-3.5 text-amber-600" />
                Description & Subtitle Font Size
              </span>
              <span className="text-[10px] text-amber-700 font-mono font-bold">
                Scale: {settings.descriptionFontScale || 100}%
              </span>
            </div>

            {/* Discrete Description Size Presets */}
            <div className="grid grid-cols-5 gap-1">
              {[
                { id: 'xs', label: 'XS', pt: '7.5pt' },
                { id: 'sm', label: 'SM', pt: '9.0pt' },
                { id: 'md', label: 'MD', pt: '10.5pt' },
                { id: 'lg', label: 'LG', pt: '12.0pt' },
                { id: 'xl', label: 'XL', pt: '14.0pt' },
              ].map((sz) => {
                const isSelected = (settings.descriptionFontSize || 'sm') === sz.id;
                return (
                  <button
                    key={sz.id}
                    type="button"
                    onClick={() => onUpdateSettings({ descriptionFontSize: sz.id as any })}
                    className={`py-1.5 rounded-md text-center border transition ${
                      isSelected
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-2xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-[11px] block leading-none">{sz.label}</span>
                    <span className={`text-[8px] block mt-0.5 ${isSelected ? 'text-slate-950 font-medium' : 'text-slate-400'}`}>
                      {sz.pt}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Granular Slider for Description Font Scale */}
            <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-slate-400">Smaller (70%)</span>
              <input
                type="range"
                min="70"
                max="160"
                step="5"
                value={settings.descriptionFontScale || 100}
                onChange={(e) => onUpdateSettings({ descriptionFontScale: Number(e.target.value) })}
                className="flex-1 accent-amber-600 h-1.5 bg-slate-200 rounded-lg cursor-pointer"
              />
              <span className="text-[10px] text-slate-400">Larger (160%)</span>
            </div>
          </div>
        </div>

        {/* COLORING & HIGHLIGHTING SECTION */}
        <div className="pt-2 border-t border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Highlighter className="w-3.5 h-3.5 text-amber-600" />
              Coloring & Highlighting
            </label>
          </div>

          {/* Title Color Override */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-600">
                Dish / Card Title Font Color
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {settings.titleColor || 'auto'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {TITLE_COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch.hex}
                  type="button"
                  onClick={() => onUpdateSettings({ titleColor: swatch.hex })}
                  title={swatch.name}
                  style={swatch.hex !== 'auto' ? { backgroundColor: swatch.hex } : undefined}
                  className={`w-6 h-6 rounded-md border text-[9px] flex items-center justify-center transition ${
                    (settings.titleColor || 'auto') === swatch.hex
                      ? 'ring-2 ring-amber-500 ring-offset-1 scale-110 font-bold'
                      : 'border-slate-300 hover:scale-105'
                  } ${swatch.hex === 'auto' ? 'bg-slate-100 text-slate-700 w-12 text-[10px]' : ''}`}
                >
                  {swatch.hex === 'auto' ? 'Auto' : ''}
                </button>
              ))}
              <input
                type="color"
                value={settings.titleColor && settings.titleColor !== 'auto' ? settings.titleColor : '#0f172a'}
                onChange={(e) => onUpdateSettings({ titleColor: e.target.value })}
                title="Custom Title Color Picker"
                className="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0"
              />
            </div>
          </div>

          {/* Description & Subtitle Font Color Override */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-600">
                Description & Subtitle Font Color
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {settings.descriptionColor || 'auto'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {DESC_COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch.hex}
                  type="button"
                  onClick={() => onUpdateSettings({ descriptionColor: swatch.hex })}
                  title={swatch.name}
                  style={swatch.hex !== 'auto' ? { backgroundColor: swatch.hex } : undefined}
                  className={`w-6 h-6 rounded-md border text-[9px] flex items-center justify-center transition ${
                    (settings.descriptionColor || 'auto') === swatch.hex
                      ? 'ring-2 ring-amber-500 ring-offset-1 scale-110 font-bold'
                      : 'border-slate-300 hover:scale-105'
                  } ${swatch.hex === 'auto' ? 'bg-slate-100 text-slate-700 w-12 text-[10px]' : ''}`}
                >
                  {swatch.hex === 'auto' ? 'Auto' : ''}
                </button>
              ))}
              <input
                type="color"
                value={settings.descriptionColor && settings.descriptionColor !== 'auto' ? settings.descriptionColor : '#475569'}
                onChange={(e) => onUpdateSettings({ descriptionColor: e.target.value })}
                title="Custom Description Color Picker"
                className="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0"
              />
            </div>
          </div>

          {/* Dietary Badge & Price Font Color Override */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-600">
                Dietary Badges & Price Font Color
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {settings.badgeTextColor || 'auto'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {BADGE_PRICE_COLOR_SWATCHES.map((swatch) => (
                <button
                  key={swatch.hex}
                  type="button"
                  onClick={() => onUpdateSettings({ badgeTextColor: swatch.hex, priceColor: swatch.hex })}
                  title={swatch.name}
                  style={swatch.hex !== 'auto' ? { backgroundColor: swatch.hex } : undefined}
                  className={`w-6 h-6 rounded-md border text-[9px] flex items-center justify-center transition ${
                    (settings.badgeTextColor || 'auto') === swatch.hex
                      ? 'ring-2 ring-amber-500 ring-offset-1 scale-110 font-bold'
                      : 'border-slate-300 hover:scale-105'
                  } ${swatch.hex === 'auto' ? 'bg-slate-100 text-slate-700 w-12 text-[10px]' : ''}`}
                >
                  {swatch.hex === 'auto' ? 'Auto' : ''}
                </button>
              ))}
              <input
                type="color"
                value={settings.badgeTextColor && settings.badgeTextColor !== 'auto' ? settings.badgeTextColor : '#047857'}
                onChange={(e) => onUpdateSettings({ badgeTextColor: e.target.value, priceColor: e.target.value })}
                title="Custom Badge & Price Color Picker"
                className="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0"
              />
            </div>
          </div>

          {/* Card Background Color */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-600">
                Card Background Color
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {settings.cardBgColor || 'auto'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {CARD_BG_SWATCHES.map((swatch) => (
                <button
                  key={swatch.hex}
                  type="button"
                  onClick={() => onUpdateSettings({ cardBgColor: swatch.hex })}
                  title={swatch.name}
                  style={swatch.hex !== 'auto' ? { backgroundColor: swatch.hex } : undefined}
                  className={`w-6 h-6 rounded-md border text-[9px] flex items-center justify-center transition ${
                    (settings.cardBgColor || 'auto') === swatch.hex
                      ? 'ring-2 ring-amber-500 ring-offset-1 scale-110 font-bold'
                      : 'border-slate-300 hover:scale-105'
                  } ${swatch.hex === 'auto' ? 'bg-slate-100 text-slate-700 w-12 text-[10px]' : ''}`}
                >
                  {swatch.hex === 'auto' ? 'Auto' : ''}
                </button>
              ))}
              <input
                type="color"
                value={settings.cardBgColor && settings.cardBgColor !== 'auto' ? settings.cardBgColor : '#ffffff'}
                onChange={(e) => onUpdateSettings({ cardBgColor: e.target.value })}
                title="Custom Background Color Picker"
                className="w-6 h-6 rounded-md border border-slate-300 cursor-pointer p-0"
              />
            </div>
          </div>

          {/* Title Highlight Mode & Highlight Color */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-semibold text-slate-600">
                Title Highlighting
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ highlightMode: 'none' })}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    (!settings.highlightMode || settings.highlightMode === 'none')
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  None
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateSettings({ highlightMode: 'title-badge', highlightColor: settings.highlightColor || '#fef08a' })}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                    settings.highlightMode === 'title-badge'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  Highlight Pill
                </button>
              </div>
            </div>

            {settings.highlightMode === 'title-badge' && (
              <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                {HIGHLIGHT_COLOR_SWATCHES.map((swatch) => (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => onUpdateSettings({ highlightColor: swatch.hex })}
                    title={swatch.name}
                    style={{ backgroundColor: swatch.hex }}
                    className={`w-6 h-6 rounded-md border transition ${
                      settings.highlightColor === swatch.hex
                        ? 'ring-2 ring-slate-900 ring-offset-1 scale-110'
                        : 'border-slate-300 hover:scale-105'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Printer Alignment & Calibration Nudge */}
          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                📐 Printer Physical Calibration
              </span>
              <button
                type="button"
                onClick={() => onUpdateSettings({ showCalibrationGrid: !settings.showCalibrationGrid })}
                className={`text-[10px] font-bold px-2 py-0.5 rounded border transition ${
                  settings.showCalibrationGrid
                    ? 'bg-blue-100 text-blue-800 border-blue-300'
                    : 'bg-slate-100 text-slate-600 border-slate-200'
                }`}
              >
                {settings.showCalibrationGrid ? 'Overlay Active' : 'Show Grid'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold">
                  <span>Horizontal (X):</span>
                  <span className="font-mono text-slate-800 font-bold">
                    {settings.calibrationOffsetX ? `${settings.calibrationOffsetX > 0 ? '+' : ''}${settings.calibrationOffsetX}in` : '0.00in'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ calibrationOffsetX: Math.round(((settings.calibrationOffsetX || 0) - 0.05) * 100) / 100 })}
                    className="flex-1 py-0.5 bg-white hover:bg-slate-200 border border-slate-300 rounded font-bold text-center text-xs"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ calibrationOffsetX: Math.round(((settings.calibrationOffsetX || 0) + 0.05) * 100) / 100 })}
                    className="flex-1 py-0.5 bg-white hover:bg-slate-200 border border-slate-300 rounded font-bold text-center text-xs"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="p-2 bg-slate-50 rounded-lg border border-slate-200 flex flex-col gap-1">
                <div className="flex justify-between items-center text-[10px] text-slate-500 font-semibold">
                  <span>Vertical (Y):</span>
                  <span className="font-mono text-slate-800 font-bold">
                    {settings.calibrationOffsetY ? `${settings.calibrationOffsetY > 0 ? '+' : ''}${settings.calibrationOffsetY}in` : '0.00in'}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ calibrationOffsetY: Math.round(((settings.calibrationOffsetY || 0) - 0.05) * 100) / 100 })}
                    className="flex-1 py-0.5 bg-white hover:bg-slate-200 border border-slate-300 rounded font-bold text-center text-xs"
                  >
                    -
                  </button>
                  <button
                    type="button"
                    onClick={() => onUpdateSettings({ calibrationOffsetY: Math.round(((settings.calibrationOffsetY || 0) + 0.05) * 100) / 100 })}
                    className="flex-1 py-0.5 bg-white hover:bg-slate-200 border border-slate-300 rounded font-bold text-center text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOGO & BRAND EMBLEM (WITH OPTION OF NO LOGO) */}
        <div className="pt-2 border-t border-slate-200">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-amber-600" />
              Logo & Brand Mark
            </label>
            <button
              type="button"
              onClick={() => onUpdateSettings({ showLogo: !settings.showLogo })}
              className={`text-[10px] font-bold px-2 py-0.5 rounded border transition flex items-center gap-1 ${
                settings.showLogo && settings.logoUrl
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-slate-100 text-slate-500 border-slate-200'
              }`}
            >
              {settings.showLogo && settings.logoUrl ? 'Logo Active' : 'No Logo / Hidden'}
            </button>
          </div>

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDraggingLogo(true);
            }}
            onDragLeave={() => setIsDraggingLogo(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5 ${
              isDraggingLogo
                ? 'border-amber-500 bg-amber-50'
                : settings.showLogo && settings.logoUrl
                ? 'border-emerald-300 bg-emerald-50/30'
                : 'border-slate-300 hover:border-slate-400 bg-slate-50/60'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png, image/jpeg, image/svg+xml, image/webp"
              onChange={handleFileInputChange}
              className="hidden"
            />

            {settings.showLogo && settings.logoUrl ? (
              <div className="flex items-center justify-between w-full px-2 py-1">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-white rounded-lg border border-slate-200 shadow-2xs">
                    <img
                      src={settings.logoUrl}
                      alt="Uploaded Logo"
                      className="h-7 object-contain max-w-[80px]"
                    />
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-semibold text-slate-800 block">
                      Custom Logo Active
                    </span>
                    <span className="text-[10px] text-slate-500">
                      Click to replace or select presets
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateSettings({ logoUrl: '', showLogo: false });
                  }}
                  className="p-1.5 text-rose-500 hover:bg-rose-100 rounded-lg transition"
                  title="Remove logo completely"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="w-5 h-5 text-slate-400" />
                <p className="text-xs font-semibold text-slate-700">
                  Click or Drag & Drop your Logo here
                </p>
                <p className="text-[10px] text-slate-500">
                  Transparent PNG or SVG recommended
                </p>
              </>
            )}
          </div>

          {/* Logo Preset Selection with "NO LOGO" Button */}
          <div className="mt-3">
            <span className="text-[10px] font-semibold text-slate-500 block mb-1.5">
              Select Vector Emblem or Remove:
            </span>
            <div className="flex items-center gap-1.5">
              {/* Option of NO LOGO */}
              <button
                type="button"
                onClick={() =>
                  onUpdateSettings({
                    logoUrl: '',
                    showLogo: false,
                  })
                }
                title="No Logo"
                className={`p-1.5 rounded-lg border bg-white flex items-center justify-center flex-1 h-8 transition text-[10px] font-semibold gap-1 ${
                  !settings.showLogo || !settings.logoUrl
                    ? 'border-slate-900 ring-1 ring-slate-900 bg-slate-100 text-slate-900'
                    : 'border-slate-200 text-slate-500 hover:border-slate-300'
                }`}
              >
                <Ban className="w-3.5 h-3.5 text-slate-400" />
                <span>None</span>
              </button>

              {PRESET_LOGOS.map((logo) => (
                <button
                  key={logo.id}
                  type="button"
                  onClick={() =>
                    onUpdateSettings({
                      logoUrl: logo.svgDataUri,
                      showLogo: true,
                    })
                  }
                  title={logo.name}
                  className={`p-1.5 rounded-lg border bg-white flex items-center justify-center flex-1 h-8 transition ${
                    settings.showLogo && settings.logoUrl === logo.svgDataUri
                      ? 'border-amber-600 ring-1 ring-amber-500 bg-amber-50/50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <img src={logo.svgDataUri} alt={logo.name} className="h-3.5 object-contain" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* EVENT-SPECIFIC THEME PRESETS */}
        <div className="pt-2 border-t border-slate-200">
          <label className="text-xs font-bold text-slate-700 block mb-2">
            Event Style & Theme
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {[
              { id: 'heritage', label: '👑 Royal Heritage', desc: 'Ivory, gold & serif luxury' },
              { id: 'wedding', label: '💍 Wedding Romance', desc: 'Rose gold, pearl & blush' },
              { id: 'corporate', label: '💼 Corporate Gala', desc: 'Midnight navy & platinum' },
              { id: 'vineyard', label: '🍷 Rustic Vineyard', desc: 'Warm oak & terracotta' },
              { id: 'tropical', label: '🌴 Summer Luau', desc: 'Teal, coral & fresh citrus' },
              { id: 'gatsby', label: '🎷 Art Deco Gatsby', desc: 'Noir & geometric gold' },
              { id: 'holiday', label: '🎄 Festive Holiday', desc: 'Crimson red & evergreen' },
              { id: 'botanical', label: '🌿 Farm-to-Table', desc: 'Botanical sage & organic' },
              { id: 'bistro', label: '☕ French Bistro', desc: 'Classic double line' },
              { id: 'noir', label: '🖤 Luxe Noir', desc: 'Charcoal & gold' },
              { id: 'minimal', label: 'Clean Modern', desc: 'Sleek monochrome' },
              { id: 'kraft', label: '🏷️ Artisan Kraft', desc: 'Warm paper texture' },
            ].map((theme) => (
              <button
                key={theme.id}
                onClick={() => onUpdateSettings({ theme: theme.id as ThemeStyle })}
                className={`p-2 rounded-lg border text-left transition ${
                  settings.theme === theme.id
                    ? 'border-amber-600 bg-amber-50/60 font-semibold text-slate-900 ring-1 ring-amber-500 shadow-2xs'
                    : 'border-slate-200 hover:border-slate-300 text-slate-700 bg-white'
                }`}
              >
                <span className="text-[11px] block">{theme.label}</span>
                <span className="text-[9px] text-slate-500 block leading-tight">{theme.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* EXPANDED TYPOGRAPHY SELECTOR */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
            <span>Typography & Font Family</span>
            <span className="text-[10px] font-normal text-slate-400">12 Curated Styles</span>
          </label>
          <select
            value={settings.font}
            onChange={(e) => onUpdateSettings({ font: e.target.value as FontOption })}
            className="w-full text-xs p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 focus:outline-none font-medium"
          >
            <option value="font-serif-lux">Playfair Display — Luxury Editorial Serif</option>
            <option value="font-cormorant">Cormorant Garamond — Timeless Heritage Serif</option>
            <option value="font-cinzel">Cinzel — Roman Architectural Serif</option>
            <option value="font-bodoni">Bodoni Moda — High-Fashion Haute Serif</option>
            <option value="font-script">Great Vibes — Elegant Wedding Calligraphy</option>
            <option value="font-dancing">Dancing Script — Romantic Flowing Script</option>
            <option value="font-sans-modern">Inter — Clean High-Legibility Sans</option>
            <option value="font-montserrat">Montserrat — Geometric Modern Bistro</option>
            <option value="font-oswald">Oswald — Bold Condensed Headline</option>
            <option value="font-outfit">Outfit — Contemporary Minimalist</option>
            <option value="font-slab">Roboto Slab — Artisan Rustic Serif</option>
            <option value="font-mono-clean">Space Mono — Clean Kitchen & Logistics</option>
          </select>
        </div>

        {/* DIETARY & ALLERGEN BADGE CONTROLS */}
        <div className="pt-2 border-t border-slate-200 space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <span>🏷️ Dietary & Allergen Display Format</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-semibold text-slate-600">
              <input
                type="checkbox"
                checked={settings.showAllergenBadges}
                onChange={(e) => onUpdateSettings({ showAllergenBadges: e.target.checked })}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span>Show Badges</span>
            </label>
          </div>

          {settings.showAllergenBadges && (
            <div className="space-y-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
              {/* Dietary Name Format (Code vs Full Name vs Both) */}
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block mb-1">
                  Tag Text Format:
                </span>
                <div className="grid grid-cols-2 gap-1.5">
                  {[
                    { id: 'code', label: 'Acronym Only', example: 'GF, VG, NF' },
                    { id: 'full', label: 'Full Name Only', example: 'Gluten-Free, Vegan' },
                    { id: 'both', label: 'Code • Full Name', example: 'GF • Gluten-Free' },
                    { id: 'code-full-parens', label: 'Code (Full Name)', example: 'GF (Gluten-Free)' },
                  ].map((fmt) => {
                    const isSelected = (settings.dietaryNameFormat || 'code') === fmt.id;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => onUpdateSettings({ dietaryNameFormat: fmt.id as any })}
                        className={`p-1.5 rounded-md border text-left transition ${
                          isSelected
                            ? 'bg-amber-500 text-slate-950 font-bold border-amber-600 shadow-2xs'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <span className="text-[11px] block leading-tight">{fmt.label}</span>
                        <span className={`text-[9px] block font-mono mt-0.5 ${isSelected ? 'text-slate-950 font-medium' : 'text-slate-400'}`}>
                          {fmt.example}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Visual Badge Style */}
              <div>
                <span className="text-[10px] font-semibold text-slate-500 block mb-1">
                  Visual Badge Style:
                </span>
                <div className="grid grid-cols-4 gap-1">
                  {[
                    { id: 'pill', label: 'Pill Badge' },
                    { id: 'text', label: 'Plain Text' },
                    { id: 'compact', label: 'Compact' },
                    { id: 'icon-only', label: 'Icons Only' },
                  ].map((bStyle) => (
                    <button
                      key={bStyle.id}
                      type="button"
                      onClick={() => onUpdateSettings({ badgeDisplayMode: bStyle.id as any })}
                      className={`py-1 text-[10px] font-medium rounded border text-center transition ${
                        (settings.badgeDisplayMode || 'pill') === bStyle.id
                          ? 'bg-slate-900 text-white border-slate-900 font-bold'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {bStyle.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ACCENT LINE COLOR PICKER */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
            <span>Accent Line & Badge Color</span>
            <span className="text-[11px] font-mono text-slate-500">{settings.accentColor}</span>
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={settings.accentColor}
              onChange={(e) => onUpdateSettings({ accentColor: e.target.value })}
              className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5"
            />
            <div className="flex flex-wrap gap-1.5 flex-1">
              {LUXURY_PALETTE.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => onUpdateSettings({ accentColor: c.hex })}
                  title={c.name}
                  style={{ backgroundColor: c.hex }}
                  className={`w-6 h-6 rounded-md border transition ${
                    settings.accentColor.toLowerCase() === c.hex.toLowerCase()
                      ? 'ring-2 ring-slate-900 ring-offset-1 scale-110'
                      : 'border-black/10 hover:scale-105'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* DISPLAY TOGGLES & METADATA */}
        <div className="pt-2 border-t border-slate-200 space-y-2.5">
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Display Fields & Badges
          </label>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showAccentLine}
                onChange={(e) => onUpdateSettings({ showAccentLine: e.target.checked })}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-slate-700">Accent Line Bar</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showDescription}
                onChange={(e) => onUpdateSettings({ showDescription: e.target.checked })}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-slate-700">Description / Notes</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showAllergenBadges}
                onChange={(e) => onUpdateSettings({ showAllergenBadges: e.target.checked })}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-slate-700">Dietary & Allergen Badges</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showStationBadge}
                onChange={(e) => onUpdateSettings({ showStationBadge: e.target.checked })}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-slate-700">Category / Station Badge</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showPrice}
                onChange={(e) => onUpdateSettings({ showPrice: e.target.checked })}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-slate-700">Price Tag</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showGuestName}
                onChange={(e) => onUpdateSettings({ showGuestName: e.target.checked })}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-slate-700">Guest / Recipient Name</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showPrepDate}
                onChange={(e) => onUpdateSettings({ showPrepDate: e.target.checked })}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-slate-700">Prep / Packed Date</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showUseByDate}
                onChange={(e) => onUpdateSettings({ showUseByDate: e.target.checked })}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-slate-700">Use-By / Expiry Date</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showStorageNote}
                onChange={(e) => onUpdateSettings({ showStorageNote: e.target.checked })}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-slate-700">Storage / Temp Badge</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.showChefName}
                onChange={(e) => onUpdateSettings({ showChefName: e.target.checked })}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-slate-700">Chef / Prep Staff Name</span>
            </label>
          </div>

          {/* QR Code Option */}
          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer mb-1.5">
              <input
                type="checkbox"
                checked={settings.showQrCode}
                onChange={(e) => onUpdateSettings({ showQrCode: e.target.checked })}
                className="rounded border-slate-300 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-xs font-semibold text-slate-700">
                Include QR Code (Digital Menu, Link, or Order ID)
              </span>
            </label>

            {settings.showQrCode && (
              <input
                type="url"
                value={settings.qrCodeUrl}
                onChange={(e) => onUpdateSettings({ qrCodeUrl: e.target.value })}
                placeholder="https://example.com/menu"
                className="w-full text-xs p-2 border border-slate-300 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
