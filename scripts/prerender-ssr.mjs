/**
 * IronPin Aerial — SSR Prerender Script
 *
 * Uses vite build --ssr to compile entry-server.tsx, then calls render()
 * for each public route and injects the HTML into the built index.html shell.
 *
 * No headless browser required. Runs as part of `pnpm build`.
 * Fail-soft: errors are caught and logged; the build continues without prerendering.
 */

import { build } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DIST_PUBLIC = path.resolve(ROOT, "dist", "public");
const SSR_BUNDLE = path.resolve(ROOT, "dist", "server", "entry-server.js");

// Per-route <head> additions (e.g. JSON-LD that is injected via useEffect at runtime)
// These are embedded directly into the prerendered HTML so AI crawlers see them.
const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Do you provide surveys?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "No. IronPin Aerial provides aerial imaging and visualization. Our maps and models are for documentation and planning \u2014 not boundary determination or certified survey work. When a project needs a licensed surveyor, we\u2019re glad to work alongside yours."
      }
    },
    {
      "@type": "Question",
      "name": "Where do you fly?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Based in Orlando and serving properties across Florida \u2014 Central Florida, the coasts, and everywhere between."
      }
    },
    {
      "@type": "Question",
      "name": "How fast are deliverables?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Photo reports typically within two business days of the flight. Maps and 3D models within three to five, depending on site size. Rush work is available \u2014 ask."
      }
    },
    {
      "@type": "Question",
      "name": "What about weather?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Florida weather runs the schedule. If conditions aren\u2019t safe or won\u2019t produce usable data, we don\u2019t fly \u2014 and we re-fly at no charge."
      }
    },
    {
      "@type": "Question",
      "name": "Do you work with homeowners?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "We\u2019re a commercial operation \u2014 associations, property managers, contractors, resorts, and businesses. We don\u2019t take single-family residential work."
      }
    }
  ]
};

const FAQ_SCHEMA_TAG = `<script type="application/ld+json" id="faq-schema">${JSON.stringify(FAQ_SCHEMA)}</script>`;

const ROUTES = [
  { path: "/", outDir: DIST_PUBLIC, extraHead: "" },
  { path: "/services", outDir: path.join(DIST_PUBLIC, "services"), extraHead: FAQ_SCHEMA_TAG },
  { path: "/who-we-serve", outDir: path.join(DIST_PUBLIC, "who-we-serve"), extraHead: "" },
  { path: "/about", outDir: path.join(DIST_PUBLIC, "about"), extraHead: "" },
  { path: "/contact", outDir: path.join(DIST_PUBLIC, "contact"), extraHead: "" },
];

async function buildSSRBundle() {
  console.log("  Building SSR bundle...");

  // Dynamically import vite plugins — they may not be available in all environments
  const { default: react } = await import("@vitejs/plugin-react");

  await build({
    configFile: false,
    root: path.join(ROOT, "client"),
    resolve: {
      alias: {
        "@": path.resolve(ROOT, "client", "src"),
        "@shared": path.resolve(ROOT, "shared"),
        "@assets": path.resolve(ROOT, "attached_assets"),
      },
    },
    // Use classic JSX runtime so every file has `React` in scope —
    // avoids "React is not defined" when module-level const arrays contain JSX.
    plugins: [react({ jsxRuntime: "classic" })],
    build: {
      ssr: true,
      outDir: path.resolve(ROOT, "dist", "server"),
      emptyOutDir: false,
      rollupOptions: {
        input: path.resolve(ROOT, "client", "src", "entry-server.tsx"),
        output: {
          format: "esm",
          entryFileNames: "entry-server.js",
          // Inject a React alias at the top of the bundle.
          // The classic JSX transform renames the default React import to React$1
          // (to avoid naming collisions), but some files reference bare `React`.
          // This banner ensures `React` is always in scope.
          banner: "import * as __ReactImport from 'react'; const React = __ReactImport.default || __ReactImport;",
        },
      },
    },
    ssr: {
      // Externalize Node built-ins; bundle everything else
      noExternal: [/./],
      external: ["fs", "path", "url", "http", "https", "net", "os", "crypto"],
    },
  });
  console.log("  SSR bundle built.");
}

async function prerenderRoutes() {
  // Read the built client HTML shell (contains all <head> meta, JSON-LD, CSS links)
  const shellPath = path.join(DIST_PUBLIC, "index.html");
  if (!fs.existsSync(shellPath)) {
    throw new Error(`Client shell not found at ${shellPath}. Run vite build first.`);
  }
  const shell = fs.readFileSync(shellPath, "utf-8");

  // Dynamically import the SSR bundle
  const { render } = await import(SSR_BUNDLE + `?t=${Date.now()}`);

  for (const route of ROUTES) {
    console.log(`  Rendering ${route.path} ...`);
    try {
      const appHtml = render(route.path);

      // Inject rendered HTML into the root div
      let html = shell.replace(
        '<div id="root"></div>',
        `<div id="root">${appHtml}</div>`
      );

      // Inject any per-route <head> additions (e.g. FAQPage JSON-LD)
      if (route.extraHead) {
        html = html.replace('</head>', `${route.extraHead}\n</head>`);
      }

      // Write to route directory
      fs.mkdirSync(route.outDir, { recursive: true });
      const outFile = path.join(route.outDir, "index.html");
      fs.writeFileSync(outFile, html, "utf-8");

      const sizeKB = Math.round(html.length / 1024);
      console.log(`  ✅  ${route.path} → ${outFile.replace(ROOT + "/", "")} (${sizeKB} KB)`);
    } catch (err) {
      console.error(`  ⚠️  Failed to render ${route.path}:`, err.message);
      // Fail-soft: leave the existing shell HTML in place for this route
    }
  }
}

async function main() {
  console.log("🚀 IronPin Aerial — SSR Prerender starting...");
  try {
    await buildSSRBundle();
    await prerenderRoutes();
    console.log("✅ SSR Prerender complete.");
  } catch (err) {
    // Top-level fail-soft: log the error but exit 0 so the build doesn't fail
    console.error("⚠️  SSR Prerender failed (non-fatal):", err.message);
    console.error("   The site will still deploy with the JS-only shell.");
    process.exit(0);
  }
}

main();
