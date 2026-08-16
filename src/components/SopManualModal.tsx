import React, { useState } from 'react';
import { BookOpen, Printer, CheckCircle, FileText, Globe, Tag, Sliders, ShieldCheck, Download, X } from 'lucide-react';

interface SopManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SopManualModal: React.FC<SopManualModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'sop' | 'manual' | 'translation' | 'print' | 'allergens'>('sop');

  if (!isOpen) return null;

  const handlePrintSop = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold flex items-center gap-2">
                Standard Operating Procedure (SOP) & User Manual
                <span className="text-[10px] uppercase font-mono tracking-widest bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
                  DOC-SOP-2026-F&B
                </span>
              </h2>
              <p className="text-xs text-slate-300">
                Official culinary signage, BEO auto-detection, bilingual translation, and printing protocol
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintSop}
              className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5" /> Print SOP
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 gap-1 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveTab('sop')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'sop'
                ? 'border-amber-600 text-amber-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            1. Culinary & Banquet SOP
          </button>
          <button
            onClick={() => setActiveTab('manual')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'manual'
                ? 'border-amber-600 text-amber-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4 text-amber-600" />
            2. Quick-Start User Manual
          </button>
          <button
            onClick={() => setActiveTab('translation')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'translation'
                ? 'border-amber-600 text-amber-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Globe className="w-4 h-4 text-amber-600" />
            3. Dual-Language / Translation SOP
          </button>
          <button
            onClick={() => setActiveTab('print')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'print'
                ? 'border-amber-600 text-amber-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Printer className="w-4 h-4 text-amber-600" />
            4. Avery & 8.5"x11" Print Calibration
          </button>
          <button
            onClick={() => setActiveTab('allergens')}
            className={`py-3 px-3.5 border-b-2 transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'allergens'
                ? 'border-amber-600 text-amber-900 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Tag className="w-4 h-4 text-amber-600" />
            5. Dietary & Allergen Safety
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 text-slate-700 text-xs leading-relaxed space-y-4">
          {activeTab === 'sop' && (
            <div className="space-y-4">
              <div className="border-l-4 border-amber-600 pl-3 py-1 bg-amber-50/60 rounded-r-lg">
                <h3 className="font-bold text-sm text-slate-900">
                  STANDARD OPERATING PROCEDURE: Food & Beverage Signage & Allergen Traceability
                </h3>
                <p className="text-[11px] text-slate-600">
                  Department: Culinary, Banquets, Catering, and Event Services | Standard: ISO 22000 & HACCP Compliant
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> 1. Timeline & Lead Times
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    <li><strong>48 Hours Prior:</strong> Banquet Captain imports BEO / Event Order into the Buffet Label Studio.</li>
                    <li><strong>24 Hours Prior:</strong> Executive Chef reviews and validates dietary codes (GF, DF, V, Vegan, Nut-Free, Halal).</li>
                    <li><strong>4 Hours Prior:</strong> Card stock is printed on heavy 80lb/100lb matte cover stock or Avery tent blanks.</li>
                    <li><strong>30 Mins Prior:</strong> Captain verifies physical placement against buffet warming dishes and cold stations.</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                    <CheckCircle className="w-4 h-4 text-emerald-600" /> 2. Core Mandatory Standards
                  </h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    <li><strong>No Handwritten Signs:</strong> All cards must be digitally typeset via this application for brand consistency.</li>
                    <li><strong>Legibility Distance:</strong> Dish titles must be legible from a standing distance of 3 to 4 feet.</li>
                    <li><strong>Cross-Contamination Warnings:</strong> Items with nuts, shellfish, or raw proteins must display their mandatory advisory icons.</li>
                    <li><strong>Chef / Prep Sign-off:</strong> Kitchen prep labels must display prep date, expiry (+3 days max), and chef name.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'manual' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900">
                User Manual: Generate Professional Buffet Cards in 3 Steps
              </h3>

              <div className="space-y-3">
                <div className="flex gap-3 p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Upload PDF or Paste Menu Text</h4>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Drag and drop your BEO PDF file or paste menu lines into the input area. The smart parser automatically extracts station headers, dish names, descriptions, and dietary codes.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Customize Theme, Typography & Translations</h4>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Choose from 12 luxury themes (e.g. Royal Heritage, Wedding Romance, Corporate Executive). Toggle <strong>Dual-Language Mode</strong> to instantly translate dish names into French, Spanish, Japanese, or Arabic.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 p-3 rounded-xl border border-slate-200 bg-white">
                  <div className="w-7 h-7 rounded-full bg-amber-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900">Print or Download High-Resolution Sheets</h4>
                    <p className="text-slate-600 text-[11px] mt-0.5">
                      Click <strong>Print / PDF</strong> to print directly on Avery perforated templates (8 or 10 cards per sheet) or standard 8.5"x11" cardstock with cut guides. Download full zip archives or individual 300 DPI PNGs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'translation' && (
            <div className="space-y-4">
              <div className="border-l-4 border-blue-600 pl-3 py-1 bg-blue-50/60 rounded-r-lg">
                <h3 className="font-bold text-sm text-slate-900">
                  Dual-Language & International VIP Protocol
                </h3>
                <p className="text-[11px] text-slate-600">
                  Guidelines for multilingual state dinners, embassies, international conventions, and resort hospitality
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2">
                  <h4 className="font-bold text-slate-900">Typography Hierarchy for Bilingual Cards</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    <li><strong>Primary Language:</strong> Rendered in bold display typeface (e.g. Playfair Display or Inter).</li>
                    <li><strong>Secondary Translation:</strong> Typeset in elegant italicized accent serif directly below the main title.</li>
                    <li><strong>Duplex Duplication:</strong> For 2-sided tent cards, you can print English on the front and Spanish/French on the reverse face.</li>
                  </ul>
                </div>

                <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2">
                  <h4 className="font-bold text-slate-900">Culinary Accuracy Checks</h4>
                  <ul className="list-disc pl-4 space-y-1 text-slate-600 text-[11px]">
                    <li>Ensure cooking preparations (e.g., <em>sous-vide</em>, <em>pan-seared</em>, <em>en croûte</em>) retain proper culinary nuances.</li>
                    <li>Allergen codes (GF, DF, Halal) remain universal and prominent across all languages.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'print' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900">
                Avery Template & Physical Printer Alignment Calibration
              </h3>

              <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-3.5 space-y-2">
                <h4 className="font-bold text-amber-950 text-xs">CRITICAL BROWSER PRINT SETTINGS (Chrome, Safari, Edge)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-800">
                  <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                    <span className="font-bold block text-slate-900">1. Scale</span>
                    Set strictly to <strong>100% (Default)</strong>. Do NOT use "Fit to Printable Area".
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                    <span className="font-bold block text-slate-900">2. Margins</span>
                    Set to <strong>None</strong> or <strong>Custom (0")</strong>. The app has built-in 0.35in Avery margins.
                  </div>
                  <div className="bg-white p-2.5 rounded-lg border border-amber-200">
                    <span className="font-bold block text-slate-900">3. Background Graphics</span>
                    Check <strong>"Background Graphics" ON</strong> to print luxury borders and badge colors.
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl p-3.5 bg-white space-y-2">
                <h4 className="font-bold text-slate-900">Supported Avery Templates</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <strong>Avery 5302 / 5303</strong><br /><span className="text-slate-500">3.5" x 2" (10 per sheet)</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <strong>Avery 5309 Tent</strong><br /><span className="text-slate-500">3.5" x 4" (4 per sheet)</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <strong>Avery 5163 Sticker</strong><br /><span className="text-slate-500">4" x 2" (10 per sheet)</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200">
                    <strong>Avery 5160 Prep</strong><br /><span className="text-slate-500">2.625" x 1" (30 per sheet)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'allergens' && (
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-slate-900">
                Dietary & Allergen Traceability Protocols
              </h3>
              <p className="text-[11px] text-slate-600">
                Complies with FDA Food Code, EU Directive 1169/2011, and Natasha’s Law requirements for transparent food labeling.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-[11px]">
                <div className="p-2.5 bg-amber-50/60 border border-amber-200 rounded-lg">
                  <span className="font-bold text-amber-900 block">🌾 GF (Gluten-Free)</span>
                  <span className="text-slate-600 text-[10px]">Zero wheat, rye, barley, or triticale.</span>
                </div>
                <div className="p-2.5 bg-sky-50/60 border border-sky-200 rounded-lg">
                  <span className="font-bold text-sky-900 block">🥛 DF (Dairy-Free)</span>
                  <span className="text-slate-600 text-[10px]">Contains no milk, butter, casein or whey.</span>
                </div>
                <div className="p-2.5 bg-emerald-50/60 border border-emerald-200 rounded-lg">
                  <span className="font-bold text-emerald-900 block">🌱 V (Vegetarian)</span>
                  <span className="text-slate-600 text-[10px]">Plant foods, eggs, dairy; no animal meat.</span>
                </div>
                <div className="p-2.5 bg-teal-50/60 border border-teal-200 rounded-lg">
                  <span className="font-bold text-teal-900 block">🌿 VE (Vegan)</span>
                  <span className="text-slate-600 text-[10px]">100% plant-based; zero animal products or honey.</span>
                </div>
                <div className="p-2.5 bg-rose-50/60 border border-rose-200 rounded-lg">
                  <span className="font-bold text-rose-900 block">🥜 CN (Contains Nuts)</span>
                  <span className="text-slate-600 text-[10px]">Tree nuts (almond, walnut, cashew) or peanuts.</span>
                </div>
                <div className="p-2.5 bg-cyan-50/60 border border-cyan-200 rounded-lg">
                  <span className="font-bold text-cyan-900 block">🦐 SF (Seafood / Shellfish)</span>
                  <span className="text-slate-600 text-[10px]">Crustacean, mollusk, or finfish products.</span>
                </div>
                <div className="p-2.5 bg-lime-50/60 border border-lime-200 rounded-lg">
                  <span className="font-bold text-lime-900 block">☪️ HAL (Halal)</span>
                  <span className="text-slate-600 text-[10px]">Prepared in accordance with Islamic dietary law.</span>
                </div>
                <div className="p-2.5 bg-blue-50/60 border border-blue-200 rounded-lg">
                  <span className="font-bold text-blue-900 block">✡️ KOS (Kosher)</span>
                  <span className="text-slate-600 text-[10px]">Prepared under rabbinical Kashrut supervision.</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            For hotel staff training, print and post this document in the banquet plating kitchen.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition"
          >
            Close Manual
          </button>
        </div>
      </div>
    </div>
  );
};
