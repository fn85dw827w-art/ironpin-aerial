import { useEffect } from "react";

const BASE = "IronPin Aerial";

/**
 * Sets document.title for the current page.
 * Pass a page-specific label; it will be appended to the brand name.
 * If no label is given, just the brand name is used.
 */
export function usePageTitle(label?: string) {
  useEffect(() => {
    document.title = label ? `${label} | ${BASE}` : BASE;
    return () => {
      document.title = BASE;
    };
  }, [label]);
}
