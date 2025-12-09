// src/pages/OneOffCampaignTrackerPage.tsx
import React, { useState } from "react";
import { ShellLayout, AIInsightsTile } from "@/components/layout";

type Channel = "Postcard" | "Email" | "Text Message";

type OneOffCampaignOverview = {
  id: string;
  name: string;
  audience: string;
  dropsLabel: string; // e.g. "1 drop · Last drop Mar 5, 2024"
  channels: Channel[];
  respPct: number;
  roas: number;
  sent: number;
  revenue: number;
};

type OneOffCampaignDropRow = {
  id: string;
  name: string;
  dropDate: string;
  channels: Channel[];
  sent: number;
  responses: number;
  respPct: number;
  roas: number;
  revenue: number;
};

const OVERVIEW_CAMPAIGNS: OneOffCampaignOverview[] = [
  {
    id: "spring-has-sprung",
    name: "Don's Garage: Spring Has Sprung",
    audience: "Current synthetic customers · last 9 months",
    dropsLabel: "1 drop · Last drop Mar 5, 2024",
    channels: ["Email"],
    respPct: 6.9,
    roas: 16.1,
    sent: 2800,
    revenue: 22400,
  },
  {
    id: "summer-ac-tuneup-1",
    name: "Summer A/C Tune-Up",
    audience: "Vehicles in warm-weather ZIPs · last 18 months",
    dropsLabel: "2 drops · Last drop May 24, 2024",
    channels: ["Postcard", "Email", "Text Message"],
    respPct: 6.8,
    roas: 9.9,
    sent: 5000,
    revenue: 40900,
  },
  {
    id: "back-to-school",
    name: "Back to School",
    audience: "Minivan/SUV households · schools within 10 miles",
    dropsLabel: "1 drop · Last drop Aug 15, 2024",
    channels: ["Postcard"],
    respPct: 6.2,
    roas: 7.6,
    sent: 2600,
    revenue: 19500,
  },
  {
    id: "black-friday-synth",
    name: "Black Friday Synthetic Push",
    audience: "High-mileage synthetic customers · last 24 months",
    dropsLabel: "2 drops · Last drop Nov 27, 2024",
    channels: ["Postcard", "Email"],
    respPct: 9.1,
    roas: 10.7,
    sent: 5500,
    revenue: 64800,
  },
];

const DROP_ROWS: OneOffCampaignDropRow[] = [
  {
    id: "spring-has-sprung-drop-1",
    name: "Don's Garage: Spring Has Sprung",
    dropDate: "Mar 5, 2024",
    channels: ["Email"],
    sent: 2800,
    responses: 194,
    respPct: 6.9,
    roas: 16.1,
    revenue: 22400,
  },
  {
    id: "summer-ac-tuneup-drop-1",
    name: "Summer A/C Tune-Up",
    dropDate: "May 10, 2024",
    channels: ["Postcard", "Email", "Text Message"],
    sent: 3200,
    responses: 220,
    respPct: 6.9,
    roas: 10.1,
    revenue: 26400,
  },
  {
    id: "summer-ac-tuneup-drop-2",
    name: "Summer A/C Tune-Up",
    dropDate: "May 24, 2024",
    channels: ["Email", "Text Message"],
    sent: 1800,
    responses: 121,
    respPct: 6.7,
    roas: 9.4,
    revenue: 14500,
  },
  {
    id: "back-to-school-drop-1",
    name: "Back to School",
    dropDate: "Aug 15, 2024",
    channels: ["Postcard"],
    sent: 2600,
    responses: 162,
    respPct: 6.2,
    roas: 7.6,
    revenue: 19500,
  },
  {
    id: "bf-synth-drop-1",
    name: "Black Friday Synthetic Push",
    dropDate: "Nov 20, 2024",
    channels: ["Postcard", "Email"],
    sent: 3400,
    responses: 337,
    respPct: 9.9,
    roas: 11.5,
    revenue: 40800,
  },
  {
    id: "bf-synth-drop-2",
    name: "Black Friday Synthetic Push",
    dropDate: "Nov 27, 2024",
    channels: ["Email"],
    sent: 2100,
    responses: 166,
    respPct: 7.9,
    roas: 9.3,
    revenue: 23600,
  },
];

const channelColor: Record<Channel, string> = {
  Postcard: "bg-sky-500",
  Email: "bg-emerald-500",
  "Text Message": "bg-violet-500",
};

const channelLabel: Record<Channel, string> = {
  Postcard: "Postcard",
  Email: "Email",
  "Text Message": "Text Message",
};

const OneOffCampaignTrackerPage: React.FC = () => {
  const [tab, setTab] = useState<"overview" | "drops">("overview");

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
            Store group: <span className="font-medium">All Stores</span>
          </span>
          <span>
            Period: <span className="font-medium">Last 12 months</span>
          </span>
        </>
      }
    >
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            One-Off Campaign Tracker
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Compare one-off campaigns on response rate, ROAS, revenue and drops.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT – main card */}
        <div className="lg:col-span-3 space-y-4">
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            {/* Card header + tabs */}
            <div className="flex items-center justify-between gap-3 mb-2">
              <div>
                <h2 className="text-base md:text-lg font-semibold text-slate-900">
                  One-off campaign performance
                </h2>
                <p className="mt-1 text-[11px] text-slate-600">
                  Response rate, ROAS and revenue by campaign and drop.
                </p>
              </div>
              <div className="inline-flex items-center rounded-full bg-slate-50 p-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setTab("overview")}
                  className={`px-3 py-1 rounded-full ${
                    tab === "overview"
                      ? "bg-white shadow-sm text-slate-900 font-medium"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setTab("drops")}
                  className={`px-3 py-1 rounded-full ${
                    tab === "drops"
                      ? "bg-white shadow-sm text-slate-900 font-medium"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Drops
                </button>
              </div>
            </div>

            {tab === "overview" ? (
              // ---------- OVERVIEW (bar layout) ----------
              <div className="mt-2 space-y-6 text-xs text-slate-700">
                <p className="text-[11px] text-slate-500">
                  Channel bar shows mix of Postcard, Email and Text Message
                  across all drops. Bar length shows resp % vs other campaigns.
                </p>

                {OVERVIEW_CAMPAIGNS.map((c, idx) => (
                  <div key={c.id} className="space-y-2">
                    {/* Top row: campaign name + stats */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-sm md:text-base font-semibold text-slate-900">
                          {c.name}
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500">
                          {c.audience}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-500">
                          {c.dropsLabel}
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-700 min-w-[110px]">
                        <div className="text-sm font-semibold text-amber-600">
                          {c.respPct.toFixed(1)}% RESP
                        </div>
                        <div className="mt-0.5 text-sm font-semibold text-slate-900">
                          {c.roas.toFixed(1)}x ROAS
                        </div>
                        <div className="mt-1 text-[11px] text-slate-500">
                          {c.sent.toLocaleString()} sent ·{" "}
                          {c.revenue.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          })}{" "}
                          rev
                        </div>
                      </div>
                    </div>

                    {/* Channel mix bar */}
                    <div className="mt-1">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div className="flex h-full w-full">
                          {c.channels.map((ch, chIdx) => (
                            <div
                              key={`${c.id}-${ch}-${chIdx}`}
                              className={`flex-1 ${channelColor[ch]}`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-slate-600">
                        {(["Postcard", "Email", "Text Message"] as Channel[]).map(
                          (ch) => (
                            <span
                              key={`${c.id}-${ch}-legend`}
                              className="inline-flex items-center gap-1"
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${channelColor[ch]}`}
                              />
                              <span>{channelLabel[ch]}</span>
                            </span>
                          )
                        )}
                      </div>
                    </div>

                    {/* Divider between campaigns */}
                    {idx < OVERVIEW_CAMPAIGNS.length - 1 && (
                      <div className="pt-4 border-b border-slate-100" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // ---------- DROPS (table) ----------
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500">
                      <th className="py-2 pr-3">Campaign</th>
                      <th className="py-2 pr-3 text-right">Responses</th>
                      <th className="py-2 pr-3 text-right">Resp %</th>
                      <th className="py-2 pr-3 text-right">ROAS</th>
                      <th className="py-2 pr-0 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {DROP_ROWS.map((row) => (
                      <tr
                        key={row.id}
                        className="border-t border-slate-100 align-top"
                      >
                        <td className="py-3 pr-3">
                          <div className="text-sm md:text-base font-semibold text-slate-900">
                            {row.name}
                          </div>
                          <div className="mt-1 text-[11px] text-slate-500">
                            {row.dropDate} ·{" "}
                            {row.channels
                              .map((ch) => channelLabel[ch])
                              .join(" + ")}
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            {row.sent.toLocaleString()} sent
                          </div>
                        </td>
                        <td className="py-3 pr-3 text-right text-xs text-slate-700">
                          {row.responses.toLocaleString()}
                        </td>
                        <td className="py-3 pr-3 text-right text-xs text-slate-700">
                          {row.respPct.toFixed(1)}%
                        </td>
                        <td className="py-3 pr-3 text-right text-xs text-slate-700">
                          {row.roas.toFixed(1)}x
                        </td>
                        <td className="py-3 pr-0 text-right text-xs text-slate-700">
                          {row.revenue.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT – AI Insights */}
        <div className="lg:col-span-1">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on one-off campaign performance"
            bullets={[
              "Summer A/C Tune-Up and Black Friday Synthetic Push are your strongest performers on ROAS.",
              "Use the Drops tab to compare individual drops and tune channel mix and timing.",
              "Consider testing additional drops for high-ROAS campaigns with lower send volume.",
            ]}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default OneOffCampaignTrackerPage;
