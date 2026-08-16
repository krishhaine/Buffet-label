import { AllergenInfo, AllergenKey } from '../types/buffet';

export const DEFAULT_ALLERGENS: Record<string, AllergenInfo> = {
  GF: {
    code: 'GF',
    label: 'Gluten-Free',
    fullTitle: 'Gluten-Free (No Wheat / Barley / Rye)',
    icon: '🌾',
    category: 'dietary',
    badgeClass: 'bg-amber-50 text-amber-900 border-amber-300',
    dotColor: '#d97706',
  },
  DF: {
    code: 'DF',
    label: 'Dairy-Free',
    fullTitle: 'Dairy-Free (Lactose-Free)',
    icon: '🥛',
    category: 'allergen',
    badgeClass: 'bg-sky-50 text-sky-900 border-sky-300',
    dotColor: '#0284c7',
  },
  V: {
    code: 'V',
    label: 'Vegetarian',
    fullTitle: 'Vegetarian (Lacto-Ovo)',
    icon: '🌱',
    category: 'dietary',
    badgeClass: 'bg-emerald-50 text-emerald-900 border-emerald-300',
    dotColor: '#059669',
  },
  VE: {
    code: 'VE',
    label: 'Vegan',
    fullTitle: '100% Plant-Based / Vegan',
    icon: '🌿',
    category: 'dietary',
    badgeClass: 'bg-teal-50 text-teal-900 border-teal-300',
    dotColor: '#0d9488',
  },
  CN: {
    code: 'CN',
    label: 'Contains Nuts',
    fullTitle: 'Contains Tree Nuts or Peanuts',
    icon: '🥜',
    category: 'allergen',
    badgeClass: 'bg-rose-50 text-rose-900 border-rose-300',
    dotColor: '#e11d48',
  },
  NF: {
    code: 'NF',
    label: 'Nut-Free',
    fullTitle: 'Nut-Free Certified Recipe',
    icon: '🚫🥜',
    category: 'allergen',
    badgeClass: 'bg-green-50 text-green-900 border-green-300',
    dotColor: '#16a34a',
  },
  SF: {
    code: 'SF',
    label: 'Seafood',
    fullTitle: 'Contains Fish or Crustacean Shellfish',
    icon: '🦐',
    category: 'allergen',
    badgeClass: 'bg-cyan-50 text-cyan-900 border-cyan-300',
    dotColor: '#0891b2',
  },
  EG: {
    code: 'EG',
    label: 'Contains Egg',
    fullTitle: 'Contains Eggs or Egg Products',
    icon: '🥚',
    category: 'allergen',
    badgeClass: 'bg-yellow-50 text-yellow-900 border-yellow-300',
    dotColor: '#ca8a04',
  },
  SOY: {
    code: 'SOY',
    label: 'Contains Soy',
    fullTitle: 'Contains Soy / Soybeans / Edamame',
    icon: '🫘',
    category: 'allergen',
    badgeClass: 'bg-indigo-50 text-indigo-900 border-indigo-300',
    dotColor: '#4f46e5',
  },
  SES: {
    code: 'SES',
    label: 'Sesame',
    fullTitle: 'Contains Sesame Seeds or Tahini',
    icon: '🌾',
    category: 'allergen',
    badgeClass: 'bg-orange-50 text-orange-900 border-orange-300',
    dotColor: '#ea580c',
  },
  PORK: {
    code: 'PORK',
    label: 'Pork',
    fullTitle: 'Contains Pork, Bacon, Ham, or Gelatin',
    icon: '🥓',
    category: 'dietary',
    badgeClass: 'bg-red-50 text-red-900 border-red-300',
    dotColor: '#dc2626',
  },
  HAL: {
    code: 'HAL',
    label: 'Halal',
    fullTitle: 'Halal Certified / Compliant',
    icon: '☪️',
    category: 'religious',
    badgeClass: 'bg-lime-50 text-lime-900 border-lime-300',
    dotColor: '#65a30d',
  },
  KOS: {
    code: 'KOS',
    label: 'Kosher',
    fullTitle: 'Kosher Certified / Pareve',
    icon: '✡️',
    category: 'religious',
    badgeClass: 'bg-blue-50 text-blue-900 border-blue-300',
    dotColor: '#2563eb',
  },
  RAW: {
    code: 'RAW',
    label: 'Raw / Undercooked',
    fullTitle: 'Contains Raw or Undercooked Protein Advisory',
    icon: '⚠️',
    category: 'advisory',
    badgeClass: 'bg-purple-50 text-purple-900 border-purple-300',
    dotColor: '#9333ea',
  },
  ORG: {
    code: 'ORG',
    label: 'Organic',
    fullTitle: '100% Certified Organic Ingredients',
    icon: '🍃',
    category: 'dietary',
    badgeClass: 'bg-emerald-50 text-emerald-950 border-emerald-400',
    dotColor: '#059669',
  },
  KETO: {
    code: 'KETO',
    label: 'Keto Friendly',
    fullTitle: 'Ketogenic / Low Net Carb (<5g)',
    icon: '🥑',
    category: 'dietary',
    badgeClass: 'bg-stone-100 text-stone-900 border-stone-300',
    dotColor: '#57534e',
  },
  SPICY: {
    code: 'SPICY',
    label: 'Spicy',
    fullTitle: 'Mild to High Chili Heat',
    icon: '🌶️',
    category: 'advisory',
    badgeClass: 'bg-rose-50 text-rose-950 border-rose-300',
    dotColor: '#e11d48',
  },
  ALC: {
    code: 'ALC',
    label: 'Contains Alcohol',
    fullTitle: 'Infused with Wine, Beer, or Spirits',
    icon: '🍷',
    category: 'advisory',
    badgeClass: 'bg-violet-50 text-violet-900 border-violet-300',
    dotColor: '#7c3aed',
  },
};

const STORAGE_CUSTOM_ALLERGENS = 'buffet_custom_allergens_v5';

// Load saved allergens dictionary
export function loadAllergenRegistry(): Record<string, AllergenInfo> {
  try {
    const saved = localStorage.getItem(STORAGE_CUSTOM_ALLERGENS);
    if (saved) {
      const parsed = JSON.parse(saved);
      return { ...DEFAULT_ALLERGENS, ...parsed };
    }
  } catch (e) {
    console.error('Error loading custom allergens:', e);
  }
  return { ...DEFAULT_ALLERGENS };
}

// Save custom allergens dictionary
export function saveAllergenRegistry(registry: Record<string, AllergenInfo>): void {
  try {
    localStorage.setItem(STORAGE_CUSTOM_ALLERGENS, JSON.stringify(registry));
  } catch (e) {
    console.error('Error saving custom allergens:', e);
  }
}

// Runtime active map
export let ALLERGEN_MAP: Record<string, AllergenInfo> = loadAllergenRegistry();

export function refreshAllergenMap(): Record<string, AllergenInfo> {
  ALLERGEN_MAP = loadAllergenRegistry();
  return ALLERGEN_MAP;
}

export function getAllAllergenKeys(): string[] {
  return Object.keys(ALLERGEN_MAP);
}

export const COMMON_ALLERGEN_KEYS: AllergenKey[] = [
  'GF', 'DF', 'V', 'VE', 'CN', 'NF', 'SF', 'HAL', 'KOS', 'EG', 'PORK', 'SPICY', 'KETO', 'ORG'
];

export function getAllergenInfo(code: string): AllergenInfo {
  if (!code) {
    return {
      code: '',
      label: '',
      fullTitle: '',
      icon: '🏷️',
      category: 'dietary',
      badgeClass: 'bg-slate-100 text-slate-700 border-slate-300',
      dotColor: '#64748b',
    };
  }

  const upper = code.trim().toUpperCase();
  if (ALLERGEN_MAP[upper]) {
    return ALLERGEN_MAP[upper];
  }

  // Fallback for ad-hoc custom dietary tag
  return {
    code: upper,
    label: code,
    fullTitle: `${code} (Custom Dietary Tag)`,
    icon: '🏷️',
    category: 'dietary',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    dotColor: '#64748b',
  };
}

export function getDietaryDisplayText(
  info: AllergenInfo,
  format: 'code' | 'full' | 'both' | 'code-full-parens' = 'code'
): string {
  const code = info.code || '';
  const label = info.label || code;

  if (!code && !label) return '';
  if (format === 'full') return label;
  if (format === 'both') return `${code} • ${label}`;
  if (format === 'code-full-parens') return `${code} (${label})`;
  return code;
}

