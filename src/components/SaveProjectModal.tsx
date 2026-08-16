import React, { useState } from 'react';
import { BuffetItem, DesignSettings, SavedMenu } from '../types/buffet';
import {
  X,
  Save,
  Download,
  Upload,
  Bookmark,
  CheckCircle,
  FileText,
  Clock,
  HardDrive,
  FolderOpen,
  Plus,
} from 'lucide-react';

interface SaveProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BuffetItem[];
  settings: DesignSettings;
  currentMenuId: string | null;
  savedMenus: SavedMenu[];
  onSaveCurrentAsNew: (name: string, eventName?: string) => void;
  onOverwriteMenu: (id: string) => void;
  onExportJson: () => void;
  onOpenImport: () => void;
  onOpenMenuLibrary: () => void;
}

export const SaveProjectModal: React.FC<SaveProjectModalProps> = ({
  isOpen,
  onClose,
  items,
  settings,
  currentMenuId,
  savedMenus,
  onSaveCurrentAsNew,
  onOverwriteMenu,
  onExportJson,
  onOpenImport,
  onOpenMenuLibrary,
}) => {
  const [menuName, setMenuName] = useState('');
  const [eventName, setEventName] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const currentSaved = savedMenus.find((m) => m.id === currentMenuId);

  const handleSaveNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuName.trim()) return;
    onSaveCurrentAsNew(menuName.trim(), eventName.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleQuickSave = () => {
    if (currentMenuId) {
      onOverwriteMenu(currentMenuId);
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 1200);
    } else {
      // Prompt for name
      const name = prompt('Enter a name for this menu project:', `Menu - ${new Date().toLocaleDateString()}`);
      if (name && name.trim()) {
        onSaveCurrentAsNew(name.trim());
        setSavedSuccess(true);
        setTimeout(() => {
          setSavedSuccess(false);
          onClose();
        }, 1200);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-sm">
              💾
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Save & Export Menu Project
              </h3>
              <p className="text-xs text-slate-300">
                {items.length} Labels &bull; Auto-saved to your browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert */}
        {savedSuccess && (
          <div className="bg-emerald-500 text-white px-6 py-2.5 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle className="w-4 h-4" />
            <span>Menu project successfully saved to your library!</span>
          </div>
        )}

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Method 1: Save to Browser Library */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                  Save to Saved Menus Library
                </span>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  {currentSaved
                    ? `Currently active project: "${currentSaved.name}"`
                    : 'Save this menu to quickly reload, modify, or print later.'}
                </p>
              </div>
            </div>

            {currentSaved ? (
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleQuickSave}
                  className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg transition flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Update "{currentSaved.name}"</span>
                </button>
                <button
                  onClick={onOpenMenuLibrary}
                  className="py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition"
                >
                  View Library ({savedMenus.length})
                </button>
              </div>
            ) : (
              <form onSubmit={handleSaveNew} className="space-y-2 pt-1">
                <input
                  type="text"
                  placeholder="Project Name (e.g. Imprint Plus 012365 Oval Buffet)"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  required
                />
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Event / Client (Optional)"
                    value={eventName}
                    onChange={(e) => setEventName(e.target.value)}
                    className="flex-1 text-xs p-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-xs transition flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Project</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Method 2: Download .JSON Project File (Backup & Share) */}
          <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-300/70 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <Download className="w-3.5 h-3.5 text-amber-700" />
                  Download Menu File (.JSON)
                </span>
                <p className="text-[11px] text-amber-900/80 mt-0.5">
                  Save a physical file to your computer's Downloads folder. You can email it to colleagues or reload it on any device.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <button
                onClick={onExportJson}
                className="flex-1 py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-lg shadow-xs transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download .JSON Backup File</span>
              </button>
              <button
                onClick={() => {
                  onClose();
                  onOpenImport();
                }}
                className="py-2 px-3 bg-white hover:bg-amber-100/70 border border-amber-300 text-amber-950 font-semibold text-xs rounded-lg transition flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5 text-amber-700" />
                <span>Load File</span>
              </button>
            </div>
          </div>

          {/* Auto-Save Info */}
          <div className="p-3 bg-slate-100 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-slate-500 shrink-0" />
            <p className="text-[11px]">
              <strong>Automatic Live Sync:</strong> All your edits, dishes, tags, and custom colors are automatically preserved in your browser's local memory.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>{items.length} dishes in active project</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
