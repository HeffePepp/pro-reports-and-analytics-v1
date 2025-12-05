import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar: React.FC = () => {
  const location = useLocation();

  const items = [
    { label: "Dashboard", path: "#", activeMatch: "" },
    { label: "Customers", path: "#", activeMatch: "" },
    { label: "Campaigns", path: "#", activeMatch: "" },
    { label: "Reports & Insights", path: "/", activeMatch: "/" },
    { label: "Organizations", path: "#", activeMatch: "" },
    { label: "Settings", path: "#", activeMatch: "" },
  ];

  return (
    <aside className="hidden md:flex md:flex-col w-64 bg-slate-900 text-slate-100">
      <div className="flex items-center gap-2 px-5 h-14 border-b border-slate-800">
        <div className="h-8 w-8 rounded-xl bg-emerald-400 flex items-center justify-center font-bold text-slate-900">
          TP
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">Throttle Pro</span>
          <span className="text-[11px] text-slate-400">Reporting Prototype</span>
        </div>
      </div>
      <nav className="flex-1 px-3 py-4 text-sm space-y-1">
        {items.map((item) => {
          const isActive =
            item.activeMatch &&
            location.pathname.startsWith(item.activeMatch);
          const classes = `w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 ${
            isActive ? "bg-slate-800 font-medium" : "text-slate-300"
          }`;
          const content = (
            <>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
              <span>{item.label}</span>
            </>
          );
          return item.path === "#" ? (
            <button key={item.label} className={classes}>
              {content}
            </button>
          ) : (
            <Link key={item.label} to={item.path} className={classes}>
              {content}
            </Link>
          );
        })}
      </nav>
      <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-400">
        Signed in as<br />
        <span className="text-slate-200">demo@throttlepro.com</span>
      </div>
    </aside>
  );
};

export default Sidebar;
