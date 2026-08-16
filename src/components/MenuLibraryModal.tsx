import React, { useState } from 'react';
import { SavedMenu, BuffetItem, DesignSettings } from '../types/buffet';
import { X, Bookmark, Plus, Trash2, Copy, Check, Calendar, FileText, Download, Upload, Layers } from 'lucide-react';

interface MenuLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedMenus: SavedMenu[];
  currentItems: BuffetItem[];
  currentSettings: DesignSettings;
  currentMenuId: string | null;
  onLoadMenu: (menu: SavedMenu) => void;
  onSaveCurrentAsNew: (name: string, eventName?: string) => void;
  onOverwriteMenu: (id: string) => void;
  onDeleteMenu: (id: string) => void;
  onDuplicateMenu: (id: string) => void;
  menuCopies: number;
  onChangeCopies: (copies: number) => void;
}

export const MenuLibraryModal: React.FC<MenuLibraryModalProps> = ({
  isOpen,
  onClose,
  savedMenus,
  currentItems,
  currentSettings,
  currentMenuId,
  onLoadMenu,
  onSaveCurrentAsNew,
  onOverwriteMenu,
  onDeleteMenu,
  onDuplicateMenu,
  menuCopies,
  onChangeCopies,
}) => {
  const [newMenuName, setNewMenuName] = useState('');
  const [newEventName, setNewEventName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMenuName.trim()) return;
    onSaveCurrentAsNew(newMenuName.trim(), newEventName.trim());
    setNewMenuName('');
    setNewEventName('');
    setIsCreating(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
              📂
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Menu Library & Print Runs
              </h3>
              <p className="text-xs text-slate-300">
                Save menus for recurring events, weddings, and multi-station banquet runs
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

        {/* Copies / Print Run Settings Bar */}
        <div className="bg-amber-50/80 border-b border-amber-200/80 px-6 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-bold text-amber-950">
              Print Copies Multiplier:
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-amber-900">
              Print
            </span>
            <select
              value={menuCopies}
              onChange={(e) => onChangeCopies(Number(e.target.value))}
              className="text-xs font-bold bg-white border border-amber-300 rounded-lg px-2.5 py-1 text-amber-950 focus:ring-1 focus:ring-amber-500 focus:outline-none"
            >
              {[1, 2, 3, 4, 5, 6, 8, 10, 15, 20].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'Copy (1x)' : `Copies (${num}x)`}
                </option>
              ))}
            </select>
            <span className="text-[11px] text-amber-900">
              of this entire menu (for duplicate buffet lines & stations)
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Action: Save Current Menu */}
          {!isCreating ? (
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Current Active Workspace ({currentItems.length} items)
                </span>
                <span className="text-[11px] text-slate-500">
                  {currentMenuId
                    ? `Saved in: ${savedMenus.find((m) => m.id === currentMenuId)?.name || 'Custom'}`
                    : 'Unsaved draft'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {currentMenuId && (
                  <button
                    onClick={() => onOverwriteMenu(currentMenuId)}
                    className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition"
                  >
                    Update Current
                  </button>
                )}
                <button
                  onClick={() => setIsCreating(true)}
                  className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Save As New Menu</span>
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSave} className="p-4 bg-amber-50/50 rounded-xl border border-amber-300 space-y-3">
              <span className="text-xs font-bold text-amber-950 block">
                Save Current Menu to Library
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Menu Name (e.g. Summer Gala Dinner 2026)"
                  value={newMenuName}
                  onChange={(e) => setNewMenuName(e.target.value)}
                  className="text-xs p-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                  autoFocus
                  required
                />
                <input
                  type="text"
                  placeholder="Event / Client (e.g. Grand Ballroom BEO #402)"
                  value={newEventName}
                  onChange={(e) => setNewEventName(e.target.value)}
                  className="text-xs p-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-xs"
                >
                  Save Menu
                </button>
              </div>
            </form>
          )}

          {/* Saved Menus List */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2.5">
              Saved Menus in Storage ({savedMenus.length})
            </span>

            {savedMenus.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400">
                <Bookmark className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-xs font-medium">No saved menus yet</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Save your BEO cards above to quickly load them whenever this event repeats.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {savedMenus.map((menu) => {
                  const isCurrent = currentMenuId === menu.id;
                  return (
                    <div
                      key={menu.id}
                      className={`p-3.5 rounded-xl border transition flex items-center justify-between gap-3 ${
                        isCurrent
                          ? 'border-amber-500 bg-amber-50/40 ring-1 ring-amber-400'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900 truncate">
                            {menu.name}
                          </span>
                          {isCurrent && (
                            <span className="text-[10px] bg-amber-200 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                          {menu.eventName && (
                            <span className="truncate max-w-[140px]">{menu.eventName}</span>
                          )}
                          <span>{menu.items.length} items</span>
                          <span>&bull;</span>
                          <span>{new Date(menu.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            onLoadMenu(menu);
                            onClose();
                          }}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition ${
                            isCurrent
                              ? 'bg-slate-900 text-white'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-2xs'
                          }`}
                        >
                          {isCurrent ? 'Reload' : 'Load Menu'}
                        </button>
                        <button
                          onClick={() => onDuplicateMenu(menu.id)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition"
                          title="Duplicate Menu"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeleteMenu(menu.id)}
                          className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Menu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
