import React, { useState, useEffect } from 'react';
import { BuffetItem, DesignSettings, DualLanguageMode, DualLanguageStyle } from '../types/buffet';
import {
  SUPPORTED_LANGUAGES,
  PRIMARY_LANGUAGES,
  translateAllItems,
  resetToDefaultLanguage,
  swapItemLanguages,
} from '../utils/translator';
import {
  Globe,
  Sparkles,
  Check,
  RefreshCw,
  RotateCcw,
  ArrowLeftRight,
  CheckCircle2,
  Sliders,
  Eye,
  EyeOff,
} from 'lucide-react';

interface TranslationControlsProps {
  items: BuffetItem[];
  settings: DesignSettings;
  onUpdateItems: (items: BuffetItem[]) => void;
  onUpdateSettings: (settings: Partial<DesignSettings>) => void;
}

export const TranslationControls: React.FC<TranslationControlsProps> = ({
  items,
  settings,
  onUpdateItems,
  onUpdateSettings,
}) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [translateSuccess, setTranslateSuccess] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const {
    showDualLanguage,
    primaryLanguage = 'en',
    targetLanguage = 'fr',
    dualLanguageMode = 'single_dual',
    dualLanguageStyle = 'sub_title',
    showLanguageBadges = false,
    showSecondaryDesc = true,
  } = settings;

  const currentPrimary = PRIMARY_LANGUAGES.find((l) => l.code === primaryLanguage) || PRIMARY_LANGUAGES[0];
  const currentTarget = SUPPORTED_LANGUAGES.find((l) => l.code === targetLanguage) || SUPPORTED_LANGUAGES[0];

  // Count items with active translations in the CURRENT target language
  const translatedCount = items.filter(
    (i) => i.translationName && i.translationName.trim().length > 0 && (!i.translationLang || i.translationLang === targetLanguage)
  ).length;

  // Run Translation function
  const runTranslationToTarget = async (langCode: string) => {
    if (items.length === 0 || isTranslating) return;
    try {
      setIsTranslating(true);
      setTranslateSuccess(false);
      setResetSuccess(false);
      setProgress({ current: 0, total: items.length });

      const translated = await translateAllItems(items, langCode, (current, total) => {
        setProgress({ current, total });
      });

      onUpdateItems(translated);
      onUpdateSettings({ showDualLanguage: true, targetLanguage: langCode });
      setTranslateSuccess(true);
      setTimeout(() => setTranslateSuccess(false), 3500);
    } catch (e) {
      console.error('Translation error:', e);
    } finally {
      setIsTranslating(false);
    }
  };

  // When user selects a new target language from the dropdown, translate immediately
  const handleTargetLanguageChange = (newLang: string) => {
    onUpdateSettings({ targetLanguage: newLang, showDualLanguage: true });
    runTranslationToTarget(newLang);
  };

  // Reset to Default Language (clears translated fields, preserves original)
  const handleResetToDefaultLanguage = () => {
    const resetItems = resetToDefaultLanguage(items);
    onUpdateItems(resetItems);
    onUpdateSettings({
      showDualLanguage: false,
      dualLanguageMode: 'single_dual',
    });
    setResetSuccess(true);
    setTranslateSuccess(false);
    setTimeout(() => setResetSuccess(false), 3500);
  };

  // Swap Primary and Target Languages
  const handleSwapLanguages = () => {
    if (translatedCount === 0) return;
    const swapped = swapItemLanguages(items);
    onUpdateItems(swapped);
  };

  return (
    <div className="space-y-3 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
      {/* Top Header Row with Status Badge & Reset Button */}
      <div className="flex items-center justify-between gap-2 pb-2.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-50 rounded-lg text-amber-700">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-slate-900 leading-tight">
              Dual-Language & Translation Studio
            </h3>
            <span className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
              {showDualLanguage ? (
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active: {currentPrimary.name} + {currentTarget.name}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-slate-500">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                  Default ({currentPrimary.name})
                </span>
              )}
              <span>&bull;</span>
              <span>{translatedCount}/{items.length} dishes ready</span>
            </span>
          </div>
        </div>

        {/* Action Controls in Header */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleResetToDefaultLanguage}
            title="Clear all translations and revert back to default language"
            className="text-[11px] font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-rose-200 transition flex items-center gap-1.5 shrink-0"
          >
            <RotateCcw className="w-3 h-3 text-slate-400 hover:text-rose-600" />
            <span className="hidden sm:inline">Reset to Default</span>
            <span className="sm:hidden">Reset</span>
          </button>
        </div>
      </div>

      {/* Reset Confirmation Toast */}
      {resetSuccess && (
        <div className="p-2.5 bg-slate-900 text-amber-400 text-xs font-bold rounded-lg flex items-center justify-between animate-in fade-in duration-150 shadow-sm">
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            Reset complete! All labels restored to original default language.
          </span>
          <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
            {currentPrimary.name} Active
          </span>
        </div>
      )}

      {/* Main Configuration Section */}
      <div className="space-y-3 pt-0.5">
        {/* 1. Language Pairs Row (Primary ↔ Target) */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center bg-slate-50 p-2.5 rounded-lg border border-slate-200">
          {/* Primary Language */}
          <div className="sm:col-span-5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Primary Language (Default)
            </label>
            <select
              value={primaryLanguage}
              onChange={(e) => onUpdateSettings({ primaryLanguage: e.target.value })}
              className="w-full text-xs font-semibold px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-amber-500"
            >
              {PRIMARY_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="sm:col-span-2 flex justify-center pt-2 sm:pt-4">
            <button
              type="button"
              onClick={handleSwapLanguages}
              title="Swap primary and translated texts"
              className="p-1.5 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-600 transition shadow-2xs"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Secondary Target Language */}
          <div className="sm:col-span-5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
              Secondary Target Language
            </label>
            <select
              value={targetLanguage}
              onChange={(e) => handleTargetLanguageChange(e.target.value)}
              className="w-full text-xs font-bold px-2.5 py-1.5 bg-amber-50/50 border border-amber-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-amber-500"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.nativeName})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* 2. Format & Layout Selector */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-800">
              Printing & Card Layout Mode:
            </label>
            <button
              type="button"
              onClick={() => {
                const nextShow = !showDualLanguage;
                onUpdateSettings({ showDualLanguage: nextShow });
                if (nextShow && translatedCount === 0) {
                  runTranslationToTarget(targetLanguage);
                }
              }}
              className={`text-[11px] font-semibold px-2 py-0.5 rounded transition flex items-center gap-1 ${
                showDualLanguage
                  ? 'bg-amber-100 text-amber-900 border border-amber-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {showDualLanguage ? (
                <>
                  <Eye className="w-3 h-3 text-amber-700" />
                  <span>Dual Active</span>
                </>
              ) : (
                <>
                  <EyeOff className="w-3 h-3 text-slate-400" />
                  <span>Enable Dual</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {/* Option A: Dual on Single Label */}
            <button
              type="button"
              onClick={() => {
                onUpdateSettings({ dualLanguageMode: 'single_dual', showDualLanguage: true });
                if (translatedCount === 0) runTranslationToTarget(targetLanguage);
              }}
              className={`p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                showDualLanguage && dualLanguageMode === 'single_dual'
                  ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/40 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>📑</span>
                    <span>Dual on Single Label</span>
                  </span>
                  {showDualLanguage && dualLanguageMode === 'single_dual' && (
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 font-bold" />
                  )}
                </div>
                <p className="text-[10.5px] text-slate-600 leading-tight">
                  Both {currentPrimary.name} & {currentTarget.name} printed on each card.
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-amber-900/80 mt-1.5 pt-1 border-t border-amber-200/60 block">
                Standard buffet stands & folded tents
              </span>
            </button>

            {/* Option B: Separate Paired Labels */}
            <button
              type="button"
              onClick={() => {
                onUpdateSettings({ dualLanguageMode: 'separate_paired', showDualLanguage: true });
                if (translatedCount === 0) runTranslationToTarget(targetLanguage);
              }}
              className={`p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                showDualLanguage && dualLanguageMode === 'separate_paired'
                  ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/40 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>🗂️</span>
                    <span>Separate Labels (Paired)</span>
                  </span>
                  {showDualLanguage && dualLanguageMode === 'separate_paired' && (
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 font-bold" />
                  )}
                </div>
                <p className="text-[10.5px] text-slate-600 leading-tight">
                  Generates 2 separate cards side-by-side (1 {currentPrimary.name} + 1 {currentTarget.name}).
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-amber-900/80 mt-1.5 pt-1 border-t border-amber-200/60 block">
                {items.length * 2} cards total (Pair per dish)
              </span>
            </button>

            {/* Option C: Separate Batched by Language */}
            <button
              type="button"
              onClick={() => {
                onUpdateSettings({ dualLanguageMode: 'separate_batched', showDualLanguage: true });
                if (translatedCount === 0) runTranslationToTarget(targetLanguage);
              }}
              className={`p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                showDualLanguage && dualLanguageMode === 'separate_batched'
                  ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/40 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>📦</span>
                    <span>Separate Sheets (Batched)</span>
                  </span>
                  {showDualLanguage && dualLanguageMode === 'separate_batched' && (
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 font-bold" />
                  )}
                </div>
                <p className="text-[10.5px] text-slate-600 leading-tight">
                  Sheet 1 has all {currentPrimary.name}, Sheet 2 has all {currentTarget.name}.
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-amber-900/80 mt-1.5 pt-1 border-t border-amber-200/60 block">
                Dedicated language print sets
              </span>
            </button>

            {/* Option D: Secondary Language Only */}
            <button
              type="button"
              onClick={() => {
                onUpdateSettings({ dualLanguageMode: 'secondary_only', showDualLanguage: true });
                if (translatedCount === 0) runTranslationToTarget(targetLanguage);
              }}
              className={`p-2.5 rounded-xl border text-left transition relative flex flex-col justify-between ${
                showDualLanguage && dualLanguageMode === 'secondary_only'
                  ? 'bg-amber-50/80 border-amber-400 ring-2 ring-amber-400/40 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <span>🌐</span>
                    <span>{currentTarget.name} Only</span>
                  </span>
                  {showDualLanguage && dualLanguageMode === 'secondary_only' && (
                    <Check className="w-3.5 h-3.5 text-amber-600 shrink-0 font-bold" />
                  )}
                </div>
                <p className="text-[10.5px] text-slate-600 leading-tight">
                  Replaces card contents completely with {currentTarget.name} text.
                </p>
              </div>
              <span className="text-[9.5px] font-medium text-amber-900/80 mt-1.5 pt-1 border-t border-amber-200/60 block">
                Pure 100% {currentTarget.name} labels
              </span>
            </button>
          </div>
        </div>

        {/* 3. Sub-Style Options (When Single Label is chosen) */}
        {dualLanguageMode === 'single_dual' && (
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 space-y-1.5">
            <label className="block text-[11px] font-bold text-slate-700">
              Single Card Presentation Sub-Style:
            </label>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {[
                {
                  id: 'sub_title',
                  label: 'Subtitle Under Title',
                  desc: 'Italic French under English',
                },
                {
                  id: 'side_by_side',
                  label: 'Side-by-Side (Slash)',
                  desc: 'English / Français inline',
                },
                {
                  id: 'stacked_blocks',
                  label: 'Stacked Blocks',
                  desc: 'Top English, Bottom French',
                },
                {
                  id: 'back_face',
                  label: 'Duplex Back Face',
                  desc: 'Front English, Back French',
                },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onUpdateSettings({ dualLanguageStyle: st.id as DualLanguageStyle, showDualLanguage: true })}
                  className={`p-2 rounded-lg border text-left transition ${
                    dualLanguageStyle === st.id
                      ? 'bg-slate-900 text-amber-400 border-slate-900 font-bold shadow-2xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="text-[11px] leading-tight">{st.label}</div>
                  <div className={`text-[9px] mt-0.5 leading-tight ${dualLanguageStyle === st.id ? 'text-slate-300' : 'text-slate-500'}`}>
                    {st.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 4. Fine-Tuning Toggles & Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showLanguageBadges}
              onChange={(e) => onUpdateSettings({ showLanguageBadges: e.target.checked })}
              className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
            />
            <span className="text-slate-700 font-medium">
              Show Language Badges ({currentPrimary.flag} {currentPrimary.code.toUpperCase()} / {currentTarget.flag} {currentTarget.code.toUpperCase()})
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={showSecondaryDesc}
              onChange={(e) => onUpdateSettings({ showSecondaryDesc: e.target.checked })}
              className="w-3.5 h-3.5 rounded text-amber-600 focus:ring-amber-500 border-slate-300"
            />
            <span className="text-slate-700 font-medium">
              Include Secondary Description
            </span>
          </label>
        </div>

        {/* 5. 1-Click Auto-Translate Button */}
        <div className="pt-1">
          <button
            onClick={() => runTranslationToTarget(targetLanguage)}
            disabled={isTranslating || items.length === 0}
            className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition ${
              isTranslating
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white'
            }`}
          >
            {isTranslating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>
                  Translating {progress.current} of {progress.total} dishes to {currentTarget.name}...
                </span>
              </>
            ) : translateSuccess ? (
              <>
                <Check className="w-4 h-4 text-emerald-300" />
                <span>All {items.length} Dishes Translated to {currentTarget.name}!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>
                  {translatedCount > 0
                    ? `Re-Translate All ${items.length} Dishes to ${currentTarget.name} (${currentTarget.flag})`
                    : `Translate All ${items.length} Dishes to ${currentTarget.name} (${currentTarget.flag}) Now`}
                </span>
              </>
            )}
          </button>

          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 px-1">
            <span>Instant Culinary & Beverage Lexicon</span>
            <span>Click any French or English title to edit</span>
          </div>
        </div>
      </div>
    </div>
  );
};
