import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, BarChart2, Share2, LucideIcon } from "lucide-react";

type NavItem = {
  label: string;
  path: string;
  activeMatch?: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    path: "#", // placeholder for now
    activeMatch: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Reports & Insights",
    path: "/",
    // treat the index + /reports/* as this section
    activeMatch: "/reports",
    icon: BarChart2,
  },
  {
    label: "Network Hierarchy",
    path: "#", // placeholder
    activeMatch: "/network",
    icon: Share2,
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isReportsRoute =
    location.pathname === "/" || location.pathname.startsWith("/reports");

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-slate-950 text-slate-100">
      {/* Brand row */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-800">
        <div className="h-9 w-9 rounded-2xl bg-emerald-400/90 flex items-center justify-center text-slate-900 font-semibold shadow-sm">
          TP
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold tracking-tight">
            Throttle Pro
          </span>
          <span className="text-[11px] text-slate-400">
            Reporting Prototype
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 text-sm space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.label === "Reports & Insights"
              ? isReportsRoute
              : !!(
                  item.activeMatch &&
                  location.pathname.startsWith(item.activeMatch)
                );

          const classes = [
            "w-full text-left px-3 py-2 rounded-xl flex items-center gap-2",
            "transition-colors cursor-pointer",
            isActive
              ? "bg-sky-900 text-slate-50"
              : "text-slate-300 hover:bg-slate-900/60",
          ].join(" ");

          const iconClass = isActive ? "text-sky-100" : "text-slate-400";

          const content = (
            <>
              <Icon size={16} className={iconClass} />
              <span className="truncate">{item.label}</span>
            </>
          );

          if (item.path === "#") {
            // non-clickable placeholder for now
            return (
              <button key={item.label} className={classes} type="button">
                {content}
              </button>
            );
          }

          return (
            <Link key={item.label} to={item.path} className={classes}>
              {content}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-400">
        Signed in as
        <br />
        <span className="text-slate-200">demo@throttlepro.com</span>
      </div>
    </aside>
  );
};

export default Sidebar;
