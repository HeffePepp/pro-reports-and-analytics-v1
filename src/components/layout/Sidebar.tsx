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
    path: "#",
    activeMatch: "/network",
    icon: Share2,
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();

  const isReportsRoute =
    location.pathname === "/" || location.pathname.startsWith("/reports");

  return (
    <aside
      className="
        hidden md:flex md:flex-col w-64
        bg-[#020617]          /* deep navy – closer to main platform */
        text-slate-100
      "
    >
      {/* Brand row */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-slate-800/80">
        <div className="h-9 w-9 rounded-2xl bg-sky-500 flex items-center justify-center text-slate-950 font-semibold shadow-sm">
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

          const baseClasses =
            "w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 " +
            "transition-colors cursor-pointer";

          const activeClasses =
            "bg-sky-600/25 text-sky-50"; // blue pill like the dashboard

          const inactiveClasses =
            "text-slate-300 hover:bg-white/5 hover:text-slate-50";

          const classes = `${baseClasses} ${
            isActive ? activeClasses : inactiveClasses
          }`;

          const iconClass = isActive ? "text-sky-300" : "text-slate-400";

          const content = (
            <>
              <Icon size={16} className={iconClass} />
              <span className="truncate">{item.label}</span>
            </>
          );

          if (item.path === "#") {
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
      <div className="px-4 py-4 border-t border-slate-800/80 text-xs text-slate-400">
        Signed in as
        <br />
        <span className="text-slate-200">demo@throttlepro.com</span>
      </div>
    </aside>
  );
};

export default Sidebar;
