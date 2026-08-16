/**
 * Direct Print Helper for Buffet Label Studio
 * Opens the native browser and operating system printer properties dialog
 * (supporting paper tray source, staple, collate, duplex, and margin controls)
 * with robust iframe printing and standalone tab fallback.
 */

/**
 * Executes a direct print by creating an isolated printable iframe
 * or delegating to window.print(). This bypasses popup blockers in iframes.
 */
export function executeDirectPrint(specificSheetIndex?: number): Promise<boolean> {
  return new Promise((resolve) => {
    try {
      const printContent = document.querySelector('.print-only-container');
      if (!printContent) {
        window.focus();
        window.print();
        resolve(true);
        return;
      }

      // Remove any existing print iframe
      const existingIframe = document.getElementById('buffet-print-iframe');
      if (existingIframe) {
        existingIframe.remove();
      }

      const iframe = document.createElement('iframe');
      iframe.id = 'buffet-print-iframe';
      iframe.setAttribute('title', 'Print Dispatcher');
      iframe.style.position = 'fixed';
      iframe.style.right = '0';
      iframe.style.bottom = '0';
      iframe.style.width = '0';
      iframe.style.height = '0';
      iframe.style.border = '0';
      iframe.style.opacity = '0';
      iframe.style.pointerEvents = 'none';
      document.body.appendChild(iframe);

      const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
        .map((el) => el.outerHTML)
        .join('\n');

      const html = `<!DOCTYPE html>
<html>
  <head>
    <title>Buffet Labels - Print Job</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cinzel:wght@400..900&family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&family=Dancing+Script:wght@400..700&family=Great+Vibes&family=Inter:wght@300..800&family=Montserrat:ital,wght@0,300..900;1,300..900&family=Oswald:wght@300..700&family=Outfit:wght@300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto+Slab:wght@300..800&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    ${styles}
    <style>
      html, body {
        background: #ffffff !important;
        margin: 0 !important;
        padding: 0 !important;
        color: #000000 !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      .print-only-container {
        display: block !important;
        position: static !important;
        width: 8.5in !important;
        margin: 0 auto !important;
        background: #ffffff !important;
        box-shadow: none !important;
        opacity: 1 !important;
        visibility: visible !important;
      }
      @page {
        size: 8.5in 11in;
        margin: 0;
      }
      @media print {
        html, body {
          background: #ffffff !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .page-sheet-unit {
          width: 8.5in !important;
          height: 11in !important;
          max-height: 11in !important;
          box-sizing: border-box !important;
          page-break-after: always !important;
          break-after: page !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          overflow: hidden !important;
          background: #ffffff !important;
        }
        .page-sheet-unit:last-child {
          page-break-after: auto !important;
          break-after: auto !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="print-only-container">
      ${printContent.innerHTML}
    </div>
  </body>
</html>`;

      const doc = iframe.contentWindow?.document || iframe.contentDocument;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();

        // Allow fonts and styles to render before opening print dialog
        setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
            resolve(true);
          } catch (e) {
            console.warn('Iframe print failed, falling back to window.print():', e);
            window.focus();
            window.print();
            resolve(true);
          }
        }, 350);
      } else {
        window.focus();
        window.print();
        resolve(true);
      }
    } catch (err) {
      console.warn('Direct print error, falling back to window.print():', err);
      window.focus();
      window.print();
      resolve(true);
    }
  });
}

/**
 * Opens a dedicated standalone browser tab for printing.
 * Uses Blob URLs for cross-browser safety and handles popup blocker edge cases.
 */
export function openStandalonePrintWindow(templateName = 'Buffet Labels'): void {
  const printContent = document.querySelector('.print-only-container');
  if (!printContent) {
    executeDirectPrint();
    return;
  }

  try {
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map((el) => el.outerHTML)
      .join('\n');

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
  <head>
    <title>${templateName} - Direct System & Browser Print Window</title>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz,wght@0,6..96,400..900;1,6..96,400..900&family=Cinzel:wght@400..900&family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&family=Dancing+Script:wght@400..700&family=Great+Vibes&family=Inter:wght@300..800&family=Montserrat:ital,wght@0,300..900;1,300..900&family=Oswald:wght@300..700&family=Outfit:wght@300..800&family=Playfair+Display:ital,wght@0,400..900;1,400..900&family=Roboto+Slab:wght@300..800&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    ${styles}
    <style>
      html, body {
        background: #f1f5f9;
        margin: 0;
        padding: 16px 0 40px 0;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #0f172a;
      }
      .no-print-toolbar {
        position: sticky;
        top: 12px;
        z-index: 9999;
        margin-bottom: 24px;
        padding: 14px 24px;
        background: #0f172a;
        color: #f8fafc;
        border-radius: 14px;
        box-shadow: 0 12px 30px rgba(0,0,0,0.35);
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 8.5in;
        width: calc(100% - 32px);
        box-sizing: border-box;
      }
      .toolbar-row-top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        flex-wrap: wrap;
      }
      .toolbar-title {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 700;
        font-size: 15px;
        color: #ffffff;
      }
      .toolbar-actions {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .btn-print {
        background: #f59e0b;
        color: #020617;
        border: none;
        padding: 9px 20px;
        border-radius: 8px;
        font-weight: 700;
        font-size: 13px;
        cursor: pointer;
        transition: all 0.15s ease;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .btn-print:hover {
        background: #fbbf24;
        transform: translateY(-1px);
      }
      .btn-close {
        background: #334155;
        color: #e2e8f0;
        border: none;
        padding: 9px 16px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 13px;
        cursor: pointer;
        transition: background 0.15s ease;
      }
      .btn-close:hover {
        background: #475569;
        color: #ffffff;
      }
      .toolbar-hardware-tips {
        background: rgba(255, 255, 255, 0.08);
        border: 1px solid rgba(255, 255, 255, 0.12);
        padding: 8px 12px;
        border-radius: 8px;
        font-size: 11.5px;
        color: #cbd5e1;
        line-height: 1.4;
      }
      .toolbar-hardware-tips strong {
        color: #fcd34d;
      }
      .print-only-container {
        display: block !important;
        position: static !important;
        left: auto !important;
        top: auto !important;
        width: 8.5in !important;
        margin: 0 auto !important;
        background: #ffffff;
        box-shadow: 0 4px 24px rgba(0,0,0,0.12);
        opacity: 1 !important;
        visibility: visible !important;
      }
      @page {
        size: 8.5in 11in;
        margin: 0;
      }
      @media print {
        html, body {
          background: #ffffff !important;
          padding: 0 !important;
          margin: 0 !important;
        }
        .no-print-toolbar {
          display: none !important;
        }
        .print-only-container {
          box-shadow: none !important;
        }
        .page-sheet-unit {
          width: 8.5in !important;
          height: 11in !important;
          max-height: 11in !important;
          box-sizing: border-box !important;
          page-break-after: always !important;
          break-after: page !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
          overflow: hidden !important;
          background: #ffffff !important;
        }
        .page-sheet-unit:last-child {
          page-break-after: auto !important;
          break-after: auto !important;
        }
      }
    </style>
  </head>
  <body>
    <div class="no-print-toolbar">
      <div class="toolbar-row-top">
        <div class="toolbar-title">
          <span>🖨️</span>
          <span>System & Hardware Printer Controls — ${templateName}</span>
        </div>
        <div class="toolbar-actions">
          <button class="btn-print" onclick="window.print()">
            <span>Print Sheet Run (Ctrl+P / ⌘P)</span>
          </button>
          <button class="btn-close" onclick="window.close()">
            <span>Close Tab</span>
          </button>
        </div>
      </div>
      <div class="toolbar-hardware-tips">
        <strong>Hardware Driver Setup:</strong> In your browser print dialog &bull; Margins: <strong>None (0)</strong> &bull; Scale: <strong>100% (Default)</strong> &bull; Background Graphics: <strong>Checked (ON)</strong> &bull; Paper Tray / Source: Select Heavy Cardstock / Label Tray.
      </div>
    </div>

    <div class="print-only-container">
      ${printContent.innerHTML}
    </div>

    <script>
      // Auto-trigger native print dialog after fonts and graphics render
      window.onload = function() {
        setTimeout(function() {
          window.focus();
          window.print();
        }, 400);
      };
    </script>
  </body>
</html>`;

    // Try Blob URL approach first (safest across modern browsers and CSP)
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const blobUrl = URL.createObjectURL(blob);
    const printTab = window.open(blobUrl, '_blank');

    if (!printTab) {
      // If popup blocker intervened, instantly trigger direct iframe print
      console.warn('Popup blocked, executing direct print fallback');
      executeDirectPrint();
    }
  } catch (err) {
    console.warn('Error opening standalone print window:', err);
    executeDirectPrint();
  }
}
