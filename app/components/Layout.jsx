import { useEffect, useState } from "react";
import { storeApi } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import Sidebar from "./Sidebar";
import Header from "./Header";
import AiSpinner from "./loader/AiSpinner";

const Layout = ({ children }) => {
  const { token } = useAuth();
  const [store, setStore] = useState(null);
  const [booting, setBooting] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

   useEffect(() => {
     if (!token) {
       setBooting(false);
       return;
     }

     storeApi
       .getMe()
       .then((res) => setStore(res.data ?? res))
       .catch(() => {})
       .finally(() => setBooting(false));
   }, [token]);

  // Listen for sidebar state changes from localStorage or context
  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("recomind_sidebar_open");
      if (stored !== null) {
        setSidebarOpen(JSON.parse(stored));
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <div className="min-h-screen bg-[#fff8f1] text-[#e5e2e2]">
      {/* <Sidebar />
      <Header store={store} /> */}
      <Sidebar
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
/>

{/* <Header
  store={store}
  sidebarOpen={sidebarOpen}
/> */}
      {/* <main
        className={`pt-12 px-margin-desktop pb-12 min-h-screen transition-all duration-300 overflow-x-auto ${
          sidebarOpen ? "ml-64" : "ml-20"
        }`}
      > commented to avoid 2nd scroll bar*/}
      {/* <main
  className={`pt-12 px-margin-desktop pb-12 transition-all duration-300 overflow-x-hidden ${
    sidebarOpen ? "ml-64" : "ml-20"
  }`}
> */}
<main
  className={`scrollable-container pt-12 px-margin-desktop pb-12 transition-all duration-300 overflow-x-hidden ${
    sidebarOpen ? "ml-64" : "ml-20"
  }`}
>
        {booting ? (
          <div className="flex items-center justify-center min-h-[60vh] gap-3 text-on-surface-variant">
            {/* Spinner */}
            {/* <svg
              className="animate-spin"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg> */}
            <AiSpinner label="Loading Workspace"/>
            
          </div>
        ) : (
          children
        )}
      </main>
    </div>
  );
};

export default Layout;
