/**
 * ScrollToTop — resets scroll position on every route change.
 * - Plain navigation (/services, /about, etc.): scrolls to top instantly.
 * - Hash navigation (/services#post-storm): scrolls to the matching element,
 *   offset by 80px to clear the 68px fixed header with breathing room.
 * - Does NOT interfere with browser back/forward history scroll restoration
 *   because it only fires when `location` (the pathname) changes, not on
 *   popstate events that restore a previous scroll position.
 */
import { useEffect } from "react";
import { useLocation } from "wouter";

const HEADER_OFFSET = 80; // px — clears the 68px fixed nav with room to spare

export default function ScrollToTop() {
  const [location] = useLocation();

  useEffect(() => {
    // Check if the current URL has a hash fragment
    const hash = window.location.hash;

    if (hash) {
      // Give the new page a tick to render before we try to find the element
      const id = hash.slice(1); // strip the '#'
      const attempt = (retries: number) => {
        const el = document.getElementById(id);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
          window.scrollTo({ top, behavior: "instant" });
        } else if (retries > 0) {
          requestAnimationFrame(() => attempt(retries - 1));
        }
      };
      requestAnimationFrame(() => attempt(5));
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
}
