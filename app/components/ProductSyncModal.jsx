import { useState, useEffect, useRef } from "react";
import { Search, X, Check, Loader2, AlertTriangle } from "lucide-react";
import { productApi } from "../lib/api";
import { useApi } from "../hooks/useApi";
import { useDebounced, Modal, Btn } from "./UI";

/**
 * ProductSyncModal
 *
 * Lets the merchant search their live Shopify catalog and select which
 * products to bring into RecoMind, respecting their plan's sync-slot limit.
 * Selected products can also be removed later elsewhere (Products page),
 * which frees a slot — this modal reflects that live via `syncSlots`.
 */
export default function ProductSyncModal({ onClose, onSynced, syncSlots }) {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 400);
  const [collectionSearch, setCollectionSearch] = useState("");
  const debouncedCollectionSearch = useDebounced(collectionSearch, 300);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [cursor, setCursor] = useState(null);
  const [allProducts, setAllProducts] = useState([]); // accumulated across "load more"
  const [selected, setSelected] = useState(new Map()); // shopifyProductId -> product
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);
  const listRef = useRef(null);

  const { data: collectionsRaw } = useApi(
    () =>
      productApi.searchShopifyCollections({ query: debouncedCollectionSearch }),
    [debouncedCollectionSearch],
  );
  const collections = collectionsRaw?.data?.collections || [];

  const limit = syncSlots?.limit ?? Infinity;
  const alreadyUsed = syncSlots?.used ?? 0;
  const remaining =
    limit === Infinity ? Infinity : Math.max(0, limit - alreadyUsed);
  const selectedCount = selected.size;
  const overLimit = remaining !== Infinity && selectedCount > remaining;

  const {
    data: searchRaw,
    loading: searchLoading,
    error: searchErr,
  } = useApi(
    () =>
      productApi.searchShopify({
        query: debouncedSearch,
        collectionId: selectedCollection?.shopifyCollectionId || "",
        cursor: cursor || "",
        limit: 20,
      }),
    [debouncedSearch, selectedCollection, cursor],
  );

  // Reset pagination whenever the search term changes
  useEffect(() => {
    setCursor(null);
    setAllProducts([]);
  }, [debouncedSearch]);

  // Accumulate results (new search resets the list; "load more" appends)
  useEffect(() => {
    if (!searchRaw?.data?.products) return;
    setAllProducts((prev) =>
      cursor ? [...prev, ...searchRaw.data.products] : searchRaw.data.products,
    );
  }, [searchRaw]);

  // A collection is an intent to sync its whole catalog. Select each page as
  // it arrives, then keep fetching until Shopify reports the final page.
  useEffect(() => {
    if (!selectedCollection || searchLoading || !searchRaw?.data?.products)
      return;
    setSelected((prev) => {
      const next = new Map(prev);
      searchRaw.data.products.forEach((product) => {
        if (!product.isSynced) next.set(product.shopifyProductId, product);
      });
      return next;
    });
    if (searchRaw.data.pageInfo?.hasNextPage && !searchLoading) {
      setCursor(searchRaw.data.pageInfo.endCursor);
    }
  }, [searchRaw, selectedCollection, searchLoading]);

  function chooseCollection(collection) {
    setSelectedCollection(collection);
    setCollectionSearch(collection.title);
    setSearch("");
    setCursor(null);
    setAllProducts([]);
    setSelected(new Map());
  }

  const pageInfo = searchRaw?.data?.pageInfo;

  function toggleSelect(product) {
    setSelected((prev) => {
      const next = new Map(prev);
      if (next.has(product.shopifyProductId)) {
        next.delete(product.shopifyProductId);
      } else {
        next.set(product.shopifyProductId, product);
      }
      return next;
    });
  }

  async function handleSync() {
    if (selectedCount === 0 || overLimit) return;
    setSyncing(true);
    setSyncError(null);
    try {
      const ids = Array.from(selected.keys());
      const res = await productApi.syncSelected(ids);
      onSynced?.(res.data);
      onClose();
    } catch (err) {
      setSyncError(err.message);
    } finally {
      setSyncing(false);
    }
  }

  return (
    <Modal
      title="Select products to sync"
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-4">
        {/* Slot usage banner */}
        <div className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3">
          <span className="text-[13px] font-semibold text-on-surface">
            {limit === Infinity ? (
              "Unlimited products on your plan"
            ) : (
              <>
                <span className={overLimit ? "text-error" : "text-on-surface"}>
                  {alreadyUsed + selectedCount}
                </span>{" "}
                / {limit} product slots
              </>
            )}
          </span>
          {overLimit && (
            <span className="flex items-center gap-1 text-[11px] font-bold text-error">
              <AlertTriangle size={12} strokeWidth={2} />
              Over your plan limit — deselect {selectedCount - remaining}
            </span>
          )}
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <input
            type="text"
            placeholder="Search collections..."
            value={collectionSearch}
            onChange={(e) => {
              setCollectionSearch(e.target.value);
              setSelectedCollection(null);
              setCursor(null);
              setAllProducts([]);
              setSelected(new Map());
            }}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest pl-10 pr-9 py-2.5 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary transition-colors"
          />
          {collections.length > 0 && !selectedCollection && (
            <div className="absolute z-10 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl border border-outline-variant bg-surface-bright shadow-lg">
              {collections.map((collection) => (
                <button
                  key={collection.shopifyCollectionId}
                  type="button"
                  onClick={() => chooseCollection(collection)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left text-[13px] font-semibold text-on-surface hover:bg-surface-container-low"
                >
                  <span>{collection.title}</span>
                  <span className="text-[11px] text-on-surface-variant">
                    {collection.productCount} products
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {selectedCollection && (
          <div className="flex items-center justify-between rounded-xl border border-primary/25 bg-primary/5 px-4 py-2.5 text-[12px] font-semibold text-primary">
            <span>Collection: {selectedCollection.title}</span>
            <button
              type="button"
              onClick={() => {
                setSelectedCollection(null);
                setCollectionSearch("");
                setCursor(null);
                setAllProducts([]);
                setSelected(new Map());
              }}
              className="text-on-surface-variant hover:text-on-surface"
              aria-label="Clear collection"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
          />
          <input
            type="text"
            placeholder="Search your Shopify products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest pl-10 pr-9 py-2.5 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
            >
              <X size={14} strokeWidth={2} />
            </button>
          )}
        </div>

        {/* Product list */}
        <div
          ref={listRef}
          className="max-h-80 overflow-y-auto rounded-xl border border-outline-variant divide-y divide-outline-variant"
        >
          {allProducts.length === 0 && searchLoading && (
            <div className="flex justify-center py-10">
              <Loader2
                size={20}
                className="animate-spin text-primary"
                strokeWidth={1.8}
              />
            </div>
          )}

          {allProducts.length === 0 && !searchLoading && (
            <div className="px-5 py-8 text-center text-[13px] text-on-surface-variant">
              {debouncedSearch
                ? `No products match "${debouncedSearch}".`
                : "No products found in your store."}
            </div>
          )}

          {allProducts.map((product) => {
            const isSelected = selected.has(product.shopifyProductId);
            const isDisabled =
              !isSelected &&
              !product.isSynced &&
              !selectedCollection &&
              remaining !== Infinity &&
              selectedCount >= remaining;

            return (
              <label
                key={product.shopifyProductId}
                className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                  isDisabled
                    ? "opacity-40 cursor-not-allowed"
                    : "hover:bg-surface-container-low"
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected || product.isSynced}
                  disabled={product.isSynced || isDisabled}
                  onChange={() => toggleSelect(product)}
                  className="w-4 h-4 rounded accent-primary shrink-0"
                />
                {product.image ? (
                  <img
                    src={product.image}
                    alt=""
                    className="w-9 h-9 rounded-lg object-cover border border-outline-variant shrink-0"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-lg bg-surface-container-highest shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-on-surface truncate">
                    {product.title}
                  </p>
                  {product.isSynced && (
                    <p className="text-[10px] font-bold text-green-win flex items-center gap-1">
                      <Check size={10} strokeWidth={2.5} /> Already synced
                    </p>
                  )}
                  {product.wasRemoved && !product.isSynced && (
                    <p className="text-[10px] text-on-surface-variant">
                      Previously removed — re-select to add back
                    </p>
                  )}
                </div>
              </label>
            );
          })}

          {searchLoading && allProducts.length > 0 && (
            <div className="flex justify-center py-4">
              <Loader2
                size={16}
                className="animate-spin text-primary"
                strokeWidth={1.8}
              />
            </div>
          )}

          {!searchLoading && pageInfo?.hasNextPage && (
            <button
              onClick={() => setCursor(pageInfo.endCursor)}
              className="w-full py-3 text-[12px] font-bold text-primary hover:bg-surface-container-low transition-colors"
            >
              Load more
            </button>
          )}
        </div>

        {syncError && (
          <p className="text-[12px] font-semibold text-error">{syncError}</p>
        )}

        {/* Footer actions */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-[12px] text-on-surface-variant">
            {selectedCount} selected
          </span>
          <div className="flex gap-2">
            <Btn variant="ghost" onClick={onClose} className="w-auto px-5">
              Cancel
            </Btn>
            <Btn
              onClick={handleSync}
              disabled={selectedCount === 0 || overLimit || syncing}
              className="w-auto px-5"
            >
              {syncing ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> Syncing...
                </>
              ) : (
                `Sync ${selectedCount || ""} product${selectedCount === 1 ? "" : "s"}`
              )}
            </Btn>
          </div>
        </div>
      </div>
    </Modal>
  );
}
