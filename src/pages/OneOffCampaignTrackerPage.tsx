import React, { useMemo } from "react";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";

type CampaignPerformance = {
  id: number;
  name: string;
  audience: string;
  channel: string; // used only for channel bar mix
  sent: number;
  responses: number;
  responseRate: number; // %
  roas: number; // x
  revenue: number; // response revenue
};

const CAMPAIGNS: CampaignPerformance[] = [
  {
    id: 1,
    name: "Don's Garage: Spring Has Sprung",
    audience: "Oil change customers in last 6 months",
    channel: "Email",
    sent: 4200,
    responses: 172,
    responseRate: 4.1,
    roas: 16.1,
    revenue: 18400,
  },
  {
    id: 2,
    name: "Summer A/C Tune-Up",
    audience: "Vehicles over 5 years old",
    channel: "Email + SMS",
    sent: 3800,
    responses: 262,
    responseRate: 6.9,
    roas: 10.1,
    revenue: 22150,
  },
  {
    id: 3,
    name: "Back to School",
    audience: "Households with 2+ vehicles",
    channel: "Postcard",
    sent: 2600,
    responses: 161,
    responseRate: 6.2,
    roas: 7.6,
    revenue: 15200,
  },
  {
    id: 4,
    name: "Black Friday Synthetic Push",
    audience: "Synthetic & high-mileage users",
    channel: "Postcard + Email",
    sent: 5100,
    responses: 505,
    responseRate: 9.9,
    roas: 11.5,
    revenue: 46800,
  },
];

// RESP coloring helper (same thresholds as Customer Journey)
const getRespColorClass = (rate: number): string => {
  if (rate >= 15) return "text-emerald-600"; // green
  if (rate >= 10) return "text-orange-500"; // orange
  if (rate >= 5) return "text-amber-500"; // yellow
  return "text-rose-600"; // red
};

// Channel mix + bar segment meta
type ChannelKey = "postcard" | "email" | "sms";

type ChannelSegment = {
  key: ChannelKey;
  percent: number;
  colorClass: string;
  dotColorClass: string;
  label: string; // Postcard, Email, Text Message
};

const CHANNEL_META: Record<ChannelKey, Omit<ChannelSegment, "percent">> = {
  postcard: {
    key: "postcard",
    colorClass: "bg-sky-100",
    dotColorClass: "bg-sky-300",
    label: "Postcard",
  },
  email: {
    key: "email",
    colorClass: "bg-emerald-100",
    dotColorClass: "bg-emerald-300",
    label: "Email",
  },
  sms: {
    key: "sms",
    colorClass: "bg-violet-100",
    dotColorClass: "bg-violet-300",
    label: "Text Message",
  },
};

// Parse the channel description into segments; each gets equal share of the bar
const getChannelSegments = (channel: string): ChannelSegment[] => {
  const lower = channel.toLowerCase();
  const keys: ChannelKey[] = [];
  if (lower.includes("postcard")) keys.push("postcard");
  if (lower.includes("email")) keys.push("email");
  if (lower.includes("sms") || lower.includes("text")) keys.push("sms");

  if (keys.length === 0) keys.push("email"); // default

  const share = 100 / keys.length;
  return keys.map((key) => ({
    ...CHANNEL_META[key],
    percent: share,
  }));
};

const OneOffCampaignTrackerPage: React.FC = () => {
  const campaignCount = CAMPAIGNS.length;

  const totalSent = useMemo(
    () => CAMPAIGNS.reduce((sum, c) => sum + c.sent, 0),
    []
  );
  const totalResponses = useMemo(
    () => CAMPAIGNS.reduce((sum, c) => sum + c.responses, 0),
    []
  );
  const totalRevenue = useMemo(
    () => CAMPAIGNS.reduce((sum, c) => sum + c.revenue, 0),
    []
  );
  const avgRespRate = useMemo(
    () =>
      CAMPAIGNS.reduce((sum, c) => sum + c.responseRate, 0) /
      CAMPAIGNS.length,
    []
  );
  const avgRoas = useMemo(
    () =>
      CAMPAIGNS.reduce((sum, c) => sum + c.roas, 0) /
      CAMPAIGNS.length,
    []
  );
  const maxResponseRate = useMemo(
    () => Math.max(...CAMPAIGNS.map((c) => c.responseRate), 1),
    []
  );

  const aiInsightsProps = {
    title: "AI Insights",
    subtitle: "Based on one-off campaigns",
    bullets: [
      "Black Friday Synthetic Push delivers the strongest ROAS and response among one-off campaigns.",
      "Summer A/C Tune-Up is a solid performer; consider expanding the audience and reusing this creative.",
      "Back to School is underperforming on ROAS—test stronger offers or a different channel mix.",
    ],
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
            Store group:{" "}
            <span className="font-medium">North Bay Group</span>
          </span>
          <span>
            Period:{" "}
            <span className="font-medium">Last 12 months</span>
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
            Track response, revenue and ROAS for one-off campaigns, with
            channel mix visualized per campaign.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT: KPIs + AI (mobile) + main campaign tile */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPI tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricTile
              label="Campaigns"
              value={campaignCount.toString()}
            />
            <MetricTile
              label="Total sent"
              value={totalSent.toLocaleString()}
            />
            <MetricTile
              label="Total responses"
              value={totalResponses.toLocaleString()}
            />
            <MetricTile
              label="Total revenue"
              value={`$${totalRevenue.toLocaleString()}`}
            />
            {/* If you want 4 tiles total, you can instead use:
            <MetricTile label="Avg resp %" value={`${avgRespRate.toFixed(1)}%`} />
            <MetricTile label="Avg ROAS" value={`${avgRoas.toFixed(1)}x`} />
            */}
          </div>

          {/* AI Insights – stacked after KPIs on small/medium screens */}
          <div className="block lg:hidden">
            <AIInsightsTile {...aiInsightsProps} />
          </div>

          {/* Combined performance tile (replaces the two old tables) */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-start justify-between mb-1 gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  One-off campaign performance
                </h2>
                <p className="text-[11px] text-slate-600">
                  Response rate, revenue and ROAS by campaign (dummy data)
                </p>
              </div>
            </div>

            <p className="mt-2 text-[10px] text-slate-400">
              Channel bar shows mix of Postcard, Email and Text Message for
              each campaign. Bar length shows resp % vs other campaigns.
            </p>

            <div className="mt-3 space-y-5 text-xs text-slate-700">
              {CAMPAIGNS.map((campaign, idx) => {
                const respColor = getRespColorClass(
                  campaign.responseRate
                );
                const segments = getChannelSegments(campaign.channel);
                const barWidth =
                  (campaign.responseRate / maxResponseRate) * 100;

                return (
                  <div
                    key={campaign.id}
                    className="pt-1"
                  >
                    {/* Top row: campaign + audience on left, stats on right */}
                    <div className="flex items-start justify-between gap-3 text-[11px]">
                      <div className="text-slate-700">
                        <div className="font-medium">
                          {idx + 1}. {campaign.name}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {campaign.audience}
                        </div>
                      </div>

                      <div className="flex flex-col items-end text-right gap-0.5">
                        <div className="inline-flex items-center gap-2 text-[11px] md:text-xs font-medium">
                          <span className={respColor}>
                            {campaign.responseRate.toFixed(1)}% RESP
                          </span>
                          <span className="opacity-50 text-slate-500">
                            •
                          </span>
                          <span className="text-slate-700">
                            {campaign.roas.toFixed(1)}x ROAS
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {campaign.sent.toLocaleString()} sent • $
                          {campaign.revenue.toLocaleString()} rev
                        </div>
                      </div>
                    </div>

                    {/* Channel bar + legend */}
                    <div className="mt-3">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full flex"
                          style={{ width: `${barWidth}%` }}
                        >
                          {segments.map((seg) => (
                            <div
                              key={seg.key}
                              className={`h-full ${seg.colorClass}`}
                              style={{ width: `${seg.percent}%` }}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500">
                        {segments.map((seg) => (
                          <span
                            key={seg.key}
                            className="inline-flex items-center gap-1"
                          >
                            <span
                              className={`h-3 w-3 rounded-full ${seg.dotColorClass}`}
                            />
                            <span>{seg.label}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* RIGHT: AI Insights – only on large screens */}
        <div className="hidden lg:block lg:col-span-1">
          <AIInsightsTile {...aiInsightsProps} />
        </div>
      </div>
    </ShellLayout>
  );
};

export default OneOffCampaignTrackerPage;