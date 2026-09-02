import { useEffect } from "react";

/**
 * Sets the browser tab title for the page it's called in.
 * Usage: usePageTitle("Boat Management");
 * Renders as: "Boat Management · AquaSafari"
 */
export default function usePageTitle(title) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} · AquaSafari` : "AquaSafari";

    return () => {
      document.title = previousTitle;
    };
  }, [title]);
}