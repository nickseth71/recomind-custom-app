import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import {
  Archive,
  LayoutDashboard,
  Workflow,
  FileText,
  ChartBarBig,
  ChartNoAxesCombined,
  Receipt,
  Bot,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useAuth } from "../context/Authcontext";

export const loader = async () => null;

const normalizeShopName = (shop) => {
  if (!shop) return null;
  return shop
    .replace(/\.myshopify\.com$/i, "")
    .replace(/-/g, "")
    .trim();
};

// const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { token: existingToken, shop } = useAuth();
  const [isPinned, setIsPinned] = useState(false);
  const [storePlan, setStorePlan] = useState("Starter");
  const [storedShop, setStoredShop] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // const existingToken = localStorage.getItem("recomind_token");
    // const shop = localStorage.getItem("recomind_shop");

    let decodedToken = null;
    try {
      decodedToken = existingToken ? jwtDecode(existingToken) : null;
    } catch (err) {
      decodedToken = null;
    }

    setStorePlan(decodedToken?.storePlan || "Starter");
    setStoredShop(normalizeShopName(shop));
  }, []);

  // changed isOpen to sideBar openand setIsOpen to setSidebarOpen for sidebar changes
  // const Sidebar = () => {
  //   const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/app") {
      return location.pathname === "/app" || location.pathname === "/app/";
    }
    return location.pathname.startsWith(path);
  };

  const getLinkClasses = (path) => {
    const active = isActive(path);
    // const base =
    //   "flex items-center gap-3 px-4 py-2 rounded-lg font-semibold border-r-2 transition-all duration-200 ease-in-out";
    const base =
      "flex items-center gap-2 px-3 py-2 rounded-lg font-medium border-r-2 transition-all duration-200";
    if (active) {
      return `${base} text-secondary border-secondary bg-surface-container`;
    }
    return `${base} text-on-surface-variant border-transparent hover:bg-surface-container hover:text-on-surface`;
  };

  const navItems = [
    {
      to: "/app",
      icon: <LayoutDashboard size={sidebarOpen ? "16" : "20"} />,
      label: "Dashboard",
    },
    {
      to: "/app/products",
      icon: <Archive size={sidebarOpen ? "16" : "20"} />,
      label: "Products",
    },
    {
      to: "/app/promptwins",
      icon: <LayoutDashboard size={sidebarOpen ? "16" : "20"} />,
      label: "Prompt Wins",
    },
    {
      to: "/app/competitors",
      icon: <ChartBarBig size={sidebarOpen ? "16" : "20"} />,
      label: "Competitors",
    },
    {
      to: "/app/impact",
      icon: <ChartNoAxesCombined size={sidebarOpen ? "16" : "20"} />,
      label: "Impact",
    },
    {
      to: "/app/simulation",
      icon: <Workflow size={sidebarOpen ? "16" : "20"} />,
      label: "Simulation",
    },
    {
      to: "/app/reports",
      icon: <FileText size={sidebarOpen ? "16" : "20"} />,
      label: "Reports",
    },
    {
      to: "/app/ai-index",
      icon: <Bot size={sidebarOpen ? "16" : "20"} />,
      label: "AI Store Index",
    },
    {
      to: "/app/billing",
      icon: <Receipt size={sidebarOpen ? "16" : "20"} />,
      label: "Billing",
    },
  ];

  return (
    // <aside
    //   className={`h-screen fixed left-0 top-0 border-r border-outline-variant dark:border-outline-variant bg-surface-container-lowest dark:bg-surface-container-lowest flex flex-col py-gutter px-4 z-50 transition-all duration-300 ${
    //     sidebarOpen ? "w-54" : "w-20"
    //   }`}
    // >
    <aside
      onMouseEnter={() => {
        if (!isPinned) setSidebarOpen(true);
      }}
      onMouseLeave={() => {
        if (!isPinned) setSidebarOpen(false);
      }}
      className={`h-screen fixed left-0 top-0 border-r border-outline-variant
  bg-surface-container-lowest flex flex-col py-gutter px-4 z-50
  transition-all duration-300 ease-in-out
  ${sidebarOpen ? "w-56" : "w-20"}`}
    >
      {/* Header */}
      <div
        className={`w-full mb-3 flex items-center justify-start ${!sidebarOpen && "flex-col gap-4"}`}
      >
        <div
          className={`w-full h-auto flex items-center ${sidebarOpen ? "gap-1" : "gap-0 flex-col"}`}
        >
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0">
            <img
              className="material-symbols-outlined text-on-secondary"
              src="/recomind-logo.png"
              alt="RecoMind Logo"
              width={22}
              height={22}
            />
          </div>
          {sidebarOpen && (
            <div>
              {/* <h1 className="font-display-lg text-[14px] font-bold text-on-surface dark:text-on-surface leading-none">
                RecoMind
              </h1> */}
              <h1 className="flex items-end leading-none tracking-[-0.03em]">
                <span className="text-[18px] font-extrabold text-on-surface">
                  Reco
                </span>
                <span className="text-[18px] text-on-surface">Mind</span>
                <span className="ml-[1px] text-[16px] font-bold text-[#9E3A56]">
                  .app
                </span>
              </h1>
              <p className="text-[7px] text-on-surface-variant uppercase tracking-widest mt-1">
                AI-POWERED RECOMMENDATIONS
              </p>
            </div>
          )}
        </div>
        {/* <button
          // onClick={() => setSidebarOpen(!sidebarOpen)}
          onClick={() => {
  const nextPinned = !isPinned;
  setIsPinned(nextPinned);
  setSidebarOpen(nextPinned);
}}
          className="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant hover:text-on-surface shrink-0"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronLeft
            size={18}
            className={`transition-transform duration-300 ${!sidebarOpen && "rotate-180"}`}
          />
        </button> */}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, icon, label }) => (
          <Link
            key={to}
            className={getLinkClasses(to)}
            to={to}
            title={!sidebarOpen ? label : ""}
          >
            <span
              className="material-symbols-outlined  shrink-0"
              style={{ fontSize: "16px" }}
              data-icon={icon}
            >
              {icon}
            </span>
            {sidebarOpen && (
              <span className=" text-[12px] gap-12">{label}</span>
            )}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div
        // className={`pt-2 border-t border-outline-variant ${sidebarOpen ? "space-y-2" : "space-y-3"}`}
        className={`pt-2 ${
          sidebarOpen
            ? "border-t border-outline-variant space-y-2"
            : "border-t-0 space-y-3"
        }`}
      >
        {/* <button
          className={`${
            sidebarOpen ? "w-full" : "w-full"
          } bg-secondary text-on-secondary font-bold py-2 rounded-lg mb-2 hover:opacity-90 transition-all flex items-center justify-center`}
          title={!sidebarOpen ? "Upgrade Plan" : ""}
        > 
          {sidebarOpen ? (
            "Upgrade Plan"
          ) : (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "16px" }}
            >
              trending_up
            </span>
          )} 
        </button> */}
        {/* <Link
          className={`flex items-center px-4 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors ${
            !sidebarOpen && "justify-center"
          }`}
          to="/app/settings"
          title={!sidebarOpen ? "Settings" : ""}
        >
          <span
            className="material-symbols-outlined shrink-0"
            style={{ fontSize: "16px" }}
          >
            settings
          </span>
          {sidebarOpen && <span className="ml-3">Settings</span>}
        </Link> */}
        {/* {sidebarOpen && (
          <div className=" rounded-2xl border border-outline-variant bg-surface-container p-1">
            <div className="flex items-center ">
              <div className="relative h-12 w-12 rounded-full flex items-center justify-center">
                <svg className="absolute h-12 w-12 -rotate-90">
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    fill="none"
                    stroke="#4B5563"
                    strokeWidth="4"
                  />
                  <circle
                    cx="24"
                    cy="24"
                    r="18"
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth="4"
                    strokeDasharray="113"
                    strokeDashoffset="32"
                    strokeLinecap="round"
                  />
                </svg>

                <span className="text-sm font-bold text-on-surface">72</span>
              </div>

              <div>
                <p className="text-[10px] text-on-surface font-semibold">
                  AI Visibility Score
                </p>

                <p className="text-green-500 text-xs font-semibold">
                  ↑ 12 pts vs last scan
                </p>

                <button className="text-xs text-on-surface-variant hover:underline">
                  View full report
                </button>
              </div>
            </div>
          </div>
        )} */}

        {/* store name */}
        {storedShop ? (
          <div className="border-t border-outline-variant pt-4">
            {/* <div className="flex items-center gap-3"> */}
            <div
              className={`flex items-center ${
                sidebarOpen ? "gap-3" : "justify-center"
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold shrink-0">
                {storedShop.charAt(0).toUpperCase()}
              </div>

              {sidebarOpen && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-surface leading-none">
                    {storedShop}
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {storePlan.toUpperCase()}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="border-t border-outline-variant pt-4">
            {/* <div className="flex items-center gap-3"> */}
            <div
              className={`flex items-center ${
                sidebarOpen ? "gap-3" : "justify-center"
              }`}
            >
              <div className="h-10 w-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center font-bold shrink-0">
                R
              </div>

              {sidebarOpen && (
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-on-surface leading-none">
                    RecoMind
                  </p>
                  <p className="text-xs text-on-surface-variant mt-1">
                    {storePlan}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
