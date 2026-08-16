import { BuffetItem, DualLanguageMode } from '../types/buffet';

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const PRIMARY_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English (US/UK)', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
];

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh', name: 'Chinese (Simplified)', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
  { code: 'el', name: 'Greek', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
];

// Rich culinary, banquet, bar, snacks, and catering dictionary
const CULINARY_DICTIONARY: Record<string, Record<string, string>> = {
  // Popcorn, Chips & Snack Break Items
  'Gourmet Seasoned Popcorn - Canadian Maple and Sea Salt': {
    fr: 'Popcorn Assaisonné Gourmand - Érable Canadien et Sel de Mer',
    es: 'Palomitas Sazonadas Gourmet - Arce Canadiense y Sal Marina',
    it: 'Popcorn Condito Gourmet - Acero Canadese e Sale Marino',
    de: 'Gourmet-Popcorn - Kanadischer Ahorn & Meersalz',
    ja: 'グルメポップコーン - カナディアンメープル＆シーソルト',
    zh: '风味爆米花 - 加拿大枫糖与海盐',
    pt: 'Pipoca Gourmet - Bordo Canadense e Sal Marinho',
  },
  'Gourmet Seasoned Popcorn - Caramel': {
    fr: 'Popcorn Assaisonné Gourmand - Caramel',
    es: 'Palomitas Sazonadas Gourmet - Caramelo',
    it: 'Popcorn Condito Gourmet - Caramello',
    de: 'Gourmet-Popcorn - Karamell',
    ja: 'グルメポップコーン - キャラメル',
    zh: '风味爆米花 - 焦糖风味',
    pt: 'Pipoca Gourmet - Caramelo',
  },
  'Gourmet Seasoned Popcorn - Gourmet Buttered': {
    fr: 'Popcorn Assaisonné Gourmand - Au Beurre Fin',
    es: 'Palomitas Sazonadas Gourmet - Mantequilla Fina',
    it: 'Popcorn Condito Gourmet - Al Burro Pregiato',
    de: 'Gourmet-Popcorn - Feine Butter',
    ja: 'グルメポップコーン - リッチバター',
    zh: '风味爆米花 - 浓郁黄油',
    pt: 'Pipoca Gourmet - Manteiga Especial',
  },
  'Gourmet Potato Chips - Smokehouse BBQ': {
    fr: 'Croustilles Artisanales - BBQ Fumoir',
    es: 'Papas Fritas Gourmet - Barbacoa Ahumada',
    it: 'Patatine Artigianali - BBQ Affumicato',
    de: 'Gourmet-Kartoffelchips - Rauchhaus-BBQ',
    ja: 'グルメポテトチップス - スモークハウスBBQ',
    zh: '手工薯片 - 烟熏烧烤风味',
    pt: 'Batatas Chips Gourmet - BBQ Defumado',
  },
  'Gourmet Potato Chips - Sea Salt & Vinegar': {
    fr: 'Croustilles Artisanales - Sel de Mer et Vinaigre',
    es: 'Papas Fritas Gourmet - Sal Marina y Vinagre',
    it: 'Patatine Artigianali - Sale Marino e Aceto',
    de: 'Gourmet-Kartoffelchips - Meersalz & Essig',
    ja: 'グルメポテトチップス - シーソルト＆ビネガー',
    zh: '手工薯片 - 海盐与黑醋',
    pt: 'Batatas Chips Gourmet - Sal Marinho e Vinagre',
  },
  'Gourmet Potato Chips - Honey Mustard': {
    fr: 'Croustilles Artisanales - Moutarde au Miel',
    es: 'Papas Fritas Gourmet - Mostaza y Miel',
    it: 'Patatine Artigianali - Senape al Miele',
    de: 'Gourmet-Kartoffelchips - Honig-Senf',
    ja: 'グルメポテトチップス - ハニーマスタード',
    zh: '手工薯片 - 蜂蜜芥末风味',
    pt: 'Batatas Chips Gourmet - Mostarda e Mel',
  },
  'Gourmet Potato Chips - Sour Cream Herb & Onion': {
    fr: 'Croustilles Artisanales - Crème Sure, Fines Herbes et Oignon',
    es: 'Papas Fritas Gourmet - Crema Agria, Hierbas y Cebolla',
    it: 'Patatine Artigianali - Panna Acida, Erbe e Cipolla',
    de: 'Gourmet-Kartoffelchips - Sauerrahm, Kräuter & Zwiebel',
    ja: 'グルメポテトチップス - サワークリーム ハーブ＆オニオン',
    zh: '手工薯片 - 酸奶油香草洋葱',
    pt: 'Batatas Chips Gourmet - Creme Azedo, Ervas e Cebola',
  },

  // Banquet & Entree Items
  'Herb Crusted Salmon': {
    es: 'Salmón en Costra de Hierbas',
    fr: "Saumon en Croûte d'Herbes",
    it: "Salmone in Crosta d'Erbe",
    de: 'Lachs in Kräuterkruste',
    ja: 'ハーブ香るサーモンのロースト',
    zh: '香草烤三文鱼',
    ar: 'سلمون بقشرة الأعشاب',
    pt: 'Salmão em Crosta de Ervas',
  },
  'Prime Rib of Beef': {
    es: 'Costillar de Res de Primera',
    fr: 'Côte de Bœuf Première Qualité',
    it: 'Costata di Manzo Prima Scelta',
    de: 'Premium Rinderrippenbraten',
    ja: 'プライムリブ ローストビーフ',
    zh: '特级牛肋排',
    ar: 'ضلع اللحم البقري الممتاز',
    pt: 'Prime Rib de Novilho',
  },
  'Truffle Mushroom Risotto': {
    es: 'Risotto de Hongos con Trufa',
    fr: 'Risotto aux Champignons et Truffe',
    it: 'Risotto ai Funghi e Tartufo',
    de: 'Trüffel-Pilz-Risotto',
    ja: 'トリュフと茸のリゾット',
    zh: '松露蘑菇烩饭',
    ar: 'ريزوتو الفطر بالكمأة',
    pt: 'Risoto de Cogumelos com Trufa',
  },
  'Roasted Baby Carrots': {
    es: 'Zanahorias Baby Asadas',
    fr: 'Carottes Fanes Rôties',
    it: 'Baby Carote Arrostite',
    de: 'Geröstete Babykarotten',
    ja: 'ローストベビーキャロット',
    zh: '烤迷你胡萝卜',
    ar: 'جزر صغير محمص',
    pt: 'Cenouras Baby Assadas',
  },
  'Charcuterie & Artisan Cheese Board': {
    es: 'Tabla de Embutidos y Quesos Artesanales',
    fr: 'Planche de Charcuterie et Fromages Artisanaux',
    it: 'Tagliere di Salumi e Formaggi Artigianali',
    de: 'Charcuterie- & Käseplatte',
    ja: 'シャルキュトリーと職人チーズの盛り合わせ',
    zh: '熟食冷肉与手工奶酪拼盘',
    ar: 'طبق اللحوم الباردة والأجبان الفاخرة',
    pt: 'Tábua de Frios e Queijos Artesanais',
  },
  'Mini Dark Chocolate Mousse Tart': {
    es: 'Mini Tartaleta de Mousse de Chocolate Negro',
    fr: 'Mini Tartelette Mousse Chocolat Noir',
    it: 'Mini Crostatina con Mousse al Cioccolato Fondente',
    de: 'Mini-Zartbitterschokoladen-Mousse-Törtchen',
    ja: 'ミニ ダークチョコレート ムースタルト',
    zh: '黑巧克力慕斯小挞',
    ar: 'تارت موس الشوكولاتة الداكنة الصغيرة',
    pt: 'Mini Torta de Mousse de Chocolate Amargo',
  },
  'Artisan Salad': {
    es: 'Ensalada Artesanal',
    fr: 'Salade Artisanale',
    it: 'Insalata Artigianale',
    de: 'Artisan Salat',
    ja: 'アルチザン サラダ',
    zh: '精选手工沙拉',
    ar: 'سلطة فاخرة',
    pt: 'Salada Artesanal',
  },
  'Smoked Old Fashioned': {
    es: 'Old Fashioned Ahumado',
    fr: 'Old Fashioned Fumé',
    it: 'Old Fashioned Affumicato',
    de: 'Geräucherter Old Fashioned',
    ja: 'スモークド オールドファッション',
    zh: '烟熏古典鸡尾酒',
    ar: 'أولد فاشند مدخن',
    pt: 'Old Fashioned Defumado',
  },
  'Espresso Martini': {
    es: 'Martini de Café Espresso',
    fr: 'Espresso Martini',
    it: 'Espresso Martini',
    de: 'Espresso Martini',
    ja: 'エスプレッソ マティーニ',
    zh: '浓缩咖啡马天尼',
    ar: 'إسبريسو مارتيني',
    pt: 'Martini de Café Expresso',
  },
  'Sparkling French 75': {
    es: 'French 75 Espumoso',
    fr: 'French 75 Pétillant',
    it: 'French 75 Frizzante',
    de: 'Perlender French 75',
    ja: 'フレンチ75 スパークリング',
    zh: '法式75号气泡鸡尾酒',
    ar: 'فرنش 75 فوار',
    pt: 'French 75 Espumante',
  },
  'Chef’s Signature Entrée': {
    es: 'Plato Principal del Chef',
    fr: 'Plat Signature du Chef',
    it: 'Piatto d’Autore dello Chef',
    de: 'Chefkoch Spezialität',
    ja: 'シェフ特製メインディッシュ',
    zh: '主厨招牌主菜',
    ar: 'طبق الشيف الرئيسي',
    pt: 'Prato de Assinatura do Chef',
  },
  'Artisan Deli Sandwich Box': {
    es: 'Caja de Sándwich Gourmet',
    fr: 'Coffret Sandwich Gourmand',
    it: 'Box Sandwich Artigianale',
    de: 'Feinkost-Sandwich-Box',
    ja: 'デリサンドイッチ ボックス',
    zh: '手工熟食三明治精选盒',
    ar: 'صندوق ساندويتش فاخر',
    pt: 'Caixa de Sanduíche Gourmet',
  },
  'House Herb Garlic Aioli': {
    es: 'Alioli Casero de Ajo y Hierbas',
    fr: "Aïoli Maison à l'Ail et aux Herbes",
    it: "Aioli della Casa all'Aglio ed Erbe",
    de: 'Hausgemachtes Kräuter-Knoblauch-Aioli',
    ja: '自家製ハーブガーリックアイオリ',
    zh: '自制香草大蒜蛋黄酱',
    ar: 'صلصة الأيولي بالأعشاب والثوم',
    pt: 'Aioli Caseiro de Alho e Ervas',
  },
};

// Word-level and phrase-level glossary for instant offline fallback assembly
const CULINARY_TERMS: Record<string, Record<string, string>> = {
  'gourmet': { fr: 'Gourmand', es: 'Gourmet', it: 'Gourmet', de: 'Gourmet' },
  'seasoned popcorn': { fr: 'Popcorn Assaisonné', es: 'Palomitas Sazonadas', it: 'Popcorn Condito', de: 'Gewürztes Popcorn' },
  'popcorn': { fr: 'Popcorn', es: 'Palomitas', it: 'Popcorn', de: 'Popcorn' },
  'potato chips': { fr: 'Croustilles Artisanales', es: 'Papas Fritas', it: 'Patatine', de: 'Kartoffelchips' },
  'chips': { fr: 'Croustilles', es: 'Chips', it: 'Patatine', de: 'Chips' },
  'canadian maple and sea salt': { fr: 'Érable Canadien et Sel de Mer', es: 'Arce Canadiense y Sal Marina', it: 'Acero Canadese e Sale Marino', de: 'Kanadischer Ahornsirup & Meersalz' },
  'canadian maple & sea salt': { fr: 'Érable Canadien et Sel de Mer', es: 'Arce Canadiense y Sal Marina', it: 'Acero Canadese e Sale Marino', de: 'Kanadischer Ahornsirup & Meersalz' },
  'caramel': { fr: 'Caramel', es: 'Caramelo', it: 'Caramello', de: 'Karamell' },
  'gourmet buttered': { fr: 'Au Beurre Fin', es: 'Con Mantequilla Fina', it: 'Al Burro Pregiato', de: 'Feine Butter' },
  'buttered': { fr: 'Au Beurre', es: 'Con Mantequilla', it: 'Al Burro', de: 'Gebuttert' },
  'smokehouse bbq': { fr: 'BBQ Fumoir', es: 'Barbacoa Ahumada', it: 'BBQ Affumicato', de: 'Räucherhaus-BBQ' },
  'bbq': { fr: 'Barbecue', es: 'Barbacoa', it: 'Barbecue', de: 'Barbecue' },
  'sea salt & vinegar': { fr: 'Sel de Mer et Vinaigre', es: 'Sal Marina y Vinagre', it: 'Sale Marino e Aceto', de: 'Meersalz & Essig' },
  'sea salt and vinegar': { fr: 'Sel de Mer et Vinaigre', es: 'Sal Marina y Vinagre', it: 'Sale Marino e Aceto', de: 'Meersalz & Essig' },
  'honey mustard': { fr: 'Moutarde au Miel', es: 'Mostaza y Miel', it: 'Senape e Miele', de: 'Honig-Senf' },
  'sour cream herb & onion': { fr: 'Crème Sure, Fines Herbes et Oignon', es: 'Crema Agria, Hierbas y Cebolla', it: 'Panna Acida, Erbe e Cipolla', de: 'Sauerrahm, Kräuter & Zwiebel' },
  'sour cream & onion': { fr: 'Crème Sure et Oignon', es: 'Crema Agria y Cebolla', it: 'Panna Acida e Cipolla', de: 'Sauerrahm & Zwiebel' },
  'fresh': { fr: 'Frais', es: 'Fresco', it: 'Fresco', de: 'Frisch' },
  'artisan': { fr: 'Artisanal', es: 'Artesanal', it: 'Artigianale', de: 'Handwerklich' },
  'organic': { fr: 'Biologique', es: 'Orgánico', it: 'Biologico', de: 'Bio' },
  'grilled': { fr: 'Grillé', es: 'A la Parrilla', it: 'Alla Griglia', de: 'Gegrillt' },
  'roasted': { fr: 'Rôti', es: 'Asado', it: 'Arrosto', de: 'Geröstet' },
  'smoked': { fr: 'Fumé', es: 'Ahumado', it: 'Affumicato', de: 'Geräuchert' },
  'baked': { fr: 'Cuit au Four', es: 'Horneado', it: 'Al Forno', de: 'Gebacken' },
  'salad': { fr: 'Salade', es: 'Ensalada', it: 'Insalata', de: 'Salat' },
  'soup': { fr: 'Soupe', es: 'Sopa', it: 'Zuppa', de: 'Suppe' },
  'sandwich': { fr: 'Sandwich', es: 'Sándwich', it: 'Panino', de: 'Sandwich' },
  'sauce': { fr: 'Sauce', es: 'Salsa', it: 'Salsa', de: 'Soße' },
  'dessert': { fr: 'Dessert', es: 'Postre', it: 'Dolce', de: 'Dessert' },
  'coffee': { fr: 'Café', es: 'Café', it: 'Caffè', de: 'Kaffee' },
  'tea': { fr: 'Thé', es: 'Té', it: 'Tè', de: 'Tee' },
};

/**
 * Intelligent decomposition translation helper for compound titles like "Gourmet Seasoned Popcorn - Canadian Maple and Sea Salt"
 */
function translateByCompoundRules(text: string, targetLang: string): string | null {
  const clean = text.trim();
  const lower = clean.toLowerCase();

  // Direct term check
  if (CULINARY_TERMS[lower] && CULINARY_TERMS[lower][targetLang]) {
    return CULINARY_TERMS[lower][targetLang];
  }

  // Handle hyphen / dash separated dishes (e.g. "Category - Flavor" like "Gourmet Seasoned Popcorn - Canadian Maple and Sea Salt")
  if (clean.includes(' - ') || clean.includes(' – ') || clean.includes(' — ')) {
    const separator = clean.includes(' - ') ? ' - ' : clean.includes(' – ') ? ' – ' : ' — ';
    const parts = clean.split(separator);
    const translatedParts: string[] = [];

    for (const part of parts) {
      const partLower = part.trim().toLowerCase();
      if (CULINARY_TERMS[partLower] && CULINARY_TERMS[partLower][targetLang]) {
        translatedParts.push(CULINARY_TERMS[partLower][targetLang]);
      } else {
        // Translate sub-parts
        let subPart = part.trim();
        for (const [termKey, termTrans] of Object.entries(CULINARY_TERMS)) {
          const reg = new RegExp(`\\b${termKey}\\b`, 'gi');
          if (reg.test(subPart) && termTrans[targetLang]) {
            subPart = subPart.replace(reg, termTrans[targetLang]);
          }
        }
        translatedParts.push(subPart);
      }
    }

    if (translatedParts.length === parts.length) {
      return translatedParts.join(' - ');
    }
  }

  return null;
}

/**
 * Translates a single text string into the target language.
 * Uses local high-priority culinary dictionary first, then compound rules, then falls back to translation API.
 */
export async function translateText(text: string, targetLang: string): Promise<string> {
  if (!text || !text.trim()) return '';

  const cleanText = text.trim();

  // 1. Direct Dictionary Match
  if (CULINARY_DICTIONARY[cleanText] && CULINARY_DICTIONARY[cleanText][targetLang]) {
    return CULINARY_DICTIONARY[cleanText][targetLang];
  }

  // 2. Case-insensitive dictionary check
  const lower = cleanText.toLowerCase();
  for (const [key, val] of Object.entries(CULINARY_DICTIONARY)) {
    if (key.toLowerCase() === lower && val[targetLang]) {
      return val[targetLang];
    }
  }

  // 3. Compound culinary rules match (instant & offline)
  const compoundMatch = translateByCompoundRules(cleanText, targetLang);
  if (compoundMatch) {
    return compoundMatch;
  }

  // 4. Google Translate Web API
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${encodeURIComponent(
      targetLang
    )}&dt=t&q=${encodeURIComponent(cleanText)}`;

    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && Array.isArray(data[0])) {
        const translatedParts = data[0].map((item: any) => item[0]).filter(Boolean);
        const result = translatedParts.join('').trim();
        if (result && result.toLowerCase() !== cleanText.toLowerCase()) {
          return result;
        }
      }
    }
  } catch (err) {
    // network fallback continues
  }

  // 5. MyMemory Translation API fallback
  try {
    const mmUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(cleanText)}&langpair=en|${encodeURIComponent(targetLang)}`;
    const mmRes = await fetch(mmUrl);
    if (mmRes.ok) {
      const mmData = await mmRes.json();
      if (mmData?.responseData?.translatedText) {
        return mmData.responseData.translatedText.trim();
      }
    }
  } catch (e) {
    // continue
  }

  // 6. Return compound or original
  return compoundMatch || cleanText;
}

/**
 * Batch translates all buffet items for Dual-Language printing,
 * preserving original names and descriptions so users can reset back anytime.
 */
export async function translateAllItems(
  items: BuffetItem[],
  targetLang: string,
  onProgress?: (current: number, total: number) => void
): Promise<BuffetItem[]> {
  const updatedItems: BuffetItem[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (onProgress) onProgress(i + 1, items.length);

    try {
      // Store original values before first translation if not already set
      const origName = item.originalName || item.name;
      const origDesc = item.originalDesc !== undefined ? item.originalDesc : item.description;

      const translatedName = await translateText(origName, targetLang);
      let translatedDesc = '';
      if (origDesc) {
        translatedDesc = await translateText(origDesc, targetLang);
      }

      updatedItems.push({
        ...item,
        name: origName,
        description: origDesc,
        originalName: origName,
        originalDesc: origDesc,
        translationName: translatedName,
        translationDesc: translatedDesc,
        translationLang: targetLang,
      });
    } catch (e) {
      console.error(`Error translating item ${item.name}:`, e);
      updatedItems.push(item);
    }
  }

  return updatedItems;
}

/**
 * Resets all items back to their default / original language,
 * clearing translation fields and restoring original titles and descriptions.
 */
export function resetToDefaultLanguage(items: BuffetItem[]): BuffetItem[] {
  return items.map((item) => ({
    ...item,
    name: item.originalName || item.name,
    description: item.originalDesc !== undefined ? item.originalDesc : item.description,
    translationName: '',
    translationDesc: '',
    translationLang: '',
    isTranslatedCard: false,
    cardLanguage: undefined,
  }));
}

/**
 * Swaps primary and secondary languages on all items
 */
export function swapItemLanguages(items: BuffetItem[]): BuffetItem[] {
  return items.map((item) => {
    if (!item.translationName) return item;
    return {
      ...item,
      name: item.translationName,
      description: item.translationDesc || '',
      translationName: item.name,
      translationDesc: item.description || '',
    };
  });
}

/**
 * Generates the expanded list of BuffetItems according to the selected Dual Language Mode:
 * - 'single_dual': Returns original items (both languages appear on single card)
 * - 'separate_paired': Returns [Item1_Primary, Item1_Secondary, Item2_Primary, Item2_Secondary, ...]
 * - 'separate_batched': Returns [All_Primary_Items, All_Secondary_Items]
 * - 'secondary_only': Returns items with secondary language replacing primary content
 */
export function generateProcessedItemsForPrint(
  items: BuffetItem[],
  showDualLanguage: boolean,
  dualLanguageMode: DualLanguageMode,
  targetLang: string,
  primaryLang: string = 'en'
): BuffetItem[] {
  if (!showDualLanguage || !items.length) {
    return items;
  }

  const primInfo = PRIMARY_LANGUAGES.find((l) => l.code === primaryLang) || PRIMARY_LANGUAGES[0];
  const secInfo = SUPPORTED_LANGUAGES.find((l) => l.code === targetLang) || SUPPORTED_LANGUAGES[0];

  // 1. Single card with dual languages (Both English and Target language on same label)
  if (dualLanguageMode === 'single_dual') {
    return items;
  }

  // 2. Secondary Language Only (100% replacement)
  if (dualLanguageMode === 'secondary_only') {
    return items.map((item) => ({
      ...item,
      id: `sec_${item.id}`,
      parentItemId: item.id,
      name: item.translationName || item.name,
      description: item.translationDesc !== undefined && item.translationDesc !== '' ? item.translationDesc : item.description,
      isTranslatedCard: true,
      cardLanguage: secInfo.name,
    }));
  }

  // 3. Separate Paired (Interleaved: Card 1 EN, Card 2 ES, Card 3 EN, Card 4 ES...)
  if (dualLanguageMode === 'separate_paired') {
    const paired: BuffetItem[] = [];
    items.forEach((item) => {
      // Primary card
      paired.push({
        ...item,
        id: `prim_${item.id}`,
        parentItemId: item.id,
        name: item.originalName || item.name,
        description: item.originalDesc !== undefined ? item.originalDesc : item.description,
        isTranslatedCard: false,
        cardLanguage: primInfo.name,
      });

      // Secondary card
      paired.push({
        ...item,
        id: `sec_${item.id}`,
        parentItemId: item.id,
        name: item.translationName || item.name,
        description: item.translationDesc !== undefined && item.translationDesc !== '' ? item.translationDesc : item.description,
        isTranslatedCard: true,
        cardLanguage: secInfo.name,
      });
    });
    return paired;
  }

  // 4. Separate Batched (All Primary cards first, then All Secondary cards)
  if (dualLanguageMode === 'separate_batched') {
    const primaryCards = items.map((item) => ({
      ...item,
      id: `prim_${item.id}`,
      parentItemId: item.id,
      name: item.originalName || item.name,
      description: item.originalDesc !== undefined ? item.originalDesc : item.description,
      isTranslatedCard: false,
      cardLanguage: primInfo.name,
    }));

    const secondaryCards = items.map((item) => ({
      ...item,
      id: `sec_${item.id}`,
      parentItemId: item.id,
      name: item.translationName || item.name,
      description: item.translationDesc !== undefined && item.translationDesc !== '' ? item.translationDesc : item.description,
      isTranslatedCard: true,
      cardLanguage: secInfo.name,
    }));

    return [...primaryCards, ...secondaryCards];
  }

  return items;
}
