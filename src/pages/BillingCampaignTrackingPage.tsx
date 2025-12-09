import React, { useState, useMemo } from "react";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";

type BillingSummary = {
  periodLabel: string;
  totalBilling: number;
  billedCampaigns: number;
  storesBilled: number;
  outstanding: number;
};

type BillingRow = {
  billingId: string;
  campaignName: string;
  storeName: string;
  channel: "Email" | "Postcard" | "Mixed";
  amount: number;
  status: "Pending" | "Posted" | "Paid";
  billingDate: string;
};

const billingSummary: BillingSummary = {
  periodLabel: "Current month",
  totalBilling: 12840,
  billedCampaigns: 9,
  storesBilled: 7,
  outstanding: 4320,
};

const billingRows: BillingRow[] = [
  {
    billingId: "B-2024-1201",
    campaignName: "Reminder 1 – December",
    storeName: "Vallejo, CA",
    channel: "Mixed",
    amount: 2100,
    status: "Posted",
    billingDate: "2024-12-01",
  },
  {
    billingId: "B-2024-1202",
    campaignName: "Reminder 1 – December",
    storeName: "Napa, CA",
    channel: "Mixed",
    amount: 1840,
    status: "Pending",
    billingDate: "2024-12-01",
  },
  {
    billingId: "B-2024-1203",
    campaignName: "Reactivation 18–24 months",
    storeName: "All Stores",
    channel: "Email",
    amount: 780,
    status: "Posted",
    billingDate: "2024-12-03",
  },
  {
    billingId: "B-2024-1204",
    campaignName: "Holiday Thank You",
    storeName: "All Stores",
    channel: "Email",
    amount: 540,
    status: "Paid",
    billingDate: "2024-11-29",
  },
  {
    billingId: "B-2024-1205",
    campaignName: "New Mover Welcome",
    storeName: "Fairfield, CA",
    channel: "Postcard",
    amount: 1960,
    status: "Pending",
    billingDate: "2024-12-02",
  },
];

const BillingCampaignTrackingPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Most billing this month is from reminder postcards and mixed-channel campaigns.",
    "A portion of spend is still in Pending status and should be reviewed before month-end.",
    "Paid vs posted breakdown looks healthy; no major billing anomalies are visible.",
  ]);

  const totalPending = useMemo(
    () =>
      billingRows
        .filter((b) => b.status === "Pending")
        .reduce((sum, b) => sum + b.amount, 0),
    []
  );
  const totalPaid = useMemo(
    () =>
      billingRows
        .filter((b) => b.status === "Paid")
        .reduce((sum, b) => sum + b.amount, 0),
    []
  );
  const totalPosted = useMemo(
    () =>
      billingRows
        .filter((b) => b.status === "Posted")
        .reduce((sum, b) => sum + b.amount, 0),
    []
  );

  const regenerateInsights = () => {
    setInsights([
      `Pending billing totals $${totalPending.toFixed(
        0
      )}; confirm these jobs before close.`,
      `Posted but unpaid campaigns total $${totalPosted.toFixed(
        0
      )}; review with accounting.`,
      `Paid campaigns this period total $${totalPaid.toFixed(
        0
      )}, giving visibility into cash vs accrual.`,
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Billing – Campaign Tracking" },
      ]}
      rightInfo={
        <>
          <span>
            Period:{" "}
            <span className="font-medium">{billingSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Billing – Campaign Tracking
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tie marketing activity to billing entries so owners and groups see
            exactly what they are paying for.
          </p>
        </div>
      </div>

      {/* Layout: left content + right AI tile */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <MetricTile
              label="Total billing"
              value={`$${billingSummary.totalBilling.toLocaleString()}`}
            />
            <MetricTile
              label="Outstanding"
              value={`$${billingSummary.outstanding.toLocaleString()}`}
            />
            <MetricTile
              label="Billed campaigns"
              value={billingSummary.billedCampaigns.toString()}
            />
            <MetricTile
              label="Stores billed"
              value={billingSummary.storesBilled.toString()}
            />
            <MetricTile
              label="Pending billing"
              value={`$${totalPending.toFixed(0)}`}
            />
          </div>

          {/* AI Insights – stacked here on small/medium screens */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on billing & campaign data"
              bullets={insights}
              onRefresh={regenerateInsights}
            />
          </div>

          {/* Status breakdown */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Billing by status
              </h2>
              <span className="text-[11px] text-slate-500">
                Pending, posted and paid
              </span>
            </div>
            <div className="flex flex-col md:flex-row gap-3 text-xs text-slate-700">
              <div className="flex-1">
                <div className="flex justify-between text-[11px]">
                  <span>Pending</span>
                  <span>${totalPending.toFixed(0)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-amber-400"
                    style={{
                      width: `${
                        (totalPending / billingSummary.totalBilling) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[11px]">
                  <span>Posted</span>
                  <span>${totalPosted.toFixed(0)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-sky-500"
                    style={{
                      width: `${
                        (totalPosted / billingSummary.totalBilling) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[11px]">
                  <span>Paid</span>
                  <span>${totalPaid.toFixed(0)}</span>
                </div>
                <div className="mt-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500"
                    style={{
                      width: `${
                        (totalPaid / billingSummary.totalBilling) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Billing details table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Billing details
              </h2>
              <span className="text-[11px] text-slate-500">
                Campaign-level billing entries
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Billing ID</th>
                    <th className="py-2 pr-3">Campaign</th>
                    <th className="py-2 pr-3">Store</th>
                    <th className="py-2 pr-3">Channel</th>
                    <th className="py-2 pr-3 text-right">Amount</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Billing date</th>
                  </tr>
                </thead>
                <tbody>
                  {billingRows.map((b) => (
                    <tr key={b.billingId} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-800">
                        {b.billingId}
                      </td>
                      <td className="py-2 pr-3 text-slate-700">
                        {b.campaignName}
                      </td>
                      <td className="py-2 pr-3 text-slate-700">
                        {b.storeName}
                      </td>
                      <td className="py-2 pr-3 text-slate-600">
                        {b.channel}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        ${b.amount.toFixed(0)}
                      </td>
                      <td className="py-2 pr-3 text-slate-600">{b.status}</td>
                      <td className="py-2 pr-3 text-slate-600">
                        {b.billingDate}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT: AI Insights – only on large screens */}
        <div className="hidden lg:block lg:col-span-1">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on billing & campaign data"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default BillingCampaignTrackingPage;
