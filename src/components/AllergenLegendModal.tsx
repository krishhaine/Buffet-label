import React from 'react';
import { ALLERGEN_MAP } from '../utils/allergens';
import { X, ShieldCheck, Info } from 'lucide-react';

interface AllergenLegendModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AllergenLegendModal: React.FC<AllergenLegendModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const allergensList = Object.values(ALLERGEN_MAP);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Dietary & Allergen Reference Guide
              </h3>
              <p className="text-xs text-slate-500">
                Standard culinary & banquet dietary codes used across hospitality BEOs
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-900 leading-relaxed">
              When pasting your BEO order, codes in parentheses (e.g.{' '}
              <code className="font-bold bg-amber-100/80 px-1 py-0.5 rounded text-amber-900">
                (GF, DF, V, VE)
              </code>
              ) are automatically parsed and translated into elegant guest badges.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {allergensList.map((item) => (
              <div
                key={item.code}
                className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-slate-50 flex items-center justify-between transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-lg shadow-2xs">
                    {item.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">{item.code}</span>
                      <span className="text-xs text-slate-600">&bull; {item.label}</span>
                    </div>
                    <p className="text-[11px] text-slate-500">{item.fullTitle}</p>
                  </div>
                </div>
                <span
                  className={`text-[9px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${item.badgeClass}`}
                >
                  {item.code}
                </span>
              </div>
            ))}
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
