import { useState } from "react";
import { Link, useLocation } from "react-router";
import { ChevronLeft } from "lucide-react";

export const loader = async () => null;

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
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
      "flex items-center gap-3 px-2 py-1 rounded-lg font-normal border-r-2 transition-all duration-200 ease-in-out";
    if (active) {
      return `${base} text-secondary border-secondary bg-surface-container`;
    }
    return `${base} text-on-surface-variant border-transparent hover:bg-surface-container hover:text-on-surface`;
  };

  const navItems = [
    { to: "/app", icon: "dashboard", label: "Dashboard" },
    { to: "/app/products", icon: "inventory_2", label: "Products" },
    {
      to: "/app/promptwin",
      icon: "inventory_2",
      label: "Prompt Win",
    },
    {
      to: "/app/simulation",
      icon: "precision_manufacturing",
      label: "Simulation",
    },
    { to: "/app/reports", icon: "assessment", label: "Reports" },
  ];

  return (
    <aside
      className={`h-screen fixed left-0 top-0 border-r border-outline-variant dark:border-outline-variant bg-surface-container-lowest dark:bg-surface-container-lowest flex flex-col py-gutter px-4 z-50 transition-all duration-300 ${
        isOpen ? "w-44" : "w-20"
      }`}
    >
      {/* Header */}
      <div
        className={`mb-6 flex items-center justify-between ${!isOpen && "flex-col gap-4"}`}
      >
        <div
          className={`flex items-center ${isOpen ? "gap-3" : "gap-0 flex-col"}`}
        >
          <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center shrink-0">
            <span
              className="material-symbols-outlined text-on-secondary"
              style={{ fontVariationSettings: "'FILL' 1", fontSize: "15px" }}
            >
              psychology
            </span>
          </div>
          {isOpen && (
            <div>
              <h1 className="font-display-lg text-[14px] font-bold text-on-surface dark:text-on-surface leading-none">
                RecoMind
              </h1>
              <p className="text-[8px] text-on-surface-variant uppercase tracking-widest mt-1">
                AI Commerce Visibility
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-1.5 hover:bg-surface-container rounded-lg transition-colors text-on-surface-variant hover:text-on-surface shrink-0"
          title={isOpen ? "Collapse sidebar" : "Expand sidebar"}
        >
          <ChevronLeft
            size={15}
            className={`transition-transform duration-300 ${!isOpen && "rotate-180"}`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {navItems.map(({ to, icon, label }) => (
          <Link
            key={to}
            className={getLinkClasses(to)}
            to={to}
            title={!isOpen ? label : ""}
          >
            <span
              className="material-symbols-outlined shrink-0"
              style={{ fontSize: "14px" }}
              data-icon={icon}
            >
              {icon}
            </span>
            {isOpen && <span className="text-[15px]">{label}</span>}
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div
        className={`pt-8 mt-auto border-t border-outline-variant ${isOpen ? "space-y-2" : "space-y-3"}`}
      >
        <button
          className={`${
            isOpen ? "w-full" : "w-full"
          } bg-secondary text-on-secondary font-bold py-3 rounded-lg mb-4 hover:opacity-90 transition-all flex items-center justify-center`}
          title={!isOpen ? "Upgrade Plan" : ""}
        >
          {isOpen ? (
            "Upgrade Plan"
          ) : (
            <span
              className="material-symbols-outlined"
              style={{ fontSize: "20px" }}
            >
              trending_up
            </span>
          )}
        </button>
        <Link
          className={`flex items-center px-4 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors ${
            !isOpen && "justify-center"
          }`}
          to="/app/settings"
          title={!isOpen ? "Settings" : ""}
        >
          <span
            className="material-symbols-outlined shrink-0"
            style={{ fontSize: "20px" }}
          >
            settings
          </span>
          {isOpen && <span className="ml-3">Settings</span>}
        </Link>
        <Link
          className={`flex items-center px-4 py-2 rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition-colors ${
            !isOpen && "justify-center"
          }`}
          to="/app/support"
          title={!isOpen ? "Support" : ""}
        >
          <span
            className="material-symbols-outlined shrink-0"
            style={{ fontSize: "20px" }}
          >
            help_outline
          </span>
          {isOpen && <span className="ml-3">Support</span>}
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
