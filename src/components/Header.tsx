import React from 'react';
import {
  Printer,
  Download,
  Bookmark,
  Smartphone,
  Trophy,
  HelpCircle,
  BookOpen,
  Tag,
  Settings,
  Save,
  HardDrive,
  RotateCcw,
} from 'lucide-react';

interface HeaderProps {
  cardCount: number;
  sheetCount: number;
  templateCode: string;
  menuCopies: number;
  activeMenuName: string;
  onDirectPrint: () => void;
  onOpenPrintCenter: () => void;
  onResetWorkspace: () => void;
  onOpenSaveModal: () => void;
  onOpenMenuLibrary: () => void;
  onExportJson: () => void;
  onImportJson: () => void;
  onOpenAllergenGuide: () => void;
  onOpenDietaryManager: () => void;
  onOpenSopManual: () => void;
  onOpenPrintTips: () => void;
  onOpenAppStoreGuide: () => void;
  onOpenIndustryGuide: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  cardCount,
  sheetCount,
  templateCode,
  menuCopies,
  activeMenuName,
  onDirectPrint,
  onOpenPrintCenter,
  onResetWorkspace,
  onOpenSaveModal,
  onOpenMenuLibrary,
  onExportJson,
  onImportJson,
  onOpenAllergenGuide,
  onOpenDietaryManager,
  onOpenSopManual,
  onOpenPrintTips,
  onOpenAppStoreGuide,
  onOpenIndustryGuide,
}) => {
  return (
    <header className="no-print bg-slate-900 text-slate-100 border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Title */}
        <div className="flex items-center gap-2.5">
          <span className="font-bold text-base sm:text-lg tracking-tight text-white whitespace-nowrap flex items-center gap-2">
            <span>Buffet Label Studio</span>
          </span>
          <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-medium text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800/40">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Auto-Saved</span>
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          <button
            onClick={onResetWorkspace}
            className="px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white hover:bg-rose-950/50 border border-rose-800/40 rounded-md transition flex items-center gap-1.5 whitespace-nowrap"
            title="Reset canvas and start a new menu"
          >
            <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
            <span>New / Reset</span>
          </button>

          <button
            onClick={onOpenSaveModal}
            className="px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:text-white hover:bg-emerald-950/50 border border-emerald-700/40 rounded-md transition flex items-center gap-1.5 whitespace-nowrap"
            title="Save this project to your library or download backup"
          >
            <Save className="w-3.5 h-3.5 text-emerald-400" />
            <span>Save Project</span>
          </button>

          <button
            onClick={onOpenMenuLibrary}
            className="px-3 py-1.5 text-xs font-semibold text-amber-300 hover:text-amber-200 hover:bg-slate-800 rounded-md transition flex items-center gap-1.5 whitespace-nowrap"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>Saved Menus</span>
          </button>

          <button
            onClick={onOpenDietaryManager}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition flex items-center gap-1.5 whitespace-nowrap"
            title="Add, edit, or customize dietary and allergen acronyms"
          >
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>Edit Dietary Codes</span>
          </button>

          <button
            onClick={onOpenSopManual}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition flex items-center gap-1.5 whitespace-nowrap"
            title="Hospitality SOP & Standard Operating Procedures Manual"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span>Manual & SOP</span>
          </button>

          <button
            onClick={onOpenPrintTips}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition whitespace-nowrap"
          >
            Paper Setup
          </button>

          <button
            onClick={onOpenIndustryGuide}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-md transition flex items-center gap-1.5 whitespace-nowrap hidden xl:flex"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Industry Guide</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSaveModal}
            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-lg shadow-xs transition flex items-center gap-1.5 whitespace-nowrap shrink-0"
            title="Save menu to library or download backup"
          >
            <Save className="w-4 h-4 text-white" />
            <span>Save</span>
          </button>

          {/* Direct Print Button (Opens browser/OS print window immediately) */}
          <button
            onClick={onDirectPrint}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm hover:shadow transition flex items-center gap-2 whitespace-nowrap shrink-0"
            title="Open direct browser/OS printer window (Ctrl+P / Cmd+P) with staple, tray, and margin settings"
          >
            <Printer className="w-4 h-4 text-slate-950" />
            <span>Print ({sheetCount} {sheetCount === 1 ? 'Sheet' : 'Sheets'})</span>
          </button>

          {/* Export Options Modal Button */}
          <button
            onClick={onOpenPrintCenter}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 rounded-lg transition border border-slate-700"
            title="Print & PDF Export Center (Multi-page PDF, ZIP archives, Standalone print tab)"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
