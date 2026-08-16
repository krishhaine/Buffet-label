import React from 'react';
import { X, Trophy, CheckCircle, Sparkles, Box, Utensils, Printer, Tag } from 'lucide-react';

interface IndustryGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IndustryGuideModal: React.FC<IndustryGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
              🏆
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Professional Label & Card Printing Guide
              </h3>
              <p className="text-xs text-slate-300">
                Versatile solutions for banquet buffets, boxed lunch stickers, kitchen prep & universal tags
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
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-700 leading-relaxed">
          {/* Key Advantages Banner */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 text-amber-900 font-bold text-xs mb-1">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>One Universal Studio for All Label Needs:</span>
            </div>
            <p className="text-amber-800 text-[11.5px]">
              Whether generating luxury <strong>freestanding tent cards for a wedding buffet</strong>, <strong>adhesive stickers for boxed lunch catering orders</strong>, <strong>food rotation tags with chef dates</strong>, or <strong>conference name badges</strong>, you get instant one-click downloads and calibrated 8.5" &times; 11" sheets.
            </p>
          </div>

          {/* Core Categories */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
              Primary Use Cases Supported:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* 1. Guest-Facing Buffet Cards */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">1. Guest Buffet & Banquet Cards</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">3.5" &times; 2.0" / 3.5" &times; 4.0"</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Flat cards for clip stands or self-standing folded tent cards. Auto-extracts dietary pills (GF, DF, Vegan, Halal) so guests can dine safely.
                </p>
              </div>

              {/* 2. Boxed Lunches & Catering Seals */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">2. Boxed Lunch & Meal Stickers</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">4.0" &times; 2.0" (8/sheet)</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Adhesive labels for corporate catering boxes, sandwich wraps, and salad bowls with guest name header, dietary notes, prep timestamp, and storage directives.
                </p>
              </div>

              {/* 3. Kitchen Prep & Rotation Labels */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">3. Kitchen Prep & Food Rotation</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">2.625" &times; 1.0" (30/sheet)</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Compact stickers for squeeze bottles, deli containers, and walk-in prep batches with prep date, use-by expiry, and chef name.
                </p>
              </div>

              {/* 4. Universal Tags & Retail Packaging */}
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 text-xs">4. Universal Tags & Retail Seals</span>
                  <span className="text-[10px] bg-slate-200 text-slate-700 px-1.5 py-0.5 rounded font-mono">Circles, Squares, Ovals</span>
                </div>
                <p className="text-slate-600 text-[11px]">
                  Round seal stickers for bakery pastry bags, oval wine bottle tags, conference attendee badges, and storage bin organization.
                </p>
              </div>
            </div>
          </div>

          {/* Advantages Matrix */}
          <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-2">
            <h4 className="font-bold text-emerald-950 text-xs flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-700" />
              One-Click Export Capabilities:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-emerald-900 text-[11px]">
              <div>&bull; <strong>ZIP Archive:</strong> Batch download all cards as individual high-res PNG images in one click.</div>
              <div>&bull; <strong>Full Sheet Image:</strong> Export entire 8.5" &times; 11" sheets as 300-DPI printable PNGs.</div>
              <div>&bull; <strong>Browser PDF / Print:</strong> Clean borderless printing with duplex mirroring.</div>
              <div>&bull; <strong>Custom Geometry:</strong> Specify any width, height, or corner radius for custom stock.</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
