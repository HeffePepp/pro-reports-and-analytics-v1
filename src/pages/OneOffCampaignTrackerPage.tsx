import React, { useState, useMemo } from "react";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";

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
  responseRate: number;
  roas: number;
};

const oneOffSummary: OneOffSummary = {
  storeGroupName: "North Bay Group",
  periodLabel: "Last 6 months",
  campaigns: 8,
  totalSpend: 9800,
  totalRevenue: 95600,
  totalVehicles: 520,
};

const ONE_OFF_CAMPAIGNS: OneOffRow[] = [
  {
    campaignName: "Don's Garage: Spring Has Sprung",
    targetAudience: "12–24 month inactive",
    channel: "Email",
    sent: 1500,
    spend: 520,
    vehicles: 62,
    revenue: 8350,
    responseRate: 4.1,
    roas: 16.1,
  },
  {
    campaignName: "Summer A/C Tune-Up",
    targetAudience: "Hot climate, recent visitors",
    channel: "Email + SMS",
    sent: 1100,
    spend: 1400,
    vehicles: 76,
    revenue: 14200,
    responseRate: 6.9,
    roas: 10.1,
  },
  {
    campaignName: "Back to School",
    targetAudience: "Families / multiple vehicles",
    channel: "Postcard",
    sent: 1800,
    spend: 2800,
    vehicles: 112,
    revenue: 21400,
    responseRate: 6.2,
    roas: 7.6,
  },
  {
    campaignName: "Black Friday Synthetic Push",
    targetAudience: "Conventional users",
    channel: "Postcard + Email",
    sent: 1600,
    spend: 3200,
    vehicles: 158,
    revenue: 36800,
    responseRate: 9.9,
    roas: 11.5,
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

  const maxRoas = useMemo(
    () => Math.max(...ONE_OFF_CAMPAIGNS.map((c) => c.revenue / c.spend), 1),
    []
  );

  const maxCampaignResponseRate = useMemo(
    () => Math.max(...ONE_OFF_CAMPAIGNS.map((c) => c.responseRate), 1),
    []
  );

  const regenerateInsights = () => {
    const best = ONE_OFF_CAMPAIGNS.reduce((b, c) =>
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
      {/* Header */}
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
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <MetricTile
              label="Campaigns"
              value={oneOffSummary.campaigns.toString()}
            />
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
          </div>

          {/* One-off campaign performance – updated layout */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  One-off campaign performance
                </h2>
                <p className="text-[11px] text-slate-600">
                  Response rate and ROAS by campaign (dummy data)
                </p>
              </div>
            </div>

            <div className="mt-3 space-y-3 text-xs text-slate-700">
              {ONE_OFF_CAMPAIGNS.map((campaign, idx) => (
                <div key={campaign.campaignName}>
                  {/* Top row: campaign name + channel (in parentheses), stacked stats on right */}
                  <div className="flex items-start justify-between gap-3 text-[11px]">
                    <div className="text-slate-700">
                      <span className="font-medium">
                        {idx + 1}. {campaign.campaignName}
                      </span>{" "}
                      <span className="text-slate-500">
                        ({campaign.channel})
                      </span>
                    </div>

                    <div className="text-right text-slate-600 min-w-[80px]">
                      <div>{campaign.responseRate.toFixed(1)}% RESP</div>
                      <div>{campaign.roas.toFixed(1)}x ROAS</div>
                    </div>
                  </div>

                  {/* Bar row – scaled by response rate (same visual pattern as journey tile) */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-sky-500"
                        style={{
                          width: `${
                            (campaign.responseRate / maxCampaignResponseRate) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Campaign details
              </h2>
              <span className="text-[11px] text-slate-500">
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
                  {ONE_OFF_CAMPAIGNS.map((c) => {
                    const roas = c.revenue / c.spend;
                    return (
                      <tr key={c.campaignName} className="border-t border-slate-100">
                        <td className="py-2 pr-3 text-slate-800">
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
        </div>

        {/* RIGHT: AI panel */}
        <div className="lg:col-span-1">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on one-off campaign data"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default OneOffCampaignTrackerPage;
