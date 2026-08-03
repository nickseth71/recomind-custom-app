// import { useEffect } from "react";
// import { Outlet, useLoaderData, useRouteError } from "react-router";
// import { boundary } from "@shopify/shopify-app-react-router/server";
// import Layout from "../components/Layout";
// import { EmbeddedAppProvider } from "../components/EmbeddedAppProvider";
// import { authenticate } from "../shopify.server";

// function getStoredShop() {
//   if (typeof window === "undefined" || !window.localStorage) return null;
//   return window.localStorage.getItem("recomind_shop");
// }

// export const loader = async ({ request }) => {
//   let shop = null;
//   const localStorageShop = getStoredShop();

//   try {
//     const { session } = await authenticate.admin(request);
//     if (session?.shop) {
//       shop = session.shop || localStorageShop;
//     }
//   } catch (err) {
//     if (err instanceof Response) {
//       throw err; // let Shopify's redirect (now handled properly by App Bridge) propagate
//     }
//     const url = new URL(request.url);
//     shop = url.searchParams.get("shop") || localStorageShop;
//   }

//   return {
//     apiKey: import.meta.env.SHOPIFY_API_KEY || "",
//     shop: shop || null,
//   };
// };

// export default function App() {
//   const { apiKey, shop } = useLoaderData();

//   useEffect(() => {
//     // Try multiple ways to get the shop
//     const params = new URLSearchParams(window.location.search);
//     const urlShop = params.get("shop");
//     const loaderShop = shop; // From server-side loader

//     // Check if we already have a valid token for this shop
//     const existingToken = localStorage.getItem("recomind_token");
//     const storedShop = localStorage.getItem("recomind_shop");

//     console.log("[App] Token fetch check:", {
//       urlShop,
//       loaderShop,
//       storedShop,
//       hasExistingToken: !!existingToken,
//     });

//     // If we have both token and matching shop, we're good
//     const shopToValidate = loaderShop || urlShop || storedShop;
//     if (existingToken && (!shopToValidate || storedShop === shopToValidate)) {
//       console.log("[App] Using existing token");
//       return;
//     }

//     // If we don't have a shop but have a stored shop and token, use that
//     if (!shopToValidate && storedShop && existingToken) {
//       console.log("[App] Using stored shop:", storedShop);
//       return;
//     }

//     // Fetch new token using shop from loader, URL, or stored
//     const shopToUse = loaderShop || urlShop || storedShop;

//     if (shopToUse) {
//       console.log("[App] Fetching token for shop:", shopToUse);
//       fetchAndStoreToken(shopToUse);
//     } else {
//       console.warn(
//         "[App] No shop domain available. Cannot fetch token. Waiting for Shopify context...",
//       );
//       // In an embedded app, the shop might be available through Shopify's AppBridge
//       // Set a short timeout to check again
//       const timer = setTimeout(() => {
//         const retryShop =
//           new URLSearchParams(window.location.search).get("shop") ||
//           localStorage.getItem("recomind_shop");
//         if (retryShop && !localStorage.getItem("recomind_token")) {
//           console.log("[App] Retrying with shop:", retryShop);
//           fetchAndStoreToken(retryShop);
//         }
//       }, 1000);

//       return () => clearTimeout(timer);
//     }
//   }, [shop]);

//   async function fetchAndStoreToken(shopDomain) {
//     try {
//       const backendUrl =
//         import.meta.env.VITE_BASE_URL || "http://localhost:5000";

//       console.log(
//         "[App] Fetching token from:",
//         `${backendUrl}/stores/token?shop=${shopDomain}`,
//       );

//       const res = await fetch(
//         `${backendUrl}/stores/token?shop=${encodeURIComponent(shopDomain)}`,
//       );

//       console.log("[App] Token response status:", res.status);

//       if (!res.ok) {
//         const errorText = await res.text();
//         console.warn("[App] Token fetch failed:", res.status, errorText);
//         return;
//       }

//       const data = await res.json();

//       console.log("[App] Token response data:", {
//         success: data.success,
//         hasToken: !!data.token,
//         store: data.store,
//       });

//       if (data.success && data.token) {
//         localStorage.setItem("recomind_token", data.token);
//         localStorage.setItem("recomind_shop", shopDomain);
//         console.log(
//           "[App] ✅ Token stored successfully in localStorage for shop:",
//           shopDomain,
//         );
//       } else {
//         console.warn("[App] Response missing token:", data);
//       }
//     } catch (err) {
//       console.error("[App] Error fetching backend token:", err.message, err);
//     }
//   }

//   return (
//     <EmbeddedAppProvider apiKey={apiKey}>
//       <Layout>
//         <Outlet />
//       </Layout>
//     </EmbeddedAppProvider>
//   );
// }

// // Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
// export function ErrorBoundary() {
//   return boundary.error(useRouteError());
// }

// export const headers = (headersArgs) => {
//   return boundary.headers(headersArgs);
// };

import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import Layout from "../components/Layout";
import { EmbeddedAppProvider } from "../components/EmbeddedAppProvider";
import ProductSyncGate from "../components/ProductSyncGate";
import { authenticate } from "../shopify.server";
import { AnalysisTrackerProvider } from "../context/AnalysisTrackerContext";
import GlobalAnalysisToast from "../components/GlobalAnalysisToast";
import { getToken, upsertJwt } from "../models/jwt.server";
import { AuthProvider } from "../context/Authcontext";

// function getStoredShop() {
//   if (typeof window === "undefined" || !window.localStorage) return null;
//   return window.localStorage.getItem("recomind_shop");
// }

export const loader = async ({ request }) => {
  let shop = null;

  try {
    const { session } = await authenticate.admin(request);
    shop = session?.shop;
  } catch (err) {
    if (err instanceof Response) throw err;

    const url = new URL(request.url);
    shop = url.searchParams.get("shop");
  }

  let token = null;

  if (shop) {
    token = await getToken(shop);
    console.log(
      `[app.jsx loader] getToken(${shop}) from DB ->`,
      token ? "found" : "not found",
    );

    if (!token) {
      const backendUrl =
        process.env.VITE_BASE_URL || "http://localhost:3000/recomind/v1";
      const fetchUrl = `${backendUrl}/stores/token?shop=${encodeURIComponent(shop)}`;
      console.log(`[app.jsx loader] Fetching token from backend: ${fetchUrl}`);

      try {
        const res = await fetch(fetchUrl);
        console.log(
          `[app.jsx loader] Backend responded with status ${res.status}`,
        );

        if (res.ok) {
          const data = await res.json();
          console.log(`[app.jsx loader] Backend response body:`, {
            success: data.success,
            hasToken: !!data.token,
            store: data.store?.shopDomain,
          });

          if (data.success && data.token) {
            token = data.token;
            await upsertJwt(shop, token);
            console.log(`[app.jsx loader] Token persisted to DB for ${shop}`);
          } else {
            console.error(
              `[app.jsx loader] Backend returned success:false or no token`,
              data,
            );
          }
        } else {
          const body = await res.text().catch(() => "");
          console.error(
            `[app.jsx loader] Backend returned non-OK status ${res.status}: ${body}`,
          );
        }
      } catch (err) {
        // Backend unreachable (cold start, network blip, misconfigured
        // VITE_BASE_URL, etc.) — don't crash the whole app shell over it.
        // token stays null; downstream pages already gate their useApi
        // calls on it, so they just show their own loading/empty state.
        console.error(
          `[app.jsx loader] Failed to reach backend at ${fetchUrl}: ${err.message}`,
        );
      }
    }
  }

  return {
    apiKey: import.meta.env.SHOPIFY_API_KEY || "",
    shop,
    token,
  };
};

export default function App() {
  const { apiKey, shop, token } = useLoaderData();

  return (
    <EmbeddedAppProvider apiKey={apiKey}>
      <AuthProvider shop={shop} token={token}>
        <AnalysisTrackerProvider>
          <Layout>
            <ProductSyncGate />
            <GlobalAnalysisToast />
            <Outlet />
          </Layout>
        </AnalysisTrackerProvider>
      </AuthProvider>
    </EmbeddedAppProvider>
  );
}

export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
