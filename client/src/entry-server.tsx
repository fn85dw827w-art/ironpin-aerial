/**
 * IronPin Aerial — SSR Entry Point
 * Used by scripts/prerender-ssr.mjs to render each route to HTML at build time.
 * Wraps App in wouter's Router with ssrPath instead of the browser location.
 */
import React from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import App from "./App";

export function render(path: string): string {
  return renderToString(
    <Router ssrPath={path}>
      <App />
    </Router>
  );
}
