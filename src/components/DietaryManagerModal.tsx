import React, { useState } from 'react';
import { AllergenInfo } from '../types/buffet';
import { ALLERGEN_MAP, DEFAULT_ALLERGENS, saveAllergenRegistry, refreshAllergenMap } from '../utils/allergens';
import { Tag, Plus, Trash2, RotateCcw, Check, Sparkles, X } from 'lucide-react';

interface DietaryManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistryUpdated: () => void;
}

export const DietaryManagerModal: React.FC<DietaryManagerModalProps> = ({
  isOpen,
  onClose,
  onRegistryUpdated,
}) => {
  const [registry, setRegistry] = useState<Record<string, AllergenInfo>>({ ...ALLERGEN_MAP });
  const [newCode, setNewCode] = useState('');
  const [newLabel, setNewLabel] = useState('');
  const [newFullTitle, setNewFullTitle] = useState('');
  const [newIcon, setNewIcon] = useState('🏷️');
  const [newColor, setNewColor] = useState('#0d9488');
  const [newCategory, setNewCategory] = useState<'dietary' | 'allergen' | 'religious' | 'advisory'>('dietary');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleUpdateItem = (code: string, field: keyof AllergenInfo, val: any) => {
    setRegistry(prev => ({
      ...prev,
      [code]: {
        ...prev[code],
        [field]: val,
      },
    }));
  };

  const handleAddNewCode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = newCode.trim().toUpperCase();
    if (!cleanCode) return;

    const newEntry: AllergenInfo = {
      code: cleanCode,
      label: newLabel.trim() || cleanCode,
      fullTitle: newFullTitle.trim() || `${cleanCode} (Custom Dietary Tag)`,
      icon: newIcon || '🏷️',
      category: newCategory,
      badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-300',
      dotColor: newColor || '#059669',
    };

    const updated = { ...registry, [cleanCode]: newEntry };
    setRegistry(updated);
    saveAllergenRegistry(updated);
    refreshAllergenMap();
    onRegistryUpdated();

    // Reset form
    setNewCode('');
    setNewLabel('');
    setNewFullTitle('');
    setNewIcon('🏷️');
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleDeleteCode = (code: string) => {
    const copy = { ...registry };
    delete copy[code];
    setRegistry(copy);
    saveAllergenRegistry(copy);
    refreshAllergenMap();
    onRegistryUpdated();
  };

  const handleResetToDefaults = () => {
    if (confirm('Reset all dietary and allergen codes back to factory hospitality defaults?')) {
      setRegistry({ ...DEFAULT_ALLERGENS });
      saveAllergenRegistry({ ...DEFAULT_ALLERGENS });
      refreshAllergenMap();
      onRegistryUpdated();
    }
  };

  const handleSaveAll = () => {
    saveAllergenRegistry(registry);
    refreshAllergenMap();
    onRegistryUpdated();
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Dietary & Allergen Code Manager</h2>
              <p className="text-xs text-slate-300">
                Customize dietary acronyms, icons, titles, and add bespoke hotel & catering tags
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Add New Custom Tag Box */}
          <div className="bg-amber-50/50 border border-amber-200/80 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-950 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5 text-amber-600" />
                Add New Custom Dietary Tag
              </span>
              {saveSuccess && (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Saved!
                </span>
              )}
            </div>

            <form onSubmit={handleAddNewCode} className="grid grid-cols-1 sm:grid-cols-5 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">
                  Code Acronym *
                </label>
                <input
                  type="text"
                  placeholder="e.g. AIP"
                  value={newCode}
                  onChange={e => setNewCode(e.target.value.toUpperCase())}
                  className="w-full text-xs font-bold px-2 py-1.5 border border-slate-300 rounded-lg bg-white uppercase focus:ring-2 focus:ring-amber-500"
                  maxLength={6}
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">
                  Short Label
                </label>
                <input
                  type="text"
                  placeholder="e.g. Autoimmune"
                  value={newLabel}
                  onChange={e => setNewLabel(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-bold uppercase text-slate-600 mb-0.5">
                  Full Compliance Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Autoimmune Protocol Compliant"
                  value={newFullTitle}
                  onChange={e => setNewFullTitle(e.target.value)}
                  className="w-full text-xs px-2 py-1.5 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  className="w-full py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Code
                </button>
              </div>
            </form>
          </div>

          {/* Active Dietary Codes Table */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Active Dietary Codes ({Object.keys(registry).length})
              </span>
              <button
                onClick={handleResetToDefaults}
                className="text-xs text-slate-500 hover:text-rose-600 flex items-center gap-1 transition"
              >
                <RotateCcw className="w-3 h-3" /> Reset to Hospitality Defaults
              </button>
            </div>

            <div className="border border-slate-200 rounded-xl overflow-hidden divide-y divide-slate-100">
              {(Object.values(registry) as AllergenInfo[]).map((item: AllergenInfo) => (
                <div
                  key={item.code}
                  className="p-2.5 flex flex-wrap items-center justify-between gap-3 bg-white hover:bg-slate-50 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-[120px]">
                    <span className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-sm shrink-0">
                      {item.icon}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-xs text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                          {item.code}
                        </span>
                        <input
                          type="text"
                          value={item.label}
                          onChange={e => handleUpdateItem(item.code, 'label', e.target.value)}
                          className="text-xs font-medium text-slate-800 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 outline-none px-1"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 min-w-[180px]">
                    <input
                      type="text"
                      value={item.fullTitle}
                      onChange={e => handleUpdateItem(item.code, 'fullTitle', e.target.value)}
                      className="w-full text-xs text-slate-600 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-amber-500 outline-none px-1"
                      placeholder="Full description..."
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={item.category}
                      onChange={e => handleUpdateItem(item.code, 'category', e.target.value)}
                      className="text-[11px] bg-slate-50 border border-slate-200 rounded px-1.5 py-1 text-slate-700"
                    >
                      <option value="dietary">Dietary</option>
                      <option value="allergen">Allergen</option>
                      <option value="religious">Religious</option>
                      <option value="advisory">Advisory</option>
                    </select>

                    <button
                      onClick={() => handleDeleteCode(item.code)}
                      title={`Remove code ${item.code}`}
                      className="p-1 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Codes automatically appear in the item tag selector and allergen legend.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
            >
              Close
            </button>
            <button
              onClick={handleSaveAll}
              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" /> Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
