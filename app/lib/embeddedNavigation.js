/**
 * Normalize paths from App Bridge / embedded admin navigation.
 * Shopify often navigates to "/products" while our routes live under "/app/*".
 */
export function normalizeEmbeddedPath(href) {
  if (!href || href.startsWith("http") || href.startsWith("#")) {
    return href;
  }

  let path = href.startsWith("/") ? href : `/${href}`;

  if (path.startsWith("/app")) {
    return path;
  }

  if (path === "/") {
    return "/app";
  }

  return `/app${path}`;
}
