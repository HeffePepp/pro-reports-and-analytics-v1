import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, BarStack } from "@/components/layout";

type BillingSummary = {
  periodLabel: string;
  totalBilled: number;
  campaignCount: number;
  avgRoas: number;
  totalRevenue: number;
};

type BillingRow = {
  campaignName: string;
  channel: string;
  billedAmount: number;
  revenue: number;
  vehicles: number;
  roas: number;
  billingDate: string;
};

const summary: BillingSummary = {
  periodLabel: "Last 30 days",
  totalBilled: 42000,
  campaignCount: 12,
  avgRoas: 11.3,
  totalRevenue: 474600,
};

const billingRows: BillingRow[] = [
  { campaignName: "November Reminder 1", channel: "Postcard + Email", billedAmount: 8400, revenue: 96600, vehicles: 820, roas: 11.5, billingDate: "2024-11-15" },
  { campaignName: "November Reminder 2", channel: "Postcard + SMS", billedAmount: 6200, revenue: 68200, vehicles: 580, roas: 11.0, billingDate: "2024-11-22" },
  { campaignName: "Thanksgiving Promo", channel: "Email", billedAmount: 2800, revenue: 42000, vehicles: 380, roas: 15.0, billingDate: "2024-11-20" },
  { campaignName: "Reactivation Q4", channel: "Postcard", billedAmount: 12400, revenue: 136400, vehicles: 1120, roas: 11.0, billingDate: "2024-11-25" },
  { campaignName: "December SS Email", channel: "Email", billedAmount: 1800, revenue: 32400, vehicles: 290, roas: 18.0, billingDate: "2024-12-01" },
  { campaignName: "Holiday Flash", channel: "SMS", billedAmount: 2400, revenue: 38400, vehicles: 340, roas: 16.0, billingDate: "2024-12-02" },
];

const BillingCampaignPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Total billing of $42k generated $474k in attributed revenue — 11.3x average ROAS.",
    "December SS Email has the highest ROAS at 18x; consider expanding email-based campaigns.",
    "Postcard campaigns drive volume but have lower ROAS than digital-only campaigns.",
  ]);

  const topRoasCampaign = useMemo(() => billingRows.reduce((max, row) => row.roas > max.roas ? row : max, billingRows[0]), []);
  const emailRevenue = useMemo(() => billingRows.filter((r) => r.channel.includes("Email")).reduce((sum, r) => sum + r.revenue, 0), []);

  const regenerateInsights = () => {
    setInsights([
      `${topRoasCampaign.campaignName} leads with ${topRoasCampaign.roas}x ROAS on $${topRoasCampaign.billedAmount.toLocaleString()} spend.`,
      `Email-based campaigns generated $${emailRevenue.toLocaleString()} in revenue this period.`,
      "Use this report to reconcile billing with campaign performance in vendor and finance reviews.",
    ]);
  };

  const breadcrumb = [
    { label: "Home", to: "/" },
    { label: "Reports & Insights", to: "/" },
    { label: "Billing – Campaign Tracking" },
  ];

  const rightInfo = (
    <span>Period: <span className="font-medium">{summary.periodLabel}</span></span>
  );

  return (
    <ShellLayout breadcrumb={breadcrumb} rightInfo={rightInfo}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Billing – Campaign Tracking</h1>
          <p className="mt-1 text-sm text-slate-500">
            Tie billing lines to campaigns, spend and ROAS for financial reconciliation and performance review.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">Total billed</div>
            <div className="mt-0.5 text-base font-semibold">${summary.totalBilled.toLocaleString()}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">Total revenue</div>
            <div className="mt-0.5 text-base font-semibold">${summary.totalRevenue.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile label="Total billed" value={`$${summary.totalBilled.toLocaleString()}`} helper="This period" />
        <MetricTile label="Campaigns" value={summary.campaignCount.toString()} helper="Active campaigns" />
        <MetricTile label="Avg ROAS" value={`${summary.avgRoas.toFixed(1)}x`} helper="Revenue / Billed" tone="positive" />
        <MetricTile label="Total revenue" value={`$${summary.totalRevenue.toLocaleString()}`} helper="Attributed" />
        <MetricTile label="Top ROAS" value={`${topRoasCampaign.roas}x`} helper={topRoasCampaign.campaignName} />
      </div>

      <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">Billing by channel</h2>
            <span className="text-[11px] text-slate-400">Share of total billed amount</span>
          </div>
          <BarStack
            segments={[
              { label: "Postcard", value: 44, color: "bg-indigo-500" },
              { label: "Email", value: 22, color: "bg-sky-400" },
              { label: "SMS", value: 14, color: "bg-emerald-400" },
              { label: "Mixed", value: 20, color: "bg-amber-400" },
            ]}
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
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            In the full app, this panel will call Lovable/OpenAI to generate billing insights and identify optimization opportunities.
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="text-sm font-semibold text-slate-800">Campaign billing details</h2>
          <span className="text-[11px] text-slate-400">Billed amount, revenue and ROAS by campaign</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3">Campaign</th>
                <th className="py-2 pr-3">Channel</th>
                <th className="py-2 pr-3 text-right">Billed</th>
                <th className="py-2 pr-3 text-right">Revenue</th>
                <th className="py-2 pr-3 text-right">Vehicles</th>
                <th className="py-2 pr-3 text-right">ROAS</th>
                <th className="py-2 pr-3">Billing date</th>
              </tr>
            </thead>
            <tbody>
              {billingRows.map((row) => (
                <tr key={row.campaignName} className="border-t border-slate-100">
                  <td className="py-2 pr-3 text-slate-700 font-medium">{row.campaignName}</td>
                  <td className="py-2 pr-3 text-slate-600">{row.channel}</td>
                  <td className="py-2 pr-3 text-right">${row.billedAmount.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-right text-emerald-600">${row.revenue.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-right">{row.vehicles.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-right text-sky-600">{row.roas.toFixed(1)}x</td>
                  <td className="py-2 pr-3 text-slate-500">{row.billingDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ShellLayout>
  );
};

export default BillingCampaignPage;
