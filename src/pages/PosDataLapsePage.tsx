import React, { useState } from "react";
import { Link } from "react-router-dom";

type PosDataLapseSummary = {
  storeName: string;
  periodLabel: string;
  totalRecords: number;
  currentCount: number;
  lapsedCount: number;
  criticalCount: number;
  avgDaysSinceUpdate: number;
};

type StoreRow = {
  storeName: string;
  totalRecords: number;
  currentPercent: number;
  lapsedPercent: number;
  criticalPercent: number;
};

const summary: PosDataLapseSummary = {
  storeName: "Vallejo, CA",
  periodLabel: "Last 12 months",
  totalRecords: 8420,
  currentCount: 5894,
  lapsedCount: 1684,
  criticalCount: 842,
  avgDaysSinceUpdate: 45,
};

const storeRows: StoreRow[] = [
  { storeName: "Vallejo, CA", totalRecords: 8420, currentPercent: 70, lapsedPercent: 20, criticalPercent: 10 },
  { storeName: "Napa, CA", totalRecords: 4560, currentPercent: 65, lapsedPercent: 22, criticalPercent: 13 },
  { storeName: "Fairfield, CA", totalRecords: 3210, currentPercent: 78, lapsedPercent: 15, criticalPercent: 7 },
];

const PosDataLapsePage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "70% of POS records are current – target is 80%.",
    "842 records are critically outdated (>180 days).",
    "Fairfield leads with 78% current data – share their processes.",
  ]);

  const currentPercent = Math.round((summary.currentCount / summary.totalRecords) * 100);
  const lapsedPercent = Math.round((summary.lapsedCount / summary.totalRecords) * 100);
  const criticalPercent = Math.round((summary.criticalCount / summary.totalRecords) * 100);

  const regenerateInsights = () => {
    setInsights([
      "Records older than 90 days have 40% lower engagement rates.",
      "Implement weekly data refresh reminders to improve currency.",
      "Critical records cost ~$2.50 each in lost opportunities.",
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <aside className="hidden md:flex md:flex-col w-64 bg-slate-900 text-slate-100">
        <div className="flex items-center gap-2 px-5 h-14 border-b border-slate-800">
          <div className="h-8 w-8 rounded-xl bg-emerald-400 flex items-center justify-center font-bold text-slate-900">TP</div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Throttle Pro</span>
            <span className="text-[11px] text-slate-400">Reporting Prototype</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 text-sm space-y-1">
          {["Dashboard", "Customers", "Campaigns", "Reports & Insights", "Organizations", "Settings"].map((item) => (
            <Link key={item} to={item === "Reports & Insights" ? "/" : "#"} className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 ${item === "Reports & Insights" ? "bg-slate-800 font-medium" : "text-slate-300"}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
              <span>{item}</span>
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-400">
          Signed in as<br /><span className="text-slate-200">demo@throttlepro.com</span>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-slate-400 hover:text-slate-600">Home</Link>
            <span className="text-slate-400">/</span>
            <Link to="/" className="text-slate-400 hover:text-slate-600">Reports & Insights</Link>
            <span className="text-slate-400">/</span>
            <span className="font-medium text-slate-700">POS Data Lapse</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline text-slate-500">Store: <span className="font-medium">{summary.storeName}</span></span>
            <span className="hidden sm:inline text-slate-500">Period: <span className="font-medium">{summary.periodLabel}</span></span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">POS Data Lapse</h1>
              <p className="mt-1 text-sm text-slate-500">Data freshness overview for {summary.storeName}. Monitor current, lapsed, and critical records.</p>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Total records</div>
                <div className="mt-0.5 text-base font-semibold">{summary.totalRecords.toLocaleString()}</div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Avg days since update</div>
                <div className="mt-0.5 text-base font-semibold">{summary.avgDaysSinceUpdate}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Tile label="Current records" value={`${currentPercent}%`} helper={`${summary.currentCount.toLocaleString()} records`} tone="positive" />
            <Tile label="Lapsed records" value={`${lapsedPercent}%`} helper={`${summary.lapsedCount.toLocaleString()} records`} tone="warn" />
            <Tile label="Critical records" value={`${criticalPercent}%`} helper={`${summary.criticalCount.toLocaleString()} records`} tone="negative" />
            <Tile label="Total records" value={summary.totalRecords.toLocaleString()} helper="POS records in system" />
          </div>

          <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-sm font-semibold text-slate-800">Data freshness status</h2>
                <span className="text-[11px] text-slate-400">% of records by data age</span>
              </div>
              <div className="space-y-3">
                <div className="flex w-full h-4 rounded-full overflow-hidden bg-slate-100">
                  <div className="h-full bg-emerald-400" style={{ width: `${currentPercent}%` }} title={`Current ${currentPercent}%`} />
                  <div className="h-full bg-amber-400" style={{ width: `${lapsedPercent}%` }} title={`Lapsed ${lapsedPercent}%`} />
                  <div className="h-full bg-rose-400" style={{ width: `${criticalPercent}%` }} title={`Critical ${criticalPercent}%`} />
                </div>
                <div className="flex flex-wrap gap-3 text-[11px] text-slate-600">
                  <LegendDot colorClass="bg-emerald-400" label={`Current (<90 days) · ${currentPercent}%`} />
                  <LegendDot colorClass="bg-amber-400" label={`Lapsed (90-180 days) · ${lapsedPercent}%`} />
                  <LegendDot colorClass="bg-rose-400" label={`Critical (>180 days) · ${criticalPercent}%`} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-sm font-semibold text-slate-800">AI insights (mock)</h2>
                <button onClick={regenerateInsights} className="text-[11px] px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600">Refresh</button>
              </div>
              <ul className="space-y-1 text-xs text-slate-600">
                {insights.map((line, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-sm font-semibold text-slate-800">Stores overview</h2>
              <span className="text-[11px] text-slate-400">Data freshness by store</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-4">Store</th>
                    <th className="py-2 pr-4 text-right">Total records</th>
                    <th className="py-2 pr-4 text-right">Current %</th>
                    <th className="py-2 pr-4 text-right">Lapsed %</th>
                    <th className="py-2 pr-4 text-right">Critical %</th>
                  </tr>
                </thead>
                <tbody>
                  {storeRows.map((row) => (
                    <tr key={row.storeName} className="border-t border-slate-100">
                      <td className="py-2 pr-4 text-slate-700">{row.storeName}</td>
                      <td className="py-2 pr-4 text-right">{row.totalRecords.toLocaleString()}</td>
                      <td className="py-2 pr-4 text-right text-emerald-600">{row.currentPercent}%</td>
                      <td className="py-2 pr-4 text-right text-amber-600">{row.lapsedPercent}%</td>
                      <td className="py-2 pr-4 text-right text-rose-600">{row.criticalPercent}%</td>
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
  const toneClasses = tone === "positive" ? "border-emerald-100 bg-emerald-50" : tone === "warn" ? "border-amber-100 bg-amber-50" : tone === "negative" ? "border-rose-100 bg-rose-50" : "border-slate-200 bg-white";
  return (
    <div className={`rounded-2xl border ${toneClasses} px-3 py-2 shadow-sm flex flex-col justify-between`}>
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="mt-1 text-base font-semibold text-slate-900">{value}</span>
      {helper && <span className="mt-0.5 text-[11px] text-slate-500">{helper}</span>}
    </div>
  );
};

const LegendDot: React.FC<{ colorClass: string; label: string }> = ({ colorClass, label }) => (
  <span className="inline-flex items-center gap-1">
    <span className={`h-2 w-2 rounded-full ${colorClass}`} />
    <span>{label}</span>
  </span>
);

export default PosDataLapsePage;
