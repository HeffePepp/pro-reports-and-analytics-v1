import React, { useState, useMemo } from "react";
import { ShellLayout, SummaryTile } from "@/components/layout";
import MetricTile from "@/components/layout/MetricTile";

type OneOffSummary = {
  storeGroupName: string;
  periodLabel: string;
  campaigns: number;
  totalSpend: number;
  totalRevenue: number;
  totalVehicles: number;
};

type OneOffRow = {
  campaignName: string;
  targetAudience: string;
  channel: string;
  sent: number;
  spend: number;
  vehicles: number;
  revenue: number;
};

const oneOffSummary: OneOffSummary = {
  storeGroupName: "North Bay Group",
  periodLabel: "Last 6 months",
  campaigns: 8,
  totalSpend: 9800,
  totalRevenue: 95600,
  totalVehicles: 520,
};

const oneOffRows: OneOffRow[] = [
  {
    campaignName: "Don's Garage: Spring Has Sprung",
    targetAudience: "12–24 month inactive",
    channel: "Email",
    sent: 1500,
    spend: 520,
    vehicles: 62,
    revenue: 8350,
  },
  {
    campaignName: "Summer A/C Tune-Up",
    targetAudience: "Hot climate, recent visitors",
    channel: "Email + SMS",
    sent: 1100,
    spend: 1400,
    vehicles: 76,
    revenue: 14200,
  },
  {
    campaignName: "Back to School",
    targetAudience: "Families / multiple vehicles",
    channel: "Postcard",
    sent: 1800,
    spend: 2800,
    vehicles: 112,
    revenue: 21400,
  },
  {
    campaignName: "Black Friday Synthetic Push",
    targetAudience: "Conventional users",
    channel: "Postcard + Email",
    sent: 1600,
    spend: 3200,
    vehicles: 158,
    revenue: 36800,
  },
];

const OneOffCampaignTrackerPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Seasonal one-off campaigns contribute meaningful incremental revenue.",
    "Postcard-heavy campaigns are more expensive but bring in more vehicles per campaign.",
    "Use this view to compare one-off performance vs ongoing journey results.",
  ]);

  const overallRoas = useMemo(
    () => oneOffSummary.totalRevenue / oneOffSummary.totalSpend,
    []
  );

  const regenerateInsights = () => {
    const best = oneOffRows.reduce((b, c) =>
      !b || c.revenue / c.spend > b.revenue / b.spend ? c : b
    );

    setInsights([
      `Overall ROAS for one-off campaigns is about ${overallRoas.toFixed(
        1
      )}x in this period.`,
      `"${best.campaignName}" is the strongest one-off by ROAS and should be reused or re-tested.`,
      "Consider linking high-performing one-offs into the ongoing journey strategy.",
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "One-Off Campaign Tracker" },
      ]}
      rightInfo={
        <>
          <span>
            Group:{" "}
            <span className="font-medium">
              {oneOffSummary.storeGroupName}
            </span>
          </span>
          <span>
            Period:{" "}
            <span className="font-medium">{oneOffSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            One-Off Campaign Tracker
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Compare one-off campaigns on sent, spend, vehicles, revenue and
            ROAS.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <SummaryTile
            label="Campaigns"
            value={oneOffSummary.campaigns.toString()}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile
          label="Total spend"
          value={`$${oneOffSummary.totalSpend.toLocaleString()}`}
        />
        <MetricTile
          label="Total revenue"
          value={`$${oneOffSummary.totalRevenue.toLocaleString()}`}
        />
        <MetricTile
          label="Overall ROAS"
          value={`${overallRoas.toFixed(1)}x`}
        />
        <MetricTile
          label="Total vehicles"
          value={oneOffSummary.totalVehicles.toString()}
        />
        <MetricTile
          label="Avg rev / campaign"
          value={`$${(
            oneOffSummary.totalRevenue / oneOffSummary.campaigns
          ).toFixed(0)}`}
        />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
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
            {insights.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            In production, this report would pull directly from campaign and
            invoice data to calculate ROAS.
          </p>
        </div>

        {/* Quick notes */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4 text-xs text-slate-600 space-y-2">
          <h2 className="text-sm font-semibold text-slate-800">
            When to run one-offs
          </h2>
          <ul className="list-disc pl-4 space-y-1">
            <li>Seasonal spikes (tax time, back to school, holidays).</li>
            <li>Vendor-funded pushes (synthetic, add-ons).</li>
            <li>Special local events or store anniversaries.</li>
          </ul>
        </div>
      </section>

      {/* Table */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Campaign details
          </h2>
          <span className="text-[11px] text-slate-400">
            One-off campaigns in this period
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3">Campaign</th>
                <th className="py-2 pr-3">Audience</th>
                <th className="py-2 pr-3">Channel</th>
                <th className="py-2 pr-3 text-right">Sent</th>
                <th className="py-2 pr-3 text-right">Spend</th>
                <th className="py-2 pr-3 text-right">Vehicles</th>
                <th className="py-2 pr-3 text-right">Revenue</th>
                <th className="py-2 pr-3 text-right">ROAS</th>
              </tr>
            </thead>
            <tbody>
              {oneOffRows.map((c) => {
                const roas = c.revenue / c.spend;
                return (
                  <tr key={c.campaignName} className="border-t border-slate-100">
                    <td className="py-2 pr-3 text-slate-700">
                      {c.campaignName}
                    </td>
                    <td className="py-2 pr-3 text-slate-600">
                      {c.targetAudience}
                    </td>
                    <td className="py-2 pr-3 text-slate-600">{c.channel}</td>
                    <td className="py-2 pr-3 text-right">
                      {c.sent.toLocaleString()}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      ${c.spend.toFixed(0)}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {c.vehicles.toLocaleString()}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      ${c.revenue.toLocaleString()}
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

export default OneOffCampaignTrackerPage;
