import { AllergenKey, BuffetItem } from '../types/buffet';
import { ALLERGEN_MAP } from './allergens';

// Generate a random unique ID
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Words that should stay lower case in Title Case unless at the start
const LOWERCASE_WORDS = new Set([
  'a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'with', 'de', 'du', 'au', 'la', 'le', 'et'
]);

// Acronyms and culinary terms to keep uppercase
const UPPERCASE_TERMS = new Set([
  'GF', 'DF', 'NF', 'SF', 'V', 'VE', 'CN', 'BBQ', 'BLT', 'USDA', 'A5', 'NY', 'NYC', 'IPA', 'BEO', 'CBD', 'Bao', 'Wagyu', 'Pork', 'Dill', 'VIP', 'IT', 'USB', 'USB-C', 'LED', 'QR', 'ID', 'ABV', 'DOC', 'NV'
]);

export function formatTitleCase(str: string): string {
  if (!str) return '';
  
  const trimmed = str.trim();
  // If string is already mixed case (not all caps or all lower), preserve it
  const isAllCaps = trimmed === trimmed.toUpperCase() && trimmed.length > 3;
  if (!isAllCaps) {
    return trimmed;
  }

  const words = trimmed.toLowerCase().split(/\s+/);
  return words
    .map((word, index) => {
      const cleanWord = word.replace(/[^a-zA-Z0-9-]/g, '').toUpperCase();
      if (UPPERCASE_TERMS.has(cleanWord)) {
        return cleanWord;
      }

      if (index > 0 && LOWERCASE_WORDS.has(word)) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ')
    .trim();
}

/**
 * Checks if a parenthetical or isolated string is purely internal kitchen packaging or portion specs
 * (e.g. "5oz bag", "500z bag", "bag", "individually wrapped", "10oz pouch", "box", "tub")
 * which guests should never see on dining buffet cards.
 */
export function isInternalPackagingSpec(text: string): boolean {
  if (!text) return false;
  const clean = text.trim().toLowerCase();

  const isMatch = /^(?:\d+(?:\.\d+)?\s*(?:oz|g|kg|lbs?|ml|cl|lt|ozs?|0z)\s*)?(?:bag|bags|box|boxes|pack|packs|package|packaged|pouch|pouches|cup|cups|tub|tubs|tin|tins|bottle|bottles|can|cans|tray|trays|pan|pans|bulk|container|portion|portions|individually\s+wrapped|individually\s+packaged|wrapped|plastic\s+wrap|sealed|cellophane|foil)$/i.test(clean)
    || /^(?:bag|bags|box|boxes|pack|packet|packets|pouch|pouches|wrapped|individually\s+wrapped|individually\s+packaged|ea|each|dz|dozen|case|cs|tray|pan|portion)$/i.test(clean)
    || /^\d+(?:\.\d+)?\s*(?:oz|0z|g|kg|lbs?|ml)\b/i.test(clean);

  return isMatch;
}

/**
 * Normalizes and strips catering system columns, dates, times, quantities, and portion units.
 */
function cleanCateringMetadata(text: string): string {
  return text
    // 1. Catering Table Quantities & Units (e.g. "375.00 PRS", "1.00 DZ", "500.00 PRS", "2.00 EA", "10.00 PAX", "1.00 DOZ")
    .replace(/\b\d+(?:\.\d+)?\s*(?:PRS|PERS|PERSONS?|PAX|GUEST|GUESTS|DZ|DOZ|DOZEN|EA|EACH|CS|CASE|CASES|KG|LBS?|PK|PACK|PORTIONS?|SERVINGS?|TRAY|TRAYS|PAN|PANS|GAL|BOTTLES?)\b/gi, ' ')
    // 2. Catering Dates (e.g. "29-Jul-26", "29-Jul-2026", "06-Aug-2026", "7/29/26", "2026-07-29")
    .replace(/\b\d{1,2}-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*-\d{2,4}(?:\s+\d{1,2}:\d{2}(?::\d{2})?)?\b/gi, ' ')
    .replace(/\b\d{1,2}\/\d{1,2}\/\d{2,4}(?:\s+\d{1,2}:\d{2})?\b/g, ' ')
    .replace(/\b\d{4}-\d{2}-\d{2}\b/g, ' ')
    // 3. Isolated time stamps at end of line or metadata columns (e.g. "8:12", "16:02")
    .replace(/(?<=\s)\d{1,2}:\d{2}(?::\d{2})?(?=\s|$)/g, ' ')
    // 4. Packaging specs like (5oz bag), (bag), (individually wrapped)
    .replace(/\((?:\d+(?:\.\d+)?\s*(?:oz|0z|g|kg|lbs?|ml)\s*)?(?:bag|bags|box|boxes|pack|pouch|tub|individually\s+wrapped)\)/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts dietary / allergen tags from text and returns both the tag list and text with tags stripped.
 */
function extractDietaryTags(rawText: string): { tags: AllergenKey[]; textWithoutTags: string } {
  const tags: AllergenKey[] = [];
  let text = rawText;

  // 1. Check parenthesized or bracketed dietary acronyms e.g. (GF, DF, V, VE), (DF, V, VE), [GF/DF], (V), (GF)
  const codeTagRegex = /[\(\[]\s*((?:GF|DF|V|VE|VG|CN|NF|SF|HAL|KOS|EG|SOY|SES|PORK|RAW|ORG|KETO|SPICY|ALC)(?:[\s,\/\-–]+(?:GF|DF|V|VE|VG|CN|NF|SF|HAL|KOS|EG|SOY|SES|PORK|RAW|ORG|KETO|SPICY|ALC))*)\s*[\)\]]/gi;
  let match: RegExpExecArray | null;

  while ((match = codeTagRegex.exec(text)) !== null) {
    const parts = match[1].split(/[\s,\/\-]+/);
    for (const p of parts) {
      let cleanTag = p.trim().toUpperCase() as AllergenKey;
      if (cleanTag === ('VG' as any)) cleanTag = 'VE';
      if (ALLERGEN_MAP[cleanTag] && !tags.includes(cleanTag)) {
        tags.push(cleanTag);
      }
    }
  }

  // 2. Full word dietary notes e.g. (Gluten-Free, Dairy-Free), (Vegan), (Vegetarian)
  const wordTagRegex = /[\(\[]\s*([^()\[\]]*(?:Gluten[\s-]Free|Dairy[\s-]Free|Vegan|Vegetarian|Nut[\s-]Free|Halal|Kosher|Contains\s*(?:Nuts?|Peanuts?|Pork)|Plant[\s-]Based)[^()\[\]]*)\s*[\)\]]/gi;
  while ((match = wordTagRegex.exec(text)) !== null) {
    const inner = match[1];
    if (/\b(?:Gluten[\s-]Free|GF)\b/i.test(inner) && !tags.includes('GF')) tags.push('GF');
    if (/\b(?:Dairy[\s-]Free|Lactose[\s-]Free|DF)\b/i.test(inner) && !tags.includes('DF')) tags.push('DF');
    if (/\b(?:Vegan|100%\s*Plant[\s-]Based)\b/i.test(inner) && !tags.includes('VE')) tags.push('VE');
    if (/\b(?:Vegetarian)\b/i.test(inner) && !tags.includes('V') && !tags.includes('VE')) tags.push('V');
    if (/\b(?:Nut[\s-]Free)\b/i.test(inner) && !tags.includes('NF')) tags.push('NF');
    if (/\b(?:Contains\s*Nuts?|Contains\s*Peanuts?|Tree\s*Nuts?)\b/i.test(inner) && !tags.includes('CN')) tags.push('CN');
    if (/\b(?:Contains\s*Pork|Bacon|Prosciutto|Ham)\b/i.test(inner) && !tags.includes('PORK')) tags.push('PORK');
    if (/\b(?:Halal)\b/i.test(inner) && !tags.includes('HAL')) tags.push('HAL');
    if (/\b(?:Kosher)\b/i.test(inner) && !tags.includes('KOS')) tags.push('KOS');
    if (/\b(?:Spicy|Chili|Jalapeño)\b/i.test(inner) && !tags.includes('SPICY')) tags.push('SPICY');
  }

  // Also check un-parenthesized occurrences of distinct words if tags list is empty
  if (tags.length === 0) {
    if (/\bGluten[\s-]Free\b/i.test(text) && !tags.includes('GF')) tags.push('GF');
    if (/\bDairy[\s-]Free\b/i.test(text) && !tags.includes('DF')) tags.push('DF');
    if (/\bVegan\b/i.test(text) && !tags.includes('VE')) tags.push('VE');
    if (/\bVegetarian\b/i.test(text) && !tags.includes('V') && !tags.includes('VE')) tags.push('V');
    if (/\bNut[\s-]Free\b/i.test(text) && !tags.includes('NF')) tags.push('NF');
  }

  // Strip extracted dietary parentheticals so they don't clutter the item title or description
  text = text.replace(codeTagRegex, ' ');
  text = text.replace(wordTagRegex, ' ');
  text = text.replace(/\(\s*\)/g, ' ').replace(/\[\s*\]/g, ' ').replace(/\s+/g, ' ').trim();

  return { tags, textWithoutTags: text };
}

/**
 * Bulletproof BEO & Catering Menu Parser
 * Guarantees exact, clean separation of Menu Title and Culinary Description
 * Handles wrapped lines, BEO timestamps, catering quantities/units, dates, and dashes.
 */
export function parseBeoText(rawText: string, defaultStation = 'Buffet Station'): BuffetItem[] {
  if (!rawText || !rawText.trim()) return [];

  // Normalize line endings
  const normalized = rawText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');

  // Step 1: Chunk lines into Item Blocks & Section Headers
  interface RawChunk {
    type: 'header' | 'item';
    text: string;
  }

  const chunks: RawChunk[] = [];
  let currentItemLines: string[] = [];

  const isScheduleTimestamp = (line: string) =>
    /^\s*\d{1,2}:\d{2}(?:\s*(?:AM|PM|am|pm))?\s*(?:[-–—to\s]+\d{1,2}:\d{2}(?:\s*(?:AM|PM|am|pm))?)?\s+/i.test(line);

  const isSectionHeader = (line: string) =>
    /^(?:={2,}|#{1,3}|\[|\-+\s*)([A-Za-z0-9\s&/\-,]+)(?:\s*-+|\]|={2,}|:)$/i.test(line) ||
    /^(?:STATION|SECTION|COURSE|BUFFET LINE|TABLE|AREA|CATEGORY|BAR)\s*[\d:]?\s*[-–—:]\s*(.+)$/i.test(line);

  const flushCurrentItem = () => {
    if (currentItemLines.length > 0) {
      const combined = currentItemLines.join(' ').trim();
      if (combined.length > 0) {
        chunks.push({ type: 'item', text: combined });
      }
      currentItemLines = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i].trim();
    if (!rawLine) continue;

    // Check for Section Header
    if (isSectionHeader(rawLine)) {
      flushCurrentItem();
      chunks.push({ type: 'header', text: rawLine });
      continue;
    }

    // Check if line starts with a schedule timestamp (e.g. "13:00 14:30 ...")
    if (isScheduleTimestamp(rawLine)) {
      flushCurrentItem();
      currentItemLines.push(rawLine);
      continue;
    }

    // Check if line starts with an explicit bullet point or numbered item (e.g. "• Salmon", "* Chicken", "1. Beef")
    if (/^[•*]\s+[A-Za-z]/.test(rawLine) || /^\d+\.\s+[A-Z]/.test(rawLine)) {
      flushCurrentItem();
      currentItemLines.push(rawLine);
      continue;
    }

    // Check if line contains an explicit pipe separator (e.g. "Title | Description | Price")
    if (rawLine.includes('|') && !rawLine.startsWith('&') && !rawLine.startsWith('(')) {
      flushCurrentItem();
      currentItemLines.push(rawLine);
      continue;
    }

    // Otherwise, this line is a continuation / description wrap of the current item!
    if (currentItemLines.length > 0) {
      currentItemLines.push(rawLine);
    } else {
      // First line without timestamp
      currentItemLines.push(rawLine);
    }
  }

  flushCurrentItem();

  // Step 2: Parse each item chunk with bulletproof precision
  const items: BuffetItem[] = [];
  let currentStation = defaultStation;

  for (const chunk of chunks) {
    if (chunk.type === 'header') {
      const stationMatch = chunk.text.replace(/^[=\-#\[\s]+|[=\-#\]\s:]+$/g, '').trim();
      if (stationMatch && stationMatch.length > 2 && stationMatch.length < 50) {
        currentStation = stationMatch;
      }
      continue;
    }

    let line = chunk.text.trim();
    if (!line) continue;

    // Ignore catering table header labels (e.g. "Time Item Description Qty Price")
    if (/^(?:Time|Item\s+Description|Quantity|Qty|Units?|Guest\s+Count|BEO\s+#)/i.test(line) && line.split(/\s{2,}|\t/).length > 2) {
      continue;
    }

    // Strip start-of-line BEO Schedule Times e.g. "13:00 14:30" or "13:00 - 14:30" or "1:00 PM - 2:30 PM"
    line = line.replace(/^\s*\d{1,2}:\d{2}(?:\s*(?:AM|PM|am|pm))?\s*(?:[-–—to\s]+\d{1,2}:\d{2}(?:\s*(?:AM|PM|am|pm))?)?\s+/i, '');

    // Strip catering columns (e.g. "375.00 PRS 29-Jul-26 8:12", "1.00 DZ 6-Aug-26 16:02", "29-Jul-26 8:12")
    line = cleanCateringMetadata(line);

    // Extract Price / Hosted flag
    let price = '';
    let isHosted = false;
    if (/\b(?:Hosted|Included|Complimentary|Host\s*Bar)\b/i.test(line)) {
      isHosted = true;
      price = 'Hosted';
      line = line.replace(/\b(?:Hosted|Included|Complimentary|Host\s*Bar)\b/gi, ' ').trim();
    }
    const priceMatch = line.match(/\$\s*(\d+(?:\.\d{2})?)/);
    if (priceMatch) {
      price = '$' + priceMatch[1];
      line = line.replace(/\$\s*(\d+(?:\.\d{2})?)/g, ' ').trim();
    }

    // Extract Guest Name if present (e.g. "For: Sarah Jenkins | ...")
    let guestName = '';
    const guestMatch = line.match(/\b(?:For|Guest|Name|Attendee|To|Recipient):\s*([^|,\n]+)/i);
    if (guestMatch) {
      guestName = guestMatch[1].trim();
      line = line.replace(/\b(?:For|Guest|Name|Attendee|To|Recipient):\s*[^|,\n]+/i, ' ').trim();
    }

    // Extract Chef / Prep metadata
    let prepDate = '';
    let useByDate = '';
    let chefName = '';
    const prepMatch = line.match(/\b(?:Prep|Packed|Made|Date):\s*([^|,\n]+)/i);
    if (prepMatch) {
      prepDate = prepMatch[1].trim();
      line = line.replace(/\b(?:Prep|Packed|Made|Date):\s*[^|,\n]+/i, ' ').trim();
    }
    const expMatch = line.match(/\b(?:Best\s*By|Exp|Expires|Use\s*By|Discard):\s*([^|,\n]+)/i);
    if (expMatch) {
      useByDate = expMatch[1].trim();
      line = line.replace(/\b(?:Best\s*By|Exp|Expires|Use\s*By|Discard):\s*[^|,\n]+/i, ' ').trim();
    }
    const chefMatch = line.match(/\b(?:Chef|Prep\s*By|Made\s*By):\s*([^|,\n]+)/i);
    if (chefMatch) {
      chefName = chefMatch[1].trim();
      line = line.replace(/\b(?:Chef|Prep\s*By|Made\s*By):\s*[^|,\n]+/i, ' ').trim();
    }

    // Extract Storage / Temperature instructions
    let storageNote = '';
    const storageMatch = line.match(/\(([^)]*(?:Keep\s*Refrigerated|Serve\s*Chilled|Heat\s*Before\s*Serving|Store\s*Below|Perishable|Keep\s*Frozen|Room\s*Temp)[^)]*)\)/i);
    if (storageMatch) {
      storageNote = storageMatch[1].trim();
      line = line.replace(storageMatch[0], ' ').trim();
    }

    // Extract Dietary / Allergen Tags
    const { tags, textWithoutTags } = extractDietaryTags(line);
    line = textWithoutTags;

    // --- SEPARATE MENU TITLE vs CULINARY DESCRIPTION ---
    let title = '';
    let description = '';

    // Check for parenthetical descriptions first (e.g. "Title (Spring greens, cherry tomatoes...)")
    const parenDescMatch = line.match(/\(([^)]+)\)/);
    if (parenDescMatch) {
      const inner = parenDescMatch[1].trim();
      if (!isInternalPackagingSpec(inner) && inner.length > 2) {
        description = inner;
        line = line.replace(parenDescMatch[0], ' ').trim();
      }
    }

    // Check for Pipe separation (Title | Description)
    if (line.includes('|')) {
      const parts = line.split('|').map((s) => s.trim()).filter(Boolean);
      title = parts[0] || '';
      if (parts[1] && !description) {
        description = parts[1];
      }
    }
    // Check for Dash / En-dash / Em-dash separation (Title - Description or Title – Description)
    else if (/[-–—]\s+/.test(line)) {
      // Find the first occurrence of dash/en-dash/em-dash with space
      const dashMatch = line.match(/^(.+?)\s+[-–—]\s+(.+)$/);
      if (dashMatch) {
        const potentialTitle = dashMatch[1].trim();
        const potentialDesc = dashMatch[2].trim();

        // Check if the title part starts with an Add-on keyword like "*Add" or "Add"
        if (/^\*?(?:Add|Option)\b/i.test(potentialTitle) && potentialTitle.length < 6) {
          title = `${potentialTitle} - ${potentialDesc}`;
        } else {
          title = potentialTitle;
          if (!description) {
            description = potentialDesc;
          } else {
            description = `${potentialDesc} • ${description}`;
          }
        }
      } else {
        title = line;
      }
    }
    // Check for Colon separation (Title: Description)
    else if (/^[A-Za-z0-9\s'’-]+:\s+[A-Za-z]/.test(line)) {
      const colonIndex = line.indexOf(':');
      title = line.substring(0, colonIndex).trim();
      if (!description) {
        description = line.substring(colonIndex + 1).trim();
      }
    }
    // Default: Entire cleaned line is the title
    else {
      title = line;
    }

    // Clean up Title
    title = title
      .replace(/^[\d]+\.\s+/, '') // leading numbers "1. "
      .replace(/^[*•\-–—\s,;:]+/, '') // leading symbols "*", "•", "-"
      .replace(/[*•\-–—\s,;:]+$/, '') // trailing symbols
      .replace(/\s+/g, ' ')
      .trim();

    // Clean up Description
    description = description
      .replace(/^[*•\-–—\s,;:]+/, '')
      .replace(/[*•\-–—\s,;:]+$/, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (isInternalPackagingSpec(description)) {
      description = '';
    }

    // Detect Drink Category & ABV if applicable
    let drinkCategory: 'cocktail' | 'wine' | 'beer' | 'spirit' | 'mocktail' | 'other' | undefined = undefined;
    const combinedSearch = `${currentStation} ${title} ${description}`.toLowerCase();

    if (combinedSearch.includes('cocktail') || combinedSearch.includes('caesar') || combinedSearch.includes('margarita') || combinedSearch.includes('spritz') || combinedSearch.includes('martini') || combinedSearch.includes('old fashioned')) {
      drinkCategory = 'cocktail';
    } else if (combinedSearch.includes('wine') || combinedSearch.includes('sommelier') || combinedSearch.includes('sparkling') || combinedSearch.includes('champagne') || combinedSearch.includes('cabernet') || combinedSearch.includes('chardonnay') || combinedSearch.includes('prosecco')) {
      drinkCategory = 'wine';
    } else if (combinedSearch.includes('beer') || combinedSearch.includes('cider') || combinedSearch.includes('draft') || combinedSearch.includes('lager') || combinedSearch.includes('ipa') || combinedSearch.includes('pilsner')) {
      drinkCategory = 'beer';
    } else if (combinedSearch.includes('spirit') || combinedSearch.includes('liquor') || combinedSearch.includes('whiskey') || combinedSearch.includes('bourbon') || combinedSearch.includes('vodka') || combinedSearch.includes('gin') || combinedSearch.includes('tequila')) {
      drinkCategory = 'spirit';
    } else if (combinedSearch.includes('zero-proof') || combinedSearch.includes('mocktail') || combinedSearch.includes('non-alcoholic') || combinedSearch.includes('juice')) {
      drinkCategory = 'mocktail';
    }

    let drinkAbv = '';
    const abvMatch = `${title} ${description}`.match(/\b(\d+(?:\.\d+)?%\s*ABV)\b/i);
    if (abvMatch) {
      drinkAbv = abvMatch[1];
    }

    if (title.length >= 2) {
      items.push({
        id: generateId(),
        name: formatTitleCase(title),
        description: description,
        tags: tags,
        station: currentStation,
        price: price || undefined,
        drinkCategory: drinkCategory,
        drinkPrice: price || undefined,
        drinkAbv: drinkAbv || undefined,
        isHosted: isHosted,
        guestName: guestName || undefined,
        prepDate: prepDate || undefined,
        useByDate: useByDate || undefined,
        chefName: chefName || undefined,
        storageNote: storageNote || undefined,
      });
    }
  }

  return items;
}

/**
 * Parses tab-delimited or CSV text (e.g. copied from Google Sheets / Excel / PDF tables)
 */
export function parseTableText(rawText: string): BuffetItem[] {
  if (!rawText.trim()) return [];

  const lines = rawText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const items: BuffetItem[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const cols = line.includes('\t')
      ? line.split('\t').map((c) => c.trim())
      : line.split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));

    if (cols.length === 0) continue;

    if (
      i === 0 &&
      (cols[0].toLowerCase() === 'name' ||
        cols[0].toLowerCase() === 'item' ||
        cols[0].toLowerCase() === 'dish' ||
        cols[0].toLowerCase() === 'drink')
    ) {
      continue;
    }

    const name = cols[0] || '';
    let description = cols[1] || '';
    if (description && isInternalPackagingSpec(description)) {
      description = '';
    }
    const rawTags = cols[2] || '';
    const station = cols[3] || 'Buffet';
    const price = cols[4] || '';
    const guestName = cols[5] || undefined;
    const prepDate = cols[6] || undefined;

    if (!name) continue;

    const tags: AllergenKey[] = [];
    if (rawTags) {
      const splitTags = rawTags.split(/[,;\s/]+/);
      for (const t of splitTags) {
        const upper = t.trim().toUpperCase() as AllergenKey;
        if (ALLERGEN_MAP[upper] && !tags.includes(upper)) {
          tags.push(upper);
        }
      }
    }

    items.push({
      id: generateId(),
      name: formatTitleCase(name),
      description: description,
      tags: tags,
      station: station,
      price: price,
      guestName: guestName,
      prepDate: prepDate,
    });
  }

  return items;
}
