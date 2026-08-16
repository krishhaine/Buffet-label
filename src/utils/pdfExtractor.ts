import * as pdfjsLib from 'pdfjs-dist';
import { StudioMode } from '../types/buffet';

// Configure PDF.js worker
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '4.10.38'}/pdf.worker.min.mjs`;
}

export interface ExtractedPdfResult {
  rawText: string;
  pageCount: number;
  detectedTitle?: string;
  detectedEventDate?: string;
  detectedSections: string[];
  detectedMode: StudioMode;
  itemCountEstimate: number;
}

/**
 * Extracts clean text from an uploaded PDF File (BEO, Event Order, Banquet Proposal, Menu PDF)
 */
export async function extractTextFromPdf(file: File): Promise<ExtractedPdfResult> {
  const arrayBuffer = await file.arrayBuffer();
  const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  let fullText = '';
  const detectedSections: string[] = [];

  for (let pageNum = 1; pageNum <= numPages; pageNum++) {
    const page = await pdfDoc.getPage(pageNum);
    const textContent = await page.getTextContent();
    
    let lastY: number | null = null;
    let pageText = '';

    for (const item of textContent.items as any[]) {
      if (!item.str) continue;
      
      // If Y coordinate changed significantly, insert a newline
      if (lastY !== null && Math.abs(item.transform[5] - lastY) > 8) {
        pageText += '\n';
      } else if (pageText && !pageText.endsWith(' ') && !pageText.endsWith('\n')) {
        pageText += ' ';
      }
      
      pageText += item.str;
      lastY = item.transform[5];
    }

    fullText += pageText + '\n\n';
  }

  // Post-processing & Detection
  const cleanedText = fullText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // Detect Sections
  const sectionRegex = /(?:^|\n)(?:STATION|SECTION|COURSE|BUFFET|BAR|BREAKFAST|LUNCH|DINNER|RECEPTION|HORS D['’]OEUVRES|DESSERT|SALAD|ENTREE|BEVERAGES?|HOT STATION|COLD STATION)[\s:\-–—]+([^\n]+)/gi;
  let match: RegExpExecArray | null;
  while ((match = sectionRegex.exec(cleanedText)) !== null) {
    const secName = match[1]?.trim();
    if (secName && secName.length < 50 && !detectedSections.includes(secName)) {
      detectedSections.push(secName);
    }
  }

  // Detect Mode
  let detectedMode: StudioMode = 'buffet';
  const lower = cleanedText.toLowerCase();

  if (lower.includes('cocktail') || lower.includes('bourbon') || lower.includes('martini') || lower.includes('spritz') || lower.includes('host bar') || lower.includes('cash bar')) {
    detectedMode = 'bar_menu';
  } else if (lower.includes('boxed lunch') || lower.includes('sandwich box') || lower.includes('attendee:') || lower.includes('for: dr.') || lower.includes('for: mr.')) {
    detectedMode = 'boxed_lunch';
  } else if (lower.includes('use by') || lower.includes('prep date') || lower.includes('shelf life') || lower.includes('rotation')) {
    detectedMode = 'kitchen_prep';
  } else if (lower.includes('course 1') || lower.includes('first course') || lower.includes('plated dinner') || lower.includes('multi-course')) {
    detectedMode = 'full_menu_sheet';
  }

  // Item Count Estimate (lines with words and bullet/dashes/dietary markers)
  const lines = cleanedText.split('\n').filter(l => l.trim().length > 3);
  const itemCountEstimate = Math.max(1, lines.length);

  return {
    rawText: cleanedText,
    pageCount: numPages,
    detectedSections,
    detectedMode,
    itemCountEstimate,
  };
}
