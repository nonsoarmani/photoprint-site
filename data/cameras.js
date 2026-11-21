// [name, width px, height px, batch]. Pixel sizes are each camera's maximum still resolution.
// Check them against the maker's spec sheet before you publish a new wave.
const raw = [
  ["iPhone 12, 13 and 14 (12 MP)", 4032, 3024, 1],
  ["iPhone 14 Pro, 15 and 16 (48 MP mode)", 8064, 6048, 1, "Most iPhones save 24 MP photos by default. To capture the full 48 MP, turn on Resolution Control (ProRAW & Resolution Control on Pro models) in Settings > Camera > Formats, then choose a Max option in the Camera app. Only the main 1x camera shoots 48 MP."],
  ["iPhone 15 and 15 Pro (default 24 MP)", 5712, 4284, 1, "This is the default size for the main camera on iPhone 15 models. The ultrawide and telephoto cameras save 12 MP (4032 × 3024)."],
  ["Samsung Galaxy S23 Ultra (200 MP mode)", 16320, 12240, 2],
  ["Canon EOS R5", 8192, 5464, 1],
  ["Canon EOS R6 Mark II", 6000, 4000, 1], ["Canon EOS R10", 6000, 4000, 1],
  ["Canon EOS R7", 6960, 4640, 1], ["Canon EOS 90D", 6960, 4640, 2],
  ["Canon EOS 5D Mark IV", 6720, 4480, 1], ["Canon EOS R", 6720, 4480, 2],
  ["Nikon Z8", 8256, 5504, 1], ["Nikon Z7 II", 8256, 5504, 1], ["Nikon D850", 8256, 5504, 1],
  ["Nikon Z6 II", 6048, 4024, 1], ["Nikon D750", 6016, 4016, 2], ["Nikon Z5", 6016, 4016, 2],
  ["Sony A7 III", 6000, 4000, 1], ["Sony A6400", 6000, 4000, 1],
  ["Sony A7 IV", 7008, 4672, 1], ["Sony A7R V", 9504, 6336, 1], ["Sony A7R IV", 9504, 6336, 1],
  ["Sony A1", 8640, 5760, 2],
  ["Fujifilm X-T5", 7728, 5152, 1], ["Fujifilm X-T4", 6240, 4160, 2], ["Fujifilm GFX 100S", 11648, 8736, 1],
  ["Leica Q3", 9528, 6344, 2], ["OM System OM-1", 5184, 3888, 2],
];
// Generic megapixel pages (3:2 shape)
[8, 12, 16, 20, 24, 33, 45, 61, 100].forEach(mp => {
  const w = Math.round(Math.sqrt(mp * 1e6 * 1.5)), h = Math.round(w / 1.5);
  raw.push([mp + " megapixel photo", w, h, 1]);
});
const groups = {};
raw.forEach(([name, pw, ph, b, note]) => {
  const maker = /megapixel/.test(name) ? "generic" : name.split(" ")[0];
  const key = maker + pw + "x" + ph;
  (groups[key] = groups[key] || { maker, pw, ph, names: [], b }).names.push(name);
  groups[key].b = Math.min(groups[key].b, b);
  if (note) groups[key].note = note;
});
module.exports = Object.values(groups).map(g => {
  const list = g.names.length > 1 ? g.names.slice(0, -1).join(", ") + " and " + g.names.slice(-1) : g.names[0];
  const slug = (g.maker === "generic" ? g.names[0] : g.names.join(" ")).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 70);
  return Object.assign(g, { label: list, slug, mp: g.pw * g.ph / 1e6 });
});
