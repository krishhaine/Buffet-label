import React, { useState, useRef } from 'react';
import { SAMPLE_MENUS } from '../utils/sampleMenus';
import { StudioMode } from '../types/buffet';
import { extractTextFromPdf, ExtractedPdfResult } from '../utils/pdfExtractor';
import {
  FileText,
  Sparkles,
  Trash2,
  Table,
  ListPlus,
  Wand2,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  RefreshCw,
  Layers,
  ChevronDown,
} from 'lucide-react';

interface BeoInputPanelProps {
  rawInput: string;
  onChangeInput: (text: string) => void;
  onParse: (mode: 'beo' | 'table') => void;
  onLoadSample: (sampleId: string) => void;
  onClear: () => void;
  onAddNewManual: () => void;
  activeStation: string;
  onChangeStation: (station: string) => void;
  currentMode?: StudioMode;
  onSelectMode?: (mode: StudioMode) => void;
}

export const BeoInputPanel: React.FC<BeoInputPanelProps> = ({
  rawInput,
  onChangeInput,
  onParse,
  onLoadSample,
  onClear,
  onAddNewManual,
  activeStation,
  onChangeStation,
  currentMode,
  onSelectMode,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'input' | 'samples' | 'table'>('upload');
  const [sampleCategory, setSampleCategory] = useState<StudioMode | 'all'>('all');
  const [isExtractingPdf, setIsExtractingPdf] = useState(false);
  const [pdfExtractionResult, setPdfExtractionResult] = useState<ExtractedPdfResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredSamples = sampleCategory === 'all'
    ? SAMPLE_MENUS
    : SAMPLE_MENUS.filter((s) => s.category === sampleCategory);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        setIsExtractingPdf(true);
        const result = await extractTextFromPdf(file);
        setPdfExtractionResult(result);
        onChangeInput(result.rawText);

        if (onSelectMode && result.detectedMode) {
          onSelectMode(result.detectedMode);
        }

        // Auto trigger parse
        setTimeout(() => {
          onParse('beo');
        }, 100);
      } catch (err) {
        console.error('Failed to extract text from PDF:', err);
      } finally {
        setIsExtractingPdf(false);
      }
    } else {
      // Plain text or CSV
      const text = await file.text();
      onChangeInput(text);
      if (file.name.endsWith('.csv') || file.name.endsWith('.tsv')) {
        onParse('table');
      } else {
        onParse('beo');
      }
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Panel Header & Tabs */}
      <div className="px-4 py-3 border-b border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-amber-600" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            1. BEO, PDF & Menu Auto-Detector
          </h2>
        </div>

        {/* Input Mode Tabs */}
        <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
              activeTab === 'upload' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5 text-amber-600" />
            <span>PDF Auto-Detect</span>
          </button>
          <button
            onClick={() => setActiveTab('input')}
            className={`px-2.5 py-1 rounded-md transition ${
              activeTab === 'input' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Paste Text
          </button>
          <button
            onClick={() => setActiveTab('samples')}
            className={`px-2.5 py-1 rounded-md transition ${
              activeTab === 'samples' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Presets
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-2.5 py-1 rounded-md transition ${
              activeTab === 'table' ? 'bg-white text-slate-900 shadow-xs font-semibold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Excel / CSV
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* TAB 1: PDF Auto-Detect & Drag/Drop */}
        {activeTab === 'upload' && (
          <div className="space-y-3">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-amber-50/40 hover:bg-amber-50/70 p-6 rounded-xl text-center cursor-pointer transition flex flex-col items-center justify-center space-y-2 group"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.txt,.docx,.csv,.tsv"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileUpload(e.target.files[0]);
                  }
                }}
                className="hidden"
              />

              <div className="w-12 h-12 rounded-full bg-amber-100 group-hover:bg-amber-200 text-amber-700 flex items-center justify-center transition">
                {isExtractingPdf ? (
                  <RefreshCw className="w-6 h-6 animate-spin" />
                ) : (
                  <UploadCloud className="w-6 h-6" />
                )}
              </div>

              <div>
                <span className="text-xs font-bold text-slate-800 group-hover:text-amber-900 block">
                  {isExtractingPdf ? 'Extracting BEO Text from PDF...' : 'Drop Banquet Event Order (PDF / Menu Copy) Here'}
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Supports PDF, Word text, and spreadsheets. Automatically detects stations, allergen tags & dietary notes.
                </p>
              </div>

              <span className="inline-block text-[10px] font-semibold bg-white border border-amber-300/80 px-2.5 py-1 rounded-full text-amber-800 shadow-2xs">
                Browse Files...
              </span>
            </div>

            {/* Extraction summary toast if detected */}
            {pdfExtractionResult && (
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl space-y-1.5 animate-in fade-in duration-150">
                <div className="flex items-center justify-between text-xs font-bold text-emerald-900">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    PDF Auto-Detection Successful ({pdfExtractionResult.pageCount} Pages)
                  </span>
                  <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded font-mono">
                    ~{pdfExtractionResult.detectedSections.length} Stations Found
                  </span>
                </div>
                {pdfExtractionResult.detectedSections.length > 0 && (
                  <div className="flex flex-wrap gap-1 pt-1">
                    {pdfExtractionResult.detectedSections.map((sec, idx) => (
                      <span key={idx} className="text-[9.5px] bg-white border border-emerald-200 text-emerald-800 px-1.5 py-0.5 rounded">
                        {sec}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Quick action buttons */}
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => onParse('beo')}
                className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5"
              >
                <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                <span>Re-Parse Active Text</span>
              </button>
              <button
                onClick={onAddNewManual}
                className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition flex items-center gap-1"
              >
                <ListPlus className="w-3.5 h-3.5 text-slate-500" />
                <span>+ Manual Item</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Quick Text Input */}
        {activeTab === 'input' && (
          <div className="space-y-3">
            <div className="relative">
              <textarea
                value={rawInput}
                onChange={(e) => onChangeInput(e.target.value)}
                rows={7}
                className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 focus:outline-none placeholder:text-slate-400 leading-relaxed"
                placeholder="Paste raw BEO menu, copied PDF text, bar cocktail list, boxed lunches, or items...

Examples:
• The Golden Hour Spritz | Empress Gin, Elderflower, Prosecco, Grapefruit | Hosted
• Smoked Old Fashioned | Woodford Reserve Bourbon, Demerara | $16.00
• For: Sarah Jenkins | Smoked Turkey & Havarti on Focaccia | (GF, DF)
• 18:00 20:30 Prime Rib of Beef (GF, DF) (served with horseradish cream)
• Truffle Aioli | Best By: Aug 20 | Chef Marco | (V, EG)"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onParse('beo')}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5"
                >
                  <Wand2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Parse & Generate Cards</span>
                </button>
                <button
                  onClick={onAddNewManual}
                  className="px-3 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-lg transition flex items-center gap-1"
                >
                  <ListPlus className="w-3.5 h-3.5 text-slate-500" />
                  <span>+ Manual Item</span>
                </button>
              </div>

              <button
                onClick={onClear}
                className="px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-medium transition flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: Sample Presets Library */}
        {activeTab === 'samples' && (
          <div className="space-y-2.5">
            {/* Category Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 mb-1">
              {[
                { id: 'all', label: 'All Presets' },
                { id: 'bar_menu', label: '🍸 Bar Menus' },
                { id: 'full_menu_sheet', label: '📄 8.5×11 Sheets' },
                { id: 'buffet', label: '🍽️ Buffet Cards' },
                { id: 'boxed_lunch', label: '📦 Boxed Lunch' },
                { id: 'kitchen_prep', label: '🏷️ Kitchen Prep' },
                { id: 'universal', label: '✨ Universal Tags' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSampleCategory(cat.id as any)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded-md whitespace-nowrap transition ${
                    sampleCategory === cat.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredSamples.map((menu) => (
                <button
                  key={menu.id}
                  onClick={() => {
                    onLoadSample(menu.id);
                    setActiveTab('input');
                  }}
                  className="text-left p-3 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 bg-white transition group flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800 group-hover:text-amber-900">
                        {menu.title}
                      </span>
                      <Sparkles className="w-3 h-3 text-amber-500 opacity-0 group-hover:opacity-100 transition" />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                      {menu.description}
                    </p>
                  </div>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-amber-700">
                    Load & Generate &rarr;
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: Excel / CSV Import */}
        {activeTab === 'table' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-600 bg-amber-50/60 p-2.5 rounded-lg border border-amber-200/80">
              <span className="font-semibold text-amber-900 block mb-0.5">
                Copy/paste rows directly from Excel or Google Sheets:
              </span>
              Columns expected: <code>Item Name</code> | <code>Description</code> | <code>Dietary (GF, DF, V)</code> | <code>Category</code> | <code>Price</code> | <code>Guest Name</code>
            </div>

            <textarea
              value={rawInput}
              onChange={(e) => onChangeInput(e.target.value)}
              rows={6}
              className="w-full text-xs font-mono p-3 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 focus:outline-none"
              placeholder="Herb Crusted Salmon	Wild pacific salmon with lemon dill	GF, DF, SF	Hot Station	$24.00
Artisan Vegan Wrap	Roasted veggies with hummus	GF, DF, V, VE	Boxed Lunch	$14.50	Sarah Jenkins
Smoked Old Fashioned	Bourbon, demerara, angostura	V	Cocktails	$16.00"
            />

            <button
              onClick={() => onParse('table')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5"
            >
              <Table className="w-3.5 h-3.5 text-amber-400" />
              <span>Import Spreadsheet Data</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
