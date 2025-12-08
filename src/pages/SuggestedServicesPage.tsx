import React, { useState, useMemo } from "react";
import ShellLayout from "@/components/layout/ShellLayout";
import MetricTile from "@/components/layout/MetricTile";
import AIInsightsTile from "@/components/layout/AIInsightsTile";

// ============================================================================
// SUGGESTED SERVICES REPORT – DATA & COMPONENT
// ============================================================================

// ---- Summary KPIs ----
type SuggestedServicesSummary = {
  storeGroupName: string;
  periodLabel: string;
  emailsSent: number;          // SS messages sent
  ssRevenue: number;           // revenue from responded SS jobs
  totalInvoiceRevenue: number; // total invoice revenue in period
  acceptanceRate: number;      // overall RESP %
  totalInvoices: number;       // all invoices in period
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
  totalInvoices: 21500,             // dummy
  validEmailOnSsInvoicesPct: 81.2,  // dummy
  invoicesWithSsItemPct: 34.5,      // dummy
};

// ---- Performance by service type (Overview tab) ----
type SuggestedServiceTypeRow = {
  service: string;
  invoices: number;       // invoices that include this SS job
  validEmailPct: number;  // % of those invoices with a valid email
  respPct: number;        // % of those customers that later RESP
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

// ---- Touch point details (Details tab) ----
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

// ============================================================================
// SuggestedServicesPage COMPONENT
// ============================================================================

const SuggestedServicesPage: React.FC = () => {
  const [ssTab, setSsTab] = useState<"overview" | "details">("overview");

  // KPI calcs
  const ssResponses = useMemo(
    () =>
      Math.round(ssSummary.emailsSent * (ssSummary.acceptanceRate / 100)),
    []
  );

  // AI Insights
  const [insights, setInsights] = useState<string[]>([
    "Cabin Air Filter and Engine Air Filter have the strongest RESP %, making them ideal candidates for SS education and video content.",
    "Valid email rates are generally strong; focus any cleanup on services with lower email quality to unlock more SS volume.",
    "Use the Details tab to confirm which SS touch point timing (1 week, 1 month, etc.) is driving the best ROAS.",
  ]);

  const regenerateInsights = () => {
    const bestService = SS_SERVICE_TYPES.reduce((best, row) =>
      !best || row.respPct > best.respPct ? row : best
    );
    setInsights([
      `"${bestService.service}" currently has the highest RESP rate at ${bestService.respPct.toFixed(
        1
      )}%.`,
      "Combine this service with early touch points (1 week and 1 month) to maximize conversion while the visit is fresh.",
      "Test different SS subject lines and video placements for weaker services to lift RESP without deep discounting.",
    ]);
  };

  const maxRespService = useMemo(
    () => Math.max(...SS_SERVICE_TYPES.map((r) => r.respPct), 1),
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
            Track how Suggested Services communications drive completed jobs and
            revenue by service type and touch point.
          </p>
        </div>
      </div>

      {/* Main layout: left content + right AI panel */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT: KPIs + tabbed service-type card */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPI tiles */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-7 gap-3">
            <MetricTile
              label="Suggested Services Messages Sent"
              value={ssSummary.emailsSent.toLocaleString()}
            />
            <MetricTile
              label="Suggested Services Responses"
              value={ssResponses.toLocaleString()}
            />
            <MetricTile
              label="Resp %"
              value={`${ssSummary.acceptanceRate.toFixed(1)}%`}
            />
            <MetricTile
              label="Suggested Services Revenue"
              value={`$${ssSummary.ssRevenue.toLocaleString()}`}
            />
            <MetricTile
              label="Total Invoice Revenue"
              value={`$${ssSummary.totalInvoiceRevenue.toLocaleString()}`}
            />
            <MetricTile
              label="% valid emails on Suggested Services invoices"
              value={`${ssSummary.validEmailOnSsInvoicesPct.toFixed(1)}%`}
            />
            <MetricTile
              label="% inv with Suggested Services item included"
              value={`${ssSummary.invoicesWithSsItemPct.toFixed(1)}%`}
            />
          </div>

          {/* Performance by service type – Overview / Details tabs */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Performance by service type
                </h2>
                <p className="text-[11px] text-slate-600">
                  Suggested Services: invoices, valid emails and RESP %
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

            {/* OVERVIEW TAB – bars + service stats */}
            {ssTab === "overview" && (
              <div className="space-y-3 text-xs text-slate-700">
                {SS_SERVICE_TYPES.map((row) => (
                  <div key={row.service}>
                    {/* Top row: service + right-aligned stats line */}
                    <div className="flex items-start justify-between gap-3 text-[11px]">
                      <div className="text-slate-700 font-medium">
                        {row.service}
                      </div>
                      <div className="text-right text-slate-600 whitespace-nowrap">
                        {row.invoices.toLocaleString()} invoices ·{" "}
                        {row.validEmailPct.toFixed(1)}% valid emails ·{" "}
                        {row.respPct.toFixed(1)}% RESP
                      </div>
                    </div>

                    {/* Bar based on RESP % */}
                    <div className="mt-2 flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{
                            width: `${
                              (row.respPct / maxRespService) * 100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* DETAILS TAB – Touch point details table */}
            {ssTab === "details" && (
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
                      <tr
                        key={tp.timing}
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

        {/* RIGHT: AI Insights */}
        <div className="lg:col-span-1">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on SS jobs and touch points"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default SuggestedServicesPage;
