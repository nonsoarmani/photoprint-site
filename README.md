# photoprint.io: setup guide (start to finish)

This folder builds your whole website: the print checker, camera pages, print-size pages, business pages,
the startup cost calculator, the lead form, sitemap and SEO tags. You never edit pages by hand.
You edit the files in `data/`, run one command, and the site rebuilds.

## Part 1: Install two free tools (one time)
1. Node.js: go to nodejs.org, download the LTS version, install it (click Next on everything).
2. Git: go to git-scm.com, download, install (click Next on everything).
Close and reopen VS Code afterwards.

## Part 2: Open and test the site on your computer
1. Unzip this folder. In VS Code: File > Open Folder > choose `photoprint-site`.
2. Open the terminal: Terminal menu > New Terminal.
3. Type `npm run build` and press Enter. You should see: `Built 53 pages (wave 1) into dist/`.
4. Type `npm run preview` and press Enter. Open the address it shows (usually http://localhost:3000).
   Press Ctrl+C in the terminal to stop it.

## Part 3: Set your details
Open `site.config.js`. Change `email` to your real address.
Get a form key: go to web3forms.com, enter your email, they send you an access key. Paste it in `formKey`.
All quote requests are then emailed to you with the project details.

## Part 4: Put it on GitHub
1. On github.com click New repository. Name it `photoprint-site`. Choose Private. Click Create.
2. In the VS Code terminal run these one at a time (replace the URL with yours from GitHub):
   git init
   git add .
   git commit -m "first version"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/photoprint-site.git
   git push -u origin main
   A browser window may ask you to sign in to GitHub. Do that.

## Part 5: Publish with Cloudflare
1. Cloudflare dashboard > Workers & Pages > Create application > Pages > Connect to Git.
2. Choose your `photoprint-site` repository.
3. Build command: `npm run build`   Build output directory: `dist`   Click Save and Deploy.
4. You get a free `something.pages.dev` link. Open it to see the live site.

## Part 6: Connect photoprint.io
1. Your domain must use Cloudflare's nameservers. In Cloudflare click Add a site > photoprint.io > Free plan.
   Cloudflare shows two nameservers. Paste them in the place where you bought the domain (the registrar). Wait until Cloudflare says Active.
2. Pages project > Custom domains > Set up a domain > `photoprint.io`. Repeat for `www.photoprint.io`.

## Part 7: Tell Google about it
1. search.google.com/search-console > Add property > Domain > photoprint.io. Add the DNS record it shows in Cloudflare (DNS > Add record > TXT).
2. In Search Console open Sitemaps and submit `sitemap.xml`.
3. Do the same at bing.com/webmasters (you can import from Google).

## Part 8: Release more pages over time
Each camera and size in `data/` has a wave number (1, 2, ...). `maxBatch` in `site.config.js` decides how many waves are live.
To release wave 2: change `maxBatch: 1` to `maxBatch: 2`, then in the terminal:
   git add .
   git commit -m "wave 2"
   git push
Cloudflare rebuilds automatically in about a minute.

## Adding more pages
- New camera: add one line in `data/cameras.js`. Check the pixel size on the maker's spec sheet.
- New print size: add a line in `data/sizes.js`.
- New business page: copy one block in `data/usecases.js` and rewrite it in your own words.
- New guide: copy a block in `data/guides.js`.
Then build, commit and push as above.
