import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, BarStack } from "@/components/layout";

type SuggestedServicesSummary = {
  storeName: string;
  periodLabel: string;
  totalSsSent: number;
  ssAcceptedCount: number;
  ssRevenue: number;
  avgSsTicket: number;
};

type StoreRow = {
  storeName: string;
  ssSent: number;
  ssAccepted: number;
  acceptanceRate: number;
  ssRevenue: number;
  avgTicket: number;
};

const summary: SuggestedServicesSummary = {
  storeName: "All Stores",
  periodLabel: "Last 90 days",
  totalSsSent: 4820,
  ssAcceptedCount: 1108,
  ssRevenue: 18400,
  avgSsTicket: 16.6,
};

const storeRows: StoreRow[] = [
  { storeName: "Vallejo, CA", ssSent: 1840, ssAccepted: 460, acceptanceRate: 25.0, ssRevenue: 7820, avgTicket: 17.0 },
  { storeName: "Napa, CA", ssSent: 1520, ssAccepted: 334, acceptanceRate: 22.0, ssRevenue: 5510, avgTicket: 16.5 },
  { storeName: "Fairfield, CA", ssSent: 1460, ssAccepted: 314, acceptanceRate: 21.5, ssRevenue: 5070, avgTicket: 16.1 },
];

const SuggestedServicesPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Suggested Services acceptance rate averages about 23% across all stores.",
    "Vallejo leads with 25% acceptance; stores below 20% are candidates for technician coaching.",
    "SS-driven revenue is $18.4k this period — a meaningful upsell channel worth optimizing.",
  ]);

  const acceptanceRate = useMemo(() => Math.round((summary.ssAcceptedCount / summary.totalSsSent) * 100), []);

  const regenerateInsights = () => {
    setInsights([
      `${acceptanceRate}% of Suggested Services are accepted, generating ~$${summary.ssRevenue.toLocaleString()} in added revenue.`,
      "Top-performing stores have higher acceptance rates; share their scripts and techniques with lower performers.",
      "Consider testing different service recommendations by vehicle age or mileage to improve relevance.",
    ]);
  };

  const breadcrumb = [
    { label: "Home", to: "/" },
    { label: "Reports & Insights", to: "/" },
    { label: "Suggested Services" },
  ];

  const rightInfo = (
    <>
      <span>Store: <span className="font-medium">{summary.storeName}</span></span>
      <span>Period: <span className="font-medium">{summary.periodLabel}</span></span>
    </>
  );

  return (
    <ShellLayout breadcrumb={breadcrumb} rightInfo={rightInfo}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Suggested Services</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track how educational Suggested Services convert into upsell revenue across stores and technicians.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">SS sent</div>
            <div className="mt-0.5 text-base font-semibold">{summary.totalSsSent.toLocaleString()}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">SS revenue</div>
            <div className="mt-0.5 text-base font-semibold">${summary.ssRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile label="SS acceptance rate" value={`${acceptanceRate}%`} helper={`${summary.ssAcceptedCount.toLocaleString()} accepted`} tone="positive" />
        <MetricTile label="SS revenue" value={`$${summary.ssRevenue.toLocaleString()}`} helper="Upsell from SS" />
        <MetricTile label="Avg SS ticket" value={`$${summary.avgSsTicket.toFixed(2)}`} helper="Per accepted service" />
        <MetricTile label="SS sent" value={summary.totalSsSent.toLocaleString()} helper="Total recommendations" />
        <MetricTile label="Conversion potential" value="+$8k" helper="If 5pt acceptance lift" />
      </div>

      <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">Acceptance by store</h2>
            <span className="text-[11px] text-slate-400">% of SS recommendations accepted</span>
          </div>
          <BarStack
            segments={storeRows.map((row) => ({
              label: row.storeName,
              value: row.acceptanceRate,
              color: row.acceptanceRate >= 24 ? "bg-emerald-400" : row.acceptanceRate >= 21 ? "bg-sky-400" : "bg-amber-400",
            }))}
          />
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-sm font-semibold text-slate-800">AI insights (mock)</h2>
            <button onClick={regenerateInsights} className="text-[11px] px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600">Refresh</button>
          </div>
          <ul className="space-y-1 text-xs text-slate-600">
            {insights.map((line, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            In the full app, this panel will call Lovable/OpenAI with live SS metrics to generate store-specific coaching recommendations.
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="text-sm font-semibold text-slate-800">Stores overview</h2>
          <span className="text-[11px] text-slate-400">SS sent, accepted, revenue by store</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3">Store</th>
                <th className="py-2 pr-3 text-right">SS sent</th>
                <th className="py-2 pr-3 text-right">SS accepted</th>
                <th className="py-2 pr-3 text-right">Acceptance %</th>
                <th className="py-2 pr-3 text-right">SS revenue</th>
                <th className="py-2 pr-3 text-right">Avg ticket</th>
              </tr>
            </thead>
            <tbody>
              {storeRows.map((row) => (
                <tr key={row.storeName} className="border-t border-slate-100">
                  <td className="py-2 pr-3 text-slate-700">{row.storeName}</td>
                  <td className="py-2 pr-3 text-right">{row.ssSent.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-right">{row.ssAccepted.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-right text-emerald-600">{row.acceptanceRate.toFixed(1)}%</td>
                  <td className="py-2 pr-3 text-right text-emerald-600">${row.ssRevenue.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-right">${row.avgTicket.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ShellLayout>
  );
};

export default SuggestedServicesPage;
