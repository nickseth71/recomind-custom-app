// import { useEffect, useState } from "react";
// import { useLocation } from "react-router";
// import { storeApi } from "../lib/api";
// import { useAuth } from "../context/Authcontext";
// import Sidebar from "./Sidebar";
// import Header from "./Header";
// import AiSpinner from "./loader/AiSpinner";
// import Onboarding from "./Onboarding";

// const Layout = ({ children }) => {
//   const { token } = useAuth();
//   const location = useLocation();
//   const [store, setStore] = useState(null);
//   const [booting, setBooting] = useState(true);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [onboardingComplete, setOnboardingComplete] = useState(false);

//   const isHome = location.pathname === "/app" || location.pathname === "/app/";

//   useEffect(() => {
//     setOnboardingComplete(
//       window.localStorage.getItem("recomind_onboarding_complete") === "true",
//     );
//   }, []);

//   useEffect(() => {
//     if (!token) {
//       setBooting(false);
//       return;
//     }
// useEffect(() => {
//   if (typeof window === "undefined") return;

//   const completed =
//     window.localStorage.getItem("recomind_onboarding_complete") === "true";

//   setOnboardingComplete(completed);
//   setCheckingOnboarding(false);
// }, []);
//     storeApi
//       .getMe()
//       .then((res) => setStore(res.data ?? res))
//       .catch(() => {})
//       .finally(() => setBooting(false));
//   }, [token]);

//   // Listen for sidebar state changes from localStorage or context
//   useEffect(() => {
//     const handleStorageChange = () => {
//       const stored = localStorage.getItem("recomind_sidebar_open");
//       if (stored !== null) {
//         setSidebarOpen(JSON.parse(stored));
//       }
//     };
//     window.addEventListener("storage", handleStorageChange);
//     return () => window.removeEventListener("storage", handleStorageChange);
//   }, []);

//   return (
//     <div className="min-h-screen bg-[#fff8f1] text-[#e5e2e2]">
//       {isHome && !onboardingComplete ? (
//         <Onboarding
//           onComplete={() => {
//             window.localStorage.setItem("recomind_onboarding_complete", "true");
//             setOnboardingComplete(true);
//           }}
//         />
//       ) : (
//         <>
//           {/* <Sidebar />
//       <Header store={store} /> */}
//           <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

//           {/* <Header
//   store={store}
//   sidebarOpen={sidebarOpen}
// /> */}
//           {/* <main
//         className={`pt-12 px-margin-desktop pb-12 min-h-screen transition-all duration-300 overflow-x-auto ${
//           sidebarOpen ? "ml-64" : "ml-20"
//         }`}
//       > commented to avoid 2nd scroll bar*/}
//           {/* <main
//   className={`pt-12 px-margin-desktop pb-12 transition-all duration-300 overflow-x-hidden ${
//     sidebarOpen ? "ml-64" : "ml-20"
//   }`}
// > */}
//           <main
//             className={`h-screen scrollable-container pt-12 px-margin-desktop pb-12 transition-all duration-300 overflow-x-hidden ${
//               sidebarOpen ? "ml-64" : "ml-20"
//             }`}
//           >
//             {booting ? (
//               <div className="flex items-center justify-center min-h-[60vh] gap-3 text-on-surface-variant">
//                 {/* Spinner */}
//                 {/* <svg
//               className="animate-spin"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//             >
//               <circle
//                 cx="12"
//                 cy="12"
//                 r="10"
//                 stroke="currentColor"
//                 strokeWidth="4"
//               />
//               <path
//                 fill="currentColor"
//                 d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
//               />
//             </svg> */}
//                 <AiSpinner label="Loading Workspace" />
//               </div>
//             ) : (
//               children
//             )}
//           </main>
//         </>
//       )}
//     </div>
//   );
// };

// export default Layout;

import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import { storeApi } from "../lib/api";
import { useAuth } from "../context/Authcontext";

import Sidebar from "./Sidebar";
import Header from "./Header";
import AiSpinner from "./loader/AiSpinner";
import Onboarding from "./Onboarding";

const Layout = ({ children }) => {
  const { token } = useAuth();
  const location = useLocation();

  const [store, setStore] = useState(null);
  const [booting, setBooting] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // null = we haven't checked localStorage yet
  // true = onboarding has been completed
  // false = onboarding needs to be shown
  const [onboardingComplete, setOnboardingComplete] = useState(null);

  const isHome = location.pathname === "/app" || location.pathname === "/app/";

  // Check onboarding status BEFORE rendering the app/onboarding
  // This prevents onboarding Page 1 from flashing on refresh.
  useEffect(() => {
    if (typeof window === "undefined") return;

    const completed =
      window.localStorage.getItem("recomind_onboarding_complete") === "true";

    setOnboardingComplete(completed);
  }, []);

  // Load store data

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

  // Listen for sidebar state changes from localStorage

  useEffect(() => {
    const handleStorageChange = () => {
      const stored = localStorage.getItem("recomind_sidebar_open");

      if (stored !== null) {
        try {
          setSidebarOpen(JSON.parse(stored));
        } catch {
          // Ignore invalid localStorage value
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  if (onboardingComplete === null) {
    return (
      <div className="min-h-screen bg-[#fff8f1] flex items-center justify-center">
        <AiSpinner label="Loading Workspace" />
      </div>
    );
  }

  return (
    <div className="glass-surface min-h-screen text-[#101d34]">
      {/* FIRST-TIME USER:
          Show onboarding only on the /app home page*/}
      {isHome && !onboardingComplete ? (
        <Onboarding
          onComplete={() => {
            // Save completion so onboarding does not appear again
            window.localStorage.setItem("recomind_onboarding_complete", "true");

            // Immediately update React state
            setOnboardingComplete(true);
          }}
        />
      ) : (
        <>
          {/* Sidebar */}
          <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

          {/* Main content */}
          <main
            className={`h-screen scrollable-container pt-12 px-margin-desktop pb-12 transition-all duration-300 overflow-x-hidden ${
              sidebarOpen ? "ml-64" : "ml-20"
            }`}
          >
            {booting ? (
              <div className="flex items-center justify-center min-h-[60vh] gap-3 text-on-surface-variant">
                <AiSpinner label="Loading Workspace" />
              </div>
            ) : (
              children
            )}
          </main>
        </>
      )}
    </div>
  );
};

export default Layout;
