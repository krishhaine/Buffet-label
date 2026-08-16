export interface PresetLogo {
  id: string;
  name: string;
  svgDataUri: string;
}

export const PRESET_LOGOS: PresetLogo[] = [
  {
    id: 'laurel_crest',
    name: 'Royal Laurel & Crown',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" fill="%23d4af37"><path d="M50 4 L53 10 L60 11 L55 16 L56 23 L50 19 L44 23 L45 16 L40 11 L47 10 Z"/><circle cx="32" cy="15" r="3"/><circle cx="68" cy="15" r="3"/><path d="M20 18 C28 22, 38 22, 45 17" stroke="%23d4af37" stroke-width="1.5" fill="none"/><path d="M80 18 C72 22, 62 22, 55 17" stroke="%23d4af37" stroke-width="1.5" fill="none"/></svg>`,
  },
  {
    id: 'artisan_fork',
    name: 'Artisan Culinary & Cloche',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" fill="%232c3e50"><circle cx="50" cy="8" r="2"/><path d="M35 22 C35 14, 65 14, 65 22 Z" fill="%232c3e50"/><line x1="32" y1="24" x2="68" y2="24" stroke="%232c3e50" stroke-width="2"/></svg>`,
  },
  {
    id: 'grand_hotel',
    name: 'Five Star Hotel Monogram',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" fill="%231e293b"><text x="50" y="20" font-family="serif" font-size="18" font-weight="bold" text-anchor="middle" letter-spacing="4">H &middot; M</text></svg>`,
  },
  {
    id: 'botanical_leaf',
    name: 'Botanical Leaf & Herb',
    svgDataUri: `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 30" fill="%23059669"><path d="M42 22 C42 12, 50 8, 58 8 C58 18, 50 22, 42 22 Z"/><path d="M58 8 C58 18, 52 24, 46 25" stroke="%23059669" stroke-width="1.5" fill="none"/></svg>`,
  },
];
