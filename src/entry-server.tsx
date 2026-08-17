/**
 * IronPin Aerial — SSR Entry Point
 * Used by scripts/prerender-ssr.mjs to render each route to HTML at build time.
 * Wraps App in the same providers as main.tsx, but uses wouter's ssrPath
 * instead of the browser location, and a no-op tRPC client (no network calls).
 */
import React from "react";
import { renderToString } from "react-dom/server";
import { Router } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCReact } from "@trpc/react-query";
import { httpBatchLink } from "@trpc/client";
import superjson from "superjson";
import App from "./App";
import type { AppRouter } from "../../server/routers";

// Create a fresh tRPC instance for SSR (no browser globals needed)
const trpcSSR = createTRPCReact<AppRouter>();

export function render(path: string): string {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false, staleTime: Infinity },
    },
  });

  // Point at a dummy URL — no actual requests are made during renderToString
  // because useMutation/useQuery don't fire during synchronous SSR
  const trpcClient = trpcSSR.createClient({
    links: [
      httpBatchLink({
        url: "http://localhost:3000/api/trpc",
        transformer: superjson,
      }),
    ],
  });

  const html = renderToString(
    <trpcSSR.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Router ssrPath={path}>
          <App />
        </Router>
      </QueryClientProvider>
    </trpcSSR.Provider>
  );

  return html;
}
