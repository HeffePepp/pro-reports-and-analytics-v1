import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile, ZipMapPlaceholder, KpiCustomizeButton } from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";

type SuggestedServicesSummary = {
  storeGroupName: string;
  periodLabel: string;
  emailsSent: number;
  ssRevenue: number;
  totalInvoiceRevenue: number;
  acceptanceRate: number;
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

// ✅ Updated to your full 25-service list
const SS_SERVICE_TYPES: SuggestedServiceTypeRow[] = [
  { service: "PCV VALVE", invoices: 2200, validEmailPct: 75, respPct: 15.0 },
  { service: "PWR STEERING FLUSH", invoices: 2160, validEmailPct: 78, respPct: 16.2 },
  { service: "REAR BRAKE SERVICE", invoices: 2120, validEmailPct: 81, respPct: 17.4 },
  { service: "REAR DIFF SERVICE", invoices: 2080, validEmailPct: 84, respPct: 18.6 },
  { service: "RADIATOR SERVICE", invoices: 2040, validEmailPct: 87, respPct: 19.8 },
  { service: "SERPENTINE BELT SVC.", invoices: 2000, validEmailPct: 75, respPct: 21.0 },
  { service: "SHOCK/STRUTS", invoices: 1960, validEmailPct: 78, respPct: 22.2 },
  { service: "TRANSFER CASE SERV", invoices: 1920, validEmailPct: 81, respPct: 23.4 },
  { service: "TIRE ROTATION", invoices: 1880, validEmailPct: 84, respPct: 24.6 },
  { service: "TRANSMISSION SERVICE", invoices: 1840, validEmailPct: 87, respPct: 25.8 },
  { service: "TUNE-UP", invoices: 1800, validEmailPct: 75, respPct: 15.0 },
  { service: "WIPER BLADES", invoices: 1760, validEmailPct: 78, respPct: 16.2 },
  { service: "AIR FILTER", invoices: 1720, validEmailPct: 81, respPct: 17.4 },
  { service: "BREATHER FILTER", invoices: 1680, validEmailPct: 84, respPct: 18.6 },
  { service: "BRAKE SERVICE", invoices: 1640, validEmailPct: 87, respPct: 19.8 },
  { service: "BATTERY SERVICE", invoices: 1600, validEmailPct: 75, respPct: 21.0 },
  { service: "CABIN AIR FILTER", invoices: 1560, validEmailPct: 78, respPct: 22.2 },
  { service: "ENGINE FLUSH", invoices: 1520, validEmailPct: 81, respPct: 23.4 },
  { service: "EXHAUST WORK", invoices: 1480, validEmailPct: 84, respPct: 24.6 },
  { service: "FRONT BRAKE SERVICE", invoices: 1440, validEmailPct: 87, respPct: 25.8 },
  { service: "FRONT DIFF SERVICE", invoices: 1400, validEmailPct: 75, respPct: 15.0 },
  { service: "FUEL FILTER", invoices: 1360, validEmailPct: 78, respPct: 16.2 },
  { service: "FUEL INJ. SERVICE", invoices: 1320, validEmailPct: 81, respPct: 17.4 },
  { service: "HOSES", invoices: 1280, validEmailPct: 84, respPct: 18.6 },
  { service: "LIGHT BULB", invoices: 1240, validEmailPct: 87, respPct: 19.8 },
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
  { timing: "1 week after Service", channel: "Email", sent: 1850, responses: 420, respPct: 22.7, roas: 9.5 },
  { timing: "1 month after Service", channel: "Email", sent: 1760, responses: 310, respPct: 17.6, roas: 12.1 },
  { timing: "3 months after Service", channel: "Email", sent: 1640, responses: 240, respPct: 14.6, roas: 11.2 },
  { timing: "6 months after Service", channel: "Email", sent: 1380, responses: 280, respPct: 20.3, roas: 16.4 },
];

const getRespColorClass = (rate: number): string => {
  if (rate >= 15) return "text-emerald-600";
  if (rate >= 10) return "text-orange-500";
  if (rate >= 5) return "text-amber-500";
  return "text-rose-600";
};

type ZipStat = {
  zip: string;
  city: string;
  state: string;
  responses: number;
  respPct: number;
  ssRevenue: number;
  activeCustomers: number;
  loyalCustomers: number;
  age0to5: number;
  age6to10: number;
  age11plus: number;
};

const SS_ZIP_STATS: ZipStat[] = [
  {
    zip: "94110",
    city: "San Francisco",
    state: "CA",
    responses: 92,
    respPct: 21.5,
    ssRevenue: 18600,
    activeCustomers: 154,
    loyalCustomers: 48,
    age0to5: 37,
    age6to10: 43,
    age11plus: 20,
  },
  {
    zip: "94901",
    city: "San Rafael",
    state: "CA",
    responses: 66,
    respPct: 19.3,
    ssRevenue: 13200,
    activeCustomers: 118,
    loyalCustomers: 36,
    age0to5: 33,
    age6to10: 44,
    age11plus: 23,
  },
  {
    zip: "95401",
    city: "Santa Rosa",
    state: "CA",
    responses: 54,
    respPct: 17.1,
    ssRevenue: 10800,
    activeCustomers: 101,
    loyalCustomers: 29,
    age0to5: 28,
    age6to10: 40,
    age11plus: 32,
  },
];

type SsTab = "overview" | "details";

const KPI_OPTIONS: KpiOption[] = [
  { id: "ssMsgsSent", label: "SS msgs sent" },
  { id: "ssResponses", label: "SS responses" },
  { id: "respPct", label: "Resp %" },
  { id: "ssRevenue", label: "SS revenue" },
  { id: "totalInvRev", label: "Total inv. rev." },
  { id: "validEmail", label: "SS inv. valid email" },
  { id: "withSsItem", label: "% inv. w/ SS item" },
];

const SuggestedServicesPage: React.FC = () => {
  const [ssTab, setSsTab] = useState<SsTab>("overview");
  const [selectedZip, setSelectedZip] = useState<ZipStat | null>(SS_ZIP_STATS[0]);

  const ssResponses = useMemo(() => Math.round(ssSummary.emailsSent * (ssSummary.acceptanceRate / 100)), []);

  const { selectedIds, setSelectedIds } = useKpiPreferences("suggested-services", KPI_OPTIONS);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "ssMsgsSent":
        return (
          <MetricTile
            key={id}
            label="SS msgs sent"
            value={ssSummary.emailsSent.toLocaleString()}
            helpText="Number of suggested-service follow-up messages sent during the selected period."
          />
        );
      case "ssResponses":
        return (
          <MetricTile
            key={id}
            label="SS responses"
            value={ssResponses.toLocaleString()}
            helpText="Number of customers who responded to a suggested-service message by clicking, calling, or booking."
          />
        );
      case "respPct":
        return (
          <MetricTile
            key={id}
            label="Resp %"
            value={`${ssSummary.acceptanceRate.toFixed(1)}%`}
            helpText="Response rate for suggested-service messages: responses divided by messages sent."
          />
        );
      case "ssRevenue":
        return (
          <MetricTile
            key={id}
            label="SS revenue"
            value={ssSummary.ssRevenue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
            helpText="Total repair-order revenue tied to accepted suggested services during the selected period."
          />
        );
      case "totalInvRev":
        return (
          <MetricTile
            key={id}
            label="Total inv. rev."
            value={ssSummary.totalInvoiceRevenue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
            helpText="Total repair-order revenue for all invoices in the selected period, whether or not they included suggested services."
          />
        );
      case "validEmail":
        return (
          <MetricTile
            key={id}
            label="SS inv. valid email"
            value={`${ssSummary.validEmailOnSsInvoicesPct.toFixed(1)}%`}
            helpText="Percent of invoices with suggested services where the customer record has a valid email address on file."
          />
        );
      case "withSsItem":
        return (
          <MetricTile
            key={id}
            label="% inv. w/ SS item"
            value={`${ssSummary.invoicesWithSsItemPct.toFixed(1)}%`}
            helpText="Percent of all invoices that include at least one suggested-service line item."
          />
        );
      default:
        return null;
    }
  };

  const aiInsightsProps = {
    title: "AI insights: Suggested services",
    timeframeLabel: ssSummary.periodLabel,
    bullets: [
      `Suggested services messages generated ${ssSummary.ssRevenue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })} in revenue at a ${ssSummary.acceptanceRate.toFixed(1)}% response rate.`,
      "Focus on service types with higher RESP% and strong email coverage to lift total RO value.",
      "Use the ZIP-level map below to adjust offers and channels by ZIP and customer mix.",
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
            Store group: <span className="font-medium">{ssSummary.storeGroupName}</span>
          </span>
          <span>
            Period: <span className="font-medium">{ssSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Suggested Services</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track how Suggested Services communications drive completed jobs and revenue by service type and touch
            point.
          </p>
        </div>
        <KpiCustomizeButton
          reportId="suggested-services"
          options={KPI_OPTIONS}
          selectedIds={selectedIds}
          onChangeSelected={setSelectedIds}
        />
      </div>

      {/* Layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPI tiles - only rendered when selected */}
          {selectedIds.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{selectedIds.map((id) => renderKpiTile(id))}</div>
          )}

          {/* MAIN TWO-TAB TILE: Overview / Details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <header className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[13px] font-semibold text-slate-900">Active Suggested Services</h2>
              </div>

              {/* Two-tab pill, like One-off Campaigns, but just Overview / Details */}
              <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1 text-[11px]">
                {(["overview", "details"] as SsTab[]).map((tab) => {
                  const isActive = ssTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setSsTab(tab)}
                      className={`rounded-full px-3 py-1 transition ${
                        isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      {tab === "overview" ? "Overview" : "Details"}
                    </button>
                  );
                })}
              </div>
            </header>

            {/* OVERVIEW TAB – list styling like campaign overview, NO colored bar */}
            {ssTab === "overview" && (
              <div className="mt-4 divide-y divide-slate-100">
                {SS_SERVICE_TYPES.map((row) => {
                  const responses = Math.round(row.invoices * (row.respPct / 100));
                  const respClass = getRespColorClass(row.respPct);

                  return (
                    <div key={row.service} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          {/* Service name */}
                          <div className="truncate text-xs font-medium text-slate-900">{row.service}</div>

                          {/* Stats above/below for breathing room */}
                          <div className="mt-1 text-[11px] text-slate-500">
                            {row.invoices.toLocaleString()} invoices with this service
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            {row.validEmailPct.toFixed(1)}% of these invoices have a valid email address
                          </div>
                        </div>

                        {/* Right side: response stats */}
                        <div className="text-right">
                          <div className={`text-sm font-semibold ${respClass}`}>{row.respPct.toFixed(1)}% RESP</div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            {responses.toLocaleString()} responses
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* DETAILS TAB – touch point timing table */}
            {ssTab === "details" && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full table-fixed text-[11px]">
                  {/* Column widths so right side stays tight + grouped */}
                  <colgroup>
                    <col className="w-[46%]" />  {/* Touch point */}
                    <col className="w-[9%]" />   {/* Sent */}
                    <col className="w-[11%]" />  {/* Responses */}
                    <col className="w-[9%]" />   {/* Resp % */}
                    <col className="w-[10%]" />  {/* ROAS */}
                    <col className="w-[15%]" />  {/* Revenue */}
                  </colgroup>

                  <thead className="border-b border-slate-100 text-slate-500 uppercase tracking-wide">
                    <tr>
                      <th className="py-2 pr-4 text-left font-medium">Touch point</th>
                      <th className="py-2 pl-4 text-right font-medium">Sent</th>
                      <th className="py-2 pl-4 text-right font-medium">Responses</th>
                      <th className="py-2 pl-4 text-right font-medium">Resp %</th>
                      <th className="py-2 pl-4 text-right font-medium">ROAS</th>
                      <th className="py-2 pl-4 text-right font-medium">Revenue</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {SS_TOUCHPOINTS.map((tp) => {
                      const revenue = Math.round(tp.responses * tp.roas * 50); // mock revenue calculation
                      return (
                        <tr key={tp.timing}>
                          {/* LEFT: touch point info */}
                          <td className="py-3 pr-4 align-top">
                            <div className="text-[16px] font-semibold text-slate-900">Suggested Services</div>
                            <div className="mt-0.5 text-[11px] text-slate-500">{tp.timing}</div>
                            <div className="text-[11px] text-slate-500">{tp.channel}</div>
                          </td>

                          {/* RIGHT: tight stat block */}
                          <td className="py-3 pl-4 text-right align-middle text-slate-900">
                            {tp.sent.toLocaleString()}
                          </td>
                          <td className="py-3 pl-4 text-right align-middle text-slate-900">
                            {tp.responses.toLocaleString()}
                          </td>
                          <td className="py-3 pl-4 text-right align-middle">
                            <span className="font-semibold text-emerald-600">{tp.respPct.toFixed(1)}%</span>
                          </td>
                          <td className="py-3 pl-4 text-right align-middle text-slate-900">
                            {tp.roas.toFixed(1)}x
                          </td>
                          <td className="py-3 pl-4 text-right align-middle text-slate-900">
                            {revenue.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* AI stacked on small screens - after main content */}
          <div className="block lg:hidden">
            <AIInsightsTile {...aiInsightsProps} />
          </div>
        </div>

        {/* RIGHT: AI on large screens */}
        <div className="hidden lg:block lg:col-span-1 self-start">
          <AIInsightsTile {...aiInsightsProps} />
        </div>
      </div>
    </ShellLayout>
  );
};

export default SuggestedServicesPage;
