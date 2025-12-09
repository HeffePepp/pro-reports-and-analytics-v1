import React, { useState, useMemo } from "react";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";

type RoasSummary = {
  storeGroupName: string;
  periodLabel: string;
  totalSpend: number;
  totalRevenue: number;
  totalVehicles: number;
  campaigns: number;
};

type RoasCampaignRow = {
  campaignName: string;
  audience: string;
  channel: "Email" | "Postcard" | "Mixed";
  sent: number;
  spend: number;
  revenue: number;
  vehicles: number;
};

const roasSummary: RoasSummary = {
  storeGroupName: "All Stores",
  periodLabel: "Last 90 days",
  totalSpend: 5200,
  totalRevenue: 76600,
  totalVehicles: 420,
  campaigns: 6,
};

const roasCampaigns: RoasCampaignRow[] = [
  {
    campaignName: "Spring Has Sprung",
    audience: "12–24 month inactive",
    channel: "Email",
    sent: 1500,
    spend: 520,
    revenue: 8350,
    vehicles: 62,
  },
  {
    campaignName: "Tax Time Tune-Up",
    audience: "High LTV, due in 30 days",
    channel: "Mixed",
    sent: 1200,
    spend: 1400,
    revenue: 24600,
    vehicles: 110,
  },
  {
    campaignName: "Synthetic Upgrade Push",
    audience: "Conventional users",
    channel: "Postcard",
    sent: 900,
    spend: 980,
    revenue: 17800,
    vehicles: 76,
  },
  {
    campaignName: "Reactivation 18–24 months",
    audience: "Lapsed",
    channel: "Email",
    sent: 1400,
    spend: 420,
    revenue: 9300,
    vehicles: 55,
  },
  {
    campaignName: "New Mover Welcome",
    audience: "New households",
    channel: "Postcard",
    sent: 700,
    spend: 780,
    revenue: 9100,
    vehicles: 48,
  },
  {
    campaignName: "Holiday Thank You",
    audience: "Top 25% LTV",
    channel: "Email",
    sent: 600,
    spend: 100,
    revenue: 2450,
    vehicles: 19,
  },
];

const RoasPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Mixed-channel campaigns drive the strongest ROAS but have higher spend per send.",
    "Postcard-only campaigns produce solid revenue but could be boosted with email follow-ups.",
    "Some email-only campaigns are extremely efficient on a ROAS basis and are ideal for frequent use.",
  ]);

  const overallRoas = useMemo(
    () => roasSummary.totalRevenue / roasSummary.totalSpend,
    []
  );

  const channelAgg = useMemo(() => {
    const agg: Record<
      RoasCampaignRow["channel"],
      { spend: number; revenue: number }
    > = {
      Email: { spend: 0, revenue: 0 },
      Postcard: { spend: 0, revenue: 0 },
      Mixed: { spend: 0, revenue: 0 },
    };
    roasCampaigns.forEach((c) => {
      agg[c.channel].spend += c.spend;
      agg[c.channel].revenue += c.revenue;
    });
    return (Object.keys(agg) as RoasCampaignRow["channel"][]).map((ch) => {
      const spend = agg[ch].spend;
      const revenue = agg[ch].revenue;
      return {
        channel: ch,
        spend,
        revenue,
        roas: spend ? revenue / spend : 0,
      };
    });
  }, []);

  const maxRoasChannel = useMemo(
    () => Math.max(...channelAgg.map((c) => c.roas), 1),
    [channelAgg]
  );

  const maxRoasCampaign = useMemo(
    () =>
      Math.max(
        ...roasCampaigns.map((c) => c.revenue / c.spend),
        1
      ),
    []
  );

  const regenerateInsights = () => {
    const bestCampaign = roasCampaigns.reduce((best, c) =>
      !best || c.revenue / c.spend > best.revenue / best.spend ? c : best
    );

    setInsights([
      `Overall ROAS is ${overallRoas.toFixed(
        1
      )}x, with best performance from "${bestCampaign.campaignName}".`,
      "Mixed-channel campaigns are ideal for key periods (tax time, holidays) where you want maximum reach and impact.",
      "Email-only campaigns deliver high ROAS at low cost; keep them running year-round for maintenance and SS follow-ups.",
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "ROAS" },
      ]}
      rightInfo={
        <>
          <span>
            Store group:{" "}
            <span className="font-medium">{roasSummary.storeGroupName}</span>
          </span>
          <span>
            Period:{" "}
            <span className="font-medium">{roasSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">
            ROAS (Return on Ad Spend)
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Evaluate campaigns and channels on spend, vehicles, revenue and
            ROAS.
          </p>
        </div>
      </div>

      {/* Main layout: left content + right AI tile */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT: all ROAS tiles, charts & table */}
        <div className="lg:col-span-3 space-y-4">
          {/* Metric tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <MetricTile
              label="Total spend"
              value={`$${roasSummary.totalSpend.toLocaleString()}`}
            />
            <MetricTile
              label="Total revenue"
              value={`$${roasSummary.totalRevenue.toLocaleString()}`}
            />
            <MetricTile
              label="Overall ROAS"
              value={`${overallRoas.toFixed(1)}x`}
              helper={`${roasSummary.campaigns} campaigns`}
            />
            <MetricTile
              label="Vehicles from campaigns"
              value={roasSummary.totalVehicles.toLocaleString()}
            />
            <MetricTile
              label="Avg spend / campaign"
              value={`$${(
                roasSummary.totalSpend / roasSummary.campaigns
              ).toFixed(0)}`}
            />
          </div>

          {/* AI Insights – stacked here on small/medium screens */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on recent campaign performance"
              bullets={insights}
              onRefresh={regenerateInsights}
            />
          </div>

          {/* ROAS by channel & by campaign */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* ROAS by channel */}
            <div className="rounded-2xl bg-card border border-border shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-foreground">
                  ROAS by channel
                </h2>
                <span className="text-[11px] text-muted-foreground">
                  Relative ROAS by channel (dummy)
                </span>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                {channelAgg.map((c) => (
                  <div key={c.channel} className="space-y-1">
                    <div className="flex justify-between text-[11px]">
                      <span>{c.channel}</span>
                      <span>
                        {c.roas.toFixed(1)}x ROAS · $
                        {c.spend.toLocaleString()} spend
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-sky-500"
                          style={{
                            width: `${(c.roas / maxRoasChannel) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ROAS by campaign */}
            <div className="rounded-2xl bg-card border border-border shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-foreground">
                  ROAS by campaign
                </h2>
                <span className="text-[11px] text-muted-foreground">
                  Relative ROAS (dummy)
                </span>
              </div>
              <div className="space-y-2 text-xs text-muted-foreground">
                {roasCampaigns.map((c) => {
                  const roas = c.revenue / c.spend;
                  return (
                    <div key={c.campaignName} className="space-y-1">
                      <div className="flex justify-between text-[11px]">
                        <span>{c.campaignName}</span>
                        <span>{roas.toFixed(1)}x</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{
                              width: `${(roas / maxRoasCampaign) * 100}%`,
                            }}
                          />
                        </div>
                        <span className="text-[10px] w-28 text-right">
                          {c.channel} · ${c.spend.toFixed(0)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Campaign details table */}
          <section className="rounded-2xl bg-card border border-border shadow-sm p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-sm font-semibold text-foreground">
                Campaign details
              </h2>
              <span className="text-[11px] text-muted-foreground">
                Spend, revenue and ROAS by campaign
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                    <th className="py-2 pr-3">Campaign</th>
                    <th className="py-2 pr-3">Audience</th>
                    <th className="py-2 pr-3">Channel</th>
                    <th className="py-2 pr-3 text-right">Sent</th>
                    <th className="py-2 pr-3 text-right">Spend</th>
                    <th className="py-2 pr-3 text-right">Revenue</th>
                    <th className="py-2 pr-3 text-right">Vehicles</th>
                    <th className="py-2 pr-3 text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {roasCampaigns.map((c) => {
                    const roas = c.revenue / c.spend;
                    return (
                      <tr key={c.campaignName} className="border-t border-border">
                        <td className="py-2 pr-3 text-foreground">
                          {c.campaignName}
                        </td>
                        <td className="py-2 pr-3 text-muted-foreground">
                          {c.audience}
                        </td>
                        <td className="py-2 pr-3 text-muted-foreground">
                          {c.channel}
                        </td>
                        <td className="py-2 pr-3 text-right">
                          {c.sent.toLocaleString()}
                        </td>
                        <td className="py-2 pr-3 text-right">
                          ${c.spend.toFixed(0)}
                        </td>
                        <td className="py-2 pr-3 text-right">
                          ${c.revenue.toLocaleString()}
                        </td>
                        <td className="py-2 pr-3 text-right">
                          {c.vehicles.toLocaleString()}
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

        {/* RIGHT: AI Insights – only on large screens */}
        <div className="hidden lg:block lg:col-span-1">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on recent campaign performance"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default RoasPage;
