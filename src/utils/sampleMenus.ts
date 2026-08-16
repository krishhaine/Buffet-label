import { SampleMenu } from '../types/buffet';

export const SAMPLE_MENUS: SampleMenu[] = [
  {
    id: 'corporate_artisan_lunch_beo',
    title: 'Corporate Artisan Lunch & Sandwiches BEO',
    category: 'buffet',
    station: 'Artisan Lunch Station',
    recommendedTemplateId: 'std-card-3.5x2',
    description: 'Mediterranean garden salad, Italian job panini, chicken banh mi, and vegan roasted vegetables with dietary badges',
    rawText: `=== ARTISAN LUNCH & SANDWICH STATION ===
13:00 14:30 Mediterranean Garden Salad 29-Jul-26 8:12
(GF,DF,V,VE) – Spring Greens, Romaine,
Cherry Tomatoes, Cucumbers, Kalamata
Olives, Red Onions, Shredded
Vegetables, Tossed in a Lemon-Oregano
Vinaigrette
13:00 14:30 The Italian Job - Calabrese Salami, 375.00 PRS 29-Jul-26 8:12
Dry-Cured Capicollo, Jalapeno Jack
Cheese, Garlic Aioli, Red Pepper Spread,
Red Onion, Lettuce, Tomato
13:00 14:30 Chicken Breast Banh Mi - Chicken 375.00 PRS 29-Jul-26 8:12
Breast, Hoisin Marinade, Spicy Asian
Sesame Sauce, Garlic Aioli, Pickled
Carrot, Red Onion, Cilantro, Jalapeno
(DF)
13:00 14:30 The Outsider - Roasted Vegetables with 500.00 PRS 29-Jul-26 8:12
House Made Vegan Aioli (DF, V, VE)
13:00 14:30 Oatmeal Raisin House Baked Cookies 1.00 PRS 29-Jul-26 8:12
(V)
13:00 14:30 *Add - Gluten-Free Bread Options (Per 500.00 PRS 29-Jul-26 8:12
Guest)`,
  },
  {
    id: 'gourmet_popcorn_break',
    title: 'Gourmet Popcorn & Artisan Chips Break',
    category: 'buffet',
    station: 'Snack Break Station',
    recommendedTemplateId: 'std-card-3.5x2',
    description: 'Canadian maple & sea salt popcorn, smokehouse BBQ chips, honey mustard chips, and artisan dips',
    rawText: `=== ARTISAN POPCORN & GOURMET CHIPS BREAK ===
Gourmet Seasoned Popcorn - Canadian 1.00 DZ 6-Aug-26 16:02
Maple and Sea Salt (GF, DF, V, VE) (5oz
bag)
13:00 14:30 Gourmet Seasoned Popcorn - Caramel 1.00 DZ 6-Aug-26 16:02
(GF, DF, V, VE) (5oz bag)
13:00 14:30 Gourmet Seasoned Popcorn - Gourmet 1.00 DZ 6-Aug-26 16:02
Buttered - (GF, DF, V, VE) (5oz bag)
13:00 14:30 Gourmet Potato Chips - Smokehouse BBQ 1.00 DZ 6-Aug-26 16:02
(DF, V) (bag)
13:00 14:30 Gourmet Potato Chips - Sea Salt & 1.00 DZ 6-Aug-26 16:02
Vinegar (DF, V) (bag)
13:00 14:30 Gourmet Potato Chips - Honey Mustard 1.00 DZ 6-Aug-26 16:02
(DF, V) (bag)
13:00 14:30 Gourmet Potato Chips - Sour Cream Herb 2.00 DZ 6-Aug-26 16:02
& Onion (DF, V) (bag)`,
  },
  // --- Guest-Facing Buffet Cards ---
  {
    id: 'dessert_reception',
    title: 'Luxury Gala Dessert Reception',
    category: 'buffet',
    station: 'Dessert Buffet',
    recommendedTemplateId: 'std-card-3.5x2',
    description: 'Artisan pastries, wildberry donuts, petit tiramisu, and chocolate tarts with dietary codes',
    rawText: `=== ARTISAN PASTRY & DESSERT STATION ===
Mini Stuffed Artisan Donuts - Wildberry 1.00 DZ (V)
Mini Stuffed Artisan Donuts - Hazelnut & Cocoa (V, CN) 1.00 DZ
Mini Stuffed Artisan Donuts - Salted Caramel (V) 1.00 DZ
Mini Stuffed Artisan Donuts - Dark Belgian Chocolate (V) 1.00 DZ
Seasonal Whole & Sliced Fruit Platter (GF, DF, V, VE) 4.00 DZ
Petit Tiramisu with Espresso Dust (V) 1.00 DZ
Key Lime Cheesecake Bites (V) 1.00 DZ
Wild Berry Panna Cotta with Mint (GF, V) 1.00 DZ
Vegan Valrhona Chocolate Tart (GF, DF, V, VE) 1.00 DZ
Gourmet Seasoned Popcorn - Truffle and Herb (GF, DF, V, VE) (5oz bag)
Gourmet Seasoned Popcorn - Tangy Dill & Sea Salt (GF, DF, V, VE) (5oz bag)
Warm Churros with Cinnamon Sugar & Mexican Chocolate Dip (V)`,
  },
  {
    id: 'banquet_dinner',
    title: 'Grand Banquet Dinner & Carving Station',
    category: 'buffet',
    station: 'Main Entrées',
    recommendedTemplateId: 'tent-card-3.5x4',
    description: 'Herb crusted prime rib, cedar plank salmon, risotto, and roasted vegetables (Tent cards)',
    rawText: `=== CHEF CARVING & HOT ENTRÉES ===
18:00 20:30 Rosemary & Garlic Crusted Prime Rib of Beef (GF, DF) (served with horseradish cream)
18:00 20:30 Wild Pacific Salmon with Lemon Herb Butter (GF, SF)
18:00 20:30 Free-Range Roasted Chicken Breast with Wild Thyme Jus (GF, DF, HAL)
18:00 20:30 Creamy Arborio Truffle Risotto with Wild Foraged Mushrooms (GF, V)
18:00 20:30 Roasted Heirloom Tri-Color Carrots with Maple Tahini (GF, DF, V, VE)
18:00 20:30 Garlic Confit Fingerling Potatoes (GF, DF, V, VE)
=== SALAD & ARTISAN BREAD ===
18:00 20:30 Baby Tuscan Kale & Shaved Fennel Salad (GF, DF, V, VE) (citrus vinaigrette)
18:00 20:30 Burrata Pugliese with Heirloom Tomatoes & Aged Balsamic (GF, V)
18:00 20:30 Warm Rustic Sourdough Loaf with Whipped Sea Salt Butter (V)`,
  },

  // --- 8.5" x 11" Bar & Beverage Menus ---
  {
    id: 'wedding_host_bar',
    title: 'Wedding & Gala Host Bar (8.5" × 11")',
    category: 'bar_menu',
    station: 'Open Host Bar',
    recommendedTemplateId: 'sheet-bar-8.5x11',
    description: 'Complimentary hosted bar with signature cocktails, reserve wines, craft beers & zero-proof mocktails',
    rawText: `=== SIGNATURE COCKTAILS ===
The Golden Hour Spritz | Empress 1908 Gin, Elderflower Liqueur, Prosecco, Fresh Grapefruit Twist | Hosted
Smoked Rosemary Old Fashioned | Woodford Reserve Bourbon, Demerara, Angostura, Torched Rosemary Smoke | Hosted
French 75 Royale | Courvoisier Cognac, Lemon Juice, Simple Syrup, Champagne Brut | Hosted
Blackberry Sage Smash | Casamigos Blanco Tequila, Muddled Blackberries, Fresh Lime, Agave | Hosted

=== SOMMELIER WINE SELECTION ===
2022 Napa Valley Reserve Cabernet Sauvignon | Rutherford Estate • Bold Oak, Blackberry, Cassis | Hosted
2023 Sonoma Coast Chardonnay | Russian River Valley • Crisp Green Apple, Brioche, Vanilla | Hosted
2021 Provence Rosé | Château d'Esclans • Wild Strawberry, White Peach, Floral Minerality | Hosted
NV Veuve Clicquot Yellow Label Brut | Reims, France • Ripe Peach, Toast, Crisp Effervescence | Hosted

=== CRAFT BEER & CIDERS ===
Allagash White Belgian Wheat | Portland, ME • 5.2% ABV | Hosted
Lagunitas Hazy Wonder IPA | Petaluma, CA • 6.0% ABV | Hosted
Peroni Nastro Azzurro Premium Lager | Rome, Italy • 5.1% ABV | Hosted
Aval Artisanal French Hard Cider | Brittany, France • 6.0% ABV (GF) | Hosted

=== ZERO-PROOF & ARTISAN MOCKTAILS ===
Cucumber Basil Refresher | Seedlip Spice 94, English Cucumber, Fresh Lime, Soda | Hosted
Wildberry Lavender Fizz | House Blackberry Puree, Lavender Blossom Syrup, Sparkling Water | Hosted`,
  },
  {
    id: 'cocktail_lounge_cash_bar',
    title: 'Craft Cocktail Lounge Cash Bar (8.5" × 11")',
    category: 'bar_menu',
    station: 'Main Bar',
    recommendedTemplateId: 'sheet-bar-8.5x11',
    description: 'Itemized cash bar menu with customizable prices for cocktails ($15), wines ($12), beers ($8), and spirits',
    rawText: `=== SIGNATURE COCKTAILS ===
Smoked Maple Bourbon Old Fashioned | Buffalo Trace, Vermont Maple, House Bitters, Orange Peel | $16.00
Spicy Hibiscus Mezcalita | Ilegal Mezcal, Cointreau, Hibiscus Agave, Habanero Salt Rim | $15.00
Espresso Martini Deluxe | Ketel One Vodka, Fresh Espresso, Mr Black Coffee Liqueur, Cocoa | $16.00
Empress Botanical Gin & Tonic | Empress 1908 Gin, Fever-Tree Elderflower Tonic, Juniper & Thyme | $14.00

=== WINES BY THE GLASS ===
Justin Cabernet Sauvignon | Paso Robles 2021 • Rich Plum & Vanilla | $14.00
Kim Crawford Sauvignon Blanc | Marlborough 2023 • Crisp Passionfruit & Citrus | $12.00
Whispering Angel Rosé | Côtes de Provence 2022 • Fresh Strawberry & Citrus | $13.00
La Marca Prosecco DOC | Veneto, Italy • Delicate Peach & Crisp Bubbles | $11.00

=== CRAFT DRAFT & BOTTLED BEER ===
Sierra Nevada Hazy Little Thing IPA | Chico, CA • 6.7% ABV | $8.00
Stella Artois European Pilsner | Belgium • 5.0% ABV | $7.50
Guinness Extra Stout | Dublin, Ireland • 5.6% ABV | $8.50
Corona Extra with Lime | Mexico • 4.6% ABV | $7.00

=== ZERO-PROOF BEVERAGES ===
Pomegranate Rosemary Spritzer | Fresh Pomegranate, Rosemary Syrup, Sparkling Water | $7.00
Fever-Tree Ginger Beer | Natural Spicy Ginger & Fresh Lime | $5.00`,
  },
  {
    id: 'subsidized_corporate_bar',
    title: 'Corporate Subsidized Bar (8.5" × 11")',
    category: 'bar_menu',
    station: 'Event Bar',
    recommendedTemplateId: 'sheet-bar-8.5x11',
    description: 'Subsidized bar pricing ($3 / $4 per drink) with sponsor host header and drink tickets notice',
    rawText: `=== PREMIUM COCKTAILS ===
Barrel-Aged Manhattan | Bulleit Rye, Sweet Vermouth, Bitters, Luxardo Cherry | $4.00
Moscow Mule | Grey Goose Vodka, Fresh Lime Juice, Craft Ginger Beer, Copper Mug | $4.00
Classic Paloma | Casamigos Reposado, Fresh Ruby Red Grapefruit Juice, Agave, Lime | $4.00

=== WINE & SPARKLING ===
J. Lohr Seven Oaks Cabernet | Central Coast 2021 | $3.00
Kendall-Jackson Vintner's Reserve Chardonnay | California 2022 | $3.00
Mionetto Prosecco Prestige DOC | Treviso, Italy | $3.00

=== PREMIUM BEER SELECTION ===
Firestone Walker 805 Blonde Ale | Paso Robles, CA • 4.7% ABV | $2.50
Elysian Space Dust IPA | Seattle, WA • 8.2% ABV | $3.00
Modelo Especial | Mexico • 4.4% ABV | $2.50

=== CRAFT SODAS & JUICES ===
San Pellegrino Sparkling Mineral Water (Blood Orange or Lemon) | $1.50
Iced Hibiscus Berry Herbal Tea | Compliments of Sponsor | $0.00`,
  },

  // --- 8.5" x 11" Full Menu Sheet & Posters ---
  {
    id: 'full_banquet_menu_sheet',
    title: 'Grand Gala 8.5" × 11" Banquet Menu Sheet',
    category: 'full_menu_sheet',
    station: 'Dinner Menu',
    recommendedTemplateId: 'sheet-full-8.5x11',
    description: 'Complete 8.5" × 11" multi-course dinner menu with appetizers, entrées, desserts, and sommelier pairings',
    rawText: `=== HORS D'OEUVRES & STARTERS ===
Wild Mushroom & Truffle Velouté | Crispy Brioche Crouton, Chive Oil (V)
Heirloom Tomato & Burrata Salad | Aged Modena Balsamic, Pine Nut Pesto, Micro Basil (GF, V, CN)
Jumbo Lump Crab Cake | Sweet Corn Coulis, Remoulade, Pickled Mustard Seeds (SF)

=== PLATED ENTRÉES ===
Prime Center Cut Filet Mignon | Truffle Pomme Purée, Glazed Asparagus, Port Wine Demi-Glace (GF)
Chilean Sea Bass with Miso Glaze | Forbidden Black Rice, Baby Bok Choy, Ginger Lemongrass Emulsion (GF, DF, SF)
Roasted Acorn Squash & Quinoa Risotto | Foraged Chanterelles, Crispy Sage, Toasted Pumpkin Seeds (GF, DF, V, VE)

=== ARTISAN DESSERTS ===
Valrhona Dark Chocolate Marquise | Salted Caramel Crisp, Raspberry Coulis, Gold Leaf (GF, V)
Meyer Lemon Meyer Tart | Torched Italian Meringue, Candied Citrus Zest (V)

=== SOMMELIER WINE PAIRINGS ===
Starters: 2023 Sancerre Domaine Vacheron (Loire Valley, France)
Entrées: 2021 Caymus Napa Valley Cabernet Sauvignon (California)
Dessert: 2018 Château d'Yquem Sauternes (Bordeaux, France)`,
  },
  {
    id: 'single_dish_poster',
    title: 'Chef\'s Feature Special 8.5" × 11" Poster',
    category: 'full_menu_sheet',
    station: 'Chef Feature',
    recommendedTemplateId: 'sheet-full-8.5x11',
    description: 'Eye-catching single item showcase poster for carving stations, daily specials, or signature dishes',
    rawText: `=== CHEF'S DAILY MASTERPIECE ===
Dry-Aged Tomahawk Ribeye for Two | 45-day Himalayan salt aged prime ribeye carved tableside, served with roasted marrow bone, black truffle compound butter, garlic confit fingerlings, and charred broccolini | (GF) | $120.00`,
  },

  // --- Boxed Lunch & Catering Container Stickers ---
  {
    id: 'boxed_lunches_corporate',
    title: 'Executive Boxed Lunches (Individual Stickers)',
    category: 'boxed_lunch',
    station: 'Boxed Meals',
    recommendedTemplateId: 'sticker-box-4x2',
    description: 'Corporate catering meal boxes with guest names, artisan sandwiches, dietary tags & prep dates',
    rawText: `=== EXECUTIVE CATERING BOXED LUNCHES ===
For: Sarah Jenkins | Smoked Turkey Breast & Aged White Cheddar on Rosemary Focaccia | Prep: Aug 15 | Exp: Aug 17 | (Keep Refrigerated)
For: Michael Chang | Grilled Chimichurri Flank Steak Wrap with Pickled Red Onion | Prep: Aug 15 | Exp: Aug 17 | (GF, DF, HAL)
For: Elena Rostova | Roasted Mediterranean Vegetable & Hummus Grain Bowl | Prep: Aug 15 | Exp: Aug 17 | (GF, DF, V, VE)
For: David Sterling | Herb Roasted Chicken Breast with Basil Pesto & Arugula | Prep: Aug 15 | Exp: Aug 17 | (GF, CN, HAL)
For: Priya Patel | Curried Chickpea & Quinoa Salad with Avocado Lime Dressing | Prep: Aug 15 | Exp: Aug 17 | (GF, DF, V, VE, NF)
For: James Wilson | Wild Pacific Smoked Salmon Bagel with Dill Cream Cheese | Prep: Aug 15 | Exp: Aug 17 | (SF, PESC)
For: Dr. Marcus Vance | Artisanal Prosciutto & Burrata Baguette with Fig Jam | Prep: Aug 15 | Exp: Aug 17 | (PORK)
For: Chloe Bennett | Grilled Portobello & Goat Cheese Panini with Balsamic Glaze | Prep: Aug 15 | Exp: Aug 17 | (V)`,
  },

  // --- Kitchen Prep & Jar Stickers ---
  {
    id: 'kitchen_prep_stickers',
    title: 'Kitchen Prep & Food Rotation Stickers',
    category: 'kitchen_prep',
    station: 'Garde Manger',
    recommendedTemplateId: 'sticker-prep-2.6x1',
    description: 'Chef rotation tags for sauces, dressings, bakery doughs, and prepared batches with dates & allergens',
    rawText: `=== KITCHEN PREP & ROTATION TAGS ===
Truffle Garlic Aioli | Prep: Aug 15 08:00 AM | Best By: Aug 20 | Chef Marco | (V, EG)
House Basil Pine Nut Pesto | Prep: Aug 15 09:30 AM | Best By: Aug 22 | Chef Elena | (V, CN)
Citrus Champagne Vinaigrette | Prep: Aug 15 10:00 AM | Best By: Aug 28 | Chef Marco | (GF, DF, V, VE)
Smoked Chipotle BBQ Glaze | Prep: Aug 14 02:00 PM | Best By: Sep 01 | Chef Lucas | (GF, DF, V, VE)
Wild Mushroom Reduction Sauce | Prep: Aug 15 11:00 AM | Best By: Aug 18 | Chef Marco | (GF, V)
Organic Chia Mango Pudding Cups | Prep: Aug 15 07:00 AM | Best By: Aug 17 | Pastry Chef Chloe | (GF, DF, V, VE)
Artisan Sourdough Starter Batch #4 | Prep: Aug 15 06:00 AM | Best By: Aug 25 | Pastry Team | (V, VE)
House Pickled Red Onions & Jalapeños | Prep: Aug 13 03:00 PM | Best By: Sep 15 | Chef Lucas | (GF, DF, V, VE, SPICY)`,
  },

  // --- Universal & Multi-Purpose Professional Labels ---
  {
    id: 'universal_conference_tags',
    title: 'Universal Conference & Product Labels',
    category: 'universal',
    station: 'Registration & Retail',
    recommendedTemplateId: 'std-card-3.5x2',
    description: 'Conference badges, retail artisan jars, and storage organization labels for any professional field',
    rawText: `=== PROFESSIONAL BADGES & RETAIL TAGS ===
Dr. Alexander Wright | Keynote Speaker • Global Tech Summit 2026 | VIP All-Access Pass | Room: Main Hall
Sophia Sterling | Executive Director • Green Horizon Labs | VIP Delegate | Room: Executive Lounge
Marcus Aurelius Vance | Lead Software Architect • Cloud Systems | Attendee | Table 14
Artisan Lavender Honey Jar (8oz) | 100% Raw Wildflower Honey • Handcrafted in Sonoma Valley | $14.00
Hand-Poured Soy Candle - Cedarwood & Amber | 45-Hour Clean Burn • Natural Essential Oils | $22.00
Storage Bin #A-104 | High-Speed Thunderbolt & USB-C Cabling Kits | IT Logistics Dept
Asset Tag #DEV-8842 | Precision 4K Calibration Monitor | Studio Production Suite`,
  },
];
