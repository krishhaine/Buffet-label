import React, { useState, useEffect, useRef } from 'react';
import { BuffetItem, DesignSettings, AllergenKey, SavedMenu, StudioMode } from './types/buffet';
import { SAMPLE_MENUS } from './utils/sampleMenus';
import { parseBeoText, parseTableText, generateId, isInternalPackagingSpec } from './utils/beoParser';
import { Header } from './components/Header';
import { BeoInputPanel } from './components/BeoInputPanel';
import { StylingControls } from './components/StylingControls';
import { TranslationControls } from './components/TranslationControls';
import { CardPreviewGrid } from './components/CardPreviewGrid';
import { PrintSheetView } from './components/PrintSheetView';
import { AllergenLegendModal } from './components/AllergenLegendModal';
import { PrintTipsModal } from './components/PrintTipsModal';
import { AppStoreExportModal } from './components/AppStoreExportModal';
import { IndustryGuideModal } from './components/IndustryGuideModal';
import { MenuLibraryModal } from './components/MenuLibraryModal';
import { DietaryManagerModal } from './components/DietaryManagerModal';
import { SopManualModal } from './components/SopManualModal';
import { PrintCenterModal } from './components/PrintCenterModal';
import { SaveProjectModal } from './components/SaveProjectModal';
import { ResetConfirmModal } from './components/ResetConfirmModal';
import { ModeCategorySelector } from './components/ModeCategorySelector';
import { PRESET_LOGOS } from './utils/presetLogos';
import { getTemplateById, calculateSheetLayout } from './utils/templates';
import { executeDirectPrint, openStandalonePrintWindow } from './utils/printHelper';
import { Utensils, Box, Clock, Tag, GlassWater, FileText } from 'lucide-react';

const STORAGE_SETTINGS_KEY = 'buffet_label_settings_v7';
const STORAGE_ITEMS_KEY = 'buffet_label_items_v7';
const STORAGE_SAVED_MENUS_KEY = 'buffet_label_saved_menus_v7';
const STORAGE_ACTIVE_MENU_KEY = 'buffet_label_active_menu_v7';

const DEFAULT_SETTINGS: DesignSettings = {
  templateId: 'imprintplus-012365-oval',
  shape: 'oval',
  widthIn: 5.33,
  heightIn: 2.33,
  cornerRadius: 9999,
  orientation: 'landscape',
  printSides: 'single',
  menuCopies: 1,
  mode: 'buffet',
  theme: 'heritage',
  font: 'font-serif-lux',
  textAlign: 'left',
  titleColor: 'auto',
  cardBgColor: 'auto',
  highlightColor: '#fef08a',
  highlightMode: 'none',
  accentColor: '#d4af37',
  secondaryColor: '#1e293b',
  logoUrl: '',
  logoHeight: 16,
  logoPosition: 'left',
  showLogo: false,
  showAccentLine: true,
  showDescription: true,
  showStationBadge: false,
  showAllergenBadges: true,
  badgeDisplayMode: 'pill',
  dietaryNameFormat: 'code',
  borderStyle: 'hairline',
  showCutGuides: true,
  tentMirrorTitle: false,
  showQrCode: false,
  qrCodeUrl: '',
  qrCodeLabel: 'Digital Menu',
  showPrice: false,
  titleFontSize: 'md',
  titleFontScale: 100,
  descriptionFontSize: 'sm',
  descriptionFontScale: 100,
  verticalAlign: 'center',
  verticalOffset: 0,
  contentPadding: 'normal',
  titleUppercase: false,
  centerText: false,
  // Dual-language & translation defaults
  showDualLanguage: false,
  primaryLanguage: 'en',
  targetLanguage: 'es',
  dualLanguageMode: 'single_dual',
  dualLanguageStyle: 'sub_title',
  showLanguageBadges: false,
  showSecondaryDesc: true,
  printSelectedSheetOnly: 0,
  // Sticker and metadata fields (disabled by default)
  showGuestName: false,
  showPrepDate: false,
  showUseByDate: false,
  showStorageNote: false,
  showChefName: false,
  // Back card defaults
  backShowIngredients: false,
  backShowWinePairing: false,
  backShowQrCode: false,
  // Bar Menu Settings
  barSettings: {
    barType: 'host',
    hostName: 'The Montgomery Family & Gala Committee',
    eventSubtitle: 'Grand Ballroom & Terrace Bar',
    eventDate: 'Saturday, August 15, 2026',
    barHours: '5:00 PM – 11:30 PM',
    subsidizedPriceText: '$3.00 per cocktail / $2.00 beer & wine (Remaining balance hosted by sponsor)',
    gratuityNote: 'Hospitality service & gratuity are graciously hosted',
    showPricing: true,
    defaultCocktailPrice: '$16.00',
    defaultWinePrice: '$14.00',
    defaultBeerPrice: '$8.00',
    defaultSpiritPrice: '$15.00',
    defaultMocktailPrice: '$9.00',
  },
  // 8.5x11 Full Menu Sheet Settings
  fullMenuSettings: {
    sheetType: 'full_menu',
    eventTitle: 'Executive Grand Gala Dinner',
    eventSubtitle: 'Multi-Course Seasonal Banquet',
    eventDate: 'Saturday, August 15, 2026',
    hostName: 'Executive Chef Marco & Culinary Team',
    menuColumns: 2,
    footerNote: 'Please inform our service staff of any severe allergies or dietary preferences.',
  },
};

export default function App() {
  const [currentMode, setCurrentMode] = useState<StudioMode>('buffet');
  const [rawInput, setRawInput] = useState<string>(SAMPLE_MENUS[0].rawText);

  // Saved Menus Library
  const [savedMenus, setSavedMenus] = useState<SavedMenu[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SAVED_MENUS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // ignore
    }
    return [
      {
        id: 'initial-gala-menu',
        name: 'Executive Breakfast & Gala Buffet',
        eventName: 'Grand Ballroom BEO #204',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        items: parseBeoText(SAMPLE_MENUS[0].rawText),
        settings: DEFAULT_SETTINGS,
        copies: 1,
      },
    ];
  });

  const [currentMenuId, setCurrentMenuId] = useState<string | null>(() => {
    try {
      return localStorage.getItem(STORAGE_ACTIVE_MENU_KEY) || 'initial-gala-menu';
    } catch {
      return null;
    }
  });

  const [items, setItems] = useState<BuffetItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_ITEMS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: BuffetItem) => ({
            ...item,
            description: item.description && isInternalPackagingSpec(item.description) ? '' : item.description,
          }));
        }
      }
    } catch {
      // ignore
    }
    return parseBeoText(SAMPLE_MENUS[0].rawText);
  });

  const [settings, setSettings] = useState<DesignSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_SETTINGS_KEY);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // ignore
    }
    return DEFAULT_SETTINGS;
  });

  const [activeStation, setActiveStation] = useState<string>('Buffet Station');
  const [showAllergenGuide, setShowAllergenGuide] = useState<boolean>(false);
  const [showDietaryManager, setShowDietaryManager] = useState<boolean>(false);
  const [showSopManual, setShowSopManual] = useState<boolean>(false);
  const [showPrintTips, setShowPrintTips] = useState<boolean>(false);
  const [showAppStoreGuide, setShowAppStoreGuide] = useState<boolean>(false);
  const [showIndustryGuide, setShowIndustryGuide] = useState<boolean>(false);
  const [showMenuLibrary, setShowMenuLibrary] = useState<boolean>(false);
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [showPrintCenterModal, setShowPrintCenterModal] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SETTINGS_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_ITEMS_KEY, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_MENUS_KEY, JSON.stringify(savedMenus));
    } catch {
      // ignore
    }
  }, [savedMenus]);

  useEffect(() => {
    try {
      if (currentMenuId) {
        localStorage.setItem(STORAGE_ACTIVE_MENU_KEY, currentMenuId);
      }
    } catch {
      // ignore
    }
  }, [currentMenuId]);

  // Mode Switcher Handler
  const handleSwitchMode = (mode: StudioMode) => {
    setCurrentMode(mode);

    if (mode === 'bar_menu') {
      const sample = SAMPLE_MENUS.find((s) => s.category === 'bar_menu') || SAMPLE_MENUS[2];
      setRawInput(sample.rawText);
      const parsed = parseBeoText(sample.rawText, sample.station);
      setItems(parsed);
      setSettings((prev) => ({
        ...prev,
        mode: 'bar_menu',
        templateId: 'sheet-bar-8.5x11',
        widthIn: 8.5,
        heightIn: 11.0,
        shape: 'rectangle',
        theme: 'gatsby',
        font: 'font-serif-lux',
        showPrice: true,
        showDescription: true,
        showAllergenBadges: true,
      }));
    } else if (mode === 'full_menu_sheet') {
      const sample = SAMPLE_MENUS.find((s) => s.category === 'full_menu_sheet') || SAMPLE_MENUS[5];
      setRawInput(sample.rawText);
      const parsed = parseBeoText(sample.rawText, sample.station);
      setItems(parsed);
      setSettings((prev) => ({
        ...prev,
        mode: 'full_menu_sheet',
        templateId: 'sheet-full-8.5x11',
        widthIn: 8.5,
        heightIn: 11.0,
        shape: 'rectangle',
        theme: 'heritage',
        font: 'font-cormorant',
        showDescription: true,
        showAllergenBadges: true,
      }));
    } else if (mode === 'boxed_lunch') {
      const sample = SAMPLE_MENUS.find((s) => s.category === 'boxed_lunch') || SAMPLE_MENUS[7];
      setRawInput(sample.rawText);
      const parsed = parseBeoText(sample.rawText, sample.station);
      setItems(parsed);
      setSettings((prev) => ({
        ...prev,
        mode: 'boxed_lunch',
        templateId: 'sticker-box-4x2',
        widthIn: 4.0,
        heightIn: 2.0,
        shape: 'rectangle',
        theme: 'kraft',
        font: 'font-sans-modern',
        showGuestName: true,
        showPrepDate: true,
        showUseByDate: true,
        showStorageNote: true,
      }));
    } else if (mode === 'kitchen_prep') {
      const sample = SAMPLE_MENUS.find((s) => s.category === 'kitchen_prep') || SAMPLE_MENUS[8];
      setRawInput(sample.rawText);
      const parsed = parseBeoText(sample.rawText, sample.station);
      setItems(parsed);
      setSettings((prev) => ({
        ...prev,
        mode: 'kitchen_prep',
        templateId: 'sticker-prep-2.625x1',
        widthIn: 2.625,
        heightIn: 1.0,
        shape: 'rectangle',
        theme: 'industrial',
        font: 'font-sans-modern',
        showChefName: true,
        showPrepDate: true,
        showUseByDate: true,
        showStorageNote: true,
        showDescription: false,
      }));
    } else if (mode === 'universal') {
      const sample = SAMPLE_MENUS.find((s) => s.category === 'universal') || SAMPLE_MENUS[9];
      setRawInput(sample.rawText);
      const parsed = parseBeoText(sample.rawText, sample.station);
      setItems(parsed);
      setSettings((prev) => ({
        ...prev,
        mode: 'universal',
        templateId: 'badge-circle-2.5',
        widthIn: 2.5,
        heightIn: 2.5,
        shape: 'circle',
        theme: 'minimal',
      }));
    } else {
      // Default FOH Buffet & Oval Platters
      const sample = SAMPLE_MENUS[0];
      setRawInput(sample.rawText);
      const parsed = parseBeoText(sample.rawText, sample.station);
      setItems(parsed);
      setSettings((prev) => ({
        ...prev,
        mode: 'buffet',
        templateId: 'imprintplus-012365-oval',
        widthIn: 5.33,
        heightIn: 2.33,
        shape: 'oval',
        cornerRadius: 9999,
        theme: 'heritage',
        font: 'font-serif-lux',
        showAccentLine: true,
        showDescription: true,
        showAllergenBadges: true,
        showLogo: false,
        showStationBadge: false,
      }));
    }
  };

  // Parse Action
  const handleParse = (mode: 'beo' | 'table' = 'beo') => {
    if (mode === 'table') {
      const parsed = parseTableText(rawInput);
      if (parsed.length > 0) setItems(parsed);
    } else {
      const parsed = parseBeoText(rawInput, activeStation);
      if (parsed.length > 0) setItems(parsed);
    }
  };

  // Load Preset Sample
  const handleLoadSample = (sampleId: string) => {
    const sample = SAMPLE_MENUS.find((s) => s.id === sampleId);
    if (sample) {
      setRawInput(sample.rawText);
      const parsed = parseBeoText(sample.rawText, sample.station);
      setItems(parsed);
      setActiveStation(sample.station);
      if (sample.recommendedTemplateId) {
        const tmpl = getTemplateById(sample.recommendedTemplateId);
        setSettings((prev) => ({
          ...prev,
          templateId: sample.recommendedTemplateId!,
          widthIn: tmpl.widthIn,
          heightIn: tmpl.heightIn,
          shape: tmpl.shape,
          mode: sample.category as StudioMode,
        }));
        if (sample.category) setCurrentMode(sample.category as StudioMode);
      }
    }
  };

  // Clear
  const handleClear = () => {
    setRawInput('');
    setItems([]);
  };

  // Add Item Manually
  const handleAddNewManual = () => {
    const newItem: BuffetItem = {
      id: generateId(),
      name:
        currentMode === 'bar_menu'
          ? 'Artisan Smoked Old Fashioned'
          : currentMode === 'boxed_lunch'
          ? 'Artisan Deli Sandwich Box'
          : currentMode === 'kitchen_prep'
          ? 'House Herb Garlic Aioli'
          : 'Chef’s Signature Entrée',
      description:
        currentMode === 'bar_menu'
          ? 'Bourbon, Demerara Sugar, House Bitters, Torched Rosemary'
          : currentMode === 'boxed_lunch'
          ? 'With kettle chips, crisp apple & gourmet cookie'
          : 'Handcrafted recipe with fresh herbs and reduction sauce',
      tags: currentMode === 'bar_menu' ? ['V'] : ['V', 'GF'],
      station:
        currentMode === 'bar_menu'
          ? 'Signature Cocktails'
          : activeStation || 'Buffet Station',
      drinkCategory: currentMode === 'bar_menu' ? 'cocktail' : undefined,
      drinkPrice: currentMode === 'bar_menu' ? (settings.barSettings?.barType === 'host' ? 'Hosted' : '$16.00') : undefined,
      price: currentMode === 'bar_menu' ? (settings.barSettings?.barType === 'host' ? 'Hosted' : '$16.00') : undefined,
      guestName: currentMode === 'boxed_lunch' ? 'Guest / Attendee' : undefined,
      prepDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      useByDate: '+3 Days',
      storageNote: 'Keep Chilled',
      chefName: 'Prep Staff',
      backIngredients: 'Organic seasonal ingredients, fresh herbs, sea salt',
      backWinePairing: '2022 Napa Valley Sauvignon Blanc',
    };
    setItems((prev) => [newItem, ...prev]);
  };

  // Update Item
  const handleUpdateItem = (updated: BuffetItem) => {
    setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
  };

  // Delete Item
  const handleDeleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Duplicate Item
  const handleDuplicateItem = (item: BuffetItem) => {
    const duplicated: BuffetItem = {
      ...item,
      id: generateId(),
      name: `${item.name} (Copy)`,
    };
    setItems((prev) => [...prev, duplicated]);
  };

  // Batch Add Tag
  const handleBatchAddTag = (tag: AllergenKey, stationFilter?: string) => {
    setItems((prev) =>
      prev.map((item) => {
        if (!stationFilter || (item.station || 'General Buffet') === stationFilter) {
          if (!item.tags.includes(tag)) {
            return { ...item, tags: [...item.tags, tag] };
          }
        }
        return item;
      })
    );
  };

  // Menu Library Functions
  const handleSaveCurrentAsNewMenu = (name: string, eventName?: string) => {
    const newMenu: SavedMenu = {
      id: generateId(),
      name,
      eventName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      items: [...items],
      settings: { ...settings },
      copies: settings.menuCopies || 1,
    };
    setSavedMenus((prev) => [newMenu, ...prev]);
    setCurrentMenuId(newMenu.id);
  };

  const handleOverwriteMenu = (id: string) => {
    setSavedMenus((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              items: [...items],
              settings: { ...settings },
              copies: settings.menuCopies || 1,
              updatedAt: new Date().toISOString(),
            }
          : m
      )
    );
  };

  const handleLoadSavedMenu = (menu: SavedMenu) => {
    setItems(menu.items || []);
    if (menu.settings) {
      setSettings((prev) => ({ ...prev, ...menu.settings, menuCopies: menu.copies || prev.menuCopies }));
      if (menu.settings.mode) setCurrentMode(menu.settings.mode);
    }
    setCurrentMenuId(menu.id);
  };

  const handleDeleteSavedMenu = (id: string) => {
    setSavedMenus((prev) => prev.filter((m) => m.id !== id));
    if (currentMenuId === id) {
      setCurrentMenuId(null);
    }
  };

  const handleDuplicateSavedMenu = (id: string) => {
    const existing = savedMenus.find((m) => m.id === id);
    if (!existing) return;
    const duplicated: SavedMenu = {
      ...existing,
      id: generateId(),
      name: `${existing.name} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    setSavedMenus((prev) => [duplicated, ...prev]);
  };

  // Export JSON Backup
  const handleExportJson = () => {
    const exportData = {
      version: '6.0',
      exportedAt: new Date().toISOString(),
      savedMenus,
      activeMenuId: currentMenuId,
      settings,
      items,
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `label-studio-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Import JSON Backup
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.items && Array.isArray(parsed.items)) {
          setItems(parsed.items);
        }
        if (parsed.settings) {
          setSettings((prev) => ({ ...prev, ...parsed.settings }));
          if (parsed.settings.mode) setCurrentMode(parsed.settings.mode);
        }
        if (parsed.savedMenus && Array.isArray(parsed.savedMenus)) {
          setSavedMenus(parsed.savedMenus);
        }
        if (parsed.activeMenuId) {
          setCurrentMenuId(parsed.activeMenuId);
        }
      } catch (err) {
        console.error('Failed to parse import JSON:', err);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Reset Workspace Handlers
  const handleSaveAndReset = (newMenuName?: string) => {
    const saveName = newMenuName || currentMenuName || 'Saved Project';
    handleSaveCurrentAsNewMenu(saveName, 'Saved Before Reset');
    setRawInput('');
    setItems([]);
    setCurrentMenuId(null);
    setSettings(DEFAULT_SETTINGS);
  };

  const handleDiscardAndReset = () => {
    setRawInput('');
    setItems([]);
    setCurrentMenuId(null);
    setSettings(DEFAULT_SETTINGS);
  };

  // Direct Print Trigger with optional specific sheet index (Immediately opens native browser / OS printer properties window)
  const handleDirectPrint = (specificSheetIndex?: number) => {
    if (specificSheetIndex && specificSheetIndex > 0) {
      setSettings((prev) => ({ ...prev, printSelectedSheetOnly: specificSheetIndex }));
    } else {
      setSettings((prev) => ({ ...prev, printSelectedSheetOnly: 0 }));
    }
    // Instantly trigger direct browser & OS printer dialog
    setTimeout(() => {
      executeDirectPrint(specificSheetIndex);
    }, 20);
  };

  // Sheet calculation
  const template = getTemplateById(settings.templateId);
  const layout = template.id !== 'custom-template'
    ? { cardsPerSheet: template.cardsPerSheet }
    : calculateSheetLayout(settings.widthIn, settings.heightIn);

  const cardsPerSheet = layout.cardsPerSheet || 10;
  const copiesCount = Math.max(1, settings.menuCopies || 1);
  const totalCardsToPrint = items.length * copiesCount;
  const baseSheets = Math.ceil(totalCardsToPrint / cardsPerSheet) || 1;
  const totalSheets = settings.printSides === 'double' ? baseSheets * 2 : baseSheets;

  const currentMenuName = savedMenus.find((m) => m.id === currentMenuId)?.name || 'Custom Project';

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col antialiased text-slate-800">
      {/* Hidden file input for JSON import */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleImportJson}
        className="hidden"
      />

      {/* Top Bar Header */}
      <Header
        cardCount={items.length}
        sheetCount={totalSheets}
        templateCode={template.code}
        menuCopies={copiesCount}
        activeMenuName={currentMenuName}
        onDirectPrint={() => handleDirectPrint(0)}
        onOpenPrintCenter={() => setShowPrintCenterModal(true)}
        onResetWorkspace={() => setShowResetModal(true)}
        onOpenSaveModal={() => setShowSaveModal(true)}
        onOpenMenuLibrary={() => setShowMenuLibrary(true)}
        onExportJson={handleExportJson}
        onImportJson={() => fileInputRef.current?.click()}
        onOpenAllergenGuide={() => setShowAllergenGuide(true)}
        onOpenDietaryManager={() => setShowDietaryManager(true)}
        onOpenSopManual={() => setShowSopManual(true)}
        onOpenPrintTips={() => setShowPrintTips(true)}
        onOpenAppStoreGuide={() => setShowAppStoreGuide(true)}
        onOpenIndustryGuide={() => setShowIndustryGuide(true)}
      />

      {/* Primary Studio Mode Categorized Selector */}
      <ModeCategorySelector
        currentMode={currentMode}
        onSelectMode={handleSwitchMode}
      />

      {/* Main Workspace (Hidden on Print) */}
      <main className="no-print flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
          {/* Left Column: Input & Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <BeoInputPanel
              rawInput={rawInput}
              onChangeInput={setRawInput}
              onParse={handleParse}
              onLoadSample={handleLoadSample}
              onClear={() => setShowResetModal(true)}
              onAddNewManual={handleAddNewManual}
              activeStation={activeStation}
              onChangeStation={setActiveStation}
              currentMode={currentMode}
              onSelectMode={handleSwitchMode}
            />

            {/* Translation & Bilingual Module */}
            <TranslationControls
              items={items}
              settings={settings}
              onUpdateItems={setItems}
              onUpdateSettings={(newVals) =>
                setSettings((prev) => ({ ...prev, ...newVals }))
              }
            />

            <StylingControls
              settings={settings}
              onUpdateSettings={(newVals) =>
                setSettings((prev) => ({ ...prev, ...newVals }))
              }
            />
          </div>

          {/* Right Column: Live Interactive Preview Grid (7 cols) - Sticky & Floating */}
          <div className="lg:col-span-7 lg:sticky lg:top-4 self-start space-y-4 max-h-[calc(100vh-2rem)] overflow-y-auto pr-1">
            <CardPreviewGrid
              items={items}
              settings={settings}
              onUpdateItem={handleUpdateItem}
              onDeleteItem={handleDeleteItem}
              onDuplicateItem={handleDuplicateItem}
              onAddItem={handleAddNewManual}
              onClearAll={() => setShowResetModal(true)}
              onBatchAddTag={handleBatchAddTag}
              onTriggerPrint={handleDirectPrint}
              onUpdateSettings={(newVals) =>
                setSettings((prev) => ({ ...prev, ...newVals }))
              }
              onUpdateBarSettings={(bar) =>
                setSettings((prev) => ({
                  ...prev,
                  barSettings: { ...prev.barSettings, ...bar } as any,
                }))
              }
              onUpdateFullMenuSettings={(full) =>
                setSettings((prev) => ({
                  ...prev,
                  fullMenuSettings: { ...prev.fullMenuSettings, ...full } as any,
                }))
              }
            />
          </div>
        </div>
      </main>

      {/* PRINT SHEET AREA (Rendered for high-DPI export & window.print()) */}
      <PrintSheetView items={items} settings={settings} />

      {/* Modals */}
      <ResetConfirmModal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        itemsCount={items.length}
        activeMenuName={currentMenuName}
        templateCode={template.code}
        onSaveAndReset={handleSaveAndReset}
        onDiscardAndReset={handleDiscardAndReset}
      />

      <SaveProjectModal
        isOpen={showSaveModal}
        onClose={() => setShowSaveModal(false)}
        currentItems={items}
        currentSettings={settings}
        activeMenuName={currentMenuName}
        onSaveNew={handleSaveCurrentAsNewMenu}
        onOverwriteActive={() => currentMenuId && handleOverwriteMenu(currentMenuId)}
        onExportBackup={handleExportJson}
        menuCopies={copiesCount}
        onChangeCopies={(copies) => setSettings((prev) => ({ ...prev, menuCopies: copies }))}
      />

      <PrintCenterModal
        isOpen={showPrintCenterModal}
        onClose={() => setShowPrintCenterModal(false)}
        items={items}
        settings={settings}
        totalSheets={totalSheets}
        templateName={template.name}
        templateCode={template.code}
        onTriggerDirectPrint={(sheetIdx) => {
          handleDirectPrint(sheetIdx);
        }}
      />

      <MenuLibraryModal
        isOpen={showMenuLibrary}
        onClose={() => setShowMenuLibrary(false)}
        savedMenus={savedMenus}
        currentItems={items}
        currentSettings={settings}
        currentMenuId={currentMenuId}
        onLoadMenu={handleLoadSavedMenu}
        onSaveCurrentAsNew={handleSaveCurrentAsNewMenu}
        onOverwriteMenu={handleOverwriteMenu}
        onDeleteMenu={handleDeleteSavedMenu}
        onDuplicateMenu={handleDuplicateSavedMenu}
        menuCopies={copiesCount}
        onChangeCopies={(copies) => setSettings((prev) => ({ ...prev, menuCopies: copies }))}
      />

      <DietaryManagerModal
        isOpen={showDietaryManager}
        onClose={() => setShowDietaryManager(false)}
        onDietaryUpdated={() => {
          setItems([...items]);
        }}
      />

      <SopManualModal
        isOpen={showSopManual}
        onClose={() => setShowSopManual(false)}
      />

      <AllergenLegendModal
        isOpen={showAllergenGuide}
        onClose={() => setShowAllergenGuide(false)}
      />

      <PrintTipsModal
        isOpen={showPrintTips}
        onClose={() => setShowPrintTips(false)}
        onTriggerPrint={() => handleDirectPrint(0)}
      />

      <AppStoreExportModal
        isOpen={showAppStoreGuide}
        onClose={() => setShowAppStoreGuide(false)}
      />

      <IndustryGuideModal
        isOpen={showIndustryGuide}
        onClose={() => setShowIndustryGuide(false)}
      />
    </div>
  );
}
