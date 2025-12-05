import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, LegendDot } from "@/components/layout";

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
  { storeName: "Vallejo, CA", totalVehicles: 6420, currentPercent: 71, atRiskPercent: 14, lostPercent: 15 },
  { storeName: "Napa, CA", totalVehicles: 3880, currentPercent: 64, atRiskPercent: 18, lostPercent: 18 },
  { storeName: "Fairfield, CA", totalVehicles: 2950, currentPercent: 76, atRiskPercent: 13, lostPercent: 11 },
];

const ServiceIntervals: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Most at-risk customers are 13–18 months since last service.",
    "About 910 vehicles are at risk and 950 are lost at the Vallejo store.",
    "Consider a reactivation campaign for the 13–18 month bucket with a gentle offer.",
  ]);

  const currentPercent = useMemo(() => Math.round((summary.currentCount / summary.totalVehicles) * 100), []);
  const atRiskPercent = useMemo(() => Math.round((summary.atRiskCount / summary.totalVehicles) * 100), []);
  const lostPercent = useMemo(() => Math.max(0, 100 - currentPercent - atRiskPercent), [currentPercent, atRiskPercent]);

  const regenerateInsights = () => {
    setInsights([
      "71% of vehicles are current; focusing on at-risk buckets could recover ~300–400 customers.",
      "The largest at-risk cohort is 13–18 months out. They respond best to reminder + modest offer.",
      "Stores with stronger data capture show higher current% – coach low performers on capture and journey settings.",
    ]);
  };

  const breadcrumb = [
    { label: "Home", to: "/" },
    { label: "Reports & Insights", to: "/" },
    { label: "Service Intervals" },
  ];

  const rightInfo = (
    <>
      <span className="hidden sm:inline">Store: <span className="font-medium">{summary.storeName}</span></span>
      <span className="hidden sm:inline">Period: <span className="font-medium">{summary.periodLabel}</span></span>
    </>
  );

  return (
    <ShellLayout breadcrumb={breadcrumb} rightInfo={rightInfo}>
      {/* Title + description */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Service Intervals</h1>
          <p className="mt-1 text-sm text-slate-500">
            Retention snapshot for {summary.storeName}. See how many vehicles are current, at-risk or lost based on time since last service.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">Total vehicles</div>
            <div className="mt-0.5 text-base font-semibold">{summary.totalVehicles.toLocaleString()}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">Avg days between visits</div>
            <div className="mt-0.5 text-base font-semibold">{summary.avgDaysBetweenVisits}</div>
          </div>
        </div>
      </div>

      {/* Hero tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile label="Current customers" value={`${currentPercent}%`} helper={`${summary.currentCount.toLocaleString()} vehicles`} tone="positive" />
        <MetricTile label="At-risk customers" value={`${atRiskPercent}%`} helper={`${summary.atRiskCount.toLocaleString()} vehicles`} tone="warn" />
        <MetricTile label="Lost customers" value={`${lostPercent}%`} helper={`${summary.lostCount.toLocaleString()} vehicles`} tone="negative" />
        <MetricTile label="Total vehicles" value={summary.totalVehicles.toLocaleString()} helper="Unique vehicles in period" />
        <MetricTile label="Avg days between visits" value={`${summary.avgDaysBetweenVisits}`} helper="Across all returning vehicles" />
      </div>

      {/* Status bar chart + insights */}
      <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-sm font-semibold text-slate-800">Retention status</h2>
            <span className="text-[11px] text-slate-400">% of vehicles by time-since-last-visit</span>
          </div>
          <div className="space-y-3">
            <div className="flex w-full h-4 rounded-full overflow-hidden bg-slate-100">
              <div className="h-full bg-emerald-400" style={{ width: `${currentPercent}%` }} title={`Current ${currentPercent}%`} />
              <div className="h-full bg-amber-400" style={{ width: `${atRiskPercent}%` }} title={`At-risk ${atRiskPercent}%`} />
              <div className="h-full bg-rose-400" style={{ width: `${lostPercent}%` }} title={`Lost ${lostPercent}%`} />
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
          <p className="mt-3 text-[11px] text-slate-400">
            In the full app, this panel will call Lovable/OpenAI with live metrics to generate store-specific recommendations.
          </p>
        </div>
      </section>

      {/* Store table */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="text-sm font-semibold text-slate-800">Stores overview</h2>
          <span className="text-[11px] text-slate-400">Current / at-risk / lost % by store</span>
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
                  <td className="py-2 pr-4 text-right">{row.totalVehicles.toLocaleString()}</td>
                  <td className="py-2 pr-4 text-right text-emerald-600">{row.currentPercent}%</td>
                  <td className="py-2 pr-4 text-right text-amber-600">{row.atRiskPercent}%</td>
                  <td className="py-2 pr-4 text-right text-rose-600">{row.lostPercent}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ShellLayout>
  );
};

export default ServiceIntervals;
