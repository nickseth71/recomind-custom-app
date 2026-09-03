import { createContext, useContext, useEffect } from "react";
import { setAuthToken } from "../lib/api";

const AuthContext = createContext({ token: null, shop: null });

/**
 * AuthProvider
 *
 * Wraps the app with the token/shop that the root loader fetched
 * server-side (from jwt.server.js, backed by the Prisma DB) — this
 * replaces the old client-side fetch-then-localStorage.setItem dance.
 *
 * Also keeps app/lib/api.js's internal token in sync via setAuthToken,
 * since request() there is a plain function (not a React component) and
 * needs a synchronous, non-hook way to read the current token.
 */
export function AuthProvider({ token, shop, children }) {
  useEffect(() => {
    setAuthToken(token);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, shop }}>
      {children}
    </AuthContext.Provider>
  );
}

/** useAuth() — read { token, shop } anywhere in the tree, replaces every
 * old `localStorage.getItem("recomind_token" | "recomind_shop")` call. */
export function useAuth() {
  return useContext(AuthContext);
}
