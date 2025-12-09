import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";

type ChannelKey = "postcard" | "email" | "sms";

type CampaignDrop = {
  date: string;          // ISO or display-ready, e.g. "2024-03-15"
  label: string;         // e.g. "Mar 15, 2024"
  channels: ChannelKey[];
  sent: number;
  responses: number;
  respPct: number;       // %
  roas: number;          // x
  revenue: number;       // $
};

type OneOffCampaign = {
  id: string;
  name: string;
  audience: string;
  drops: CampaignDrop[];
};

const ONE_OFF_CAMPAIGNS: OneOffCampaign[] = [
  {
    id: "spring-email",
    name: "Don's Garage: Spring Has Sprung",
    audience: "Current synthetic customers · last 9 months",
    drops: [
      {
        date: "2024-03-05",
        label: "Mar 5, 2024",
        channels: ["email"],
        sent: 2800,
        responses: 194,
        respPct: 6.9,
        roas: 16.1,
        revenue: 22400,
      },
    ],
  },
  {
    id: "ac-tune-up",
    name: "Summer A/C Tune-Up",
    audience: "Vehicles in warm-weather ZIPs · last 18 months",
    drops: [
      {
        date: "2024-05-10",
        label: "May 10, 2024",
        channels: ["postcard", "email", "sms"],
        sent: 3200,
        responses: 220,
        respPct: 6.9,
        roas: 10.1,
        revenue: 26400,
      },
      {
        date: "2024-05-24",
        label: "May 24, 2024",
        channels: ["email", "sms"],
        sent: 1800,
        responses: 121,
        respPct: 6.7,
        roas: 9.4,
        revenue: 14500,
      },
    ],
  },
  {
    id: "back-to-school",
    name: "Back to School",
    audience: "Minivan/SUV households · schools within 10 miles",
    drops: [
      {
        date: "2024-08-15",
        label: "Aug 15, 2024",
        channels: ["postcard"],
        sent: 2600,
        responses: 162,
        respPct: 6.2,
        roas: 7.6,
        revenue: 19500,
      },
    ],
  },
  {
    id: "black-friday-synth",
    name: "Black Friday Synthetic Push",
    audience: "High-mileage synthetic customers · last 24 months",
    drops: [
      {
        date: "2024-11-20",
        label: "Nov 20, 2024",
        channels: ["postcard", "email"],
        sent: 3400,
        responses: 337,
        respPct: 9.9,
        roas: 11.5,
        revenue: 40800,
      },
      {
        date: "2024-11-27",
        label: "Nov 27, 2024",
        channels: ["email"],
        sent: 2100,
        responses: 166,
        respPct: 7.9,
        roas: 9.3,
        revenue: 23600,
      },
    ],
  },
];

// Flattened drops array for the Drops tab
type OneOffCampaignDrop = {
  id: string;
  campaign: string;
  audience: string;
  dropDateLabel: string;
  channels: string;
  sent: number;
  responses: number;
  respPct: number;
  roas: number;
  revenue: number;
};

const ONE_OFF_CAMPAIGN_DROPS: OneOffCampaignDrop[] = ONE_OFF_CAMPAIGNS.flatMap(
  (campaign) =>
    campaign.drops.map((drop, idx) => ({
      id: `${campaign.id}-${idx}`,
      campaign: campaign.name,
      audience: campaign.audience,
      dropDateLabel: drop.label,
      channels: drop.channels
        .map((ch) =>
          ch === "postcard"
            ? "Postcard"
            : ch === "email"
            ? "Email"
            : "Text Message"
        )
        .join(" + "),
      sent: drop.sent,
      responses: drop.responses,
      respPct: drop.respPct,
      roas: drop.roas,
      revenue: drop.revenue,
    }))
);

// shared RESP color rules
const getRespColorClass = (rate: number): string => {
  if (rate >= 15) return "text-emerald-600";
  if (rate >= 10) return "text-orange-500";
  if (rate >= 5) return "text-amber-500";
  return "text-rose-600";
};

type ChannelSegment = {
  key: ChannelKey;
  percent: number;
  colorClass: string;
  dotColorClass: string;
  label: string;
};

const CHANNEL_META: Record<
  ChannelKey,
  Omit<ChannelSegment, "percent">
> = {
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

// combine channels across drops for the bar
const getCampaignChannelSegments = (
  campaign: OneOffCampaign
): ChannelSegment[] => {
  const counts: Record<ChannelKey, number> = {
    postcard: 0,
    email: 0,
    sms: 0,
  };
  campaign.drops.forEach((drop) => {
    drop.channels.forEach((ch) => {
      counts[ch] += drop.sent;
    });
  });
  const total = Object.values(counts).reduce((s, v) => s + v, 0) || 1;
  return (Object.keys(counts) as ChannelKey[])
    .filter((key) => counts[key] > 0)
    .map((key) => ({
      ...CHANNEL_META[key],
      percent: (counts[key] / total) * 100,
    }));
};

// aggregate metrics across drops
const getCampaignTotals = (campaign: OneOffCampaign) => {
  const sent = campaign.drops.reduce((s, d) => s + d.sent, 0);
  const responses = campaign.drops.reduce((s, d) => s + d.responses, 0);
  const revenue = campaign.drops.reduce((s, d) => s + d.revenue, 0);
  const weightedResp =
    sent === 0
      ? 0
      : (campaign.drops.reduce(
          (s, d) => s + d.respPct * d.sent,
          0
        ) / sent);
  const weightedRoas =
    revenue === 0
      ? 0
      : campaign.drops.reduce(
          (s, d) => s + d.roas * (d.revenue / revenue),
          0
        );
  const latestDrop = campaign.drops.reduce((latest, d) =>
    !latest || d.date > latest.date ? d : latest
  );
  return { sent, responses, revenue, weightedResp, weightedRoas, latestDrop };
};

type OneOffTab = "overview" | "drops";

const OneOffCampaignTrackerPage: React.FC = () => {
  const [tab, setTab] = useState<OneOffTab>("overview");

  const {
    totalSent,
    totalResponses,
    totalRevenue,
    avgRespPct,
    avgRoas,
    maxResp,
  } = useMemo(() => {
    let sent = 0;
    let responses = 0;
    let revenue = 0;
    let respWeightedSum = 0;
    let roasWeightedSum = 0;
    let maxRespLocal = 0;

    ONE_OFF_CAMPAIGNS.forEach((c) => {
      const totals = getCampaignTotals(c);
      sent += totals.sent;
      responses += totals.responses;
      revenue += totals.revenue;
      respWeightedSum += totals.weightedResp * totals.sent;
      roasWeightedSum += totals.weightedRoas * totals.revenue;
      if (totals.weightedResp > maxRespLocal) {
        maxRespLocal = totals.weightedResp;
      }
    });

    const avgResp =
      sent === 0 ? 0 : respWeightedSum / (sent || 1);
    const avgRoas =
      revenue === 0 ? 0 : roasWeightedSum / (revenue || 1);

    return {
      totalSent: sent,
      totalResponses: responses,
      totalRevenue: revenue,
      avgRespPct: avgResp,
      avgRoas,
      maxResp: maxRespLocal || 1,
    };
  }, []);

  const aiInsightsProps = {
    title: "AI Insights",
    subtitle: "One-off campaigns · 12 months",
    bullets: [
      "Black Friday Synthetic Push delivers the strongest overall lift across multiple drops.",
      "Summer A/C Tune-Up sees best response when postcards are combined with email + text.",
      "Use the Drops tab to compare early vs late drops and adjust future multi-drop plans.",
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
            One-off Campaign Tracker
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Response, ROAS and revenue for one-off campaigns, including multiple
            drops and channel mixes.
          </p>
        </div>
      </div>

      {/* Layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricTile
              label="Campaigns"
              value={ONE_OFF_CAMPAIGNS.length.toString()}
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
              label="Avg resp %"
              value={`${avgRespPct.toFixed(1)}%`}
            />
            <MetricTile
              label="Avg ROAS"
              value={`${avgRoas.toFixed(1)}x`}
            />
            <MetricTile
              label="Revenue"
              value={`$${totalRevenue.toLocaleString()}`}
            />
          </div>

          {/* AI stacked on small screens */}
          <div className="block lg:hidden">
            <AIInsightsTile {...aiInsightsProps} />
          </div>

          {/* Combined performance tile */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  One-off campaign performance
                </h2>
                <p className="text-[11px] text-slate-600">
                  Response rate, ROAS, revenue and drops by campaign.
                </p>
              </div>

              {/* Tabs for this tile */}
              <div className="inline-flex items-center rounded-full bg-slate-100 p-1 text-[11px]">
                {(["overview", "drops"] as OneOffTab[]).map((t) => {
                  const label =
                    t === "overview" ? "Overview" : "Drops";
                  const isActive = tab === t;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      className={`px-3 py-1 rounded-full ${
                        isActive
                          ? "bg-white shadow-sm text-slate-900"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </div>

            {tab === "overview" && (
              <>
                <p className="mt-1 text-[10px] text-slate-400">
                  Channel bar shows mix of Postcard, Email and Text Message
                  across all drops. Bar length shows resp % vs other campaigns.
                </p>

                <div className="mt-3 space-y-5 text-xs text-slate-700">
                  {ONE_OFF_CAMPAIGNS.map((campaign) => {
                    const totals = getCampaignTotals(campaign);
                    const respColor = getRespColorClass(
                      totals.weightedResp
                    );
                    const segments =
                      getCampaignChannelSegments(campaign);
                    const width =
                      (totals.weightedResp / maxResp) * 100 || 0;

                    return (
                      <div key={campaign.id} className="pt-1">
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3 text-[11px]">
                          <div className="text-slate-700">
                            <div className="font-medium">
                              {campaign.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {campaign.audience}
                            </div>
                            <div className="text-[10px] text-slate-400 mt-0.5">
                              {campaign.drops.length}{" "}
                              {campaign.drops.length === 1
                                ? "drop"
                                : "drops"}
                              {" · "}
                              Last drop{" "}
                              {totals.latestDrop.label}
                            </div>
                          </div>

                          <div className="flex flex-col items-end text-right gap-0.5">
                            <div className="inline-flex items-center gap-2 text-[11px] md:text-xs font-medium">
                              <span className={respColor}>
                                {totals.weightedResp.toFixed(1)}% RESP
                              </span>
                              <span className="opacity-50 text-slate-500">
                                •
                              </span>
                              <span className="text-slate-700">
                                {totals.weightedRoas.toFixed(1)}x ROAS
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {totals.sent.toLocaleString()} sent • $
                              {totals.revenue.toLocaleString()} rev
                            </div>
                          </div>
                        </div>

                        {/* Channel bar + legend */}
                        <div className="mt-3">
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden flex">
                            {/* performance bar (resp %) */}
                            <div
                              className="h-full bg-sky-500"
                              style={{ width: `${width}%` }}
                            />
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
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
              </>
            )}

            {tab === "drops" && (
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500">
                      <th className="py-2 pr-3 whitespace-nowrap">Campaign</th>
                      <th className="py-2 pr-3 text-right whitespace-nowrap">Drop</th>
                      <th className="py-2 pr-3 whitespace-nowrap">Channel</th>
                      <th className="py-2 pr-3 text-right whitespace-nowrap">Sent</th>
                      <th className="py-2 pr-3 text-right whitespace-nowrap">Resp</th>
                      <th className="py-2 pr-3 text-right whitespace-nowrap">Resp %</th>
                      <th className="py-2 pr-3 text-right whitespace-nowrap">ROAS</th>
                      <th className="py-2 pr-0 text-right whitespace-nowrap">Revenue</th>
                    </tr>
                  </thead>

                  <tbody>
                    {ONE_OFF_CAMPAIGN_DROPS.map((drop) => (
                      <tr
                        key={drop.id}
                        className="border-t border-slate-100 align-top"
                      >
                        {/* CAMPAIGN + AUDIENCE (consolidated first column) */}
                        <td className="py-3 pr-3">
                          <div className="text-xs font-semibold text-slate-900">
                            {drop.campaign}
                          </div>
                          {drop.audience && (
                            <div className="mt-0.5 text-[11px] text-slate-500">
                              {drop.audience}
                            </div>
                          )}
                        </td>

                        {/* DROP DATE */}
                        <td className="py-3 pr-3 text-right text-slate-700 whitespace-nowrap">
                          {drop.dropDateLabel}
                        </td>

                        {/* CHANNEL(S) */}
                        <td className="py-3 pr-3 text-slate-700">
                          <div className="text-[11px] whitespace-nowrap">
                            {drop.channels}
                          </div>
                        </td>

                        {/* NUMERIC STATS */}
                        <td className="py-3 pr-3 text-right text-slate-800">
                          {drop.sent.toLocaleString()}
                        </td>
                        <td className="py-3 pr-3 text-right text-slate-800">
                          {drop.responses.toLocaleString()}
                        </td>
                        <td
                          className={`py-3 pr-3 text-right font-semibold ${getRespColorClass(
                            drop.respPct
                          )}`}
                        >
                          {drop.respPct.toFixed(1)}%
                        </td>
                        <td className="py-3 pr-3 text-right text-slate-800">
                          {drop.roas.toFixed(1)}x
                        </td>
                        <td className="py-3 pr-0 text-right text-slate-800">
                          ${drop.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT: AI on large screens */}
        <div className="hidden lg:block lg:col-span-1">
          <AIInsightsTile {...aiInsightsProps} />
        </div>
      </div>
    </ShellLayout>
  );
};

export default OneOffCampaignTrackerPage;
