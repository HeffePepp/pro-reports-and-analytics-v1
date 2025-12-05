import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type ServiceIntervalsSummary = {
  storeName: string;
  periodLabel: string;
  totalVehicles: number;
  currentCount: number;
  atRiskCount: number;
  lostCount: number;
  avgDaysBetweenVisits: number;
};

type StoreRow = {
  storeName: string;
  totalVehicles: number;
  currentPercent: number;
  atRiskPercent: number;
  lostPercent: number;
};

// Dummy data – swap this out for Airtable / API later
const summary: ServiceIntervalsSummary = {
  storeName: "Vallejo, CA",
  periodLabel: "Last 12 months",
  totalVehicles: 6420,
  currentCount: 4560,
  atRiskCount: 910,
  lostCount: 950,
  avgDaysBetweenVisits: 178,
};

const storeRows: StoreRow[] = [
  {
    storeName: "Vallejo, CA",
    totalVehicles: 6420,
    currentPercent: 71,
    atRiskPercent: 14,
    lostPercent: 15,
  },
  {
    storeName: "Napa, CA",
    totalVehicles: 3880,
    currentPercent: 64,
    atRiskPercent: 18,
    lostPercent: 18,
  },
  {
    storeName: "Fairfield, CA",
    totalVehicles: 2950,
    currentPercent: 76,
    atRiskPercent: 13,
    lostPercent: 11,
  },
];

const ServiceIntervals: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Most at-risk customers are 13–18 months since last service.",
    "About 910 vehicles are at risk and 950 are lost at the Vallejo store.",
    "Consider a reactivation campaign for the 13–18 month bucket with a gentle offer.",
  ]);

  const currentPercent = useMemo(
    () =>
      Math.round((summary.currentCount / summary.totalVehicles) * 100),
    []
  );
  const atRiskPercent = useMemo(
    () =>
      Math.round((summary.atRiskCount / summary.totalVehicles) * 100),
    []
  );
  const lostPercent = useMemo(
    () =>
      Math.max(0, 100 - currentPercent - atRiskPercent),
    [currentPercent, atRiskPercent]
  );

  // In the future, call your backend / Lovable AI here
  const regenerateInsights = () => {
    // For now, just rotate some dummy text
    setInsights([
      "71% of vehicles are current; focusing on at-risk buckets could recover ~300–400 customers.",
      "The largest at-risk cohort is 13–18 months out. They respond best to reminder + modest offer.",
      "Stores with stronger data capture show higher current% – coach low performers on capture and journey settings.",
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar (same look as home) */}
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
            <Link
              to="/"
              className="text-slate-400 hover:text-slate-600"
            >
              Reports & Insights
            </Link>
            <span className="text-slate-400">/</span>
            <span className="font-medium text-slate-700">Service Intervals</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline text-slate-500">
              Store: <span className="font-medium">{summary.storeName}</span>
            </span>
            <span className="hidden sm:inline text-slate-500">
              Period: <span className="font-medium">{summary.periodLabel}</span>
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
          {/* Title + description */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                Service Intervals
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Retention snapshot for {summary.storeName}. See how many vehicles are
                current, at-risk or lost based on time since last service.
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Total vehicles</div>
                <div className="mt-0.5 text-base font-semibold">
                  {summary.totalVehicles.toLocaleString()}
                </div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Avg days between visits</div>
                <div className="mt-0.5 text-base font-semibold">
                  {summary.avgDaysBetweenVisits}
                </div>
              </div>
            </div>
          </div>

          {/* Hero tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <Tile label="Current customers" value={`${currentPercent}%`} helper={`${summary.currentCount.toLocaleString()} vehicles`} tone="positive" />
            <Tile label="At-risk customers" value={`${atRiskPercent}%`} helper={`${summary.atRiskCount.toLocaleString()} vehicles`} tone="warn" />
            <Tile label="Lost customers" value={`${lostPercent}%`} helper={`${summary.lostCount.toLocaleString()} vehicles`} tone="negative" />
            <Tile label="Total vehicles" value={summary.totalVehicles.toLocaleString()} helper="Unique vehicles in period" />
            <Tile label="Avg days between visits" value={`${summary.avgDaysBetweenVisits}`} helper="Across all returning vehicles" />
          </div>

          {/* Status bar chart */}
          <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-sm font-semibold text-slate-800">
                  Retention status
                </h2>
                <span className="text-[11px] text-slate-400">
                  % of vehicles by time-since-last-visit
                </span>
              </div>
              <div className="space-y-3">
                <div className="flex w-full h-4 rounded-full overflow-hidden bg-slate-100">
                  <div
                    className="h-full bg-emerald-400"
                    style={{ width: `${currentPercent}%` }}
                    title={`Current ${currentPercent}%`}
                  />
                  <div
                    className="h-full bg-amber-400"
                    style={{ width: `${atRiskPercent}%` }}
                    title={`At-risk ${atRiskPercent}%`}
                  />
                  <div
                    className="h-full bg-rose-400"
                    style={{ width: `${lostPercent}%` }}
                    title={`Lost ${lostPercent}%`}
                  />
                </div>
                <div className="flex flex-wrap gap-3 text-[11px] text-slate-600">
                  <LegendDot colorClass="bg-emerald-400" label={`Current · ${currentPercent}%`} />
                  <LegendDot colorClass="bg-amber-400" label={`At-risk · ${atRiskPercent}%`} />
                  <LegendDot colorClass="bg-rose-400" label={`Lost · ${lostPercent}%`} />
                </div>
              </div>
            </div>

            {/* AI insights */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-2">
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
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-slate-400">
                In the full app, this panel will call Lovable/OpenAI with live metrics
                to generate store-specific recommendations.
              </p>
            </div>
          </section>

          {/* Store table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-sm font-semibold text-slate-800">
                Stores overview
              </h2>
              <span className="text-[11px] text-slate-400">
                Current / at-risk / lost % by store
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-4">Store</th>
                    <th className="py-2 pr-4 text-right">Total vehicles</th>
                    <th className="py-2 pr-4 text-right">Current %</th>
                    <th className="py-2 pr-4 text-right">At-risk %</th>
                    <th className="py-2 pr-4 text-right">Lost %</th>
                  </tr>
                </thead>
                <tbody>
                  {storeRows.map((row) => (
                    <tr key={row.storeName} className="border-t border-slate-100">
                      <td className="py-2 pr-4 text-slate-700">{row.storeName}</td>
                      <td className="py-2 pr-4 text-right">
                        {row.totalVehicles.toLocaleString()}
                      </td>
                      <td className="py-2 pr-4 text-right text-emerald-600">
                        {row.currentPercent}%
                      </td>
                      <td className="py-2 pr-4 text-right text-amber-600">
                        {row.atRiskPercent}%
                      </td>
                      <td className="py-2 pr-4 text-right text-rose-600">
                        {row.lostPercent}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

interface TileProps {
  label: string;
  value: string;
  helper?: string;
  tone?: "positive" | "warn" | "negative";
}

const Tile: React.FC<TileProps> = ({ label, value, helper, tone }) => {
  const toneClasses =
    tone === "positive"
      ? "border-emerald-100 bg-emerald-50"
      : tone === "warn"
      ? "border-amber-100 bg-amber-50"
      : tone === "negative"
      ? "border-rose-100 bg-rose-50"
      : "border-slate-200 bg-white";

  return (
    <div
      className={`rounded-2xl border ${toneClasses} px-3 py-2 shadow-sm flex flex-col justify-between`}
    >
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="mt-1 text-base font-semibold text-slate-900">
        {value}
      </span>
      {helper && (
        <span className="mt-0.5 text-[11px] text-slate-500">{helper}</span>
      )}
    </div>
  );
};

const LegendDot: React.FC<{ colorClass: string; label: string }> = ({
  colorClass,
  label,
}) => (
  <span className="inline-flex items-center gap-1">
    <span className={`h-2 w-2 rounded-full ${colorClass}`} />
    <span>{label}</span>
  </span>
);

export default ServiceIntervals;
