/**
 * IronPin Aerial — Prerender Script
 * 
 * Starts a local static server on the built dist, visits each public route
 * with headless Chrome, and writes the fully-rendered HTML to
 * dist/public/<route>/index.html so AI crawlers see complete content.
 * 
 * Usage: node scripts/prerender.mjs
 * (Run after pnpm build)
 */

import puppeteer from "puppeteer-core";
import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST = path.resolve(ROOT, "dist/public");

const ROUTES = [
  { path: "/",             outDir: "" },
  { path: "/services",     outDir: "services" },
  { path: "/who-we-serve", outDir: "who-we-serve" },
  { path: "/about",        outDir: "about" },
  { path: "/contact",      outDir: "contact" },
];

const PORT = 4173;
const BASE_URL = `http://localhost:${PORT}`;

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

function startStaticServer() {
  return new Promise((resolve) => {
    const MIME = {
      ".html": "text/html",
      ".js": "application/javascript",
      ".mjs": "application/javascript",
      ".css": "text/css",
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".svg": "image/svg+xml",
      ".ico": "image/x-icon",
      ".woff2": "font/woff2",
      ".woff": "font/woff",
      ".ttf": "font/ttf",
      ".json": "application/json",
      ".txt": "text/plain",
    };

    const server = http.createServer((req, res) => {
      let urlPath = req.url.split("?")[0];
      let filePath = path.join(DIST, urlPath);

      // Try exact file
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
        fs.createReadStream(filePath).pipe(res);
        return;
      }

      // SPA fallback — serve index.html for all routes
      const indexPath = path.join(DIST, "index.html");
      res.writeHead(200, { "Content-Type": "text/html" });
      fs.createReadStream(indexPath).pipe(res);
    });

    server.listen(PORT, () => {
      console.log(`  Static server listening on port ${PORT}`);
      resolve(server);
    });
  });
}

async function waitForServer(url, retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      await new Promise((resolve, reject) => {
        http.get(url, (res) => resolve(res)).on("error", reject);
      });
      return;
    } catch {}
    await sleep(300);
  }
  throw new Error(`Server at ${url} did not start`);
}

async function prerender() {
  console.log("🚀 IronPin Aerial — Prerender starting...\n");

  if (!fs.existsSync(DIST)) {
    throw new Error(`Build directory not found: ${DIST}. Run pnpm build first.`);
  }

  const server = await startStaticServer();
  await waitForServer(BASE_URL);

  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/chromium",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
    headless: true,
  });

  for (const route of ROUTES) {
    const url = BASE_URL + route.path;
    console.log(`  Rendering ${route.path} ...`);

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900 });

    // Block analytics/tracking to speed up render
    await page.setRequestInterception(true);
    page.on("request", req => {
      const u = req.url();
      if (
        u.includes("umami") ||
        u.includes("google-analytics") ||
        u.includes("googletagmanager") ||
        u.includes("hotjar")
      ) {
        req.abort();
      } else {
        req.continue();
      }
    });

    await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
    // Extra wait for any deferred rendering
    await sleep(1000);

    let html = await page.content();

    // Mark as prerendered
    html = html.replace(
      "</head>",
      `  <meta name="prerendered" content="true" />\n</head>`
    );

    const outDir = route.outDir
      ? path.join(DIST, route.outDir)
      : DIST;

    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }

    const outFile = path.join(outDir, "index.html");
    fs.writeFileSync(outFile, html, "utf-8");

    const kb = Math.round(fs.statSync(outFile).size / 1024);
    console.log(`  ✅  ${route.path} → ${outFile.replace(ROOT, ".")} (${kb} KB)`);

    await page.close();
  }

  await browser.close();
  server.close();

  console.log("\n✅ Prerender complete — all routes have static HTML.");
}

prerender().catch(err => {
  console.error("\n❌ Prerender failed:", err.message);
  process.exit(1);
});
