import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, BarStack } from "@/components/layout";

type RoasSummary = {
  storeName: string;
  periodLabel: string;
  totalSpend: number;
  totalRevenue: number;
  totalVehicles: number;
  overallRoas: number;
};

type ChannelRow = {
  channel: string;
  spend: number;
  revenue: number;
  vehicles: number;
  roas: number;
  responseRate: number;
};

const summary: RoasSummary = {
  storeName: "All Stores",
  periodLabel: "Last 90 days",
  totalSpend: 28500,
  totalRevenue: 421800,
  totalVehicles: 3420,
  overallRoas: 14.8,
};

const channelRows: ChannelRow[] = [
  { channel: "Email", spend: 4200, revenue: 86400, vehicles: 920, roas: 20.6, responseRate: 18.4 },
  { channel: "Postcard", spend: 14800, revenue: 198600, vehicles: 1680, roas: 13.4, responseRate: 12.8 },
  { channel: "SMS", spend: 3200, revenue: 64800, vehicles: 480, roas: 20.3, responseRate: 22.1 },
  { channel: "Mixed (multi-touch)", spend: 6300, revenue: 72000, vehicles: 340, roas: 11.4, responseRate: 9.6 },
];

const RoasPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Overall ROAS is 14.8x — every $1 spent generates nearly $15 in attributed revenue.",
    "Email and SMS have the highest ROAS (20x+) but lower volume; postcard drives the most vehicles.",
    "Consider shifting 10% of postcard budget to SMS to test if high ROAS scales with more spend.",
  ]);

  const emailPct = useMemo(() => Math.round((channelRows[0].revenue / summary.totalRevenue) * 100), []);
  const postcardPct = useMemo(() => Math.round((channelRows[1].revenue / summary.totalRevenue) * 100), []);

  const regenerateInsights = () => {
    setInsights([
      `Postcard accounts for ${postcardPct}% of revenue but has lower ROAS than digital channels.`,
      `Email drives ${emailPct}% of revenue with 20.6x ROAS — highly efficient for retention.`,
      "Test reducing low-ROAS mixed campaigns and reallocating to high-performing single channels.",
    ]);
  };

  const breadcrumb = [
    { label: "Home", to: "/" },
    { label: "Reports & Insights", to: "/" },
    { label: "ROAS" },
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
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">ROAS (Return on Ad Spend)</h1>
          <p className="mt-1 text-sm text-slate-500">
            Evaluate campaigns and channels on spend, response, revenue and ROAS to optimize marketing investment.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">Total spend</div>
            <div className="mt-0.5 text-base font-semibold">${summary.totalSpend.toLocaleString()}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">Attributed revenue</div>
            <div className="mt-0.5 text-base font-semibold">${summary.totalRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile label="Overall ROAS" value={`${summary.overallRoas.toFixed(1)}x`} helper="Revenue / Spend" tone="positive" />
        <MetricTile label="Total vehicles" value={summary.totalVehicles.toLocaleString()} helper="From all channels" />
        <MetricTile label="Total spend" value={`$${summary.totalSpend.toLocaleString()}`} helper="Marketing investment" />
        <MetricTile label="Total revenue" value={`$${summary.totalRevenue.toLocaleString()}`} helper="Attributed to campaigns" />
        <MetricTile label="Avg cost/vehicle" value={`$${(summary.totalSpend / summary.totalVehicles).toFixed(2)}`} helper="Acquisition cost" />
      </div>

      <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">Revenue by channel</h2>
            <span className="text-[11px] text-slate-400">% of attributed revenue</span>
          </div>
          <BarStack
            segments={channelRows.map((row) => ({
              label: row.channel,
              value: Math.round((row.revenue / summary.totalRevenue) * 100),
              color: row.channel === "Email" ? "bg-sky-400" : row.channel === "Postcard" ? "bg-indigo-500" : row.channel === "SMS" ? "bg-emerald-400" : "bg-amber-400",
            }))}
          />
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">ROAS by channel</h2>
            <span className="text-[11px] text-slate-400">Return multiple</span>
          </div>
          <div className="space-y-2">
            {channelRows.map((row) => (
              <div key={row.channel} className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>{row.channel}</span>
                  <span>{row.roas.toFixed(1)}x</span>
                </div>
                <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full ${row.roas >= 18 ? "bg-emerald-400" : row.roas >= 12 ? "bg-sky-400" : "bg-amber-400"}`}
                    style={{ width: `${Math.min((row.roas / 25) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
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
          <p className="mt-3 text-[11px] text-slate-400">
            In the full app, this panel will call Lovable/OpenAI with live ROAS data to generate budget optimization recommendations.
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="text-sm font-semibold text-slate-800">Channel breakdown</h2>
          <span className="text-[11px] text-slate-400">Spend, revenue, vehicles and ROAS by channel</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3">Channel</th>
                <th className="py-2 pr-3 text-right">Spend</th>
                <th className="py-2 pr-3 text-right">Revenue</th>
                <th className="py-2 pr-3 text-right">Vehicles</th>
                <th className="py-2 pr-3 text-right">ROAS</th>
                <th className="py-2 pr-3 text-right">Response %</th>
              </tr>
            </thead>
            <tbody>
              {channelRows.map((row) => (
                <tr key={row.channel} className="border-t border-slate-100">
                  <td className="py-2 pr-3 text-slate-700">{row.channel}</td>
                  <td className="py-2 pr-3 text-right">${row.spend.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-right text-emerald-600">${row.revenue.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-right">{row.vehicles.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-right text-sky-600">{row.roas.toFixed(1)}x</td>
                  <td className="py-2 pr-3 text-right">{row.responseRate.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ShellLayout>
  );
};

export default RoasPage;
