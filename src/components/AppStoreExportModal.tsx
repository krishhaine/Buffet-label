import React, { useState } from 'react';
import { X, Smartphone, Apple, Play, Download, Sparkles, CheckCircle2, DollarSign, Layers, Globe, Shield, ArrowRight } from 'lucide-react';

interface AppStoreExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AppStoreExportModal: React.FC<AppStoreExportModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'pwa' | 'appstore' | 'commercial'>('pwa');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
              🚀
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Multi-Platform & App Store Publishing
              </h3>
              <p className="text-xs text-slate-300">
                Install as a standalone app on iOS, Android, macOS, and publish to App Stores
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

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-2 gap-2">
          <button
            onClick={() => setActiveTab('pwa')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'pwa'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Install on Device (iOS / Android)</span>
          </button>

          <button
            onClick={() => setActiveTab('appstore')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'appstore'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Apple className="w-3.5 h-3.5" />
            <span>Apple & Google Store Packaging</span>
          </button>

          <button
            onClick={() => setActiveTab('commercial')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'commercial'
                ? 'border-amber-600 text-amber-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Monetization & Sales Tips</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-slate-700 leading-relaxed">
          {/* TAB 1: Instant PWA Install */}
          {activeTab === 'pwa' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <span className="font-bold text-amber-900 block text-xs mb-1">
                  ⚡ Progressive Web App (PWA) Ready Out of the Box
                </span>
                <p className="text-amber-800 text-[11.5px]">
                  This app includes offline caching, touch optimization, and responsive layouts. You can install it on any iPhone, iPad, Android phone, or Mac/PC immediately without going through app review.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* iOS Instructions */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Apple className="w-4 h-4 text-slate-800" />
                    <span>How to Install on iPhone / iPad</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px]">
                    <li>Open this web URL in <strong>Safari</strong> on your iPhone or iPad.</li>
                    <li>Tap the <strong>Share</strong> icon (square with arrow pointing up) at the bottom toolbar.</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                    <li>It opens like a full native iOS app without browser navigation bars!</li>
                  </ol>
                </div>

                {/* Android Instructions */}
                <div className="border border-slate-200 rounded-xl p-4 bg-slate-50/50 space-y-2">
                  <div className="flex items-center gap-2 text-slate-900 font-bold text-xs">
                    <Play className="w-4 h-4 text-emerald-600" />
                    <span>How to Install on Android</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-slate-600 text-[11px]">
                    <li>Open this web URL in <strong>Google Chrome</strong> on Android.</li>
                    <li>Tap the three dots <strong>(⋮)</strong> menu in the upper right corner.</li>
                    <li>Tap <strong>"Install App"</strong> or <strong>"Add to Home Screen"</strong>.</li>
                    <li>An official app icon appears on your home screen with offline capability!</li>
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: App Store Packaging */}
          {activeTab === 'appstore' && (
            <div className="space-y-3.5">
              <p className="text-slate-600">
                To sell this application on the <strong>Apple App Store</strong> or <strong>Google Play Store</strong>, you can wrap this React codebase in minutes using modern industry wrappers:
              </p>

              <div className="space-y-2.5">
                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">1. Capacitor by Ionic (Recommended)</span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">Official Standard</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Run <code className="font-mono bg-white px-1.5 py-0.5 rounded border text-slate-800">npx cap init</code> and <code className="font-mono bg-white px-1.5 py-0.5 rounded border text-slate-800">npx cap add ios android</code>. It generates native Xcode and Android Studio projects ready for store submission.
                  </p>
                </div>

                <div className="p-3.5 border border-slate-200 rounded-xl bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-xs">2. PWABuilder (Microsoft Open Source)</span>
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">No-Code Generator</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Visit <code className="font-mono bg-white px-1.5 py-0.5 rounded border text-slate-800">pwabuilder.com</code>, paste your deployed live URL, and click "Build APK / iOS Package" to get ready-to-upload store archives.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Commercial & Monetization Suggestions */}
          {activeTab === 'commercial' && (
            <div className="space-y-3.5">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5">
                <h4 className="font-bold text-emerald-900 text-xs mb-1">
                  💰 Top Monetization Models for the Label & Hospitality Space:
                </h4>
                <ul className="space-y-1.5 text-emerald-950 text-[11px]">
                  <li>
                    &bull; <strong>SaaS Subscription for Event Venues & Caterers:</strong> Charge $19/mo or $149/yr to catering directors, kitchen teams, and event coordinators.
                  </li>
                  <li>
                    &bull; <strong>Custom Hotel & Corporate Branding:</strong> Offer white-label hotel branding with corporate logos, custom pantone colors, and multi-property templates.
                  </li>
                  <li>
                    &bull; <strong>Print Stock Compatibility:</strong> Market universal compatibility across all standard cardstock and peelable sticker sheets.
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
