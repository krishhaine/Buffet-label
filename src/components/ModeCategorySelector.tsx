import React, { useState, useRef, useEffect } from 'react';
import { StudioMode } from '../types/buffet';
import {
  Utensils,
  GlassWater,
  FileText,
  Box,
  Clock,
  Tag,
  ChevronDown,
  Check,
  Sparkles,
  Layers,
  ChefHat,
  Wine,
} from 'lucide-react';

export interface ModeOption {
  id: StudioMode;
  label: string;
  shortLabel: string;
  category: 'foh' | 'boh' | 'bar' | 'universal';
  categoryLabel: string;
  categoryIcon: string;
  dimensions: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  tags: string[];
}

export const MODE_CATEGORIES = [
  { id: 'all', label: 'All Formats', shortLabel: 'All', icon: Layers, desc: 'All Formats' },
  { id: 'foh', label: 'FOH (Front of House)', shortLabel: 'FOH', icon: Utensils, desc: 'Buffet Cards & Dinner Menus' },
  { id: 'boh', label: 'BOH (Back of House)', shortLabel: 'BOH', icon: ChefHat, desc: 'Kitchen Prep & Food Safety' },
  { id: 'bar', label: 'Bar (Drinks & Lounge)', shortLabel: 'Bar', icon: Wine, desc: 'Cocktail & Beverage Menus' },
] as const;

export const STUDIO_MODES: ModeOption[] = [
  // 1. FOH (Front of House)
  {
    id: 'buffet',
    label: 'FOH Buffet Cards & Platter Ovals',
    shortLabel: 'Buffet Cards & Ovals',
    category: 'foh',
    categoryLabel: 'FOH (Front of House)',
    categoryIcon: '🍽️',
    dimensions: 'Imprint Plus 012365 Oval & Cards',
    description: 'Imprint Plus 012365 Oval (5.33"×2.33"), standard cards (3.5"×2") & standing clips.',
    icon: Utensils,
    tags: ['Imprint Plus 012365', 'Avery 5302', 'Oval Platter'],
  },
  {
    id: 'full_menu_sheet',
    label: 'FOH 8.5"×11" Banquet Dinner Sheet',
    shortLabel: 'Dinner Menu Sheet',
    category: 'foh',
    categoryLabel: 'FOH (Front of House)',
    categoryIcon: '🍽️',
    dimensions: '8.5"×11.0" Full Sheet',
    description: 'Full-page multi-course banquet menus, station overview posters, and buffet signs.',
    icon: FileText,
    tags: ['Full Page', '1/Sheet', 'Banquet Poster'],
  },

  // 2. BOH (Back of House)
  {
    id: 'kitchen_prep',
    label: 'BOH Kitchen Prep & Food Safety Labels',
    shortLabel: 'Kitchen Prep & HACCP',
    category: 'boh',
    categoryLabel: 'BOH (Back of House)',
    categoryIcon: '👨‍🍳',
    dimensions: '2.625"×1.0" Stickers (30/Sheet)',
    description: 'HACCP food rotation stickers with prep date, use-by date, storage notes & chef initials.',
    icon: Clock,
    tags: ['Avery 5160', '30/Sheet', 'HACCP Safety'],
  },
  {
    id: 'boxed_lunch',
    label: 'BOH Boxed Lunch & Catering Stickers',
    shortLabel: 'Boxed Lunch Stickers',
    category: 'boh',
    categoryLabel: 'BOH (Back of House)',
    categoryIcon: '📦',
    dimensions: '4.0"×2.0" Stickers (8/Sheet)',
    description: 'Individual meal box labels with attendee names, sides, dietary tags & station.',
    icon: Box,
    tags: ['Avery 5163', '8/Sheet', 'Attendee Names'],
  },

  // 3. Bar & Beverage
  {
    id: 'bar_menu',
    label: 'Bar & Cocktail Menu 8.5"×11"',
    shortLabel: 'Bar & Cocktail Menu',
    category: 'bar',
    categoryLabel: 'Bar & Beverage Lounge',
    categoryIcon: '🍸',
    dimensions: '8.5"×11.0" Full Sheet',
    description: 'Cocktail lounge, wedding host bar, cash bar, and subsidized drink menus with pricing.',
    icon: GlassWater,
    tags: ['Host Bar', 'Cash Bar', 'Cocktails'],
  },

  // 4. Universal
  {
    id: 'universal',
    label: 'Universal Badges, Seals & Custom',
    shortLabel: 'Universal Badges',
    category: 'universal',
    categoryLabel: 'Universal Formats',
    categoryIcon: '🏷️',
    dimensions: 'Circles, Squares & Die-Cuts',
    description: 'Round seals, square stickers, jars, favor bags, and custom die-cut tags.',
    icon: Tag,
    tags: ['Avery 22807', '12/Sheet', 'Seals'],
  },
];

interface ModeCategorySelectorProps {
  currentMode: StudioMode;
  onSelectMode: (mode: StudioMode) => void;
}

export const ModeCategorySelector: React.FC<ModeCategorySelectorProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeMode = STUDIO_MODES.find((m) => m.id === currentMode) || STUDIO_MODES[0];
  const ActiveIcon = activeMode.icon;

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filteredModes = selectedDepartment === 'all'
    ? STUDIO_MODES
    : STUDIO_MODES.filter((m) => m.category === selectedDepartment || (selectedDepartment === 'foh' && m.category === 'universal'));

  // Group modes by category for structured dropdown display
  const departmentsList = [
    { id: 'foh', label: 'FOH — Front of House (Buffet & Dining)', icon: '🍽️' },
    { id: 'boh', label: 'BOH — Back of House (Kitchen & Prep)', icon: '👨‍🍳' },
    { id: 'bar', label: 'Bar — Beverage & Cocktail Lounge', icon: '🍸' },
    { id: 'universal', label: 'Universal — Seals, Badges & Custom', icon: '🏷️' },
  ];

  return (
    <div className="no-print bg-slate-900 border-b border-slate-800 text-slate-100 relative z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          {/* Left: Department & Format Quick Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 hidden sm:inline">
                Format:
              </span>

              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 rounded-lg text-xs font-bold transition flex items-center gap-2 shadow-xs group"
                aria-expanded={isOpen}
              >
                <ActiveIcon className="w-4 h-4 text-slate-950 shrink-0" />
                <span className="truncate max-w-[200px] sm:max-w-none">
                  {activeMode.label}
                </span>
                <span className="hidden md:inline-block text-[10px] bg-amber-600/30 text-slate-950 px-1.5 py-0.5 rounded font-mono font-medium">
                  {activeMode.dimensions}
                </span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-slate-950 transition-transform duration-200 ${
                    isOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>
            </div>

            {/* Categorized Dropdown Popover */}
            {isOpen && (
              <div className="absolute left-0 mt-2 w-[340px] sm:w-[500px] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150 z-50">
                {/* Dropdown Header */}
                <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">Select Hospitality Format</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    FOH &bull; BOH &bull; Bar
                  </span>
                </div>

                {/* Categorized List */}
                <div className="max-h-[70vh] overflow-y-auto p-2.5 space-y-3">
                  {departmentsList.map((dept) => {
                    const deptModes = STUDIO_MODES.filter((m) => m.category === dept.id);
                    if (deptModes.length === 0) return null;

                    return (
                      <div key={dept.id} className="space-y-1">
                        {/* Category Heading */}
                        <div className="px-2 py-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-slate-800/40 rounded">
                          <span>{dept.icon}</span>
                          <span>{dept.label}</span>
                        </div>

                        {/* Category Items */}
                        <div className="grid grid-cols-1 gap-1">
                          {deptModes.map((mode) => {
                            const Icon = mode.icon;
                            const isSelected = currentMode === mode.id;

                            return (
                              <button
                                key={mode.id}
                                type="button"
                                onClick={() => {
                                  onSelectMode(mode.id);
                                  setIsOpen(false);
                                }}
                                className={`w-full p-2.5 rounded-lg text-left transition flex items-start justify-between gap-3 ${
                                  isSelected
                                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-200'
                                }`}
                              >
                                <div className="flex items-start gap-2.5">
                                  <div
                                    className={`p-1.5 rounded-md shrink-0 mt-0.5 ${
                                      isSelected
                                        ? 'bg-amber-600/30 text-slate-950'
                                        : 'bg-slate-700/60 text-amber-400'
                                    }`}
                                  >
                                    <Icon className="w-4 h-4" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <span className="text-xs leading-snug">
                                        {mode.label}
                                      </span>
                                      <span
                                        className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                                          isSelected
                                            ? 'bg-slate-950/20 text-slate-950'
                                            : 'bg-slate-700 text-slate-300'
                                        }`}
                                      >
                                        {mode.dimensions}
                                      </span>
                                    </div>
                                    <p
                                      className={`text-[10.5px] mt-0.5 leading-tight ${
                                        isSelected ? 'text-slate-900 font-normal' : 'text-slate-400'
                                      }`}
                                    >
                                      {mode.description}
                                    </p>
                                  </div>
                                </div>

                                {isSelected && (
                                  <Check className="w-4 h-4 text-slate-950 shrink-0 font-bold mt-1" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right: Operational Department Tabs (FOH, BOH, Bar, All) */}
          <div className="flex items-center gap-1 overflow-x-auto py-0.5 max-w-full">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1 hidden sm:inline">
              Department:
            </span>
            {MODE_CATEGORIES.map((dept) => {
              const Icon = dept.icon;
              const isSelected = selectedDepartment === dept.id;

              return (
                <button
                  key={dept.id}
                  type="button"
                  onClick={() => {
                    setSelectedDepartment(dept.id);
                    // Switch to corresponding mode when department clicked
                    if (dept.id === 'foh') {
                      onSelectMode('buffet');
                    } else if (dept.id === 'boh') {
                      onSelectMode('kitchen_prep');
                    } else if (dept.id === 'bar') {
                      onSelectMode('bar_menu');
                    }
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 shadow-xs ring-1 ring-amber-400'
                      : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                  title={dept.desc}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{dept.shortLabel}</span>
                  <span className={`text-[10px] hidden md:inline font-normal ${isSelected ? 'text-slate-900 font-semibold' : 'text-slate-400'}`}>
                    ({dept.label.replace(/.*\(|\)/g, '')})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Department-Filtered Quick Strip */}
        {selectedDepartment !== 'all' && (
          <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto pb-0.5">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider shrink-0">
              {MODE_CATEGORIES.find((c) => c.id === selectedDepartment)?.label}:
            </span>
            {filteredModes.map((mode) => {
              const Icon = mode.icon;
              const isCurrent = currentMode === mode.id;

              return (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => onSelectMode(mode.id)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
                    isCurrent
                      ? 'bg-amber-400 text-slate-950 font-bold'
                      : 'bg-slate-800/90 text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{mode.shortLabel}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
