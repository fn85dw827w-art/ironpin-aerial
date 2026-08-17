/**
 * Agent-readiness middleware for IronPin Aerial
 *
 * 1. Adds RFC 8288 Link response headers on every HTML response pointing
 *    agents to machine-readable resources (api-catalog, llms.txt, agent-skills).
 *
 * 2. Implements Markdown-for-Agents content negotiation: when a request
 *    carries `Accept: text/markdown` the server returns the llms.txt content
 *    (the canonical plain-text/markdown site summary) with
 *    `Content-Type: text/markdown; charset=utf-8` instead of HTML.
 *    This satisfies the Cloudflare "Markdown for Agents" spec.
 */

import { type Express, type Request, type Response, type NextFunction } from "express";
import fs from "fs";
import path from "path";

// RFC 8288 Link header value — added to every HTML page response
const AGENT_LINK_HEADER = [
  `<https://ironpinaerial.com/.well-known/api-catalog>; rel="api-catalog"`,
  `<https://ironpinaerial.com/llms.txt>; rel="service-doc"; type="text/plain"`,
  `<https://ironpinaerial.com/.well-known/agent-skills/index.json>; rel="describedby"; type="application/json"`,
  `<https://ironpinaerial.com/.well-known/mcp/server-card.json>; rel="describedby"; type="application/json"`,
].join(", ");

// Public routes that support Markdown-for-Agents negotiation
const MARKDOWN_ROUTES = new Set(["/", "/services", "/who-we-serve", "/about", "/contact"]);

function resolveDistPath(): string {
  return process.env.NODE_ENV === "development"
    ? path.resolve(import.meta.dirname, "..", "dist", "public")
    : path.resolve(import.meta.dirname, "public");
}

function getLlmsTxtContent(): string | null {
  try {
    // In production the file is in dist/public/llms.txt
    const distPath = resolveDistPath();
    const filePath = path.resolve(distPath, "llms.txt");
    if (fs.existsSync(filePath)) {
      return fs.readFileSync(filePath, "utf-8");
    }
    // Fallback: read from client/public during development
    const devPath = path.resolve(import.meta.dirname, "..", "client", "public", "llms.txt");
    if (fs.existsSync(devPath)) {
      return fs.readFileSync(devPath, "utf-8");
    }
  } catch {
    // ignore
  }
  return null;
}

// Correct RFC 9727 api-catalog linkset structure
const API_CATALOG_CONTENT = JSON.stringify({
  linkset: [
    {
      anchor: "https://ironpinaerial.com/",
      "service-doc": [
        {
          href: "https://ironpinaerial.com/llms.txt",
          type: "text/plain",
          title: "IronPin Aerial — LLM-readable site summary",
        },
      ],
      describedby: [
        {
          href: "https://ironpinaerial.com/.well-known/agent-skills/index.json",
          type: "application/json",
          title: "Agent Skills discovery index",
        },
        {
          href: "https://ironpinaerial.com/.well-known/mcp/server-card.json",
          type: "application/json",
          title: "MCP Server Card",
        },
      ],
    },
  ],
}, null, 2);

export function registerAgentMiddleware(app: Express) {
  // ── 1. Link headers on all HTML responses ──────────────────────────────
  app.use((_req: Request, res: Response, next: NextFunction) => {
    // Append Link header — we use append so we don't clobber any existing Link headers
    res.append("Link", AGENT_LINK_HEADER);
    next();
  });

  // ── 2. Explicit Content-Type routes for extensionless well-known files ──
  // Express static() cannot infer Content-Type for extensionless files.
  // These routes must come BEFORE static serving.
  app.get("/.well-known/api-catalog", (_req: Request, res: Response) => {
    res.set("Content-Type", "application/linkset+json").end(API_CATALOG_CONTENT);
  });

  app.get("/.well-known/oauth-protected-resource", (_req: Request, res: Response) => {
    const content = JSON.stringify({
      resource: "https://ironpinaerial.com",
      authorization_servers: [],
      scopes_supported: [],
      bearer_methods_supported: [],
      resource_documentation: "https://ironpinaerial.com/auth.md",
      resource_policy_uri: "https://ironpinaerial.com/auth.md",
    }, null, 2);
    res.set("Content-Type", "application/json").end(content);
  });

  // ── 3. Markdown-for-Agents content negotiation ─────────────────────────
  // Intercept requests to public pages where the client signals it prefers markdown.
  // We serve llms.txt as the canonical markdown representation of the site.
  app.use((req: Request, res: Response, next: NextFunction) => {
    const accept = req.headers["accept"] || "";
    const wantsMarkdown =
      accept.includes("text/markdown") || accept.includes("text/x-markdown");

    if (!wantsMarkdown) {
      return next();
    }

    // Normalise path: strip trailing slash, default to "/"
    const urlPath = (req.path || "/").replace(/\/+$/, "") || "/";

    if (!MARKDOWN_ROUTES.has(urlPath)) {
      return next();
    }

    const content = getLlmsTxtContent();
    if (!content) {
      return next();
    }

    res
      .status(200)
      .set({
        "Content-Type": "text/markdown; charset=utf-8",
        "Vary": "Accept",
      })
      .end(content);
  });
}
