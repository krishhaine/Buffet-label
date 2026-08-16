export type CardShape = 
  | 'rectangle'       // Classic sharp rectangle (3.5" x 2.0" default)
  | 'rounded-rect'    // Modern curved corners
  | 'square'          // Square card/tag (e.g. 2.5" x 2.5")
  | 'circle'          // Circular round badge & seal (e.g. 2.5" or 2.0" dia)
  | 'oval'            // Oval / Ellipse (e.g. 3.25" x 2.0")
  | 'semi-circle'     // Arch / Dome shape for luxury buffet stands
  | 'tent'            // Center fold standing tent card (3.5" x 4.0")
  | 'sheet-letter'    // Full 8.5" x 11" Menu / Bar Sheet Poster
  | 'sticker-rect'    // Standard adhesive box & container sticker (4.0" x 2.0")
  | 'sticker-compact' // Compact prep & jar label (2.625" x 1.0")
  | 'custom';         // Fully user-defined dimensions

export type PrintSides = 'single' | 'double'; // One-sided vs Double-sided duplex

export type StudioMode = 
  | 'buffet'          // Guest-facing buffet cards & luxury tent displays (3.5"x2", 3.5"x4")
  | 'full_menu_sheet' // 8.5" x 11" Full Menu Sheet or Single Feature Dish Display
  | 'bar_menu'        // 8.5" x 11" Bar & Beverage Menu (Host, Cash, Subsidized)
  | 'boxed_lunch'     // Boxed lunch & catering meal container stickers (4"x2")
  | 'kitchen_prep'    // Kitchen prep date & food rotation labels (2.625"x1")
  | 'universal';      // Multi-purpose professional tags & seals (circles, squares, custom)

export type ThemeStyle = 
  | 'heritage'      // Royal Heritage (Ivory, Gold & Serif luxury)
  | 'wedding'       // Wedding & Gala Romance (Rose Gold, Pearl & Calligraphy)
  | 'corporate'     // Corporate Executive (Midnight Navy & Platinum)
  | 'vineyard'      // Rustic Vineyard & Barn (Oak Wood, Warm Terracotta)
  | 'tropical'      // Tropical Luau & Summer (Teal, Coral & Fresh Citrus)
  | 'gatsby'        // Art Deco & Great Gatsby (Noir, Geometric Gold)
  | 'holiday'       // Holiday & Festive Gala (Crimson Red & Evergreen)
  | 'minimal'       // Clean Modern Monochrome (Slate & Crisp White)
  | 'bistro'        // French Bistro & Brasserie (Classic Double Line)
  | 'noir'          // Luxe Noir (Charcoal & Warm Gold)
  | 'botanical'     // Botanical Sage (Organic Farm-to-Table)
  | 'contemporary'  // Five-Star Luxury Hotel (Refined Top Bar)
  | 'kraft'         // Artisan Kraft (Warm paper texture)
  | 'industrial';   // High-Contrast Logistics (Bold Black & White)

export type FontOption = 
  | 'font-serif-lux'    // Playfair Display (Serif Luxury)
  | 'font-cormorant'    // Cormorant Garamond (Timeless Heritage)
  | 'font-cinzel'       // Cinzel (Classic Roman)
  | 'font-bodoni'       // Bodoni Moda (High Fashion Editorial)
  | 'font-script'       // Great Vibes (Wedding Calligraphy)
  | 'font-dancing'      // Dancing Script (Romantic Flow)
  | 'font-sans-modern'  // Inter (Clean High-Legibility Sans)
  | 'font-montserrat'   // Montserrat (Geometric Bistro)
  | 'font-oswald'       // Oswald (Bold Headline)
  | 'font-outfit'       // Outfit (Modern Minimalist)
  | 'font-slab'         // Roboto Slab (Artisan Rustic Serif)
  | 'font-mono-clean';  // Space Mono (Clean Logistics & Kitchen)

export type TextAlignOption = 'left' | 'center' | 'right';

export type HighlightMode = 'none' | 'title-badge' | 'full-accent' | 'box-border';

export type BadgeDisplayMode = 'pill' | 'compact' | 'icon-only' | 'text';

export type DietaryNameFormat = 'code' | 'full' | 'both' | 'code-full-parens';

export type BorderStyle = 'hairline' | 'double' | 'corner' | 'minimal' | 'dashed' | 'none' | 'sticker-cut';

export type AllergenKey = string;

export type DualLanguageMode = 
  | 'single_dual'         // Both languages combined on each individual card
  | 'separate_paired'     // Separate card for each language, paired next to each other (Card 1: English, Card 2: Spanish)
  | 'separate_batched'    // Separate cards batched by language (All English cards on Sheet 1, all Spanish cards on Sheet 2)
  | 'secondary_only';     // Replace card content with secondary language entirely

export type DualLanguageStyle = 
  | 'sub_title'       // Italicized translation subtitle under main title
  | 'side_by_side'    // English / Translation inline with separator
  | 'stacked_blocks'  // Primary English top block + subtle line + Secondary bottom block
  | 'back_face';      // Duplex reverse (Front = Primary, Back = Secondary)

export interface AllergenInfo {
  code: string;
  label: string;
  fullTitle: string;
  icon: string;
  category: 'dietary' | 'allergen' | 'religious' | 'advisory';
  badgeClass: string;
  dotColor: string;
}

export interface PrintTemplate {
  id: string;
  name: string;
  code: string;
  shape: CardShape;
  widthIn: number;
  heightIn: number;
  cornerRadius: number;
  cardsPerSheet: number;
  columns: number;
  rows: number;
  description: string;
  isFoldable?: boolean;
  isSticker?: boolean;
  category: 'cards' | 'sheets' | 'stickers' | 'shapes' | 'tents' | 'custom';
}

export interface BuffetItem {
  id: string;
  name: string;
  description: string;
  tags: AllergenKey[];
  station?: string;
  price?: string;
  calories?: string;
  origin?: string;
  // Preservation of original text for reset
  originalName?: string;
  originalDesc?: string;
  // Dual-language & translation fields
  translationName?: string;
  translationDesc?: string;
  translationLang?: string;
  // Flags for separate language cards
  isTranslatedCard?: boolean;
  cardLanguage?: string;
  parentItemId?: string;
  // Boxed lunch & kitchen sticker fields
  guestName?: string;      // e.g. "For: Sarah Jenkins"
  prepDate?: string;       // e.g. "Aug 15"
  useByDate?: string;      // e.g. "Aug 18"
  chefName?: string;       // e.g. "Chef Marco"
  storageNote?: string;    // e.g. "Keep Chilled"
  orderNumber?: string;    // e.g. "Order #402"
  itemType?: StudioMode;
  // Bar Menu Fields
  drinkCategory?: 'cocktail' | 'wine' | 'beer' | 'spirit' | 'mocktail' | 'other';
  drinkPrice?: string;
  drinkAbv?: string;
  isHosted?: boolean;      // true if included in host bar
  // Double-sided back fields
  backNotes?: string;
  backIngredients?: string;
  backWinePairing?: string;
  backTitle?: string;
  // Per-item font size and position overrides
  fontSizeOverride?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'auto';
  titleScaleOverride?: number; // per-item scale percentage (70 to 180)
  descriptionFontSizeOverride?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'auto';
  descScaleOverride?: number; // per-item description scale percentage (70 to 180)
  verticalOffsetOverride?: number; // per-item vertical nudge in px
}

export type BarType = 'host' | 'cash' | 'subsidized' | 'open';

export interface BarMenuSettings {
  barType: BarType;
  eyebrowText?: string;
  showEyebrow?: boolean;
  eventTitle?: string;
  eventSubtitle: string;
  showSubtitle?: boolean;
  eventDate: string;
  showDate?: boolean;
  barHours: string;
  showBarHours?: boolean;
  hostName: string;
  showHostName?: boolean;
  subsidizedPriceText: string;
  gratuityNote: string;
  showPricing: boolean;
  menuColumns?: 1 | 2;
  spacingDensity?: 'compact' | 'normal' | 'relaxed';
  showDietaryLegend?: boolean;
  defaultCocktailPrice: string;
  defaultWinePrice: string;
  defaultBeerPrice: string;
  defaultSpiritPrice: string;
  defaultMocktailPrice: string;
}

export interface FullMenuSheetSettings {
  sheetType: 'full_menu' | 'single_item_poster';
  eyebrowText?: string;
  showEyebrow?: boolean;
  eventTitle: string;
  eventSubtitle: string;
  showSubtitle?: boolean;
  eventDate: string;
  showDate?: boolean;
  hostName: string;
  showHostName?: boolean;
  menuColumns: 1 | 2;
  spacingDensity?: 'compact' | 'normal' | 'relaxed';
  showDietaryBadges?: boolean;
  showDietaryLegend?: boolean;
  footerNote: string;
}

export interface DesignSettings {
  mode: StudioMode;
  templateId: string; // Defaults to 'std-card-3.5x2'
  shape: CardShape;
  widthIn: number;
  heightIn: number;
  cornerRadius: number;
  orientation: 'landscape' | 'portrait';
  printSides: PrintSides;
  menuCopies: number; // Number of copies of the same menu to print (1-20)
  printSelectedSheetOnly?: number; // 0 = all sheets, 1 = sheet 1 only, 2 = sheet 2 only, etc.
  theme: ThemeStyle;
  font: FontOption;
  textAlign: TextAlignOption; // left, center, right
  accentColor: string;
  secondaryColor: string;
  titleColor: string;         // custom title color override or auto
  descriptionColor?: string;  // custom description/subtitle font color or auto
  badgeTextColor?: string;    // custom dietary/tags font color or auto
  priceColor?: string;        // custom price font color or auto
  cardBgColor: string;        // custom card background color override or auto
  highlightColor: string;     // custom highlight color
  highlightMode: HighlightMode;
  logoUrl: string;
  logoHeight: number;
  logoPosition: 'left' | 'center' | 'right';
  showLogo: boolean;
  showAccentLine: boolean;
  showDescription: boolean;
  showStationBadge: boolean;
  showAllergenBadges: boolean;
  badgeDisplayMode: BadgeDisplayMode;
  dietaryNameFormat?: DietaryNameFormat; // 'code' (GF), 'full' (Gluten-Free), 'both' (GF • Gluten-Free), 'code-full-parens' (GF (Gluten-Free))
  borderStyle: BorderStyle;
  showCutGuides: boolean;
  tentMirrorTitle: boolean; // For 2-sided buffet islands
  showQrCode: boolean;
  qrCodeUrl: string;
  qrCodeLabel: string;
  showPrice: boolean;
  titleFontSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  titleFontScale?: number; // 70 to 180 (percentage)
  descriptionFontSize?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  descriptionFontScale?: number; // 70 to 180 (percentage)
  verticalAlign?: 'auto' | 'center' | 'top' | 'bottom' | 'space-between';
  verticalOffset?: number; // -40 to +40 in pixels
  contentPadding?: 'compact' | 'normal' | 'relaxed' | 'spacious';
  titleUppercase: boolean;
  centerText: boolean; // legacy alias
  customStationName?: string;
  // Printer Calibration & Physical Sheet Offset
  calibrationOffsetX?: number; // -0.5 to +0.5 inches
  calibrationOffsetY?: number; // -0.5 to +0.5 inches
  showCalibrationGrid?: boolean; // visual alignment grid with inch marks
  // Dual Language & Translation Settings
  showDualLanguage: boolean;
  primaryLanguage: string; // 'en' (default), 'es', 'fr', etc.
  targetLanguage: string; // 'es', 'fr', 'de', 'it', 'ja', 'zh', 'ar', 'pt', etc.
  dualLanguageMode: DualLanguageMode;
  dualLanguageStyle: DualLanguageStyle;
  showLanguageBadges: boolean; // e.g. [EN] / [ES] badges on cards
  showSecondaryDesc: boolean;  // toggle translated description on/off
  secondaryTextColor?: string; // 'auto' | 'accent' | 'muted' | custom hex
  // Sticker specific toggles
  showGuestName: boolean;
  showPrepDate: boolean;
  showUseByDate: boolean;
  showStorageNote: boolean;
  showChefName: boolean;
  // Bar Menu Settings
  barSettings: BarMenuSettings;
  // Full 8.5x11 Menu Settings
  fullMenuSettings: FullMenuSheetSettings;
  // Back card settings
  backShowIngredients: boolean;
  backShowWinePairing: boolean;
  backShowQrCode: boolean;
}

export interface SavedMenu {
  id: string;
  name: string;
  eventName?: string;
  date?: string;
  createdAt: string;
  updatedAt: string;
  mode?: StudioMode;
  items: BuffetItem[];
  settings: Partial<DesignSettings>;
  copies: number;
}

export interface SampleMenu {
  id: string;
  title: string;
  category: StudioMode;
  description: string;
  station: string;
  recommendedTemplateId: string;
  rawText: string;
}
