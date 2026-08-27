import { useState, useEffect } from "react";
import { storeApi } from "../lib/api";
import ProductSyncModal from "./ProductSyncModal";
import {useAuth} from "../context/Authcontext"

/**
 * ProductSyncGate
 *
 * Mounted once in app.jsx, above <Outlet />. Waits for the auth token to
 * land in localStorage (set asynchronously elsewhere in app.jsx), then
 * checks whether the store has any products synced yet. If not — this is
 * a fresh install — it opens the product picker automatically.
 *
 * Also exposes a manual re-open path via the `recomind:open-sync-picker`
 * event, so a "Manage synced products" button anywhere in the app (e.g.
 * the Products page) can trigger the same modal later.
 */
export default function ProductSyncGate() {
  const {token} = useAuth();
  const [open, setOpen] = useState(false);
  const [syncSlots, setSyncSlots] = useState(null);
  const [checked, setChecked] = useState(false);

  async function checkSyncStatus() {
    try {
      const res = await storeApi.getMe();
      const slots = res?.data?.syncSlots;
      if (slots) {
        setSyncSlots(slots);
        if (slots.needsSetup) setOpen(true);
      }
    } catch (err) {
      // Not authenticated yet, or backend not reachable — silently retry later
    } finally {
      setChecked(true);
    }
  }

  useEffect(() => {
    // Poll briefly for the token to appear (it's set async by app.jsx's
    // fetchAndStoreToken), then do the actual check once.
    // if (localStorage.getItem("recomind_token")) {
    //   checkSyncStatus();
    //   return;
    // }
    // const interval = setInterval(() => {
    //   if (localStorage.getItem("recomind_token")) {
    //     clearInterval(interval);
    //     checkSyncStatus();
    //   }
    // }, 500);
    // const timeout = setTimeout(() => clearInterval(interval), 10000);
    // return () => {
    //   clearInterval(interval);
    //   clearTimeout(timeout);
    // };
    if(!token) return;
    checkSyncStatus();
  }, [token]);

  useEffect(() => {
    function handleManualOpen() {
      checkSyncStatus().then(() => setOpen(true));
    }
    window.addEventListener("recomind:open-sync-picker", handleManualOpen);
    return () =>
      window.removeEventListener("recomind:open-sync-picker", handleManualOpen);
  }, []);

  if (!open) return null;

  return (
    <ProductSyncModal
      syncSlots={syncSlots}
      onClose={() => setOpen(false)}
      onSynced={() => {
        setOpen(false);
        checkSyncStatus();
        // Let any open list/dashboard page know it should refetch
        window.dispatchEvent(new Event("recomind:products-synced"));
      }}
    />
  );
}
