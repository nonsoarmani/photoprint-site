const fs = require("fs"), path = require("path");
const C = require("./site.config.js"), cams = require("./data/cameras.js"), sizes = require("./data/sizes.js");
const uses = require("./data/usecases.js"), guides = require("./data/guides.js"), calc = require("./data/calculator.js");
const R = p => fs.readFileSync(path.join(__dirname, p), "utf8"), D = path.join(__dirname, "dist");
const TOOL = R("src/tool.html"), QUOTE = R("src/quote.html"), CSS = R("src/style.css"), V = Date.now();
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const nf = n => Math.round(n).toLocaleString("en-US"), f1 = n => (Math.round(n * 10) / 10).toString(), cm = n => nf(n * 2.54);
const need = d => Math.min(300, Math.max(30, Math.round(5000 / d)));
const DIST = [[36, "Wall art (3 ft)"], [96, "Across a room (8 ft)"], [180, "Lobby or storefront (15 ft)"]];
const TIERS = [[300, "Fine art"], [200, "Sharp"], [150, "Standard"], [100, "Large format"]];
const live = x => x.b <= C.maxBatch;
const LC = cams.filter(live), LS = sizes.filter(live);
const label = ppi => ppi >= 250 ? "Excellent" : ppi >= 150 ? "Great" : ppi >= 100 ? "Good at wall distance" : ppi >= 50 ? "Best from a distance" : "Too low";
const short = g => g.maker === "generic" ? "a " + Math.round(g.mp) + " MP photo" : g.names.length === 1 ? g.names[0] : g.names.length === 2 ? g.names.join(" & ") : g.names[0] + " & " + (g.names.length - 1) + " more";
fs.rmSync(D, { recursive: true, force: true }); fs.mkdirSync(D, { recursive: true });
const pages = [];
const NAV = [["/", "Checker"], ["/largest-print-size/", "By camera"], ["/photo-resolution-for/", "By print size"], ["/image-size-for/", "Business uses"], ["/for-photographers/", "Photographers"], ["/photo-printing-business-cost-calculator/", "Startup costs"], ["/guides/", "Guides"]];
const LOGO = '<svg width="26" height="26" viewBox="0 0 26 26" fill="none" aria-hidden="true"><circle cx="13" cy="13" r="8" stroke="currentColor" stroke-width="2"/><path d="M13 1v7M13 18v7M1 13h7M18 13h7" stroke="var(--acc)" stroke-width="2" stroke-linecap="round"/></svg>';
function put(p, html) { const f = path.join(D, p, "index.html"); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, html); }
const tiles = a => '<div class="grid c2">' + a.map(([h, t, d]) => `<a class="tile" href="${h}"><b>${esc(t)}</b><span>${esc(d || "")}</span></a>`).join("") + "</div>";
const faqHtml = l => '<section class="faq mt"><h2>Frequently asked questions</h2>' + l.map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("") + "</section>";
const tbl = (h, rows) => `<div class="tw"><table><thead><tr>${h.map((x, i) => `<th${i ? ' style="text-align:right"' : ""}>${x}</th>`).join("")}</tr></thead><tbody>${rows.map(r => "<tr>" + r.map((c, i) => i ? `<td>${c}</td>` : `<th>${c}</th>`).join("") + "</tr>").join("")}</tbody></table></div>`;
function page(o) {
  const p = o.path, url = C.url + p, t = /photoprint/.test(o.title) ? o.title : o.title + " | " + C.name;
  if (!o.noindex) pages.push(p);
  const ld = [...(o.ld || [])], cr = o.crumbs || [];
  if (cr.length) ld.push({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [["Home", "/"], ...cr].map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c[0], item: C.url + (c[1] || p) })) });
  if (o.faq) ld.push({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: o.faq.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })) });
  const nav = NAV.map(([h, n]) => `<a href="${h}"${(h === "/" ? p === "/" : p.startsWith(h)) ? " aria-current=\"page\"" : ""}>${n}</a>`).join("");
  const crumbs = cr.length ? '<p class="crumbs"><a href="/">Home</a>' + cr.map((c, i) => " / " + (i < cr.length - 1 ? `<a href="${c[1]}">${esc(c[0])}</a>` : esc(c[0]))).join("") + "</p>" : "";
  const quote = o.noquote ? "" : '<div class="m">' + QUOTE + "</div>";
  const scripts = `<script>window.SITE=${JSON.stringify({ formKey: C.formKey, email: C.email })};window.PRESET=${JSON.stringify(o.preset || null)};${o.inject || ""}</script>` + (o.tool ? `<script src="/checker.js?v=${V}"></script>` : "") + (o.calc ? `<script src="/calc.js?v=${V}"></script>` : "") + (o.noquote ? "" : `<script src="/quote.js?v=${V}"></script>`);
  put(p, `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><title>${esc(t)}</title><meta name="description" content="${esc(o.desc)}"><link rel="canonical" href="${url}">${o.noindex ? '<meta name="robots" content="noindex">' : ""}<meta property="og:title" content="${esc(t)}"><meta property="og:description" content="${esc(o.desc)}"><meta property="og:url" content="${url}"><meta property="og:type" content="website"><meta name="twitter:card" content="summary"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet"><style>${CSS}</style>${ld.map(x => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join("")}</head><body><div class="wrap"><div class="top"><a class="logo" href="/">${LOGO}photoprint</a></div><nav class="pills" aria-label="Main">${nav}</nav>${crumbs}<main>${o.body}${quote}</main><footer><div class="fl"><a href="/largest-print-size/">By camera</a><a href="/photo-resolution-for/">By print size</a><a href="/image-size-for/">Business uses</a><a href="/guides/">Guides</a><a href="/privacy/">Privacy</a></div><p>© ${new Date().getFullYear()} ${C.name}. Print sizes and cost figures are planning guides, not quotes.</p></footer></div>${scripts}</body></html>`);
}
const sizeLink = s => [`/photo-resolution-for/${s.slug}/`, `Photo resolution for a ${s.label} print`, s.note];
const useLink = u => [`/image-size-for/${u.slug}/`, `Image size for a ${u.name}`, u.desc.split(",")[0]];
const header = (h, lead) => `<h1 class="pg">${h}</h1>${lead ? `<p class="lead">${lead}</p>` : ""}`;

// HOME
page({ path: "/", title: "Print Size & Quality Checker: How Big Can You Print Your Photo?", desc: "Free print size and quality checker. Upload a photo and see the largest size you can print sharp, how it looks at your viewing distance, and get a print quote. Private and instant.", tool: true, preset: { intent: "print" },
  ld: [{ "@context": "https://schema.org", "@type": "WebApplication", name: "Print Size & Quality Checker", url: C.url, applicationCategory: "MultimediaApplication", operatingSystem: "Any", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }],
  faq: [["What resolution do I need to print a photo?", "For prints held in the hand, aim for 300 pixels per inch. For wall prints, 150 is usually enough. Large murals and banners viewed from a distance can go as low as 30 to 50 pixels per inch."], ["Is my photo uploaded?", "No. The checker runs in your browser and your photo never leaves your device."], ["Can I print a phone photo as a large poster?", "A 12 MP phone photo prints well up to about 16 × 20 inches. A 48 MP photo can reach poster and small mural sizes."]],
  body: `<h1>How big can you print this photo?</h1><p class="lead">Drop in an image and see the largest size it prints sharp, how it will look at your viewing distance, and what it looks like next to a real person. Free and private. Your photo stays on your device.</p>${TOOL}
<section class="mt"><h2>What do you want to do?</h2><div class="grid c3"><a class="tile" href="/image-size-for/"><b>Print for a business</b><span>Murals, window graphics, canvas and metal prints.</span></a><a class="tile" href="/for-photographers/"><b>Find a pro lab</b><span>Wholesale printing and albums for photographers.</span></a><a class="tile" href="/photo-printing-business-cost-calculator/"><b>Start a print business</b><span>Estimate equipment and startup costs.</span></a></div></section>
<section class="mt"><h2>Check your camera or phone</h2>${tiles(LC.filter(g => g.maker !== "generic").slice(0, 6).map(g => [`/largest-print-size/${g.slug}/`, short(g), f1(g.mp) + " megapixels"]))}<p><a href="/largest-print-size/">See all cameras and phones</a></p></section>
${faqHtml([["What resolution do I need to print a photo?", "For prints held in the hand, aim for 300 pixels per inch. For wall prints, 150 is usually enough. Large murals and banners viewed from a distance can go as low as 30 to 50 pixels per inch."], ["Is my photo uploaded?", "No. The checker runs in your browser and your photo never leaves your device."], ["Can I print a phone photo as a large poster?", "A 12 MP phone photo prints well up to about 16 × 20 inches. A 48 MP photo can reach poster and small mural sizes."]])}` });

// CAMERAS
LC.forEach(g => {
  const gen = g.maker === "generic", mp = f1(g.mp), ppiAt = (w, h) => Math.min(g.pw / Math.max(w, h), g.ph / Math.min(w, h));
  const m300 = [g.pw / 300, g.ph / 300], m150 = [g.pw / 150, g.ph / 150], wall = need(36);
  const sub = LS.filter(s => s.t), a24 = ppiAt(24, 36), a48 = ppiAt(48, 96);
  const subj = gen ? `A ${g.label}` : `Photos from ${g.label}`;
  const faq = [[`What is the largest print size for ${g.label}?`, `${subj} measure ${gen ? "about " : ""}${nf(g.pw)} × ${nf(g.ph)} pixels. For a fine-art quality print at 300 pixels per inch, the largest size is ${f1(m300[0])} × ${f1(m300[1])} inches (${cm(m300[0])} × ${cm(m300[1])} cm). For a wall print at 150 pixels per inch, it is ${f1(m150[0])} × ${f1(m150[1])} inches.`],
    [`Can ${gen ? "a " : ""}${g.label} print a 24 × 36 inch poster?`, `At 24 × 36 inches the print would have ${nf(a24)} pixels per inch, which is rated ${label(a24).toLowerCase()}.`],
    [`Can I print a 4 × 8 ft mural from ${gen ? "a " : ""}${g.label}?`, `At 48 × 96 inches the print would have ${nf(a48)} pixels per inch. ${a48 >= 40 ? "That is enough for a mural viewed from a few feet away." : "That is low, so plan a bigger viewing distance, AI upscaling, or a smaller size."}`]];
  const same = LC.filter(x => x.maker === g.maker && x !== g && !gen).slice(0, 5), near = LC.filter(x => x !== g).sort((a, b) => Math.abs(a.mp - g.mp) - Math.abs(b.mp - g.mp)).slice(0, 4);
  const rel = [...new Map([...same, ...near].map(x => [x.slug, x])).values()].slice(0, 6);
  page({ path: `/largest-print-size/${g.slug}/`, title: gen ? `Largest Print Size for a ${Math.round(g.mp)} MP Photo` : `Largest Print Size for ${short(g)} (${mp} MP)`, desc: `${subj} are ${nf(g.pw)} × ${nf(g.ph)} pixels. See the largest print size at 300, 200 and 150 PPI, and how it looks at poster and mural sizes.`, tool: true, preset: { pw: g.pw, ph: g.ph, w: 24, h: 36, d: 36, intent: "print" }, faq, crumbs: [["By camera", "/largest-print-size/"], [short(g)]],
    body: `${header(`Largest print size for ${esc(g.label)}`, `${esc(subj)} measure ${gen ? "about " : ""}<b>${nf(g.pw)} × ${nf(g.ph)} pixels</b> (${mp} megapixels). Here is how big that prints, and how sharp it looks at common sizes.`)}
<div class="card"><div class="stat"><div><b>${mp} MP</b><span>Resolution</span></div><div><b>${f1(m300[0])} × ${f1(m300[1])} in</b><span>Max at 300 PPI (fine art)</span></div><div><b>${f1(m150[0])} × ${f1(m150[1])} in</b><span>Max at 150 PPI (wall print)</span></div><div><b>${f1(g.pw / wall)} × ${f1(g.ph / wall)} in</b><span>Max for wall viewing at 3 ft</span></div></div></div>
<section class="mt prose"><h2>Largest print by quality level</h2>${tbl(["Quality", "Pixels per inch", "Largest print"], TIERS.map(([q, n]) => [n === 300 ? "Fine art" : n === 200 ? "Sharp" : n === 150 ? "Standard" : "Large format", n, `${f1(g.pw / q)} × ${f1(g.ph / q)} in<br><small>${cm(g.pw / q)} × ${cm(g.ph / q)} cm</small>`]))}
<h2>Largest print by viewing distance</h2><p>People standing farther back cannot see fine detail, so the same file can be printed much larger.</p>${tbl(["Viewed from", "PPI needed", "Largest print"], DIST.map(([d, n]) => [n, need(d), `${f1(g.pw / need(d))} × ${f1(g.ph / need(d))} in`]))}
<h2>How it looks at common sizes</h2>${tbl(["Print size", "PPI", "Rating"], sub.map(s => { const x = ppiAt(s.w, s.h); return [esc(s.label), nf(x), label(x)]; }))}</section>
<section class="mt"><h2>Check your own photo</h2>${TOOL}</section>${faqHtml(faq)}
<section class="mt"><h2>Related</h2>${tiles([...rel.map(x => [`/largest-print-size/${x.slug}/`, `Largest print size for ${short(x)}`, f1(x.mp) + " megapixels"]), ...LS.filter(s => [24, 36, 48].includes(s.w) || s.slug === "48x96").slice(0, 3).map(sizeLink), useLink(uses[0])])}</section>` });
});

// SIZES
LS.forEach(s => {
  const L = Math.max(s.w, s.h), S = Math.min(s.w, s.h), ok = (q) => LC.filter(g => Math.min(g.pw / L, g.ph / S) >= q).sort((a, b) => a.mp - b.mp);
  const r150 = ok(150), r300 = ok(300), i = LS.indexOf(s), near = [LS[i - 2], LS[i - 1], LS[i + 1], LS[i + 2]].filter(Boolean);
  const reach = r150.length ? `${r150.length} of the ${LC.length} camera and phone groups on this site reach 150 PPI at this size, starting from ${short(r150[0])} at ${f1(r150[0].mp)} MP.` : `None of the cameras on this site reach 150 PPI natively at this size, so plan a larger viewing distance, upscaling, or a smaller print.`;
  const faq = [[`What resolution do I need for a ${s.label} print?`, `For fine art quality (300 PPI) you need ${nf(L * 300)} × ${nf(S * 300)} pixels (${f1(L * S * 90000 / 1e6)} MP). For a standard wall print (150 PPI), ${nf(L * 150)} × ${nf(S * 150)} pixels (${f1(L * S * 22500 / 1e6)} MP) is enough.`], [`Can I print a ${s.label} from a phone photo?`, reach]];
  page({ path: `/photo-resolution-for/${s.slug}/`, title: `Photo Resolution for a ${s.label} Print`, desc: `Pixels and megapixels needed for a ${s.label} print at 300, 200, 150 and 100 PPI, and which cameras can do it.`, tool: true, preset: { w: s.w, h: s.h, d: 36, intent: "print" }, faq, crumbs: [["By print size", "/photo-resolution-for/"], [s.label]],
    body: `${header(`Photo resolution for a ${esc(s.label)} print`, `A ${esc(s.label)} print (${cm(s.w)} × ${cm(s.h)} cm) is ${s.note}. Here is the file size you need.`)}
<section class="prose"><h2>Pixels needed by quality</h2>${tbl(["Quality", "Pixels needed", "Megapixels"], TIERS.map(([q, n]) => [`${n} PPI`, `${nf(L * q)} × ${nf(S * q)}`, f1(L * S * q * q / 1e6) + " MP"]))}
<h2>Pixels needed by viewing distance</h2>${tbl(["Viewed from", "PPI", "Pixels needed"], DIST.map(([d, n]) => [n, need(d), `${nf(L * need(d))} × ${nf(S * need(d))}`]))}
<h2>Which cameras can do it?</h2><p>${reach} ${r300.length ? `${r300.length} reach full 300 PPI.` : ""}</p>${r150.length ? tiles(r150.slice(0, 4).map(g => [`/largest-print-size/${g.slug}/`, short(g), f1(g.mp) + " megapixels"])) : ""}</section>
<section class="mt"><h2>Check your own photo at this size</h2>${TOOL}</section>${faqHtml(faq)}
<section class="mt"><h2>Related</h2>${tiles([...near.map(sizeLink), useLink(uses[2])])}</section>` });
});

// USE CASES
uses.forEach(u => {
  const n = need(u.d), faq = u.faq, [fl, fw, fh] = u.sizes[0];
  page({ path: `/image-size-for/${u.slug}/`, title: `Image Size for a ${u.name[0].toUpperCase() + u.name.slice(1)}`, desc: u.desc, tool: true, preset: { w: fw, h: fh, d: u.d, intent: u.intent }, faq, crumbs: [["Business uses", "/image-size-for/"], [u.name]],
    body: `${header(`Image size for a ${esc(u.name)}`, esc(u.intro[0]))}
<section class="prose"><p>${esc(u.intro[1])}</p><h2>Recommended file sizes</h2><p>These targets assume people view the print from roughly ${u.d / 12} ft away, which needs about ${n} pixels per inch.</p>${tbl(["Size", "Good", "Best"], u.sizes.map(([l, w, h]) => [esc(l), `${nf(w * n * .75)} × ${nf(h * n * .75)} px`, `${nf(w * n)} × ${nf(h * n)} px`]))}
<h2>Tips before you order</h2><ul>${u.tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul></section>
<section class="mt"><h2>Test your image</h2>${TOOL}</section>${faqHtml(faq)}
<section class="mt"><h2>Related</h2>${tiles([...uses.filter(x => x !== u).slice(0, 3).map(useLink), ...LS.slice(3, 5).map(sizeLink)])}</section>` });
});

// HUBS
page({ path: "/largest-print-size/", title: "Largest Print Size by Camera or Phone", desc: "Find the largest print size your camera or phone can produce, with sharp, wall and mural sizes calculated from real pixel dimensions.", crumbs: [["By camera"]], noquote: false,
  body: `${header("Largest print size by camera or phone", "Pick your camera or phone to see the biggest sharp print it can make.")}${tiles(LC.map(g => [`/largest-print-size/${g.slug}/`, short(g), f1(g.mp) + " megapixels"]))}` });
page({ path: "/photo-resolution-for/", title: "Photo Resolution for Any Print Size", desc: "Pixels and megapixels needed for common print sizes, from 8 × 10 inch to wall murals.", crumbs: [["By print size"]],
  body: `${header("Photo resolution for any print size", "Choose a print size to see the pixels you need.")}${tiles(LS.map(sizeLink))}` });
page({ path: "/image-size-for/", title: "Image Size for Business Prints, Murals and Graphics", desc: "File size and resolution guides for hotel murals, restaurant walls, office graphics, window graphics and more.", crumbs: [["Business uses"]],
  body: `${header("Image size for business prints and graphics", "Choose your project to see recommended file sizes and tips, then get matched with a print partner.")}${tiles(uses.map(useLink))}` });
page({ path: "/guides/", title: "Print Guides", desc: "Plain-English guides on print resolution, wall murals and starting a photo printing business.", crumbs: [["Guides"]],
  body: `${header("Print guides")}${tiles(guides.map(g => [`/guides/${g.slug}/`, g.title, g.desc]))}` });
guides.forEach(g => page({ path: `/guides/${g.slug}/`, title: g.title, desc: g.desc, crumbs: [["Guides", "/guides/"], [g.title]], preset: { intent: g.slug.includes("business") ? "equip" : "print" },
  body: `${header(esc(g.title), esc(g.desc))}<article class="prose">${g.body}</article>` }));

// PHOTOGRAPHERS
page({ path: "/for-photographers/", title: "Find a Professional Photo Lab for Your Photography Business", desc: "Check your files for print size, then get matched with a wholesale professional lab for prints, albums and wall art.", tool: true, preset: { intent: "lab" }, crumbs: [["Photographers"]],
  faq: [["What should I look for in a pro lab?", "Check colour profiles, paper and finish options, turnaround, packaging, white-label shipping to your clients, and how they handle reprints."], ["How should I price prints?", "Start from your lab cost, add your time and profit, and aim for a price that reflects the value of a finished print, not just production cost."]],
  body: `${header("Find a professional photo lab for your photography business", "Check that your files are big enough, then tell us what you need and we’ll match you with a wholesale lab.")}${TOOL}<section class="prose mt"><h2>What to compare when choosing a lab</h2><ul><li>Print types: lustre, metallic, fine art, canvas, metal, acrylic, albums.</li><li>Colour: ICC profiles and soft proofing support.</li><li>Shipping: white-label drop shipping to your clients.</li><li>Turnaround and reprint policy.</li><li>Minimum order and trade pricing.</li></ul></section>${faqHtml([["What should I look for in a pro lab?", "Check colour profiles, paper and finish options, turnaround, packaging, white-label shipping to your clients, and how they handle reprints."], ["How should I price prints?", "Start from your lab cost, add your time and profit, and aim for a price that reflects the value of a finished print, not just production cost."]])}` });

// CALCULATOR
page({ path: "/photo-printing-business-cost-calculator/", title: "Photo Printing Business Startup Cost Calculator", desc: "Estimate the startup cost of a home studio, wide-format print shop, pro photo lab or sign shop, then get matched with equipment suppliers.", calc: true, preset: { intent: "equip" }, inject: `window.CALC=${JSON.stringify(calc)};`, crumbs: [["Startup cost calculator"]],
  faq: [["How much does it cost to start a photo printing business?", "A home studio can start from a few thousand dollars. Wide-format and sign shops often run from about $15,000 to $100,000. A full professional lab can exceed $100,000. Use the calculator above for a range."], ["Are these figures quotes?", "No. They are planning estimates. Get quotes from suppliers before you commit."]],
  body: `${header("Photo printing business startup cost calculator", "Choose your business type and equipment level to see a planning estimate. These are rough ranges, not quotes.")}
<div class="card"><h2>Business type</h2><div class="chips" id="ct"></div><h2 style="margin-top:22px">Equipment level</h2><div class="chips" id="cr"></div><div class="chips"><button type="button" class="chip" id="cw" aria-pressed="true">Include 3 months of working capital</button></div></div>
<div class="card m"><div class="meta">Estimated startup cost (USD)</div><div class="total" id="ctot"></div><div class="tw"><table><tbody id="cb"></tbody></table></div><button class="btn" id="cgo" type="button">Get equipment quotes</button></div>
<section class="prose mt"><h2>How to use this estimate</h2><p>Equipment is only part of the budget. The ranges include supplies, software, workspace setup, marketing and a few months of running costs. Prices vary by country, supplier, new or used equipment and shipping. Always request written quotes.</p></section>${faqHtml([["How much does it cost to start a photo printing business?", "A home studio can start from a few thousand dollars. Wide-format and sign shops often run from about $15,000 to $100,000. A full professional lab can exceed $100,000. Use the calculator above for a range."], ["Are these figures quotes?", "No. They are planning estimates. Get quotes from suppliers before you commit."]])}` });

// LEGAL + 404
page({ path: "/privacy/", title: "Privacy Policy", desc: "How photoprint.io handles your photos and quote requests.", crumbs: [["Privacy"]], noquote: true,
  body: `${header("Privacy policy")}<article class="prose"><p><b>Your photos.</b> The print checker runs in your browser. Photos are not uploaded to our servers.</p><p><b>Quote requests.</b> When you submit a request, we collect your email, country, project details and anything you add. We use it to contact you and, with your consent, share it with relevant print partners or suppliers who may contact you.</p><p><b>Analytics.</b> We may use privacy-friendly analytics to understand site usage.</p><p><b>Contact.</b> To ask us to delete your data, email ${C.email}.</p><p><small>This is a starter template, not legal advice. Have it reviewed for your region before launch.</small></p></article>` });

fs.writeFileSync(path.join(D, "404.html"), `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Page not found | ${C.name}</title><meta name="robots" content="noindex"><style>${CSS}</style></head><body><div class="wrap"><div class="top"><a class="logo" href="/">${LOGO}photoprint</a></div><h1 class="pg">Page not found</h1><p class="lead">That page doesn’t exist. Try the <a href="/">print size checker</a>.</p></div></body></html>`);
["checker.js", "quote.js", "calc.js"].forEach(f => fs.copyFileSync(path.join(__dirname, "src", f), path.join(D, f)));
fs.writeFileSync(path.join(D, "favicon.svg"), '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" fill="none"><circle cx="13" cy="13" r="8" stroke="#0F1217" stroke-width="2"/><path d="M13 1v7M13 18v7M1 13h7M18 13h7" stroke="#0A6FC2" stroke-width="2" stroke-linecap="round"/></svg>');
const day = new Date().toISOString().slice(0, 10);
fs.writeFileSync(path.join(D, "sitemap.xml"), '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + pages.map(p => `<url><loc>${C.url}${p}</loc><lastmod>${day}</lastmod></url>`).join("") + "</urlset>");
fs.writeFileSync(path.join(D, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${C.url}/sitemap.xml\n`);
console.log("Built " + pages.length + " pages (wave " + C.maxBatch + ") into dist/");
