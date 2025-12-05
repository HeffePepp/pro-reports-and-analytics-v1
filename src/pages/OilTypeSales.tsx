import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, BarStack } from "@/components/layout";

type OilMixSummary = {
  storeName: string;
  periodLabel: string;
  invCount: number;
  conventionalPct: number;
  syntheticBlendPct: number;
  fullSynPct: number;
  highMileagePct: number;
  unclassifiedPct: number;
  conventionalRev: number;
  syntheticBlendRev: number;
  fullSynRev: number;
  highMileageRev: number;
  unclassifiedRev: number;
  vendorSharePct: number;
};

type StoreRow = {
  storeName: string;
  invCount: number;
  conventionalPct: number;
  syntheticBlendPct: number;
  fullSynPct: number;
  highMileagePct: number;
  unclassifiedPct: number;
  syntheticUnitsPct: number;
  syntheticRevPct: number;
};

const summary: OilMixSummary = {
  storeName: "All Stores",
  periodLabel: "Last 90 days",
  invCount: 18420,
  conventionalPct: 31,
  syntheticBlendPct: 22,
  fullSynPct: 37,
  highMileagePct: 8,
  unclassifiedPct: 2,
  conventionalRev: 82000,
  syntheticBlendRev: 106000,
  fullSynRev: 184000,
  highMileageRev: 72000,
  unclassifiedRev: 6000,
  vendorSharePct: 32,
};

const storeRows: StoreRow[] = [
  { storeName: "Vallejo, CA", invCount: 1842, conventionalPct: 28, syntheticBlendPct: 24, fullSynPct: 38, highMileagePct: 8, unclassifiedPct: 2, syntheticUnitsPct: 70, syntheticRevPct: 84 },
  { storeName: "Napa, CA", invCount: 1360, conventionalPct: 35, syntheticBlendPct: 23, fullSynPct: 30, highMileagePct: 10, unclassifiedPct: 2, syntheticUnitsPct: 63, syntheticRevPct: 79 },
  { storeName: "Fairfield, CA", invCount: 1210, conventionalPct: 24, syntheticBlendPct: 18, fullSynPct: 46, highMileagePct: 9, unclassifiedPct: 3, syntheticUnitsPct: 73, syntheticRevPct: 87 },
];

const OilTypeSales: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Synthetic oils represent about 69% of units and 83% of oil revenue across all stores.",
    "Vallejo leads synthetic adoption with ~70% of invoices on synthetic or high mileage.",
    "Conventional is still >30% of units; moving 10 pts of that to synthetic could significantly grow revenue.",
  ]);

  const syntheticUnitsPct = useMemo(() => summary.syntheticBlendPct + summary.fullSynPct + summary.highMileagePct, []);
  const totalRev = useMemo(() => summary.conventionalRev + summary.syntheticBlendRev + summary.fullSynRev + summary.highMileageRev + summary.unclassifiedRev, []);
  const syntheticRevPct = useMemo(() => Math.round(((summary.syntheticBlendRev + summary.fullSynRev + summary.highMileageRev) / totalRev) * 100), [totalRev]);

  const regenerateInsights = () => {
    setInsights([
      `Synthetic units are ~${syntheticUnitsPct}% but contribute ~${syntheticRevPct}% of oil revenue.`,
      "Focus upgrade conversations on high conventional stores; even a 5–10 pt shift yields meaningful revenue.",
      `Current vendor share is about ${summary.vendorSharePct}% of oil revenue; consider co-op campaigns to grow further.`,
    ]);
  };

  const breadcrumb = [
    { label: "Home", to: "/" },
    { label: "Reports & Insights", to: "/" },
    { label: "Oil Type Sales" },
  ];

  const rightInfo = (
    <>
      <span>Store: <span className="font-medium">{summary.storeName}</span></span>
      <span>Period: <span className="font-medium">{summary.periodLabel}</span></span>
    </>
  );

  return (
    <ShellLayout breadcrumb={breadcrumb} rightInfo={rightInfo}>
      {/* Title + hero tiles */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Oil Type Sales</h1>
          <p className="mt-1 text-sm text-slate-500">
            Volume and revenue mix across conventional, synthetic blend, full synthetic and high mileage oils.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">Oil invoices</div>
            <div className="mt-0.5 text-base font-semibold">{summary.invCount.toLocaleString()}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">Vendor share</div>
            <div className="mt-0.5 text-base font-semibold">{summary.vendorSharePct}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile label="Synthetic units" value={`${syntheticUnitsPct}%`} helper="Blend + full syn + high mileage" />
        <MetricTile label="Synthetic revenue share" value={`${syntheticRevPct}%`} helper="Of total oil revenue" />
        <MetricTile label="Conventional units" value={`${summary.conventionalPct}%`} helper="Share of oil invoices" />
        <MetricTile label="Total oil revenue" value={`$${totalRev.toLocaleString()}`} helper="All oil types" />
        <MetricTile label="Unclassified" value={`${summary.unclassifiedPct}%`} helper="Invoices without mapped type" />
      </div>

      {/* Charts + insights */}
      <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">Mix by volume</h2>
            <span className="text-[11px] text-slate-400">% of oil invoices by type</span>
          </div>
          <BarStack
            segments={[
              { label: "Conventional", value: summary.conventionalPct, color: "bg-slate-400" },
              { label: "Syn blend", value: summary.syntheticBlendPct, color: "bg-sky-400" },
              { label: "Full syn", value: summary.fullSynPct, color: "bg-indigo-500" },
              { label: "High mileage", value: summary.highMileagePct, color: "bg-emerald-400" },
              { label: "Unclassified", value: summary.unclassifiedPct, color: "bg-amber-400" },
            ]}
          />
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">Mix by revenue</h2>
            <span className="text-[11px] text-slate-400">Share of oil revenue by type (dummy)</span>
          </div>
          <BarStack
            segments={[
              { label: "Conventional", value: Math.round((summary.conventionalRev / totalRev) * 100), color: "bg-slate-400" },
              { label: "Syn blend", value: Math.round((summary.syntheticBlendRev / totalRev) * 100), color: "bg-sky-400" },
              { label: "Full syn", value: Math.round((summary.fullSynRev / totalRev) * 100), color: "bg-indigo-500" },
              { label: "High mileage", value: Math.round((summary.highMileageRev / totalRev) * 100), color: "bg-emerald-400" },
              { label: "Unclassified", value: Math.round((summary.unclassifiedRev / totalRev) * 100), color: "bg-amber-400" },
            ]}
          />
        </div>

        {/* Insights */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-sm font-semibold text-slate-800">AI insights (mock)</h2>
            <button onClick={regenerateInsights} className="text-[11px] px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600">Refresh</button>
          </div>
          <ul className="space-y-1 text-xs text-slate-600">
            {insights.map((line, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            In the full app, this panel will call Lovable/OpenAI with live oil mix metrics to generate store- or brand-specific guidance.
          </p>
        </div>
      </section>

      {/* Store table */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="text-sm font-semibold text-slate-800">Stores overview</h2>
          <span className="text-[11px] text-slate-400">Synthetic vs conventional mix by store</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3">Store</th>
                <th className="py-2 pr-3 text-right">Invoices</th>
                <th className="py-2 pr-3 text-right">Conv %</th>
                <th className="py-2 pr-3 text-right">Syn blend %</th>
                <th className="py-2 pr-3 text-right">Full syn %</th>
                <th className="py-2 pr-3 text-right">High mileage %</th>
                <th className="py-2 pr-3 text-right">Synthetic units %</th>
                <th className="py-2 pr-3 text-right">Synthetic rev %</th>
              </tr>
            </thead>
            <tbody>
              {storeRows.map((row) => (
                <tr key={row.storeName} className="border-t border-slate-100">
                  <td className="py-2 pr-3 text-slate-700">{row.storeName}</td>
                  <td className="py-2 pr-3 text-right">{row.invCount.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-right text-slate-600">{row.conventionalPct}%</td>
                  <td className="py-2 pr-3 text-right text-slate-600">{row.syntheticBlendPct}%</td>
                  <td className="py-2 pr-3 text-right text-slate-600">{row.fullSynPct}%</td>
                  <td className="py-2 pr-3 text-right text-slate-600">{row.highMileagePct}%</td>
                  <td className="py-2 pr-3 text-right text-indigo-600">{row.syntheticUnitsPct}%</td>
                  <td className="py-2 pr-3 text-right text-indigo-600">{row.syntheticRevPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ShellLayout>
  );
};

export default OilTypeSales;
