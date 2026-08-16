import React, { useState } from 'react';
import {
  RotateCcw,
  Save,
  Trash2,
  X,
  AlertTriangle,
  FileSpreadsheet,
  CheckCircle2,
} from 'lucide-react';
import { BuffetItem, DesignSettings } from '../types/buffet';

interface ResetConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  itemsCount: number;
  activeMenuName: string;
  templateCode: string;
  onSaveAndReset: (newMenuName?: string) => void;
  onDiscardAndReset: () => void;
}

export const ResetConfirmModal: React.FC<ResetConfirmModalProps> = ({
  isOpen,
  onClose,
  itemsCount,
  activeMenuName,
  templateCode,
  onSaveAndReset,
  onDiscardAndReset,
}) => {
  const [saveName, setSaveName] = useState(
    `${activeMenuName} (${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`
  );
  const [showSavePrompt, setShowSavePrompt] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden text-slate-800 animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 px-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">
                Reset Workspace & Start New
              </h3>
              <p className="text-[11px] text-slate-400">
                Confirm your action before clearing
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4">
          <div className="flex items-start gap-3 p-3.5 bg-amber-50 rounded-xl border border-amber-200/80">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-950 space-y-1">
              <p className="font-bold">
                Do you want to save your current work before resetting?
              </p>
              <p className="text-amber-800 text-[11px] leading-relaxed">
                Resetting will clear the active canvas so you can start a fresh catering menu or import a new BEO.
              </p>
            </div>
          </div>

          {/* Current Project Summary Box */}
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
              Active Project Summary
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-semibold">Project Name:</span>
              <span className="font-bold text-slate-900 truncate max-w-[200px]">
                {activeMenuName || 'Untitled Project'}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-semibold">Items in Menu:</span>
              <span className="font-mono bg-white px-2 py-0.5 rounded border border-slate-200 font-bold text-amber-700">
                {itemsCount} {itemsCount === 1 ? 'Label' : 'Labels'}
              </span>
            </div>
            <div className="flex justify-between items-center text-slate-700">
              <span className="font-semibold">Paper Template:</span>
              <span className="text-slate-600 font-medium">
                {templateCode}
              </span>
            </div>
          </div>

          {/* Save Name Input (If saving) */}
          {showSavePrompt && (
            <div className="space-y-1.5 p-3 bg-emerald-50 rounded-xl border border-emerald-200 animate-in fade-in">
              <label className="text-xs font-bold text-emerald-950 block">
                Save Project As Name:
              </label>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="e.g. Saturday Gala Buffet"
                className="w-full text-xs p-2 bg-white border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800"
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-200/70 rounded-lg transition"
          >
            Cancel (Keep Editing)
          </button>

          <div className="w-full sm:w-auto flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onDiscardAndReset();
                onClose();
              }}
              className="flex-1 sm:flex-initial px-3 py-2 bg-white hover:bg-rose-50 border border-rose-200 text-rose-700 hover:text-rose-800 text-xs font-semibold rounded-lg shadow-2xs transition flex items-center justify-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Discard & Reset</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (!showSavePrompt) {
                  setShowSavePrompt(true);
                  return;
                }
                onSaveAndReset(saveName.trim() || activeMenuName);
                onClose();
              }}
              className="flex-1 sm:flex-initial px-4 py-2 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{showSavePrompt ? 'Confirm & Reset' : 'Save & Start New'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
