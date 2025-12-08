import React, { useState, useMemo } from "react";
import { ShellLayout, MetricTile } from "@/components/layout";
import AIInsightsTile from "@/components/layout/AIInsightsTile";

type SuggestedServicesSummary = {
  storeGroupName: string;
  periodLabel: string;
  emailsSent: number;
  vehiclesWithSs: number;
  ssRevenue: number;
  totalInvoiceRevenue: number;
  acceptanceRate: number;
  avgTicketLift: number;
};

const ssSummary: SuggestedServicesSummary = {
  storeGroupName: "All Stores",
  periodLabel: "Last 12 months",
  emailsSent: 18200,
  vehiclesWithSs: 4620,
  ssRevenue: 186400,
  totalInvoiceRevenue: 742000,
  acceptanceRate: 23.8,
  avgTicketLift: 22,
};

// Performance by service type
type SuggestedServiceTypeRow = {
  service: string;
  sent: number;
  responded: number;
  respPct: number;
  avgRev: number;
  revenue: number;
};

const SS_SERVICE_TYPES: SuggestedServiceTypeRow[] = [
  {
    service: "Cabin Air Filter",
    sent: 5200,
    responded: 1280,
    respPct: 24.6,
    avgRev: 68,
    revenue: 87040,
  },
  {
    service: "Engine Air Filter",
    sent: 6100,
    responded: 1420,
    respPct: 23.3,
    avgRev: 54,
    revenue: 76680,
  },
  {
    service: "Fuel System Cleaning",
    sent: 2400,
    responded: 420,
    respPct: 17.5,
    avgRev: 110,
    revenue: 46200,
  },
  {
    service: "Wiper Blades",
    sent: 4800,
    responded: 940,
    respPct: 19.6,
    avgRev: 38,
    revenue: 35720,
  },
];

// Touch point level data
type SuggestedServicesTouchPoint = {
  name: string;
  timing: string;
  channel: string;
  sent: number;
  responses: number;
  respPct: number;
  roas: number;
};

const SS_TOUCHPOINTS: SuggestedServicesTouchPoint[] = [
  {
    name: "Suggested Services – 1 week",
    timing: "1 week after Service",
    channel: "Email",
    sent: 1850,
    responses: 420,
    respPct: 22.7,
    roas: 9.5,
  },
  {
    name: "Suggested Services – 1 month",
    timing: "1 month after Service",
    channel: "Email",
    sent: 1760,
    responses: 310,
    respPct: 17.6,
    roas: 12.1,
  },
  {
    name: "Suggested Services – 3 months",
    timing: "3 months after Service",
    channel: "Email",
    sent: 1640,
    responses: 240,
    respPct: 14.6,
    roas: 11.2,
  },
  {
    name: "Suggested Services – 6 months",
    timing: "6 months after Service",
    channel: "Email",
    sent: 1380,
    responses: 280,
    respPct: 20.3,
    roas: 16.4,
  },
];

const SuggestedServicesPage: React.FC = () => {
  const [ssTab, setSsTab] = useState<"overview" | "details">("overview");
  const [insights, setInsights] = useState<string[]>([
    "Cabin and engine air filters are the strongest Suggested Services, with solid response and high average revenue.",
    "Fuel system cleaning has high revenue per job but lower acceptance; consider stronger education or offer.",
    "Wiper blades perform well as an add-on and help boost ticket without adding much bay time.",
  ]);


  const regenerateInsights = () => {
    const best = SS_SERVICE_TYPES.reduce((best, s) =>
      !best || s.respPct > best.respPct ? s : best
    );

    setInsights([
      `"${best.service}" has the highest response rate among Suggested Services.`,
      "Use video content in Suggested Services emails to educate customers and nudge acceptance on lower-performing services.",
      "Pair this report with ROAS and Coupon / Discount Analysis to decide where to place stronger offers.",
    ]);
  };

  const totalResponses = useMemo(
    () => SS_SERVICE_TYPES.reduce((sum, s) => sum + s.responded, 0),
    []
  );

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Suggested Services" },
      ]}
      rightInfo={
        <>
          <span>
            Store group:{" "}
            <span className="font-medium">{ssSummary.storeGroupName}</span>
          </span>
          <span>
            Period:{" "}
            <span className="font-medium">{ssSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Suggested Services
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track how educational Suggested Services messages convert suggested services into
            accepted work and revenue.
          </p>
        </div>
      </div>

      {/* Main layout: left content + right AI tile */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPI tiles – updated labels & extra tile */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <MetricTile
              label="SS Messages Sent"
              value={ssSummary.emailsSent.toLocaleString()}
            />
            <MetricTile
              label="SS Responses"
              value={totalResponses.toLocaleString()}
            />
            <MetricTile
              label="Resp %"
              value={`${ssSummary.acceptanceRate.toFixed(1)}%`}
            />
            <MetricTile
              label="SS Revenue"
              value={`$${ssSummary.ssRevenue.toLocaleString()}`}
            />
            <MetricTile
              label="Total Invoice Revenue"
              value={`$${ssSummary.totalInvoiceRevenue.toLocaleString()}`}
            />
          </div>

          {/* Performance by service type – tabbed Overview / Details */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Performance by service type
                </h2>
                <p className="text-[11px] text-slate-600">
                  Suggested Services: RESP % and revenue by service
                </p>
              </div>

              {/* Tabs */}
              <div className="inline-flex items-center rounded-full bg-slate-100 p-0.5 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSsTab("overview")}
                  className={
                    "px-3 py-1 rounded-full font-medium transition " +
                    (ssTab === "overview"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-500 hover:text-slate-900")
                  }
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setSsTab("details")}
                  className={
                    "px-3 py-1 rounded-full font-medium transition " +
                    (ssTab === "details"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-500 hover:text-slate-900")
                  }
                >
                  Details
                </button>
              </div>
            </div>

            {/* OVERVIEW TAB – bars + quick stats */}
            {ssTab === "overview" && (
              <div className="space-y-3 text-xs text-slate-700">
                {(() => {
                  const maxResp = Math.max(
                    ...SS_SERVICE_TYPES.map((r) => r.respPct),
                    1
                  );
                  return SS_SERVICE_TYPES.map((row) => (
                    <div key={row.service}>
                      {/* Top row: service name + RESP/avg rev + counts */}
                      <div className="flex items-start justify-between gap-3 text-[11px]">
                        <div className="text-slate-700 font-medium">
                          {row.service}
                        </div>
                        <div className="text-right text-slate-600 min-w-[120px]">
                          <div>
                            {row.respPct.toFixed(1)}% RESP · ${row.avgRev.toFixed(0)} avg rev
                          </div>
                          <div className="text-slate-500">
                            {row.responded.toLocaleString()} of{" "}
                            {row.sent.toLocaleString()} responded
                          </div>
                        </div>
                      </div>

                      {/* Bar */}
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-emerald-500"
                            style={{
                              width: `${(row.respPct / maxResp) * 100}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}

            {/* DETAILS TAB – full table */}
            {ssTab === "details" && (
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500">
                      <th className="py-2 pr-3">Service</th>
                      <th className="py-2 pr-3 text-right">Sent</th>
                      <th className="py-2 pr-3 text-right">Responded</th>
                      <th className="py-2 pr-3 text-right">Resp %</th>
                      <th className="py-2 pr-3 text-right">Avg rev</th>
                      <th className="py-2 pr-3 text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SS_SERVICE_TYPES.map((row) => (
                      <tr key={row.service} className="border-t border-slate-100">
                        <td className="py-2 pr-3 text-slate-800">{row.service}</td>
                        <td className="py-2 pr-3 text-right">
                          {row.sent.toLocaleString()}
                        </td>
                        <td className="py-2 pr-3 text-right">
                          {row.responded.toLocaleString()}
                        </td>
                        <td className="py-2 pr-3 text-right">
                          {row.respPct.toFixed(1)}%
                        </td>
                        <td className="py-2 pr-3 text-right">
                          ${row.avgRev.toFixed(0)}
                        </td>
                        <td className="py-2 pr-3 text-right">
                          ${row.revenue.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Touch point details table – Suggested Services */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Touch point details
              </h2>
              <span className="text-[11px] text-slate-600">
                Sent, responses, Resp % and ROAS by touch point
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Touch Point</th>
                    <th className="py-2 pr-3">Timing</th>
                    <th className="py-2 pr-3">Channel</th>
                    <th className="py-2 pr-3 text-right">Sent</th>
                    <th className="py-2 pr-3 text-right">Responses</th>
                    <th className="py-2 pr-3 text-right">Resp %</th>
                    <th className="py-2 pr-3 text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {SS_TOUCHPOINTS.map((tp) => (
                    <tr key={tp.timing} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-800">
                        Suggested Services
                      </td>
                      <td className="py-2 pr-3 text-slate-700">{tp.timing}</td>
                      <td className="py-2 pr-3 text-slate-700">{tp.channel}</td>
                      <td className="py-2 pr-3 text-right">
                        {tp.sent.toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {tp.responses.toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {tp.respPct.toFixed(1)}%
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {tp.roas.toFixed(1)}x
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT: AI panel */}
        <div className="lg:col-span-1">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on Suggested Services performance data"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default SuggestedServicesPage;
