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
  validEmailOnSsInvoicesPct: number;
  invoicesWithSsItemPct: number;
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

// shared RESP color rules (same as Journey)
const getRespColorClass = (rate: number): string => {
  if (rate >= 15) return "text-emerald-600";
  if (rate >= 10) return "text-orange-500";
  if (rate >= 5) return "text-amber-500";
  return "text-rose-600";
};

// Dummy ZIP stats for Suggested Services map
type ZipStat = {
  zip: string;
  city: string;
  ssResponses: number;
  respPct: number;
  ssRevenue: number;
  activeCustomers: number;
  loyalCustomers: number;
  vehicles0to5: number;
  vehicles6to10: number;
  vehicles11plus: number;
};

const SS_ZIP_STATS: ZipStat[] = [
  {
    zip: "94110",
    city: "San Francisco, CA",
    ssResponses: 92,
    respPct: 21.5,
    ssRevenue: 18600,
    activeCustomers: 154,
    loyalCustomers: 48,
    vehicles0to5: 37,
    vehicles6to10: 43,
    vehicles11plus: 20,
  },
  {
    zip: "94901",
    city: "San Rafael, CA",
    ssResponses: 66,
    respPct: 19.3,
    ssRevenue: 13200,
    activeCustomers: 118,
    loyalCustomers: 36,
    vehicles0to5: 33,
    vehicles6to10: 44,
    vehicles11plus: 23,
  },
  {
    zip: "95401",
    city: "Santa Rosa, CA",
    ssResponses: 54,
    respPct: 17.1,
    ssRevenue: 10800,
    activeCustomers: 101,
    loyalCustomers: 29,
    vehicles0to5: 28,
    vehicles6to10: 40,
    vehicles11plus: 32,
  },
];

type SsTab = "overview" | "details" | "map";
type MapMetric = "resp" | "revenue";

const SuggestedServicesPage: React.FC = () => {
  const [ssTab, setSsTab] = useState<SsTab>("overview");
  const [selectedZip, setSelectedZip] = useState<ZipStat | null>(
    SS_ZIP_STATS[0]
  );
  const [mapMetric, setMapMetric] = useState<MapMetric>("resp");

  const ssResponses = useMemo(
    () => Math.round(ssSummary.emailsSent * (ssSummary.acceptanceRate / 100)),
    []
  );

  const aiInsightsProps = {
    title: "AI Insights",
    subtitle: "Based on SS jobs and touch points",
    bullets: [
      "Cabin Air Filter and Engine Air Filter have the highest RESP %, making them ideal for more educational content.",
      "Consider testing earlier SS timing in ZIPs with higher loyalty and newer vehicles.",
      "Use the Map tab to adjust offers and channels by ZIP and customer mix.",
    ],
  };

  const currentZip = selectedZip ?? SS_ZIP_STATS[0] ?? null;

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

      {/* Layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
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
              label="% inv. w/ SS item"
              value={`${ssSummary.invoicesWithSsItemPct.toFixed(1)}%`}
            />
          </div>

          {/* AI stacked on small screens */}
          <div className="block lg:hidden">
            <AIInsightsTile {...aiInsightsProps} />
          </div>

          {/* Performance by service type – tabbed card */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
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
                {(["overview", "details", "map"] as SsTab[]).map((tab) => {
                  const label =
                    tab === "overview"
                      ? "Overview"
                      : tab === "details"
                      ? "Details"
                      : "Map";
                  const isActive = ssTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setSsTab(tab)}
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

            {ssTab === "overview" && (
              <>
                <p className="mt-1 text-[10px] text-slate-400">
                  Bar length shows RESP % vs other services. Higher RESP % =
                  stronger conversion from SS messages to completed jobs.
                </p>
                <div className="mt-3 space-y-4 text-xs text-slate-700">
                  {SS_SERVICE_TYPES.map((row) => {
                    const respColor = getRespColorClass(row.respPct);
                    const maxResp = Math.max(
                      ...SS_SERVICE_TYPES.map((r) => r.respPct),
                      1
                    );
                    const width =
                      (row.respPct / maxResp) * 100 || 0;

                    return (
                      <div key={row.service}>
                        <div className="flex items-start justify-between text-[11px] gap-3">
                          <div className="font-medium text-slate-800">
                            {row.service}
                          </div>
                          <div className="text-right text-slate-600">
                            <div className="text-[11px]">
                              {row.invoices.toLocaleString()} invoices ·{" "}
                              {row.validEmailPct.toFixed(1)}% valid emails ·{" "}
                              <span className={respColor}>
                                {row.respPct.toFixed(1)}% RESP
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
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
            )}

            {ssTab === "details" && (
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500">
                      <th className="py-2 pr-3">Touch point</th>
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
                        className="border-t border-slate-100 align-top"
                      >
                        <td className="py-3 pr-3">
                          <div className="text-xs font-medium text-slate-800">
                            Suggested Services
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {tp.timing}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {tp.channel}
                          </div>
                        </td>
                        <td className="py-3 pr-3 text-right">
                          {tp.sent.toLocaleString()}
                        </td>
                        <td className="py-3 pr-3 text-right">
                          {tp.responses.toLocaleString()}
                        </td>
                        <td className="py-3 pr-3 text-right">
                          {tp.respPct.toFixed(1)}%
                        </td>
                        <td className="py-3 pr-3 text-right">
                          {tp.roas.toFixed(1)}x
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {ssTab === "map" && (
              <div className="mt-3 space-y-4">
                {/* Map metric toggle */}
                <div className="flex items-center justify-between text-[11px]">
                  <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                    <span className="font-medium text-slate-700">
                      Map: RESP % by ZIP
                    </span>
                  </div>
                  <div className="inline-flex items-center rounded-full bg-slate-100 p-1">
                    {(["resp", "revenue"] as MapMetric[]).map(
                      (metric) => {
                        const isActive = mapMetric === metric;
                        const label =
                          metric === "resp" ? "RESP %" : "SS revenue";
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
                      }
                    )}
                  </div>
                </div>

                {/* Map placeholder */}
                <div className="relative rounded-2xl border border-slate-100 bg-slate-50 h-72 md:h-80 overflow-hidden flex items-center justify-center">
                  <div className="absolute top-3 left-3 flex flex-col gap-1 text-[10px] text-slate-600 bg-white/80 rounded-xl px-3 py-2 shadow-sm">
                    <span className="font-medium text-[10px] text-slate-700">
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
                    {SS_ZIP_STATS.map((z) => {
                      const isActive =
                        currentZip && currentZip.zip === z.zip;
                      return (
                        <button
                          key={z.zip}
                          type="button"
                          onClick={() => setSelectedZip(z)}
                          className={`px-3 py-1 rounded-full border ${
                            isActive
                              ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                              : "border-slate-200 bg-white hover:border-emerald-300 hover:text-emerald-700"
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
                              SS responses
                            </div>
                            <div className="text-xs font-semibold">
                              {currentZip.ssResponses.toLocaleString()}
                            </div>
                          </div>
                          <div>
                            <div className="text-[10px] text-slate-500">
                              SS revenue
                            </div>
                            <div className="text-xs font-semibold">
                              ${currentZip.ssRevenue.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <div className="text-[10px] text-slate-500">
                            Customers
                          </div>
                          <div className="mt-1 text-xs space-y-0.5">
                            <div>
                              Active ·{" "}
                              {currentZip.activeCustomers.toLocaleString()}
                            </div>
                            <div>
                              Loyal (3+ visits / 24 mo) ·{" "}
                              {currentZip.loyalCustomers.toLocaleString()}
                            </div>
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
                            Use these ZIP-level patterns to tune SS timing and
                            offers and to propose future one-off campaigns.
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
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

export default SuggestedServicesPage;
