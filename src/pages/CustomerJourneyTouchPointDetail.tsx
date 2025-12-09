import React, { useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";

type DetailTab = "summary" | "audience" | "map" | "journeys";

// reuse RESP color logic from CJ / SS
const getRespColorClass = (rate: number): string => {
  if (rate >= 15) return "text-emerald-600";
  if (rate >= 10) return "text-orange-500";
  if (rate >= 5) return "text-amber-500";
  return "text-rose-600";
};

type ZipStat = {
  zip: string;
  city: string;
  responses: number;
  respPct: number;
  activeCustomers: number;
  loyalCustomers: number;
  malePct: number;
  femalePct: number;
  vehicles0to5: number;
  vehicles6to10: number;
  vehicles11plus: number;
};

const REMINDER1_ZIP_STATS: ZipStat[] = [
  {
    zip: "94110",
    city: "San Francisco, CA",
    responses: 96,
    respPct: 20.3,
    activeCustomers: 178,
    loyalCustomers: 52,
    malePct: 53,
    femalePct: 47,
    vehicles0to5: 39,
    vehicles6to10: 41,
    vehicles11plus: 20,
  },
  {
    zip: "94901",
    city: "San Rafael, CA",
    responses: 74,
    respPct: 18.1,
    activeCustomers: 142,
    loyalCustomers: 39,
    malePct: 51,
    femalePct: 49,
    vehicles0to5: 34,
    vehicles6to10: 45,
    vehicles11plus: 21,
  },
  {
    zip: "95401",
    city: "Santa Rosa, CA",
    responses: 56,
    respPct: 15.2,
    activeCustomers: 119,
    loyalCustomers: 32,
    malePct: 48,
    femalePct: 52,
    vehicles0to5: 29,
    vehicles6to10: 42,
    vehicles11plus: 29,
  },
];

type MapMetric = "resp" | "roas";

const CustomerJourneyTouchPointDetailPage: React.FC = () => {
  const [detailTab, setDetailTab] = useState<DetailTab>("map");
  const [selectedZip, setSelectedZip] = useState<ZipStat | null>(
    REMINDER1_ZIP_STATS[0]
  );
  const [mapMetric, setMapMetric] = useState<MapMetric>("resp");

  const aiInsightsProps = {
    title: "AI Insights",
    subtitle: "Based on Reminder 1 data",
    bullets: [
      "Reminder 1 performs strongest in ZIPs with higher loyal-customer density.",
      "Younger vehicles (0–5 yrs) respond slightly better to Reminder 1 offers.",
      "Use this map to identify pockets where adding SMS could lift RESP %.",
    ],
  };

  const currentZip = selectedZip ?? REMINDER1_ZIP_STATS[0] ?? null;

  // dummy KPI numbers for this touch point
  const sent = 1380;
  const responses = 280;
  const respPct = 20.3;
  const roas = 16.4;
  const revenue = 33600;

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Customer Journey", to: "/reports/customer-journey" },
        { label: "Reminder 1 detail" },
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
            Reminder 1 detail
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Performance, audience and geography for this touch point.
          </p>
        </div>
      </div>

      {/* Layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <MetricTile label="Touch point" value="Reminder 1" />
            <MetricTile label="Msgs sent" value={sent.toLocaleString()} />
            <MetricTile label="Responses" value={responses.toLocaleString()} />
            <MetricTile label="Resp %" value={`${respPct.toFixed(1)}%`} />
            <MetricTile label="ROAS" value={`${roas.toFixed(1)}x`} />
          </div>

          {/* AI stacked on small screens */}
          <div className="block lg:hidden">
            <AIInsightsTile {...aiInsightsProps} />
          </div>

          {/* Detail card with tabs */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Reminder 1 detail
                </h2>
                <p className="text-[11px] text-slate-600">
                  Map, audience and journey context for this touch point.
                </p>
              </div>

              {/* tabs: Summary / Audience / Map / Journeys */}
              <div className="inline-flex items-center rounded-full bg-slate-100 p-1 text-[11px]">
                {(["summary", "audience", "map", "journeys"] as DetailTab[]).map(
                  (tab) => {
                    const label =
                      tab === "summary"
                        ? "Summary"
                        : tab === "audience"
                        ? "Audience"
                        : tab === "map"
                        ? "Map"
                        : "Journeys";
                    const isActive = detailTab === tab;
                    return (
                      <button
                        key={tab}
                        type="button"
                        onClick={() => setDetailTab(tab)}
                        className={`px-3 py-1 rounded-full ${
                          isActive
                            ? "bg-white shadow-sm text-slate-900"
                            : "text-slate-500 hover:text-slate-700"
                        }`}
                      >
                        {label}
                      </button>
                    );
                  }
                )}
              </div>
            </div>

            {detailTab === "summary" && (
              <div className="mt-3 text-xs text-slate-700 space-y-3">
                <p>
                  Reminder 1 runs at{" "}
                  <span className="font-medium">5k after last Service</span> and
                  currently delivers{" "}
                  <span className="font-medium">
                    {respPct.toFixed(1)}% RESP
                  </span>{" "}
                  and{" "}
                  <span className="font-medium">
                    {roas.toFixed(1)}x ROAS
                  </span>
                  .
                </p>
                <p>
                  Total revenue attributed to this touch point is{" "}
                  <span className="font-medium">
                    ${revenue.toLocaleString()}
                  </span>{" "}
                  from{" "}
                  <span className="font-medium">
                    {responses.toLocaleString()} responses
                  </span>{" "}
                  and{" "}
                  <span className="font-medium">
                    {sent.toLocaleString()} messages sent
                  </span>
                  .
                </p>
                <p className="text-[11px] text-slate-500">
                  Use the Audience and Map tabs to understand which ZIP codes
                  and customer segments are most responsive to Reminder 1.
                </p>
              </div>
            )}

            {detailTab === "audience" && (
              <div className="mt-3 text-xs text-slate-700 space-y-3">
                <p className="text-[11px] text-slate-500">
                  Audience breakdown (dummy data – ready for integration):
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    <span className="font-medium">62%</span> of responders drive
                    vehicles{" "}
                    <span className="font-medium">6–10 years old</span>.
                  </li>
                  <li>
                    <span className="font-medium">44%</span> have visited{" "}
                    <span className="font-medium">3+ times</span> in the last 24
                    months (loyal).
                  </li>
                  <li>
                    Mix of channels:{" "}
                    <span className="font-medium">
                      Postcard + Email + Text Message
                    </span>{" "}
                    for most Reminder 1 touch points.
                  </li>
                </ul>
              </div>
            )}

            {detailTab === "map" && (
              <div className="mt-3 space-y-4">
                {/* Map metric toggle */}
                <div className="flex items-center justify-between text-[11px]">
                  <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                    <span className="font-medium text-slate-700">
                      Map: RESP % by ZIP
                    </span>
                  </div>
                  <div className="inline-flex items-center rounded-full bg-slate-100 p-1">
                    {(["resp", "roas"] as MapMetric[]).map((metric) => {
                      const isActive = mapMetric === metric;
                      const label =
                        metric === "resp" ? "RESP %" : "ROAS";
                      return (
                        <button
                          key={metric}
                          type="button"
                          onClick={() => setMapMetric(metric)}
                          className={`px-3 py-1 rounded-full text-[11px] ${
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

                {/* Map placeholder (reuses the same pattern as CJ/SS) */}
                <div className="relative rounded-2xl border border-slate-100 bg-slate-50 h-72 md:h-80 overflow-hidden flex items-center justify-center">
                  <div className="absolute top-3 left-3 flex flex-col gap-1 text-[10px] text-slate-600 bg-white/80 rounded-xl px-3 py-2 shadow-sm">
                    <span className="text-[10px] font-semibold text-slate-700">
                      Channel legend
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-sky-300" />
                      Postcard
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
                      Email
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-2.5 w-2.5 rounded-full bg-violet-300" />
                      Text Message
                    </span>
                  </div>

                  <div className="absolute inset-x-0 bottom-3 flex justify-center text-[10px] text-slate-400">
                    Google Map placeholder – tile ready for integration
                  </div>

                  <div className="text-[11px] text-slate-300">
                    Map preview (dummy)
                  </div>
                </div>

                {/* ZIP selector + stats */}
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                    {REMINDER1_ZIP_STATS.map((z) => {
                      const isActive =
                        currentZip && currentZip.zip === z.zip;
                      return (
                        <button
                          key={z.zip}
                          type="button"
                          onClick={() => setSelectedZip(z)}
                          className={`px-3 py-1 rounded-full border ${
                            isActive
                              ? "border-sky-400 bg-sky-50 text-sky-700"
                              : "border-slate-200 bg-white hover:border-sky-300 hover:text-sky-700"
                          }`}
                        >
                          {z.zip}
                        </button>
                      );
                    })}
                  </div>

                  {currentZip && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-3 md:p-4 text-[11px] md:text-xs text-slate-700 space-y-2">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                        <div>
                          <div className="text-[11px] font-semibold text-slate-800">
                            ZIP {currentZip.zip}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            {currentZip.city}
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-4 text-right">
                          <div>
                            <div className="text-[10px] text-slate-500">
                              RESP %
                            </div>
                            <div
                              className={`text-xs font-semibold ${getRespColorClass(
                                currentZip.respPct
                              )}`}
                            >
                              {currentZip.respPct.toFixed(1)}% RESP
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500">
                              Responses
                            </div>
                            <div className="text-xs font-semibold">
                              {currentZip.responses.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500">
                              Active customers
                            </div>
                            <div className="text-xs font-semibold">
                              {currentZip.activeCustomers.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500">
                              Loyal customers
                            </div>
                            <div className="text-xs font-semibold">
                              {currentZip.loyalCustomers.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <div className="text-[10px] text-slate-500">
                            Gender mix
                          </div>
                          <div className="mt-1 text-xs">
                            {currentZip.malePct.toFixed(0)}% male ·{" "}
                            {currentZip.femalePct.toFixed(0)}% female
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">
                            Vehicle age mix
                          </div>
                          <div className="mt-1 text-xs space-y-0.5">
                            <div>
                              0–5 yrs ·{" "}
                              {currentZip.vehicles0to5.toFixed(0)}%
                            </div>
                            <div>
                              6–10 yrs ·{" "}
                              {currentZip.vehicles6to10.toFixed(0)}%
                            </div>
                            <div>
                              11+ yrs ·{" "}
                              {currentZip.vehicles11plus.toFixed(0)}%
                            </div>
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-500">
                            Notes
                          </div>
                          <div className="mt-1 text-[10px] text-slate-600">
                            Use ZIP-level patterns here to tune Reminder 1
                            offers, channel mix and future one-off campaigns.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {detailTab === "journeys" && (
              <div className="mt-3 text-xs text-slate-700 space-y-2">
                <p className="text-[11px] text-slate-500">
                  Journey context (placeholder – ready for integration):
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    Most Reminder 1 responses roll into{" "}
                    <span className="font-medium">Reminder 2</span> and{" "}
                    <span className="font-medium">Reminder 3</span> if the
                    customer does not return.
                  </li>
                  <li>
                    Use this tab to show how customers flow across touch points
                    and which follow-up steps capture the most revenue.
                  </li>
                </ul>
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

export default CustomerJourneyTouchPointDetailPage;
