import React, { useState, useMemo } from "react";
import { ShellLayout, MetricTile, SummaryTile, BarStack } from "@/components/layout";

type BillingSummary = {
  storeGroupName: string;
  periodLabel: string;
  totalBilled: number;
  campaigns: number;
  estRoas: number;
};

type BillingRow = {
  campaignName: string;
  mediaType: "Direct Mail" | "Email" | "SMS";
  channel: "Journey" | "One-off";
  sent: number;
  billedAmount: number;
  estRevenue: number;
};

const billingSummary: BillingSummary = {
  storeGroupName: "All Stores",
  periodLabel: "Last month",
  totalBilled: 42000,
  campaigns: 9,
  estRoas: 11.3,
};

const billingRows: BillingRow[] = [
  {
    campaignName: "Journey – Reminder 1",
    mediaType: "Direct Mail",
    channel: "Journey",
    sent: 6800,
    billedAmount: 16200,
    estRevenue: 284000,
  },
  {
    campaignName: "Journey – Reminder 2",
    mediaType: "Direct Mail",
    channel: "Journey",
    sent: 4200,
    billedAmount: 9800,
    estRevenue: 116000,
  },
  {
    campaignName: "Suggested Services 1-week",
    mediaType: "Email",
    channel: "Journey",
    sent: 5200,
    billedAmount: 2500,
    estRevenue: 38000,
  },
  {
    campaignName: "Spring One-Off",
    mediaType: "Direct Mail",
    channel: "One-off",
    sent: 3000,
    billedAmount: 8200,
    estRevenue: 75000,
  },
  {
    campaignName: "Loyalty SMS Nudge",
    mediaType: "SMS",
    channel: "One-off",
    sent: 2400,
    billedAmount: 1300,
    estRevenue: 22000,
  },
];

const BillingCampaignTrackingPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Most billed dollars are tied to Journey postcards, which also deliver the majority of revenue.",
    "Email and SMS lines are small in billing but very efficient on ROAS.",
    "This view is ideal for reconciling Throttle bills with campaign performance in one place.",
  ]);

  const mediaAgg = useMemo(() => {
    const agg: Record<
      BillingRow["mediaType"],
      { billed: number; revenue: number }
    > = {
      "Direct Mail": { billed: 0, revenue: 0 },
      Email: { billed: 0, revenue: 0 },
      SMS: { billed: 0, revenue: 0 },
    };
    billingRows.forEach((r) => {
      agg[r.mediaType].billed += r.billedAmount;
      agg[r.mediaType].revenue += r.estRevenue;
    });
    return agg;
  }, []);

  const mediaSegments = useMemo(() => {
    const types: BillingRow["mediaType"][] = ["Direct Mail", "Email", "SMS"];
    return types.map((type, idx) => ({
      label: type,
      value: mediaAgg[type].billed,
      color:
        idx === 0
          ? "bg-indigo-500"
          : idx === 1
          ? "bg-emerald-400"
          : "bg-sky-400",
    }));
  }, [mediaAgg]);

  const regenerateInsights = () => {
    const dm = mediaAgg["Direct Mail"];
    const em = mediaAgg["Email"];
    const sms = mediaAgg["SMS"];

    const dmRoas = dm.billed ? dm.revenue / dm.billed : 0;
    const emRoas = em.billed ? em.revenue / em.billed : 0;
    const smsRoas = sms.billed ? sms.revenue / sms.billed : 0;

    setInsights([
      `Direct Mail accounts for the majority of billed dollars with an estimated ROAS of ${dmRoas.toFixed(
        1
      )}x.`,
      `Email lines are small in billing but show an estimated ROAS of ${emRoas.toFixed(
        1
      )}x, ideal for always-on campaigns.`,
      `SMS delivers about ${smsRoas.toFixed(
        1
      )}x ROAS in this demo and can be used very selectively for high-urgency nudges.`,
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
            Store group:{" "}
            <span className="font-medium">{billingSummary.storeGroupName}</span>
          </span>
          <span>
            Period:{" "}
            <span className="font-medium">{billingSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Billing – Campaign Tracking
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Tie Throttle billing lines to specific campaigns, media types and
            estimated ROAS.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <SummaryTile
            label="Total billed"
            value={`$${billingSummary.totalBilled.toLocaleString()}`}
          />
          <SummaryTile
            label="Campaigns billed"
            value={billingSummary.campaigns.toString()}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile
          label="Estimated ROAS"
          value={`${billingSummary.estRoas.toFixed(1)}x`}
        />
        <MetricTile
          label="Avg billed / campaign"
          value={`$${(
            billingSummary.totalBilled / billingSummary.campaigns
          ).toFixed(0)}`}
        />
        <MetricTile
          label="Primary media"
          value="Direct Mail"
          helper="Most billed $"
        />
        <MetricTile
          label="Secondary media"
          value="Email"
          helper="High ROAS / low $"
        />
        <MetricTile
          label="Tertiary media"
          value="SMS"
          helper="High urgency"
        />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
        {/* Media mix */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">
              Billed $ by media type
            </h2>
            <span className="text-[11px] text-slate-400">
              Distribution of billed amounts
            </span>
          </div>
          <BarStack segments={mediaSegments} />
        </div>

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
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            In the full app, this panel will call Lovable/OpenAI with live
            billing and ROAS data to help explain and justify invoices to
            operators and vendors.
          </p>
        </div>

        {/* Quick stats */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3 text-xs text-slate-600">
          <h2 className="text-sm font-semibold text-slate-800">
            How to use this report
          </h2>
          <ul className="list-disc pl-4 space-y-1">
            <li>Reconcile billing by campaign and media type.</li>
            <li>Compare billed spend to estimated revenue/ROAS.</li>
            <li>Highlight co-op-eligible campaigns for vendor reporting.</li>
          </ul>
        </div>
      </section>

      {/* Table */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Billing lines by campaign
          </h2>
          <span className="text-[11px] text-slate-400">
            Billed amount and estimated revenue (dummy)
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3">Campaign</th>
                <th className="py-2 pr-3">Media</th>
                <th className="py-2 pr-3">Type</th>
                <th className="py-2 pr-3 text-right">Sent</th>
                <th className="py-2 pr-3 text-right">Billed</th>
                <th className="py-2 pr-3 text-right">Est revenue</th>
                <th className="py-2 pr-3 text-right">Est ROAS</th>
              </tr>
            </thead>
            <tbody>
              {billingRows.map((r) => {
                const roas = r.billedAmount
                  ? r.estRevenue / r.billedAmount
                  : 0;
                return (
                  <tr key={r.campaignName} className="border-t border-slate-100">
                    <td className="py-2 pr-3 text-slate-700">
                      {r.campaignName}
                    </td>
                    <td className="py-2 pr-3 text-slate-600">{r.mediaType}</td>
                    <td className="py-2 pr-3 text-slate-600">{r.channel}</td>
                    <td className="py-2 pr-3 text-right">
                      {r.sent.toLocaleString()}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      ${r.billedAmount.toLocaleString()}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      ${r.estRevenue.toLocaleString()}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {roas.toFixed(1)}x
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </ShellLayout>
  );
};

export default BillingCampaignTrackingPage;
