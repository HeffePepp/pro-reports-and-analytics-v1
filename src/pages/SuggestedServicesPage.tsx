import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";

type SuggestedServicesSummary = {
  storeGroupName: string;
  periodLabel: string;
  emailsSent: number;          // SS messages sent
  ssRevenue: number;           // revenue from responded SS jobs
  totalInvoiceRevenue: number; // total invoice revenue in period
  acceptanceRate: number;      // overall RESP %
  totalInvoices: number;
  validEmailOnSsInvoicesPct: number; // % valid emails on SS invoices
  invoicesWithSsItemPct: number;     // % of all invoices with SS item
};

const ssSummary: SuggestedServicesSummary = {
  storeGroupName: "All Stores",
  periodLabel: "Last 12 months",
  emailsSent: 18200,
  ssRevenue: 186400,
  totalInvoiceRevenue: 742000,
  acceptanceRate: 23.8,
  totalInvoices: 21500,
  validEmailOnSsInvoicesPct: 81.2,
  invoicesWithSsItemPct: 34.5,
};

const ssResponses = Math.round(
  ssSummary.emailsSent * (ssSummary.acceptanceRate / 100)
);

type SuggestedServiceTypeRow = {
  service: string;
  invoices: number;
  validEmailPct: number;
  respPct: number;
};

const SS_SERVICE_TYPES: SuggestedServiceTypeRow[] = [
  {
    service: "Cabin Air Filter",
    invoices: 1765,
    validEmailPct: 82.3,
    respPct: 24.6,
  },
  {
    service: "Engine Air Filter",
    invoices: 1890,
    validEmailPct: 79.4,
    respPct: 23.3,
  },
  {
    service: "Fuel System Cleaning",
    invoices: 960,
    validEmailPct: 76.8,
    respPct: 17.5,
  },
  {
    service: "Wiper Blades",
    invoices: 1420,
    validEmailPct: 84.1,
    respPct: 19.6,
  },
];

type SuggestedServicesTouchPoint = {
  timing: string;
  channel: string;
  sent: number;
  responses: number;
  respPct: number;
  roas: number;
};

const SS_TOUCHPOINTS: SuggestedServicesTouchPoint[] = [
  {
    timing: "1 week after Service",
    channel: "Email",
    sent: 1850,
    responses: 420,
    respPct: 22.7,
    roas: 9.5,
  },
  {
    timing: "1 month after Service",
    channel: "Email",
    sent: 1760,
    responses: 310,
    respPct: 17.6,
    roas: 12.1,
  },
  {
    timing: "3 months after Service",
    channel: "Email",
    sent: 1640,
    responses: 240,
    respPct: 14.6,
    roas: 11.2,
  },
  {
    timing: "6 months after Service",
    channel: "Email",
    sent: 1380,
    responses: 280,
    respPct: 20.3,
    roas: 16.4,
  },
];

// same RESP color rules as Customer Journey / One-off Campaign Tracker
const getRespColorClass = (rate: number): string => {
  if (rate >= 15) return "text-emerald-600"; // green
  if (rate >= 10) return "text-orange-500"; // orange
  if (rate >= 5) return "text-amber-500"; // yellow
  return "text-rose-600"; // red
};

const SuggestedServicesPage: React.FC = () => {
  const [ssTab, setSsTab] = useState<"overview" | "details">("overview");

  const maxRespPct = useMemo(
    () => Math.max(...SS_SERVICE_TYPES.map((s) => s.respPct), 1),
    []
  );

  const aiInsightsProps = {
    title: "AI Insights",
    subtitle: "Based on SS jobs and touch points",
    bullets: [
      "Cabin Air Filter and Engine Air Filter lead on RESP %, making them ideal for educational content.",
      "Valid email rates are strong overall; focus cleanup on any stores or techs below 75%.",
      "Use the Details tab to compare SS timing (1 week vs 1 month, etc.) and adjust the journey accordingly.",
    ],
  };

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
            Track how Suggested Services communications drive completed jobs and
            revenue by service type and touch point.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT: KPIs + AI (mobile) + tiles */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPI tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricTile
              label="SS msgs sent"
              value={ssSummary.emailsSent.toLocaleString()}
            />
            <MetricTile
              label="SS responses"
              value={ssResponses.toLocaleString()}
            />
            <MetricTile
              label="Resp %"
              value={`${ssSummary.acceptanceRate.toFixed(1)}%`}
            />
            <MetricTile
              label="SS revenue"
              value={`$${ssSummary.ssRevenue.toLocaleString()}`}
            />
            <MetricTile
              label="Total inv. rev."
              value={`$${ssSummary.totalInvoiceRevenue.toLocaleString()}`}
            />
            <MetricTile
              label="SS inv. valid email"
              value={`${ssSummary.validEmailOnSsInvoicesPct.toFixed(1)}%`}
            />
            <MetricTile
              label="Inv. w/ SS item"
              value={`${ssSummary.invoicesWithSsItemPct.toFixed(1)}%`}
            />
          </div>

          {/* AI Insights – stacked here on small/medium screens */}
          <div className="block lg:hidden">
            <AIInsightsTile {...aiInsightsProps} />
          </div>

          {/* Performance by service type – Overview + Details tabs */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2 gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Performance by service type
                </h2>
                <p className="text-[11px] text-slate-600">
                  Suggested Services: invoices, valid emails and RESP %
                </p>
              </div>

              {/* tabs */}
              <div className="inline-flex items-center rounded-full bg-slate-100 p-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setSsTab("overview")}
                  className={`px-3 py-1 rounded-full ${
                    ssTab === "overview"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setSsTab("details")}
                  className={`px-3 py-1 rounded-full ${
                    ssTab === "details"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  Details
                </button>
              </div>
            </div>

            {ssTab === "overview" ? (
              <>
                <p className="mt-1 text-[10px] text-slate-400">
                  Bar length shows RESP % vs other services.
                </p>
                <div className="mt-3 space-y-5 text-xs text-slate-700">
                  {SS_SERVICE_TYPES.map((row) => {
                    const respColor = getRespColorClass(row.respPct);
                    const width = (row.respPct / maxRespPct) * 100;

                    return (
                      <div key={row.service} className="pt-1">
                        {/* Top row: service + stats */}
                        <div className="flex items-start justify-between gap-3 text-[11px]">
                          <div className="text-slate-700">
                            <div className="font-medium">{row.service}</div>
                          </div>

                          <div className="flex flex-col items-end text-right gap-0.5">
                            <div className="inline-flex items-center gap-2 text-[11px] md:text-xs font-medium">
                              <span className={respColor}>
                                {row.respPct.toFixed(1)}% RESP
                              </span>
                              <span className="opacity-50 text-slate-500">
                                •
                              </span>
                              <span className="text-slate-700">
                                {row.validEmailPct.toFixed(1)}% valid email
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {row.invoices.toLocaleString()} invoices
                            </div>
                          </div>
                        </div>

                        {/* Bar */}
                        <div className="mt-3 flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full bg-emerald-500"
                              style={{ width: `${width}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              // Details tab: SS touch point details table (unchanged)
              <div className="mt-3 overflow-x-auto">
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
                    {SS_TOUCHPOINTS.map((tp, index) => (
                      <tr
                        key={`${tp.timing}-${index}`}
                        className="border-t border-slate-100"
                      >
                        <td className="py-2 pr-3 text-slate-800">
                          Suggested Services
                        </td>
                        <td className="py-2 pr-3 text-slate-700">
                          {tp.timing}
                        </td>
                        <td className="py-2 pr-3 text-slate-700">
                          {tp.channel}
                        </td>
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
            )}
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

export default SuggestedServicesPage;
