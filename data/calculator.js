// Planning estimates in USD, [low, high]. These are starting assumptions, NOT quotes.
// Replace them with real supplier prices as you collect them.
module.exports = {
  updated: "November 2026",
  types: {
    home: { name: "Home or studio photo printing (prints up to 17 to 24 in)", items: [
      ["Professional photo inkjet printer", 1300, 4500], ["Calibrated monitor and computer", 800, 2500],
      ["Colour management tools", 200, 600], ["Starter paper and ink", 400, 1200],
      ["Trimmer, packaging and finishing", 300, 900], ["Software and website", 200, 800],
      ["Marketing and sample prints", 300, 1500], ["Working capital (3 months)", 1000, 3000]] },
    wide: { name: "Wide-format print shop (posters, banners, murals up to 44 to 64 in)", items: [
      ["Wide-format printer", 4000, 25000], ["Laminator", 1500, 6000], ["Cutter or plotter", 2000, 8000],
      ["RIP and colour software", 500, 3500], ["Workspace setup and ventilation", 2000, 10000],
      ["Media and ink stock", 1500, 6000], ["Computer and monitor", 1500, 3500],
      ["Licences and insurance", 500, 2500], ["Website and marketing", 1000, 5000], ["Working capital (3 months)", 4000, 15000]] },
    lab: { name: "Professional photo lab (prints, albums, wholesale to photographers)", items: [
      ["Dye-sub or minilab print system", 10000, 60000], ["Installation and training", 500, 4000],
      ["Album and finishing equipment", 3000, 15000], ["Media and chemistry stock", 2000, 8000],
      ["Colour management", 500, 2000], ["Order management software", 500, 3000],
      ["Workspace setup", 2000, 12000], ["Computers", 2000, 5000],
      ["Website and marketing", 2000, 6000], ["Working capital (3 months)", 5000, 20000]] },
    sign: { name: "Sign and large-format graphics shop", items: [
      ["Large-format printer", 10000, 60000], ["Cutting plotter", 3000, 10000], ["Laminator", 2000, 8000],
      ["Vinyl and media stock", 3000, 10000], ["Installation tools and vehicle", 3000, 15000],
      ["Design software and RIP", 1000, 5000], ["Workspace setup", 3000, 15000],
      ["Licences, permits and insurance", 1000, 4000], ["Website and marketing", 2000, 8000], ["Working capital (3 months)", 6000, 20000]] },
  },
  tiers: { budget: { name: "Budget or used equipment", a: 0, b: 0.4 }, standard: { name: "Mid-range", a: 0.3, b: 0.7 }, premium: { name: "Premium or new", a: 0.6, b: 1 } },
};
