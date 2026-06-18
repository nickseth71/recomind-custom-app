import { Fragment, useEffect } from "react";
import { useNavigate } from "react-router";
import { normalizeEmbeddedPath } from "../lib/embeddedNavigation";

/**
 * Simple wrapper that enables Shopify embedded app navigation normalization
 * without loading App Bridge scripts (which cause auth redirect).
 *
 * For full App Bridge features, load scripts separately in your HTML head
 * or use a useEffect hook with proper script injection.
 */
export function EmbeddedAppProvider({ apiKey, children }) {
  return (
    <Fragment>
      <AppBridgeNavListener />
      {children}
    </Fragment>
  );
}

/**
 * Listen for Shopify embedded navigation and normalize paths
 * so they route to /app/* instead of bare paths like /products
 */
function AppBridgeNavListener() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleNavigate = (event) => {
      const href = event.target?.getAttribute?.("href");
      if (!href) return;
      const normalizedPath = normalizeEmbeddedPath(href);
      navigate(normalizedPath);
    };

    document.addEventListener("shopify:navigate", handleNavigate);
    return () =>
      document.removeEventListener("shopify:navigate", handleNavigate);
  }, [navigate]);

  return null; // This component doesn't render anything, just sets up listeners
}
