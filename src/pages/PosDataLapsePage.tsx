import React, { useState } from "react";
import { Link } from "react-router-dom";

type PosLapseRow = {
  storeName: string;
  throttleId: string;
  posName: string;
  lastInvDate: string;
  daysWithoutData: number;
  contactName: string;
  contactEmail: string;
};

const posLapseRows: PosLapseRow[] = [
  {
    storeName: "Vallejo, CA",
    throttleId: "S17040",
    posName: "LubeSoft",
    lastInvDate: "2024-12-01",
    daysWithoutData: 2,
    contactName: "POS Support – LubeSoft",
    contactEmail: "support@lubesoft.com",
  },
  {
    storeName: "Napa, CA",
    throttleId: "S18021",
    posName: "LubeSoft",
    lastInvDate: "2024-11-28",
    daysWithoutData: 5,
    contactName: "POS Support – LubeSoft",
    contactEmail: "support@lubesoft.com",
  },
  {
    storeName: "Fairfield, CA",
    throttleId: "S19012",
    posName: "ShopWare",
    lastInvDate: "2024-11-26",
    daysWithoutData: 7,
    contactName: "ShopWare Support",
    contactEmail: "help@shopware.com",
  },
];

const PosDataLapsePage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Three stores show recent POS data lapses; two are over 5 days without new invoices.",
    "When POS data stops, all performance and journey reports for those stores become stale.",
    "Reach out to POS vendors or store managers to restore the feed and prevent blind spots.",
  ]);

  const storesOver3Days = posLapseRows.filter((r) => r.daysWithoutData > 3).length;
  const maxDays = Math.max(...posLapseRows.map((r) => r.daysWithoutData));

  const regenerateInsights = () => {
    setInsights([
      `${storesOver3Days} stores have more than 3 days without POS data; the longest gap is ${maxDays} days.`,
      "Investigate whether the POS integration, SFTP/API credentials, or in-store networking is causing the lapse.",
      "In the full app, this report would trigger alerts and temporarily flag reports that rely on invoice data for those stores.",
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
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
          {["Dashboard", "Customers", "Campaigns", "Reports & Insights", "Organizations", "Settings"].map(
            (item) => (
              <Link
                key={item}
                to={item === "Reports & Insights" ? "/" : "#"}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 ${
                  item === "Reports & Insights" ? "bg-slate-800 font-medium" : "text-slate-300"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                <span>{item}</span>
              </Link>
            )
          )}
        </nav>
        <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-400">
          Signed in as<br />
          <span className="text-slate-200">demo@throttlepro.com</span>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-slate-400 hover:text-slate-600">
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <Link to="/" className="text-slate-400 hover:text-slate-600">
              Reports & Insights
            </Link>
            <span className="text-slate-400">/</span>
            <span className="font-medium text-slate-700">POS Data Lapse</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              Period: <span className="font-medium">Last 14 days</span>
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                POS Data Lapse
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Monitor which stores have stopped sending POS data, how long the gap
                has been, and which vendor contacts to escalate with.
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Stores with lapses</div>
                <div className="mt-0.5 text-base font-semibold">
                  {posLapseRows.length}
                </div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Longest gap</div>
                <div className="mt-0.5 text-base font-semibold">
                  {maxDays} days
                </div>
              </div>
            </div>
          </div>

          {/* Insights + table */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Insights */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-slate-800">
                  AI insights (mock)
                </h2>
                <button
                  onClick={regenerateInsights}
                  className="text-[11px] px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600"
                >
                  Refresh
                </button>
              </div>
              <ul className="space-y-1 text-xs text-slate-600">
                {insights.map((line, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-slate-400">
                In the full app, this panel will drive alerts and show which other
                reports are impacted by lapses at these stores.
              </p>
            </div>

            {/* Table */}
            <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-slate-800">
                  Stores with POS data gaps
                </h2>
                <span className="text-[11px] text-slate-400">
                  Days without data and vendor contacts
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                      <th className="py-2 pr-3">Store</th>
                      <th className="py-2 pr-3">Throttle ID</th>
                      <th className="py-2 pr-3">POS</th>
                      <th className="py-2 pr-3">Last invoice</th>
                      <th className="py-2 pr-3 text-right">Days w/out data</th>
                      <th className="py-2 pr-3">POS contact</th>
                      <th className="py-2 pr-3">POS email</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posLapseRows.map((row) => (
                      <tr key={row.storeName} className="border-t border-slate-100">
                        <td className="py-2 pr-3 text-slate-700">{row.storeName}</td>
                        <td className="py-2 pr-3 text-slate-600">{row.throttleId}</td>
                        <td className="py-2 pr-3 text-slate-600">{row.posName}</td>
                        <td className="py-2 pr-3 text-slate-600">{row.lastInvDate}</td>
                        <td className="py-2 pr-3 text-right text-rose-600">
                          {row.daysWithoutData}
                        </td>
                        <td className="py-2 pr-3 text-slate-600">{row.contactName}</td>
                        <td className="py-2 pr-3 text-slate-600">{row.contactEmail}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default PosDataLapsePage;
