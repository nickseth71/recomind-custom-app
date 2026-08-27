// import { useState, useEffect, useRef } from "react";
// import { Search, X, Check, Loader2, AlertTriangle } from "lucide-react";
// import { productApi } from "../lib/api";
// import { useApi } from "../hooks/useApi";
// import { useDebounced, Modal, Btn } from "./UI";

// /**
//  * ProductSyncModal
//  *
//  * Lets the merchant search their live Shopify catalog and select which
//  * products to bring into RecoMind, respecting their plan's sync-slot limit.
//  * Selected products can also be removed later elsewhere (Products page),
//  * which frees a slot — this modal reflects that live via `syncSlots`.
//  */
// export default function ProductSyncModal({ onClose, onSynced, syncSlots }) {
//   const [search, setSearch] = useState("");
//   const debouncedSearch = useDebounced(search, 400);
//   const [collectionSearch, setCollectionSearch] = useState("");
//   const debouncedCollectionSearch = useDebounced(collectionSearch, 300);
//   const [selectedCollection, setSelectedCollection] = useState(null);
//   const [cursor, setCursor] = useState(null);
//   const [allProducts, setAllProducts] = useState([]); // accumulated across "load more"
//   const [selected, setSelected] = useState(new Map()); // shopifyProductId -> product
//   const [syncing, setSyncing] = useState(false);
//   const [syncError, setSyncError] = useState(null);
//   const listRef = useRef(null);
//   const collectionPickerRef = useRef(null);
//   const [collectionPickerOpen, setCollectionPickerOpen] = useState(false);

//   useEffect(() => {
//     function handleOutsidePointerDown(event) {
//       if (
//         collectionPickerRef.current &&
//         !collectionPickerRef.current.contains(event.target)
//       ) {
//         setCollectionPickerOpen(false);
//       }
//     }

//     document.addEventListener("pointerdown", handleOutsidePointerDown);
//     return () =>
//       document.removeEventListener("pointerdown", handleOutsidePointerDown);
//   }, []);

//   const { data: collectionsRaw } = useApi(
//     () =>
//       productApi.searchShopifyCollections({ query: debouncedCollectionSearch }),
//     [debouncedCollectionSearch],
//   );
//   const collections = collectionsRaw?.data?.collections || [];

//   const limit = syncSlots?.limit ?? Infinity;
//   const alreadyUsed = syncSlots?.used ?? 0;
//   const remaining =
//     limit === Infinity ? Infinity : Math.max(0, limit - alreadyUsed);
//   const selectedCount = selected.size;
//   const overLimit = remaining !== Infinity && selectedCount > remaining;

//   const {
//     data: searchRaw,
//     loading: searchLoading,
//     error: searchErr,
//   } = useApi(
//     () =>
//       productApi.searchShopify({
//         query: debouncedSearch,
//         collectionId: selectedCollection?.shopifyCollectionId || "",
//         cursor: cursor || "",
//         limit: 20,
//       }),
//     [debouncedSearch, selectedCollection, cursor],
//   );

//   // Reset pagination whenever the search term changes
//   useEffect(() => {
//     setCursor(null);
//     setAllProducts([]);
//   }, [debouncedSearch]);

//   // Accumulate results (new search resets the list; "load more" appends)
//   useEffect(() => {
//     if (!searchRaw?.data?.products) return;
//     setAllProducts((prev) => {
//       const products = cursor
//         ? [...prev, ...searchRaw.data.products]
//         : searchRaw.data.products;
//       return Array.from(
//         new Map(products.map((product) => [product.shopifyProductId, product])),
//       ).map(([, product]) => product);
//     });
//   }, [searchRaw]);

//   // A collection is an intent to sync its whole catalog. Select each page as
//   // it arrives, then keep fetching until Shopify reports the final page.
//   useEffect(() => {
//     if (!selectedCollection || searchLoading || !searchRaw?.data?.products)
//       return;
//     setSelected((prev) => {
//       const next = new Map(prev);
//       searchRaw.data.products.forEach((product) => {
//         if (!product.isSynced) next.set(product.shopifyProductId, product);
//       });
//       return next;
//     });
//     if (searchRaw.data.pageInfo?.hasNextPage && !searchLoading) {
//       setCursor(searchRaw.data.pageInfo.endCursor);
//     }
//   }, [searchRaw, selectedCollection, searchLoading]);

//   function chooseCollection(collection) {
//     setSelectedCollection(collection);
//     setCollectionSearch(collection.title);
//     setSearch("");
//     setCursor(null);
//     setAllProducts([]);
//     setSelected(new Map());
//     setCollectionPickerOpen(false);
//   }

//   const pageInfo = searchRaw?.data?.pageInfo;

//   function toggleSelect(product) {
//     setSelected((prev) => {
//       const next = new Map(prev);
//       if (next.has(product.shopifyProductId)) {
//         next.delete(product.shopifyProductId);
//       } else {
//         next.set(product.shopifyProductId, product);
//       }
//       return next;
//     });
//   }

//   async function handleSync() {
//     if (selectedCount === 0 || overLimit) return;
//     setSyncing(true);
//     setSyncError(null);
//     try {
//       const ids = Array.from(selected.keys());
//       const res = await productApi.syncSelected(ids);
//       onSynced?.(res.data);
//       onClose();
//     } catch (err) {
//       setSyncError(err.message);
//     } finally {
//       setSyncing(false);
//     }
//   }

//   return (
//     <Modal
//       title="Select products to sync"
//       onClose={onClose}
//       maxWidth="max-w-2xl"
//     >
//       <div className="flex flex-col gap-4">
//         {/* Slot usage banner */}
//         <div className="flex items-center justify-between rounded-xl border border-outline-variant bg-surface-container-low px-4 py-3">
//           <span className="text-[13px] font-semibold text-on-surface">
//             {limit === Infinity ? (
//               "Unlimited products on your plan"
//             ) : (
//               <>
//                 <span className={overLimit ? "text-error" : "text-on-surface"}>
//                   {alreadyUsed + selectedCount}
//                 </span>{" "}
//                 / {limit} product slots
//               </>
//             )}
//           </span>
//           {overLimit && (
//             <span className="flex items-center gap-1 text-[11px] font-bold text-error">
//               <AlertTriangle size={12} strokeWidth={2} />
//               Over your plan limit — deselect {selectedCount - remaining}
//             </span>
//           )}
//         </div>

//         {/* Search bar */}
//         <div className="relative" ref={collectionPickerRef}>
//           <Search
//             size={16}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
//           />
//           <input
//             type="text"
//             placeholder="Search collections..."
//             value={collectionSearch}
//             onClick={() => setCollectionPickerOpen(true)}
//             onChange={(e) => {
//               setCollectionSearch(e.target.value);
//               setCollectionPickerOpen(true);
//               setSelectedCollection(null);
//               setCursor(null);
//               setAllProducts([]);
//               setSelected(new Map());
//             }}
//             className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest pl-10 pr-9 py-2.5 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary transition-colors"
//           />
//           {collectionPickerOpen &&
//             collections.length > 0 &&
//             !selectedCollection && (
//               <div className="absolute z-10 top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto rounded-xl border border-outline-variant bg-surface-bright shadow-lg">
//                 {collections.map((collection) => (
//                   <button
//                     key={collection.shopifyCollectionId}
//                     type="button"
//                     onClick={() => chooseCollection(collection)}
//                     className="w-full flex items-center justify-between px-4 py-2.5 text-left text-[13px] font-semibold text-on-surface hover:bg-surface-container-low"
//                   >
//                     <span>{collection.title}</span>
//                     <span className="text-[11px] text-on-surface-variant">
//                       {collection.productCount} products
//                     </span>
//                   </button>
//                 ))}
//               </div>
//             )}
//         </div>

//         {selectedCollection && (
//           <div className="flex items-center justify-between rounded-xl border border-primary/25 bg-primary/5 px-4 py-2.5 text-[12px] font-semibold text-primary">
//             <span>Collection: {selectedCollection.title}</span>
//             <button
//               type="button"
//               onClick={() => {
//                 setSelectedCollection(null);
//                 setCollectionSearch("");
//                 setCollectionPickerOpen(false);
//                 setCursor(null);
//                 setAllProducts([]);
//                 setSelected(new Map());
//               }}
//               className="text-on-surface-variant hover:text-on-surface"
//               aria-label="Clear collection"
//             >
//               <X size={14} />
//             </button>
//           </div>
//         )}

//         <div className="relative">
//           <Search
//             size={16}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
//           />
//           <input
//             type="text"
//             placeholder="Search your Shopify products..."
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest pl-10 pr-9 py-2.5 text-sm font-semibold text-on-surface placeholder:text-on-surface-variant outline-none focus:border-primary transition-colors"
//           />
//           {search && (
//             <button
//               onClick={() => setSearch("")}
//               className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface"
//             >
//               <X size={14} strokeWidth={2} />
//             </button>
//           )}
//         </div>

//         {/* Product list */}
//         <div
//           ref={listRef}
//           className="max-h-80 overflow-y-auto rounded-xl border border-outline-variant divide-y divide-outline-variant"
//         >
//           {allProducts.length === 0 && searchLoading && (
//             <div className="flex justify-center py-10">
//               <Loader2
//                 size={20}
//                 className="animate-spin text-primary"
//                 strokeWidth={1.8}
//               />
//             </div>
//           )}

//           {allProducts.length === 0 && !searchLoading && (
//             <div className="px-5 py-8 text-center text-[13px] text-on-surface-variant">
//               {debouncedSearch
//                 ? `No products match "${debouncedSearch}".`
//                 : "No products found in your store."}
//             </div>
//           )}

//           {allProducts.map((product) => {
//             const isSelected = selected.has(product.shopifyProductId);
//             const isDisabled =
//               !isSelected &&
//               !product.isSynced &&
//               !selectedCollection &&
//               remaining !== Infinity &&
//               selectedCount >= remaining;

//             return (
//               <label
//                 key={product.shopifyProductId}
//                 className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
//                   isDisabled
//                     ? "opacity-40 cursor-not-allowed"
//                     : "hover:bg-surface-container-low"
//                 }`}
//               >
//                 <input
//                   type="checkbox"
//                   checked={isSelected || product.isSynced}
//                   disabled={product.isSynced || isDisabled}
//                   onChange={() => toggleSelect(product)}
//                   className="w-4 h-4 rounded accent-primary shrink-0"
//                 />
//                 {product.image ? (
//                   <img
//                     src={product.image}
//                     alt=""
//                     className="w-9 h-9 rounded-lg object-cover border border-outline-variant shrink-0"
//                   />
//                 ) : (
//                   <div className="w-9 h-9 rounded-lg bg-surface-container-highest shrink-0" />
//                 )}
//                 <div className="flex-1 min-w-0">
//                   <p className="text-[13px] font-semibold text-on-surface truncate">
//                     {product.title}
//                   </p>
//                   {product.isSynced && (
//                     <p className="text-[10px] font-bold text-green-win flex items-center gap-1">
//                       <Check size={10} strokeWidth={2.5} /> Already synced
//                     </p>
//                   )}
//                   {product.wasRemoved && !product.isSynced && (
//                     <p className="text-[10px] text-on-surface-variant">
//                       Previously removed — re-select to add back
//                     </p>
//                   )}
//                 </div>
//               </label>
//             );
//           })}

//           {searchLoading && allProducts.length > 0 && (
//             <div className="flex justify-center py-4">
//               <Loader2
//                 size={16}
//                 className="animate-spin text-primary"
//                 strokeWidth={1.8}
//               />
//             </div>
//           )}

//           {!searchLoading && pageInfo?.hasNextPage && (
//             <button
//               onClick={() => setCursor(pageInfo.endCursor)}
//               className="w-full py-3 text-[12px] font-bold text-primary hover:bg-surface-container-low transition-colors"
//             >
//               Load more
//             </button>
//           )}
//         </div>

//         {syncError && (
//           <p className="text-[12px] font-semibold text-error">{syncError}</p>
//         )}

//         {/* Footer actions */}
//         <div className="flex items-center justify-between gap-3 pt-1">
//           <span className="text-[12px] text-on-surface-variant">
//             {selectedCount} selected
//             {selectedCollection &&
//               ` of ${selectedCollection.productCount} in collection`}
//           </span>
//           <div className="flex gap-2">
//             <Btn variant="ghost" onClick={onClose} className="w-auto px-5">
//               Cancel
//             </Btn>
//             <Btn
//               onClick={handleSync}
//               disabled={selectedCount === 0 || overLimit || syncing}
//               className="w-auto px-5"
//             >
//               {syncing ? (
//                 <>
//                   <Loader2 size={14} className="animate-spin" /> Syncing...
//                 </>
//               ) : (
//                 `Sync ${selectedCount || ""} product${selectedCount === 1 ? "" : "s"}`
//               )}
//             </Btn>
//           </div>
//         </div>
//       </div>
//     </Modal>
//   );
// }

import { useState, useEffect, useRef } from "react";
import { Search, X, Check, Loader2, AlertTriangle } from "lucide-react";
import { productApi } from "../lib/api";
import { useApi } from "../hooks/useApi";
import { useDebounced, Modal, Btn } from "./UI";

/* =========================================================
   SVG ICONS
========================================================= */

const InfinityIcon = ({ size = 22, strokeWidth = 2 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M18.5 7.5C16.5 7.5 15.1 8.7 13.8 10.2L10.2 14.3C8.9 15.8 7.5 17 5.5 17C3.3 17 1.5 15.2 1.5 13C1.5 10.8 3.3 9 5.5 9C7.5 9 8.9 10.2 10.2 11.7L13.8 15.8C15.1 17.3 16.5 18.5 18.5 18.5C20.7 18.5 22.5 16.7 22.5 14.5C22.5 12.3 20.7 10.5 18.5 10.5C16.5 10.5 15.1 11.7 13.8 13.2L10.2 17.3C8.9 18.8 7.5 20 5.5 20"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CollectionsIcon = ({ size = 19, strokeWidth = 1.8 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M3 6.5C3 5.67 3.67 5 4.5 5H9L11 7H19.5C20.33 7 21 7.67 21 8.5V18.5C21 19.33 20.33 20 19.5 20H4.5C3.67 20 3 19.33 3 18.5V6.5Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 9H21"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

const ShopifyProductsIcon = ({ size = 19, strokeWidth = 1.8 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M5 8H19L20 20H4L5 8Z"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 9V6.5C8 4.57 9.34 3 11 3H13C14.66 3 16 4.57 16 6.5V9"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    />
  </svg>
);

/**
 * ProductSyncModal
 *
 * Redesigned:
 * - One search bar
 * - Collections / Shopify Products switcher
 * - Existing Shopify sync functionality preserved
 */
export default function ProductSyncModal({ onClose, onSynced, syncSlots }) {
  /* =========================================================
     STATE
  ========================================================= */

  const [searchMode, setSearchMode] = useState("collections");

  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounced(search, 400);

  const [collectionSearch, setCollectionSearch] = useState("");
  const debouncedCollectionSearch = useDebounced(collectionSearch, 300);

  const [selectedCollection, setSelectedCollection] = useState(null);

  const [cursor, setCursor] = useState(null);
  const [allProducts, setAllProducts] = useState([]);

  const [selected, setSelected] = useState(new Map());

  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  const [collectionPickerOpen, setCollectionPickerOpen] = useState(false);

  const listRef = useRef(null);
  const collectionPickerRef = useRef(null);

  /* =========================================================
     CLOSE COLLECTION DROPDOWN ON OUTSIDE CLICK
  ========================================================= */

  useEffect(() => {
    function handleOutsidePointerDown(event) {
      if (
        collectionPickerRef.current &&
        !collectionPickerRef.current.contains(event.target)
      ) {
        setCollectionPickerOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsidePointerDown);

    return () =>
      document.removeEventListener("pointerdown", handleOutsidePointerDown);
  }, []);

  /* =========================================================
     COLLECTIONS API
  ========================================================= */

  const { data: collectionsRaw } = useApi(
    () =>
      productApi.searchShopifyCollections({
        query: debouncedCollectionSearch,
      }),
    [debouncedCollectionSearch],
  );

  const collections = collectionsRaw?.data?.collections || [];

  /* =========================================================
     PLAN / SYNC LIMIT
  ========================================================= */

  const limit = syncSlots?.limit ?? Infinity;
  const alreadyUsed = syncSlots?.used ?? 0;

  const remaining =
    limit === Infinity ? Infinity : Math.max(0, limit - alreadyUsed);

  const selectedCount = selected.size;

  const overLimit = remaining !== Infinity && selectedCount > remaining;

  /* =========================================================
     SHOPIFY PRODUCTS API
  ========================================================= */

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

  /* =========================================================
     RESET PAGINATION WHEN SEARCH CHANGES
  ========================================================= */

  useEffect(() => {
    setCursor(null);
    setAllProducts([]);
  }, [debouncedSearch]);

  /* =========================================================
     ACCUMULATE PRODUCTS
  ========================================================= */

  useEffect(() => {
    if (!searchRaw?.data?.products) return;

    setAllProducts((prev) => {
      const products = cursor
        ? [...prev, ...searchRaw.data.products]
        : searchRaw.data.products;

      return Array.from(
        new Map(products.map((product) => [product.shopifyProductId, product])),
      ).map(([, product]) => product);
    });
  }, [searchRaw]);

  /* =========================================================
     COLLECTION AUTO-SELECTION
  ========================================================= */

  useEffect(() => {
    if (!selectedCollection || searchLoading || !searchRaw?.data?.products) {
      return;
    }

    setSelected((prev) => {
      const next = new Map(prev);

      searchRaw.data.products.forEach((product) => {
        if (!product.isSynced) {
          next.set(product.shopifyProductId, product);
        }
      });

      return next;
    });

    if (searchRaw.data.pageInfo?.hasNextPage && !searchLoading) {
      setCursor(searchRaw.data.pageInfo.endCursor);
    }
  }, [searchRaw, selectedCollection, searchLoading]);

  /* =========================================================
     SELECT COLLECTION
  ========================================================= */

  function chooseCollection(collection) {
    setSelectedCollection(collection);

    setCollectionSearch(collection.title);

    setSearch("");

    setCursor(null);
    setAllProducts([]);

    setSelected(new Map());

    setCollectionPickerOpen(false);
  }

  /* =========================================================
     PAGE INFO
  ========================================================= */

  const pageInfo = searchRaw?.data?.pageInfo;

  /* =========================================================
     SWITCH SEARCH MODE
  ========================================================= */

  function handleModeChange(mode) {
    setSearchMode(mode);

    setCursor(null);
    setAllProducts([]);
    setSelected(new Map());

    if (mode === "collections") {
      setSearch("");
      setSelectedCollection(null);
      setCollectionSearch("");
    }

    if (mode === "products") {
      setCollectionPickerOpen(false);
      setSelectedCollection(null);
      setCollectionSearch("");
    }
  }

  /* =========================================================
     PRODUCT SELECTION
  ========================================================= */

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

  /* =========================================================
     SELECT ALL
  ========================================================= */

  function handleSelectAll() {
    const selectableProducts = allProducts.filter((product) => {
      if (product.isSynced) return false;

      if (
        remaining !== Infinity &&
        selectedCount >= remaining &&
        !selected.has(product.shopifyProductId)
      ) {
        return false;
      }

      return true;
    });

    const allCurrentlySelected =
      selectableProducts.length > 0 &&
      selectableProducts.every((product) =>
        selected.has(product.shopifyProductId),
      );

    setSelected((prev) => {
      const next = new Map(prev);

      if (allCurrentlySelected) {
        selectableProducts.forEach((product) => {
          next.delete(product.shopifyProductId);
        });
      } else {
        selectableProducts.forEach((product) => {
          if (remaining === Infinity || next.size < remaining) {
            next.set(product.shopifyProductId, product);
          }
        });
      }

      return next;
    });
  }

  /* =========================================================
     SYNC
  ========================================================= */

  async function handleSync() {
    if (selectedCount === 0 || overLimit) {
      return;
    }

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

  /* =========================================================
     SEARCH INPUT
  ========================================================= */

  const isCollectionMode = searchMode === "collections";

  return (
    <Modal
      title="Select products to sync"
      onClose={onClose}
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-4">
        {/* =====================================================
            PLAN BANNER
        ===================================================== */}

        <div
          className="
            flex items-center gap-3
            rounded-xl
            border border-outline-variant
            bg-surface-container-low
            px-4 py-3
          "
        >
          <span className="text-primary shrink-0">
            <InfinityIcon size={22} />
          </span>

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
            <span className="ml-auto flex items-center gap-1 text-[11px] font-bold text-error">
              <AlertTriangle size={12} strokeWidth={2} />
              Over your plan limit — deselect {selectedCount - remaining}
            </span>
          )}
        </div>

        {/* =====================================================
            SEARCH MODE LABEL
        ===================================================== */}

        <div>
          <p className="mb-2 text-[13px] font-bold text-on-surface">
            Search in
          </p>

          {/* ===================================================
              SEGMENTED SWITCH
          =================================================== */}

          <div
            className="
              flex
              rounded-xl
              border border-outline-variant
              bg-surface-container-low
              p-0.5
              overflow-hidden
            "
          >
            {/* Collections */}
            <button
              type="button"
              onClick={() => handleModeChange("collections")}
              className={`
                flex-1
                flex items-center justify-center gap-2
                px-4 py-2.5
                rounded-lg
                text-[13px]
                font-bold
                transition-all
                cursor-pointer
                ${
                  isCollectionMode
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest"
                }
              `}
            >
              <CollectionsIcon
                size={18}
                strokeWidth={isCollectionMode ? 2 : 1.8}
              />
              Collections
            </button>

            {/* Shopify Products */}
            <button
              type="button"
              onClick={() => handleModeChange("products")}
              className={`
                flex-1
                flex items-center justify-center gap-2
                px-4 py-2.5
                rounded-lg
                text-[13px]
                font-bold
                transition-all
                cursor-pointer
                ${
                  !isCollectionMode
                    ? "bg-primary text-on-primary shadow-sm"
                    : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-highest"
                }
              `}
            >
              <ShopifyProductsIcon
                size={18}
                strokeWidth={!isCollectionMode ? 2 : 1.8}
              />
              Shopify Products
            </button>
          </div>
        </div>

        {/* =====================================================
            SINGLE SEARCH BAR
        ===================================================== */}

        {isCollectionMode ? (
          <div className="relative" ref={collectionPickerRef}>
            <Search
              size={17}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-on-surface-variant
              "
              strokeWidth={1.8}
            />

            <input
              type="text"
              placeholder="Search collections..."
              value={collectionSearch}
              onClick={() => setCollectionPickerOpen(true)}
              onChange={(e) => {
                setCollectionSearch(e.target.value);

                setCollectionPickerOpen(true);

                setSelectedCollection(null);
                setCursor(null);
                setAllProducts([]);
                setSelected(new Map());
              }}
              className="
                w-full
                rounded-xl
                border border-outline-variant
                bg-surface-container-lowest
                pl-10
                pr-10
                py-3
                text-sm
                font-semibold
                text-on-surface
                placeholder:text-on-surface-variant
                outline-none
                focus:border-primary
                transition-colors
              "
            />

            {collectionSearch && (
              <button
                type="button"
                onClick={() => {
                  setCollectionSearch("");
                  setSelectedCollection(null);
                  setCollectionPickerOpen(false);
                  setCursor(null);
                  setAllProducts([]);
                  setSelected(new Map());
                }}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-on-surface-variant
                  hover:text-on-surface
                  cursor-pointer
                "
                aria-label="Clear collection search"
              >
                <X size={15} strokeWidth={2} />
              </button>
            )}

            {/* Collection dropdown */}
            {collectionPickerOpen &&
              collections.length > 0 &&
              !selectedCollection && (
                <div
                  className="
                    absolute
                    z-20
                    top-full
                    left-0
                    right-0
                    mt-1
                    max-h-48
                    overflow-y-auto
                    rounded-xl
                    border border-outline-variant
                    bg-surface-bright
                    shadow-lg
                  "
                >
                  {collections.map((collection) => (
                    <button
                      key={collection.shopifyCollectionId}
                      type="button"
                      onClick={() => chooseCollection(collection)}
                      className="
                          w-full
                          flex items-center justify-between
                          px-4 py-2.5
                          text-left
                          text-[13px]
                          font-semibold
                          text-on-surface
                          hover:bg-surface-container-low
                          cursor-pointer
                          transition-colors
                        "
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
        ) : (
          <div className="relative">
            <Search
              size={17}
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-on-surface-variant
              "
              strokeWidth={1.8}
            />

            <input
              type="text"
              placeholder="Search Shopify products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                rounded-xl
                border border-outline-variant
                bg-surface-container-lowest
                pl-10
                pr-10
                py-3
                text-sm
                font-semibold
                text-on-surface
                placeholder:text-on-surface-variant
                outline-none
                focus:border-primary
                transition-colors
              "
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-on-surface-variant
                  hover:text-on-surface
                  cursor-pointer
                "
              >
                <X size={15} strokeWidth={2} />
              </button>
            )}
          </div>
        )}

        {/* =====================================================
            SELECTED COLLECTION
        ===================================================== */}

        {selectedCollection && (
          <div
            className="
              flex items-center justify-between
              rounded-xl
              border border-primary/25
              bg-primary/5
              px-4 py-2.5
              text-[12px]
              font-semibold
              text-primary
            "
          >
            <span className="flex items-center gap-2">
              <CollectionsIcon size={15} />
              Collection: {selectedCollection.title}
            </span>

            <button
              type="button"
              onClick={() => {
                setSelectedCollection(null);
                setCollectionSearch("");
                setCollectionPickerOpen(false);
                setCursor(null);
                setAllProducts([]);
                setSelected(new Map());
              }}
              className="
                text-on-surface-variant
                hover:text-on-surface
                cursor-pointer
              "
              aria-label="Clear collection"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* =====================================================
            PRODUCT LIST
        ===================================================== */}

        <div
          ref={listRef}
          className="
            max-h-80
            overflow-y-auto
            rounded-xl
            border border-outline-variant
            divide-y divide-outline-variant
          "
        >
          {/* Initial loading */}
          {allProducts.length === 0 && searchLoading && (
            <div className="flex justify-center py-10">
              <Loader2
                size={20}
                className="animate-spin text-primary"
                strokeWidth={1.8}
              />
            </div>
          )}

          {/* Empty */}
          {allProducts.length === 0 && !searchLoading && (
            <div className="px-5 py-8 text-center text-[13px] text-on-surface-variant">
              {debouncedSearch
                ? `No products match "${debouncedSearch}".`
                : isCollectionMode && !selectedCollection
                  ? "Search for a collection to view its products."
                  : "No products found in your store."}
            </div>
          )}

          {/* Products */}
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
                className={`
                  flex items-center gap-3
                  px-4 py-3
                  transition-colors
                  ${
                    isDisabled
                      ? "opacity-40 cursor-not-allowed"
                      : "hover:bg-surface-container-low cursor-pointer"
                  }
                `}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={isSelected || product.isSynced}
                  disabled={product.isSynced || isDisabled}
                  onChange={() => toggleSelect(product)}
                  className="
                    w-4 h-4
                    rounded
                    accent-primary
                    shrink-0
                    cursor-pointer
                  "
                />

                {/* Image */}
                {product.image ? (
                  <img
                    src={product.image}
                    alt=""
                    className="
                      w-10 h-10
                      rounded-lg
                      object-cover
                      border border-outline-variant
                      shrink-0
                    "
                  />
                ) : (
                  <div
                    className="
                      w-10 h-10
                      rounded-lg
                      bg-surface-container-highest
                      shrink-0
                    "
                  />
                )}

                {/* Product info */}
                <div className="flex-1 min-w-0">
                  <p
                    className="
                      text-[13px]
                      font-semibold
                      text-on-surface
                      truncate
                    "
                  >
                    {product.title}
                  </p>

                  {product.isSynced && (
                    <p
                      className="
                        text-[10px]
                        font-bold
                        text-green-win
                        flex items-center gap-1
                      "
                    >
                      <Check size={10} strokeWidth={2.5} />
                      Already synced
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

          {/* Loading more */}
          {searchLoading && allProducts.length > 0 && (
            <div className="flex justify-center py-4">
              <Loader2
                size={16}
                className="animate-spin text-primary"
                strokeWidth={1.8}
              />
            </div>
          )}

          {/* Load more */}
          {!searchLoading && pageInfo?.hasNextPage && (
            <button
              type="button"
              onClick={() => setCursor(pageInfo.endCursor)}
              className="
                  w-full
                  py-3
                  text-[12px]
                  font-bold
                  text-primary
                  hover:bg-surface-container-low
                  transition-colors
                  cursor-pointer
                "
            >
              Load more
            </button>
          )}
        </div>

        {/* =====================================================
            ERROR
        ===================================================== */}

        {syncError && (
          <p className="text-[12px] font-semibold text-error">{syncError}</p>
        )}

        {/* =====================================================
            FOOTER
        ===================================================== */}

        <div
          className="
            flex items-center justify-between
            gap-3
            pt-1
          "
        >
          <div className="flex items-center gap-3">
            <span className="text-[12px] font-semibold text-on-surface">
              {selectedCount} selected
            </span>

            {allProducts.length > 0 && (
              <button
                type="button"
                onClick={handleSelectAll}
                className="
                  rounded-lg
                  border border-outline-variant
                  bg-surface-container-lowest
                  px-3 py-1.5
                  text-[11px]
                  font-bold
                  text-on-surface
                  hover:bg-surface-container-highest
                  transition-colors
                  cursor-pointer
                "
              >
                Select All
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <Btn
              variant="ghost"
              onClick={onClose}
              className="w-auto px-5 cursor-pointer"
            >
              Cancel
            </Btn>

            <Btn
              onClick={handleSync}
              disabled={selectedCount === 0 || overLimit || syncing}
              className="w-auto px-5 cursor-pointer"
            >
              {syncing ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Syncing...
                </>
              ) : (
                <>Sync Selected</>
              )}
            </Btn>
          </div>
        </div>
      </div>
    </Modal>
  );
}
