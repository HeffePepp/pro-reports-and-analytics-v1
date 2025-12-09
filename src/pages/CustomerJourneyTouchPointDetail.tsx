import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";

type TouchPointSummaryKpis = {
  touchPointName: string;
  interval: string;
  channel: string;
  sent: number;
  responses: number;
  responseRate: number;
  roas: number;
  revenue: number;
  vehicles: number;
};

const TOUCH_POINT_SUMMARY: TouchPointSummaryKpis = {
  touchPointName: "Reminder 1",
  interval: "5k after last Service",
  channel: "Postcard + Email + SMS",
  sent: 1380,
  responses: 280,
  responseRate: 20.3,
  roas: 16.4,
  revenue: 33600,
  vehicles: 280,
};

type TouchPointGeoRow = {
  zip: string;
  city: string;
  responses: number;
  respPct: number;
  roas: number;
  revenue: number;
};

const GEO_ROWS: TouchPointGeoRow[] = [
  {
    zip: "94952",
    city: "Petaluma, CA",
    responses: 72,
    respPct: 24.5,
    roas: 18.2,
    revenue: 8800,
  },
  {
    zip: "94954",
    city: "Petaluma East, CA",
    responses: 64,
    respPct: 21.1,
    roas: 15.6,
    revenue: 7600,
  },
  {
    zip: "95401",
    city: "Santa Rosa, CA",
    responses: 52,
    respPct: 18.7,
    roas: 14.3,
    revenue: 6400,
  },
  {
    zip: "95403",
    city: "Santa Rosa North, CA",
    responses: 38,
    respPct: 16.2,
    roas: 12.8,
    revenue: 4800,
  },
  {
    zip: "95407",
    city: "Santa Rosa South, CA",
    responses: 24,
    respPct: 13.4,
    roas: 10.2,
    revenue: 3200,
  },
];

type MapMetric = "resp" | "roas";

const CustomerJourneyTouchPointDetail: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"summary" | "audience" | "map" | "journeys">("map");
  const [mapMetric, setMapMetric] = useState<MapMetric>("resp");

  const maxRespPct = useMemo(
    () => Math.max(...GEO_ROWS.map((r) => r.respPct), 1),
    []
  );
  const maxRoas = useMemo(
    () => Math.max(...GEO_ROWS.map((r) => r.roas), 1),
    []
  );

  const aiInsightsProps = {
    title: "AI Insights",
    subtitle: "Reminder 1 · 12 months",
    bullets: [
      "Reminder 1 over-performs in Petaluma ZIPs 94952 and 94954 with RESP > 21%.",
      "ROAS is strongest in higher-income ZIPs; consider testing richer postcard offers there.",
      "Use the map to identify low-response ZIPs for email-only tests or offer adjustments.",
    ],
  };

  // choose width based on selected metric
  const getBarWidth = (row: TouchPointGeoRow) => {
    if (mapMetric === "resp") {
      return (row.respPct / maxRespPct) * 100;
    }
    return (row.roas / maxRoas) * 100;
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Customer Journey", to: "/reports/customer-journey" },
        { label: TOUCH_POINT_SUMMARY.touchPointName },
      ]}
      rightInfo={
        <>
          <span>
            Store group: <span className="font-medium">North Bay Group</span>
          </span>
          <span>
            Period: <span className="font-medium">Last 12 months</span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            {TOUCH_POINT_SUMMARY.touchPointName} – Touch point detail
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Drill into performance, audience and geography for this Customer Journey touch point.
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            {TOUCH_POINT_SUMMARY.interval} · {TOUCH_POINT_SUMMARY.channel}
          </p>
        </div>
      </div>

      {/* Main layout: left content + right AI tile */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs for this touch point */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricTile
              label="Vehicles"
              value={TOUCH_POINT_SUMMARY.vehicles.toLocaleString()}
            />
            <MetricTile
              label="Resp %"
              value={`${TOUCH_POINT_SUMMARY.responseRate.toFixed(1)}%`}
            />
            <MetricTile
              label="ROAS"
              value={`${TOUCH_POINT_SUMMARY.roas.toFixed(1)}x`}
            />
            <MetricTile
              label="Sent"
              value={TOUCH_POINT_SUMMARY.sent.toLocaleString()}
            />
            <MetricTile
              label="Revenue"
              value={`$${TOUCH_POINT_SUMMARY.revenue.toLocaleString()}`}
            />
          </div>

          {/* AI – stacked here on small screens */}
          <div className="block lg:hidden">
            <AIInsightsTile {...aiInsightsProps} />
          </div>

          {/* Touch point detail tabs */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  {TOUCH_POINT_SUMMARY.touchPointName} detail
                </h2>
                <p className="text-[11px] text-slate-600">
                  Performance, audience and geography for this touch point.
                </p>
              </div>

              {/* Tabs */}
              <div className="inline-flex items-center rounded-full bg-slate-100 p-1 text-[11px]">
                {["summary", "audience", "map", "journeys"].map((tab) => {
                  const label =
                    tab === "summary"
                      ? "Summary"
                      : tab === "audience"
                      ? "Audience"
                      : tab === "map"
                      ? "Map"
                      : "Journeys";
                  const isActive = activeTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() =>
                        setActiveTab(tab as typeof activeTab)
                      }
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

            {activeTab === "map" && (
              <>
                {/* Map tab */}
                <p className="mt-1 text-[10px] text-slate-400">
                  Map shows responses by ZIP for this touch point. Bubble size = responses;
                  color indicates {mapMetric === "resp" ? "RESP %" : "ROAS"}.
                </p>

                <div className="mt-3 grid grid-cols-1 xl:grid-cols-3 gap-4">
                  {/* Map area */}
                  <div className="xl:col-span-2">
                    <div className="relative rounded-2xl border border-slate-200 bg-slate-50 h-72 md:h-96 overflow-hidden">
                      {/* Map header pill */}
                      <div className="absolute top-3 left-3 z-10">
                        <span className="inline-flex items-center px-3 py-1 rounded-full bg-white/90 shadow-sm text-[11px] text-slate-700">
                          Map: {mapMetric === "resp" ? "RESP % by ZIP" : "ROAS by ZIP"}
                        </span>
                      </div>

                      {/* Map metric toggle */}
                      <div className="absolute top-3 right-3 z-10">
                        <div className="inline-flex items-center rounded-full bg-white/80 border border-slate-200 p-1 text-[11px]">
                          <button
                            type="button"
                            onClick={() => setMapMetric("resp")}
                            className={`px-3 py-1 rounded-full ${
                              mapMetric === "resp"
                                ? "bg-sky-50 text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            RESP %
                          </button>
                          <button
                            type="button"
                            onClick={() => setMapMetric("roas")}
                            className={`px-3 py-1 rounded-full ${
                              mapMetric === "roas"
                                ? "bg-sky-50 text-slate-900 shadow-sm"
                                : "text-slate-500 hover:text-slate-700"
                            }`}
                          >
                            ROAS
                          </button>
                        </div>
                      </div>

                      {/* Placeholder for Google Map */}
                      <div className="h-full w-full flex items-center justify-center text-[11px] text-slate-400">
                        {/* Replace this with a Google Map component wired to your data */}
                        <span>Google Map placeholder – tile ready for integration</span>
                      </div>
                    </div>
                  </div>

                  {/* Right panel: filters + top ZIPs list */}
                  <div className="xl:col-span-1 flex flex-col gap-3">
                    {/* Filter chips (example) */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <div className="text-[11px] font-semibold text-slate-700">
                        Filter
                      </div>
                      <div className="mt-2 space-y-2 text-[11px] text-slate-600">
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-slate-400">
                            Channel
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px]">
                              Postcard
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px]">
                              Email
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px]">
                              Text Message
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] uppercase tracking-wide text-slate-400">
                            Vehicle age
                          </div>
                          <div className="mt-1 flex flex-wrap gap-1.5">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px]">
                              0–5 yrs
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px]">
                              6–10 yrs
                            </span>
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[11px]">
                              11+ yrs
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Top ZIPs */}
                    <div className="rounded-2xl border border-slate-200 bg-white p-3">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-semibold text-slate-700">
                          Top ZIPs for this touch point
                        </span>
                        <span className="text-slate-400">
                          {mapMetric === "resp" ? "RESP % · responses" : "ROAS · responses"}
                        </span>
                      </div>

                      <div className="mt-2 space-y-3 text-[11px] text-slate-700">
                        {GEO_ROWS.map((row) => (
                          <div key={row.zip}>
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="font-medium text-slate-800">
                                  {row.zip}
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  {row.city}
                                </div>
                              </div>
                              <div className="text-right text-[11px]">
                                {mapMetric === "resp" ? (
                                  <>
                                    <div className="font-medium text-slate-800">
                                      {row.respPct.toFixed(1)}% RESP
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                      {row.responses} responses
                                    </div>
                                  </>
                                ) : (
                                  <>
                                    <div className="font-medium text-slate-800">
                                      {row.roas.toFixed(1)}x ROAS
                                    </div>
                                    <div className="text-[10px] text-slate-500">
                                      {row.responses} responses
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                            <div className="mt-1 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                              <div
                                className="h-full bg-sky-500"
                                style={{ width: `${getBarWidth(row)}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* CTA to create one-off campaign from this segment */}
                    <button
                      type="button"
                      className="mt-1 inline-flex items-center justify-center rounded-full bg-sky-600 px-3 py-2 text-[11px] font-medium text-white shadow-sm hover:bg-sky-700"
                    >
                      Create one-off campaign from map segment
                    </button>
                  </div>
                </div>
              </>
            )}

            {activeTab !== "map" && (
              <div className="mt-3 text-[11px] text-slate-500 italic">
                This is a placeholder for the {activeTab} tab. Map tab is fully
                laid out and ready for data; Summary/Audience/Journeys can follow
                the same patterns we've used on other reports.
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

export default CustomerJourneyTouchPointDetail;
