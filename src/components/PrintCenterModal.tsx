import React, { useState } from 'react';
import { BuffetItem, DesignSettings } from '../types/buffet';
import { getTemplateById } from '../utils/templates';
import {
  X,
  Printer,
  FileText,
  Download,
  FileArchive,
  ExternalLink,
  CheckCircle,
  HelpCircle,
  Sparkles,
  Layers,
  Compass,
} from 'lucide-react';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';
import { downloadMultiPagePdf, downloadPdfSheetsZip } from '../utils/pdfGenerator';
import { openStandalonePrintWindow, executeDirectPrint } from '../utils/printHelper';

interface PrintCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: BuffetItem[];
  settings: DesignSettings;
  totalSheets: number;
  templateName: string;
  templateCode: string;
  onTriggerDirectPrint: (sheetIndex?: number) => void;
}

export const PrintCenterModal: React.FC<PrintCenterModalProps> = ({
  isOpen,
  onClose,
  items,
  settings,
  totalSheets,
  templateName,
  templateCode,
  onTriggerDirectPrint,
}) => {
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [isExportingSheet, setIsExportingSheet] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  if (!isOpen) return null;

  // Open Clean Standalone Printable Tab
  const handleOpenPrintableWindow = () => {
    openStandalonePrintWindow(templateName);
    onClose();
  };

  // Export All Sheets as Single Consolidated Multi-Page PDF
  const handleDownloadMultiPagePdf = async () => {
    const sheetUnits = Array.from(document.querySelectorAll('.page-sheet-unit')) as HTMLElement[];
    const target = sheetUnits.length > 0 ? sheetUnits : (document.getElementById('preview-sheet-target') ? [document.getElementById('preview-sheet-target') as HTMLElement] : []);

    if (target.length === 0) {
      handleOpenPrintableWindow();
      return;
    }

    try {
      setIsExportingSheet(true);
      setStatusMessage('Generating multi-page Letter PDF...');
      await downloadMultiPagePdf(
        target,
        `buffet_sheets_${templateCode}_${items.length}items.pdf`,
        (msg) => setStatusMessage(msg)
      );
      setStatusMessage('PDF downloaded successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error('Failed to export multi-page PDF:', err);
      setStatusMessage('Error creating PDF, opening print window...');
      setTimeout(() => handleOpenPrintableWindow(), 500);
    } finally {
      setIsExportingSheet(false);
    }
  };

  // Export ZIP containing 1 PDF per sheet
  const handleDownloadPdfSheetsZip = async () => {
    const sheetUnits = Array.from(document.querySelectorAll('.page-sheet-unit')) as HTMLElement[];
    const target = sheetUnits.length > 0 ? sheetUnits : (document.getElementById('preview-sheet-target') ? [document.getElementById('preview-sheet-target') as HTMLElement] : []);

    if (target.length === 0) {
      handleOpenPrintableWindow();
      return;
    }

    try {
      setIsExportingZip(true);
      setStatusMessage('Building ZIP with PDF sheets (1 per page)...');
      await downloadPdfSheetsZip(
        target,
        `buffet_pdf_sheets_${templateCode}.zip`,
        `sheet_${templateCode}`,
        (msg) => setStatusMessage(msg)
      );
      setStatusMessage('PDF ZIP downloaded successfully!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error('Failed to export PDF ZIP:', err);
      setStatusMessage('Error generating ZIP.');
    } finally {
      setIsExportingZip(false);
    }
  };

  // Batch Export All Labels as ZIP archive
  const handleDownloadZip = async () => {
    if (items.length === 0 || isExportingZip) return;
    try {
      setIsExportingZip(true);
      setStatusMessage('Preparing ZIP archive of labels...');
      const zip = new JSZip();
      const folder = zip.folder(`buffet_labels_${templateCode}`);

      const cardElements = document.querySelectorAll('.print-card-box');

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        setStatusMessage(`Rendering card ${i + 1} of ${items.length}...`);

        let dataUrl = '';
        if (cardElements[i]) {
          dataUrl = await toPng(cardElements[i] as HTMLElement, {
            pixelRatio: 3,
            cacheBust: true,
          });
        }

        if (dataUrl) {
          const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');
          const cleanName = (item.name || `label_${i + 1}`)
            .toLowerCase()
            .replace(/[^a-z0-9]/g, '_')
            .slice(0, 30);
          folder?.file(`${String(i + 1).padStart(2, '0')}_${cleanName}.png`, base64Data, { base64: true });
        }
      }

      setStatusMessage('Creating ZIP archive...');
      const content = await zip.generateAsync({ type: 'blob' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(content);
      a.download = `buffet_labels_${templateCode}_${items.length}items.zip`;
      a.click();
      URL.revokeObjectURL(a.href);
      setStatusMessage('ZIP download complete!');
      setTimeout(() => setStatusMessage(''), 3000);
    } catch (err) {
      console.error('Failed to export ZIP:', err);
      setStatusMessage('Error creating ZIP archive.');
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold text-sm">
              🖨️
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Print & Export Center
              </h3>
              <p className="text-xs text-slate-300">
                {items.length} Labels &bull; {totalSheets} {totalSheets === 1 ? 'Sheet' : 'Sheets'} ({templateName})
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

        {/* Status Toast */}
        {statusMessage && (
          <div className="bg-amber-500 text-slate-950 px-6 py-2 text-xs font-bold flex items-center justify-between">
            <span>{statusMessage}</span>
            <span className="font-mono text-[10px]">Processing...</span>
          </div>
        )}

        {/* Modal Body: Print Options */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* Primary Action 1: Direct Printer Window & OS Properties */}
          <div className="p-4 bg-amber-50/70 rounded-xl border border-amber-300/80 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                  <Printer className="w-4 h-4 text-amber-600" />
                  Direct Printer Window (Print Options, Paper Tray, Staple, Collate)
                </span>
                <p className="text-xs text-slate-600 mt-0.5">
                  Opens the direct printer window immediately. You can choose your printer, select paper source/tray, staple & collate options, or save as PDF.
                </p>
              </div>
              <span className="px-2 py-0.5 bg-amber-200 text-amber-900 text-[10px] font-bold rounded uppercase tracking-wider">
                Full 8.5" &times; 11"
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => {
                  onClose();
                  setTimeout(() => {
                    onTriggerDirectPrint(0);
                  }, 50);
                }}
                className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-xs sm:text-sm rounded-lg shadow-sm transition flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4 text-slate-950" />
                <span>Open Direct Print Window Now</span>
              </button>

              <button
                onClick={handleOpenPrintableWindow}
                className="py-2.5 px-3 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-semibold text-xs rounded-lg transition flex items-center gap-1.5"
                title="Opens a clean top-level window for full access to OS system print dialog and hardware properties"
              >
                <span>Standalone OS Print Window</span>
              </button>
            </div>
          </div>

          {/* Action 2: PDF & Image Archive Downloads */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Download Multi-Page PDF */}
            <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-amber-600" />
                  Multi-Page PDF (All Sheets)
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  Export all {totalSheets} sheets formatted as standard 8.5" × 11" pages in a single PDF file.
                </p>
              </div>
              <button
                onClick={handleDownloadMultiPagePdf}
                disabled={isExportingSheet}
                className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg shadow-2xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5 text-slate-950" />
                <span>{isExportingSheet ? 'Generating PDF...' : 'Download PDF Document'}</span>
              </button>
            </div>

            {/* Download PDF ZIP (1 PDF per sheet) */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between space-y-2">
              <div>
                <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <FileArchive className="w-3.5 h-3.5 text-emerald-600" />
                  PDF Sheets (ZIP Archive)
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  Save 1 separate PDF per 8.5" × 11" sheet packaged in a ZIP archive.
                </p>
              </div>
              <button
                onClick={handleDownloadPdfSheetsZip}
                disabled={isExportingZip}
                className="w-full py-2 px-3 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 text-xs font-semibold rounded-lg shadow-2xs transition flex items-center justify-center gap-1.5 disabled:opacity-50"
              >
                <FileArchive className="w-3.5 h-3.5 text-emerald-600" />
                <span>{isExportingZip ? 'Packing PDFs...' : `Download ${totalSheets} Sheets (ZIP)`}</span>
              </button>
            </div>
          </div>

          {/* Quick Print Calibration Guide */}
          <div className="p-3 bg-slate-100/80 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1.5">
            <span className="font-bold text-slate-800 flex items-center gap-1 text-[11px]">
              <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
              Hardware & Printer Driver Settings:
            </span>
            <ul className="list-disc pl-5 space-y-0.5 text-[11px]">
              <li><strong>Destination:</strong> Select your printer model (or <em>Save as PDF</em>)</li>
              <li><strong>Paper Source / Tray:</strong> Use Bypass / Manual Feed Tray for heavy label stock or cardstock</li>
              <li><strong>Staple & Collate:</strong> Configure in printer preferences (or via <em>"Print using system dialog..."</em>)</li>
              <li><strong>Paper Size:</strong> Letter (8.5" &times; 11") &bull; <strong>Scale:</strong> 100% (Actual Size)</li>
              <li><strong>Margins:</strong> None or Minimum (0") &bull; <strong>Background Graphics:</strong> Enabled</li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Template: <strong>{templateName}</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
