import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import JSZip from 'jszip';

/**
 * Safely converts an HTMLElement to a PNG data URL with high-DPI scaling
 */
async function captureElementToPng(el: HTMLElement, pixelRatio: number = 2.5): Promise<string> {
  // Brief delay to ensure web fonts and layouts are settled
  await new Promise((resolve) => setTimeout(resolve, 60));

  return await toPng(el, {
    pixelRatio,
    cacheBust: false,
    backgroundColor: '#ffffff',
    quality: 0.98,
  });
}

/**
 * Generates and downloads a multi-page PDF document where each sheet is an exact 8.5" x 11" Letter page.
 */
export async function downloadMultiPagePdf(
  sheetElements: HTMLElement[],
  fileName: string = 'buffet_labels_letter_sheets.pdf',
  onProgress?: (progressMessage: string) => void
): Promise<void> {
  if (!sheetElements || sheetElements.length === 0) {
    throw new Error('No sheet elements found to render.');
  }

  const pdf = new jsPDF({
    unit: 'in',
    format: 'letter',
    orientation: 'portrait',
    compress: true,
  });

  for (let i = 0; i < sheetElements.length; i++) {
    if (onProgress) {
      onProgress(`Rendering Page ${i + 1} of ${sheetElements.length} for PDF...`);
    }

    const el = sheetElements[i];
    const imgData = await captureElementToPng(el, 2.5);

    if (i > 0) {
      pdf.addPage('letter', 'portrait');
    }

    // 8.5in x 11in standard letter full-bleed placement
    pdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11, undefined, 'FAST');
  }

  if (onProgress) {
    onProgress('Saving PDF file to downloads...');
  }

  // Save via jsPDF Blob URL trigger
  const blob = pdf.output('blob');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName.endsWith('.pdf') ? fileName : `${fileName}.pdf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generates a ZIP archive containing individual .pdf files (one PDF per 8.5" x 11" sheet)
 * as well as a consolidated multi-sheet PDF.
 */
export async function downloadPdfSheetsZip(
  sheetElements: HTMLElement[],
  zipFileName: string = 'buffet_label_sheets_pdf.zip',
  baseName: string = 'sheet',
  onProgress?: (progressMessage: string) => void
): Promise<void> {
  if (!sheetElements || sheetElements.length === 0) {
    throw new Error('No sheet elements found to render.');
  }

  const zip = new JSZip();
  const folder = zip.folder('pdf_sheets');

  // Consolidated PDF
  const combinedPdf = new jsPDF({
    unit: 'in',
    format: 'letter',
    orientation: 'portrait',
    compress: true,
  });

  for (let i = 0; i < sheetElements.length; i++) {
    if (onProgress) {
      onProgress(`Processing Sheet ${i + 1} of ${sheetElements.length} into PDF...`);
    }

    const el = sheetElements[i];
    const imgData = await captureElementToPng(el, 2.5);

    // 1. Single sheet PDF for the zip
    const singlePdf = new jsPDF({
      unit: 'in',
      format: 'letter',
      orientation: 'portrait',
      compress: true,
    });
    singlePdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11, undefined, 'FAST');
    const singleBlob = singlePdf.output('blob');
    folder?.file(`${baseName}_sheet_${String(i + 1).padStart(2, '0')}.pdf`, singleBlob);

    // 2. Add to combined PDF
    if (i > 0) {
      combinedPdf.addPage('letter', 'portrait');
    }
    combinedPdf.addImage(imgData, 'PNG', 0, 0, 8.5, 11, undefined, 'FAST');
  }

  // Also include the all-in-one PDF in the root of the ZIP
  const combinedBlob = combinedPdf.output('blob');
  zip.file('ALL_SHEETS_COMBINED.pdf', combinedBlob);

  if (onProgress) {
    onProgress('Packing ZIP archive with PDF sheets...');
  }

  const content = await zip.generateAsync({ type: 'blob' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipFileName.endsWith('.zip') ? zipFileName : `${zipFileName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

