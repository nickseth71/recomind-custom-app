// import "./tailwind.css";
import "@shopify/shopify-app-react-router/adapters/node";
import {
  ApiVersion,
  AppDistribution,
  shopifyApp,
} from "@shopify/shopify-app-react-router/server";
import { PrismaSessionStorage } from "@shopify/shopify-app-session-storage-prisma";
import prisma from "./db.server";
import { upsertJwt } from "./models/jwt.server";

const shopify = shopifyApp({
  apiKey: process.env.SHOPIFY_API_KEY,
  apiSecretKey: process.env.SHOPIFY_API_SECRET || "",
  apiVersion: ApiVersion.October25,
  scopes: process.env.SCOPES?.split(","),
  appUrl: process.env.SHOPIFY_APP_URL || "",
  authPathPrefix: "/auth",
  sessionStorage: new PrismaSessionStorage(prisma),
  distribution: AppDistribution.AppStore,
  hooks: {
    afterAuth: async ({ session }) => {
      const {
        shop,
        accessToken,
        scope,
        refreshToken,
        expires,
        refreshTokenExpires,
      } = session;

      try {
        const backendUrl =
          process.env.VITE_BASE_URL ||
          "https://staging-recomind-api.onrender.com/recomind/v1";
        const response = await fetch(`${backendUrl}/stores`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            shop,
            accessToken,
            scope,
            refreshToken,
            expiresAt: expires ? new Date(expires).toISOString() : undefined,
            refreshTokenExpiresAt: refreshTokenExpires
              ? new Date(refreshTokenExpires).toISOString()
              : undefined,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data.token) {
            await upsertJwt(shop, data.token);
          }
          console.log("[afterAuth] Store registered in backend:", {
            shop: data.store?.shopDomain,
            plan: data.store?.plan,
            hasToken: !!data.token,
          });
        } else {
          console.error(
            "[afterAuth] Backend registration failed:",
            response.status,
            await response.text(),
          );
        }
      } catch (err) {
        console.error("[afterAuth] Error calling backend:", err.message);
      }
      await shopify.registerWebhooks({ session });
    },
  },
  future: {
    expiringOfflineAccessTokens: true,
  },
  ...(process.env.SHOP_CUSTOM_DOMAIN
    ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] }
    : {}),
});

export default shopify;
export const apiVersion = ApiVersion.October25;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
