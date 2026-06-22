import { useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronLeft, Archive, Trophy ,Workflow, FileText, ChartBarBig, ChartNoAxesCombined, ReceiptText} from "lucide-react";


export const loader = async () => null;
// changed isOpen to sideBar openand setIsOpen to setSidebarOpen for sidebar changes
// const Sidebar = () => {
//   const [isOpen, setIsOpen] = useState(true);
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();

  const isActive = (path) => {
    if (path === "/app") {
      return location.pathname === "/app" || location.pathname === "/app/";
    }
    return location.pathname.startsWith(path);
  };

  const getLinkClasses = (path) => {
    const active = isActive(path);
    const base =
      "flex items-center gap-1.5 px-4 py-1 rounded-lg font-semibold border-r-2 transition-all duration-200 ease-in-out";
    if (active) {
      return `${base} text-secondary border-secondary bg-surface-container`;
    }
    return `${base} text-on-surface-variant border-transparent hover:bg-surface-container hover:text-on-surface`;
  };

  const navItems = [
    { to: "/app", icon: <Trophy size={14}/>, label: "Dashboard" },
    { to: "/app/products", icon: <Archive size={14} />, label: "Products" },
    { to: "/app/products" , icon: <Trophy size={14}/>, label: "Prompt Wins" },
    { to: "/app/products" , icon: <ChartBarBig size={14}/>, label: "Competitors" },
    { to: "/app/products" , icon: <ChartNoAxesCombined size={14}/>, label: "Impact" },
    {
      to: "/app/simulation",
      icon: <Workflow size={14}/>,
      label: "Simulation",
    },
    { to: "/app/reports", icon:<FileText size={14}/> , label: "Reports" },
    { to: "/app/products" , icon:<ReceiptText size={14} /> , label: "Billing" },
  ];

  return (
    <aside
      className={`h-screen fixed left-0 top-0 border-r border-outline-variant dark:border-outline-variant bg-surface-container-lowest dark:bg-surface-container-lowest flex flex-col py-gutter px-4 z-50 transition-all duration-300 ${
        sidebarOpen ? "w-54" : "w-20"
      }`}
    >
      {/* Header */}
      <div
        className={`mb-8 flex items-center justify-between ${!sidebarOpen && "flex-col gap-4"}`}
      >
        <div
          className={`flex items-center ${sidebarOpen ? "gap-3" : "gap-0 flex-col"}`}
        >
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-on-secondary"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "16px" }}
            >
              psychology
            </span>
          </div>
          {sidebarOpen && (
            <div>
              <h1 className="font-display-lg text-[14px] font-bold text-on-surface dark:text-on-surface leading-none">
              <h1 className="font-display-lg text-[14px] font-bold text-on-surface dark:text-on-surface leading-none">
                RecoMind
              </h1>
              <p className="text-[8px] text-on-surface-variant uppercase tracking-widest mt-1">
              <p className="text-[8px] text-on-surface-variant uppercase tracking-widest mt-1">
                AI Commerce Visibility
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant hover:text-on-surface shrink-0"
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronLeft
            size={18}
            className={`transition-transform duration-300 ${!sidebarOpen && "rotate-180"}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-0">
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
            {sidebarOpen && <span className="text-[14px]">{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={`pt-8 mt-3 border-t border-outline-variant ${sidebarOpen ? "space-y-2" : "space-y-3"}`}
      >
        <button
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
        </button>
        <Link
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
        </Link>
        <Link
          className={`flex items-center px-4 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors ${
            !sidebarOpen && "justify-center"
          }`}
          to="/app/support"
          title={!sidebarOpen ? "Support" : ""}
        >
          <span
            className="material-symbols-outlined shrink-0"
            style={{ fontSize: "16px" }}
          >
            help_outline
          </span>
          {sidebarOpen && <span className="ml-3">Support</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
