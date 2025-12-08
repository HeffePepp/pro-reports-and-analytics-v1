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

type SuggestedServiceTypeRow = {
  serviceName: string;
  suggestedCount: number;
  acceptedCount: number;
  avgRevenue: number;
};

type SSRow = {
  serviceName: string;
  sent: number;
  accepted: number;
  acceptanceRate: number;
  revenue: number;
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

const ssTypes: SuggestedServiceTypeRow[] = [
  {
    serviceName: "Cabin Air Filter",
    suggestedCount: 5200,
    acceptedCount: 1280,
    avgRevenue: 68,
  },
  {
    serviceName: "Engine Air Filter",
    suggestedCount: 6100,
    acceptedCount: 1420,
    avgRevenue: 54,
  },
  {
    serviceName: "Fuel System Cleaning",
    suggestedCount: 2400,
    acceptedCount: 420,
    avgRevenue: 110,
  },
  {
    serviceName: "Wiper Blades",
    suggestedCount: 4800,
    acceptedCount: 940,
    avgRevenue: 38,
  },
];

const SS_ROWS: SSRow[] = [
  { serviceName: "Cabin Air Filter", sent: 5200, accepted: 1280, acceptanceRate: 24.6, revenue: 87040 },
  { serviceName: "Engine Air Filter", sent: 6100, accepted: 1420, acceptanceRate: 23.3, revenue: 76680 },
  { serviceName: "Fuel System Cleaning", sent: 2400, accepted: 420, acceptanceRate: 17.5, revenue: 46200 },
  { serviceName: "Wiper Blades", sent: 4800, accepted: 940, acceptanceRate: 19.6, revenue: 35720 },
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
  const [insights, setInsights] = useState<string[]>([
    "Cabin and engine air filters are the strongest Suggested Services, with solid response and high average revenue.",
    "Fuel system cleaning has high revenue per job but lower acceptance; consider stronger education or offer.",
    "Wiper blades perform well as an add-on and help boost ticket without adding much bay time.",
  ]);

  const maxAcceptance = useMemo(
    () =>
      Math.max(
        ...ssTypes.map((t) => (t.acceptedCount / t.suggestedCount) * 100),
        1
      ),
    []
  );

  const regenerateInsights = () => {
    const best = ssTypes.reduce((best, s) =>
      !best ||
      s.acceptedCount / s.suggestedCount >
        best.acceptedCount / best.suggestedCount
        ? s
        : best
    );

    setInsights([
      `"${best.serviceName}" has the highest acceptance rate among Suggested Services.`,
      "Use video content in Suggested Services emails to educate customers and nudge acceptance on lower-performing services.",
      "Pair this report with ROAS and Coupon / Discount Analysis to decide where to place stronger offers.",
    ]);
  };

  const totalResponses = useMemo(
    () => ssTypes.reduce((sum, s) => sum + s.acceptedCount, 0),
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

          {/* Performance by service type */}
          <section className="rounded-2xl bg-card border border-border shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Performance by service type
                </h2>
                <p className="text-[11px] text-slate-600">
                  Suggested vs accepted, response and average revenue
                </p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              {ssTypes.map((s) => {
                const rate = (s.acceptedCount / s.suggestedCount) * 100;
                return (
                  <div key={s.serviceName}>
                    <div className="flex justify-between text-[11px]">
                      <span>{s.serviceName}</span>
                      <span>
                        {rate.toFixed(1)}% accept · ${s.avgRevenue.toFixed(0)}{" "}
                        avg rev
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{
                            width: `${(rate / maxAcceptance) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 w-40 text-right">
                        {s.acceptedCount.toLocaleString()} of{" "}
                        {s.suggestedCount.toLocaleString()} accepted
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Suggested service details – RESP wording */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Suggested service details
              </h2>
              <span className="text-[11px] text-slate-600">
                Sent, responded and revenue by service
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Service</th>
                    <th className="py-2 pr-3 text-right">Sent</th>
                    {/* renamed */}
                    <th className="py-2 pr-3 text-right">Responded</th>
                    {/* renamed */}
                    <th className="py-2 pr-3 text-right">Resp %</th>
                    <th className="py-2 pr-3 text-right">Revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {SS_ROWS.map((row) => (
                    <tr key={row.serviceName} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-800">
                        {row.serviceName}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {row.sent.toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {row.accepted.toLocaleString()} {/* same metric, new label */}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {row.acceptanceRate.toFixed(1)}%
                      </td>
                      <td className="py-2 pr-3 text-right">
                        ${row.revenue.toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Touch point performance */}
          <section className="rounded-2xl bg-card border border-border shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Touch point performance
              </h2>
              <span className="text-[11px] text-slate-600">
                Sent, responses, resp % and ROAS by timing
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
                    <tr key={tp.name} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-800">{tp.name}</td>
                      <td className="py-2 pr-3 text-slate-600">{tp.timing}</td>
                      <td className="py-2 pr-3 text-slate-600">{tp.channel}</td>
                      <td className="py-2 pr-3 text-right">{tp.sent.toLocaleString()}</td>
                      <td className="py-2 pr-3 text-right">{tp.responses.toLocaleString()}</td>
                      <td className="py-2 pr-3 text-right">{tp.respPct.toFixed(1)}%</td>
                      <td className="py-2 pr-3 text-right">{tp.roas.toFixed(1)}x</td>
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
