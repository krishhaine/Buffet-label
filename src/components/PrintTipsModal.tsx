import React from 'react';
import { X, Printer, CheckCircle2, FileSpreadsheet, Scissors, Layers, RotateCw } from 'lucide-react';

interface PrintTipsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerPrint: () => void;
}

export const PrintTipsModal: React.FC<PrintTipsModalProps> = ({
  isOpen,
  onClose,
  onTriggerPrint,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[85vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <Printer className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-base font-bold text-white">
                Paper & Sticker Sheet Calibration Guide
              </h3>
              <p className="text-xs text-slate-300">
                Exact alignment for 8.5" × 11" cardstock, adhesive sticker sheets & duplex printing
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-600 leading-relaxed">
          {/* Universal Standard Formats */}
          <div className="border border-amber-300 rounded-xl p-4 bg-amber-50/40 space-y-2">
            <h4 className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
              <FileSpreadsheet className="w-4 h-4 text-amber-700" />
              Standard Sheet Sizes Supported
            </h4>
            <p className="text-amber-900">
              Our print engine is calibrated for standard <strong>8.5" &times; 11" Letter sheets</strong> across pre-scored cardstock, micro-perforated sheets, and peel-and-stick adhesive paper:
            </p>
            <ul className="space-y-1 list-disc list-inside text-slate-700 pt-1">
              <li><strong>Standard 3.5" &times; 2.0" Cards:</strong> 10 per sheet (2 columns &times; 5 rows)</li>
              <li><strong>Foldable 3.5" &times; 4.0" Tent Cards:</strong> 4 per sheet (2 columns &times; 2 rows)</li>
              <li><strong>Boxed Lunch Stickers 4.0" &times; 2.0":</strong> 8 per sheet (2 columns &times; 4 rows)</li>
              <li><strong>Kitchen Prep & Jar Stickers 2.625" &times; 1.0":</strong> 30 per sheet (3 columns &times; 10 rows)</li>
              <li><strong>Square Tags 2.5" &times; 2.5":</strong> 9 per sheet (3 columns &times; 3 rows)</li>
              <li><strong>Round Stickers 2.0" & 2.5":</strong> 12 & 9 per sheet</li>
            </ul>
          </div>

          {/* Double-Sided Duplex Calibration */}
          <div className="border border-blue-200 bg-blue-50/40 rounded-xl p-4 space-y-2">
            <h4 className="font-bold text-blue-900 flex items-center gap-1.5 text-xs">
              <RotateCw className="w-4 h-4 text-blue-700" />
              Double-Sided Duplex Printing (Front + Back)
            </h4>
            <div className="space-y-1 text-blue-950">
              <p>
                When <strong>Double-Sided Duplex</strong> is enabled, the system automatically mirrors the back-page columns horizontally so both sides align back-to-back.
              </p>
              <p>
                In your printer settings, select: <strong>"Print on both sides" &bull; "Flip on Long Edge"</strong>.
              </p>
            </div>
          </div>

          {/* Browser Print Dialog Settings */}
          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-2">
            <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Browser Print Dialog Settings
            </h4>
            <div className="space-y-1.5 text-slate-700">
              <p>1. <strong>Paper Size:</strong> <code>Letter (8.5" &times; 11")</code></p>
              <p>2. <strong>Margins:</strong> <code>None</code> or <code>Default</code></p>
              <p>3. <strong>Scale:</strong> Set to <code>100%</code> (do not choose "Fit to page" or "Shrink to fit")</p>
              <p>4. <strong>Options:</strong> Check <code>"Background graphics"</code> so colors, badges, and logos render crisply.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1.5 text-slate-600 hover:text-slate-900 text-xs font-medium"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              setTimeout(onTriggerPrint, 200);
            }}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg shadow-xs transition flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Open Print Dialog Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
