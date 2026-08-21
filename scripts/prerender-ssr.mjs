/**
 * IronPin Aerial — SSR Prerender Script
 *
 * Uses vite build --ssr to compile entry-server.tsx, then calls render()
 * for each public route and injects the HTML into the built index.html shell.
 *
 * No headless browser required. Runs as part of pnpm build.
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
const SITE_ORIGIN = "https://ironpinaerial.com";

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    { "@type": "Question", "name": "Do you provide surveys?", "acceptedAnswer": { "@type": "Answer", "text": "No. IronPin Aerial provides aerial imaging and visualization. Our maps and models are for documentation and planning, not boundary determination or survey work. When a project needs a licensed surveyor, we're glad to work alongside yours." } },
    { "@type": "Question", "name": "Where do you fly?", "acceptedAnswer": { "@type": "Answer", "text": "Based in Orlando and serving properties across Florida. Central Florida, the coasts, and everywhere between." } },
    { "@type": "Question", "name": "How fast are deliverables?", "acceptedAnswer": { "@type": "Answer", "text": "Photo reports typically arrive within two business days of the flight. Maps and 3D models take three to five, depending on site size. If you need it faster, ask when you request the quote." } },
    { "@type": "Question", "name": "What about weather?", "acceptedAnswer": { "@type": "Answer", "text": "Florida weather runs the schedule. If conditions aren't safe or won't produce usable data, we don't fly. Re-flights due to weather are at no charge." } },
    { "@type": "Question", "name": "Are you licensed and insured?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. IronPin Aerial carries a dedicated aviation liability policy with $1 million in third-party coverage, and every flight is conducted by an FAA Part 107 certificated remote pilot. Certificates of insurance are available on request." } },
    { "@type": "Question", "name": "Do you work with homeowners?", "acceptedAnswer": { "@type": "Answer", "text": "Our core work is commercial: associations, property managers, contractors, resorts, and businesses. That said, we take residential projects when the scope fits what we do, such as large properties, acreage, mapping, or construction documentation on private land. If you're not sure whether your project qualifies, give us a call." } }
  ]
};

const FAQ_SCHEMA_TAG = `<script type="application/ld+json" id="faq-schema">${JSON.stringify(FAQ_SCHEMA)}</script>`;

const ROUTES = [
  { path: "/", outDir: DIST_PUBLIC, title: "IronPin Aerial | Commercial Drone Services Across Florida", description: "FAA Part 107 commercial drone services for Florida properties: inspections, aerial mapping, construction progress documentation, post-storm condition records, and aerial media.", extraHead: "" },
  { path: "/services", outDir: path.join(DIST_PUBLIC, "services"), title: "Commercial Drone Services in Florida | IronPin Aerial", description: "Explore roof inspections, aerial mapping and 3D models, construction progress documentation, post-storm condition records, and aerial media for Florida properties.", extraHead: FAQ_SCHEMA_TAG },
  { path: "/who-we-serve", outDir: path.join(DIST_PUBLIC, "who-we-serve"), title: "Drone Services for Property Teams | IronPin Aerial", description: "Aerial documentation and mapping for community associations, property managers, contractors, developers, resorts, and insurance professionals across Florida.", extraHead: "" },
  { path: "/about", outDir: path.join(DIST_PUBLIC, "about"), title: "About IronPin Aerial | FAA Part 107 Florida Drone Operator", description: "Meet IronPin Aerial, an Orlando-based FAA Part 107 commercial drone operator with OSHA 30 training serving properties across Florida.", extraHead: "" },
  { path: "/contact", outDir: path.join(DIST_PUBLIC, "contact"), title: "Request a Commercial Drone Quote | IronPin Aerial", description: "Request a quote for aerial inspections, mapping, construction progress documentation, post-storm records, or aerial media anywhere in Florida.", extraHead: "" },
];

function replaceTag(html, pattern, replacement) {
  return html.replace(pattern, replacement);
}

function applyRouteHead(html, route) {
  const canonical = route.path === "/" ? `${SITE_ORIGIN}/` : `${SITE_ORIGIN}${route.path}/`;
  let updated = html.replace(/<title>[^<]*<\/title>/i, `<title>${route.title}</title>`);
  updated = replaceTag(updated, /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i, `<meta name="description" content="${route.description}" />`);
  updated = replaceTag(updated, /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:title" content="${route.title}" />`);
  updated = replaceTag(updated, /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:description" content="${route.description}" />`);
  updated = replaceTag(updated, /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i, `<meta property="og:url" content="${canonical}" />`);
  updated = replaceTag(updated, /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:title" content="${route.title}" />`);
  updated = replaceTag(updated, /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i, `<meta name="twitter:description" content="${route.description}" />`);
  const additions = [`<link rel="canonical" href="${canonical}" />`, `<meta property="og:site_name" content="IronPin Aerial" />`, route.extraHead].filter(Boolean).join("\n");
  return updated.replace("</head>", `${additions}\n</head>`);
}

async function buildSSRBundle() {
  console.log("  Building SSR bundle...");
  const { default: react } = await import("@vitejs/plugin-react");
  await build({
    configFile: false,
    root: path.join(ROOT, "client"),
    resolve: { alias: { "@": path.resolve(ROOT, "client", "src"), "@shared": path.resolve(ROOT, "shared"), "@assets": path.resolve(ROOT, "attached_assets") } },
    plugins: [react({ jsxRuntime: "classic" })],
    build: { ssr: true, outDir: path.resolve(ROOT, "dist", "server"), emptyOutDir: false, rollupOptions: { input: path.resolve(ROOT, "client", "src", "entry-server.tsx"), output: { format: "esm", entryFileNames: "entry-server.js", banner: "import * as __ReactImport from 'react'; const React = __ReactImport.default || __ReactImport;" } } },
    ssr: { noExternal: [/./], external: ["fs", "path", "url", "http", "https", "net", "os", "crypto"] },
  });
  console.log("  SSR bundle built.");
}

async function prerenderRoutes() {
  const shellPath = path.join(DIST_PUBLIC, "index.html");
  if (!fs.existsSync(shellPath)) throw new Error(`Client shell not found at ${shellPath}. Run vite build first.`);
  const shell = fs.readFileSync(shellPath, "utf-8");
  const { render } = await import(SSR_BUNDLE + `?t=${Date.now()}`);
  for (const route of ROUTES) {
    console.log(`  Rendering ${route.path} ...`);
    try {
      const appHtml = render(route.path);
      let html = shell.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`);
      html = applyRouteHead(html, route);
      fs.mkdirSync(route.outDir, { recursive: true });
      const outFile = path.join(route.outDir, "index.html");
      fs.writeFileSync(outFile, html, "utf-8");
      console.log(`  ✅  ${route.path} → ${outFile.replace(ROOT + "/", "")} (${Math.round(html.length / 1024)} KB)`);
    } catch (err) {
      console.error(`  ⚠️  Failed to render ${route.path}:`, err.message);
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
    console.error("⚠️  SSR Prerender failed (non-fatal):", err.message);
    console.error("   The site will still deploy with the JS-only shell.");
    process.exit(0);
  }
}

main();
