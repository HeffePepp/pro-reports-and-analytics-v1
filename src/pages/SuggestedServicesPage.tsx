import React, { useMemo, useState } from "react";
import {
  ShellLayout,
  MetricTile,
  AIInsightsTile,
  ZipMapPlaceholder,
  KpiCustomizeButton,
} from "@/components/layout";
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

  const ssResponses = useMemo(
    () => Math.round(ssSummary.emailsSent * (ssSummary.acceptanceRate / 100)),
    []
  );

  const { selectedIds, setSelectedIds } = useKpiPreferences("suggested-services", KPI_OPTIONS);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "ssMsgsSent":
        return (
          <MetricTile
            key={id}
            label="SS msgs sent"
            value={ssSummary.emailsSent.toLocaleString()}
          />
        );
      case "ssResponses":
        return (
          <MetricTile
            key={id}
            label="SS responses"
            value={ssResponses.toLocaleString()}
          />
        );
      case "respPct":
        return (
          <MetricTile
            key={id}
            label="Resp %"
            value={`${ssSummary.acceptanceRate.toFixed(1)}%`}
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
          />
        );
      case "validEmail":
        return (
          <MetricTile
            key={id}
            label="SS inv. valid email"
            value={`${ssSummary.validEmailOnSsInvoicesPct.toFixed(1)}%`}
          />
        );
      case "withSsItem":
        return (
          <MetricTile
            key={id}
            label="% inv. w/ SS item"
            value={`${ssSummary.invoicesWithSsItemPct.toFixed(1)}%`}
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
            Store group:{" "}
            <span className="font-medium">{ssSummary.storeGroupName}</span>
          </span>
          <span>
            Period: <span className="font-medium">{ssSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,2.2fr),minmax(0,1fr)]">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Intro / summary */}
          <section className="space-y-2">
            <h1 className="text-lg font-semibold text-slate-900">
              Suggested services performance
            </h1>
            <p className="text-sm text-slate-600">
              Track how suggested services perform across your stores, which
              services customers accept most often, and how your follow-up
              messaging drives additional RO revenue.
            </p>
          </section>

          {/* KPI grid */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[13px] font-semibold text-slate-900">
                  Key KPIs
                </h2>
                <p className="text-[11px] text-slate-500">
                  Customize which metrics you want to watch for suggested
                  services.
                </p>
              </div>
              <KpiCustomizeButton
                reportId="suggested-services"
                options={KPI_OPTIONS}
                selectedIds={selectedIds}
                onChangeSelected={setSelectedIds}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
              {selectedIds.map((id) => renderKpiTile(id))}
            </div>
          </section>

          {/* AI tile on small screens */}
          <div className="lg:hidden">
            <AIInsightsTile {...aiInsightsProps} />
          </div>

          {/* MAIN TWO-TAB TILE: Overview / Details */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <header className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[13px] font-semibold text-slate-900">
                  Suggested services performance
                </h2>
                <p className="text-[11px] text-slate-500">
                  By service type – click Details for table view.
                </p>
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
                        isActive
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-800"
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
                  const responses = Math.round(
                    row.invoices * (row.respPct / 100)
                  );
                  const respClass = getRespColorClass(row.respPct);

                  return (
                    <div
                      key={row.service}
                      className="py-3 first:pt-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          {/* Service name */}
                          <div className="truncate text-xs font-medium text-slate-900">
                            {row.service}
                          </div>

                          {/* Stats above/below for breathing room */}
                          <div className="mt-1 text-[11px] text-slate-500">
                            {row.invoices.toLocaleString()} invoices with this
                            service
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            {row.validEmailPct.toFixed(1)}% of these invoices
                            have a valid email address
                          </div>
                        </div>

                        {/* Right side: response stats */}
                        <div className="text-right">
                          <div
                            className={`text-sm font-semibold ${respClass}`}
                          >
                            {row.respPct.toFixed(1)}% RESP
                          </div>
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

            {/* DETAILS TAB – table styled like Drops tab from One-off Campaigns */}
            {ssTab === "details" && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                      <th className="py-2 pr-3 text-left font-medium">
                        Service type
                      </th>
                      <th className="py-2 pr-3 text-right font-medium">
                        Invoices
                      </th>
                      <th className="py-2 pr-3 text-right font-medium">
                        Responses
                      </th>
                      <th className="py-2 pr-3 text-right font-medium">
                        Resp %
                      </th>
                      <th className="py-2 pl-3 text-right font-medium">
                        Valid email %
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {SS_SERVICE_TYPES.map((row) => {
                      const responses = Math.round(
                        row.invoices * (row.respPct / 100)
                      );
                      const respClass = getRespColorClass(row.respPct);

                      return (
                        <tr key={row.service}>
                          <td className="py-3 pr-3 align-top">
                            <div className="text-xs font-medium text-slate-900">
                              {row.service}
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-500">
                              Suggested service follow-up
                            </div>
                          </td>
                          <td className="py-3 pr-3 text-right align-middle">
                            {row.invoices.toLocaleString()}
                          </td>
                          <td className="py-3 pr-3 text-right align-middle">
                            {responses.toLocaleString()}
                          </td>
                          <td
                            className={`py-3 pr-3 text-right align-middle ${respClass}`}
                          >
                            {row.respPct.toFixed(1)}%
                          </td>
                          <td className="py-3 pl-3 text-right align-middle">
                            {row.validEmailPct.toFixed(1)}%
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* ZIP MAP + DETAIL CARD (separate from tabs) */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <header className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[13px] font-semibold text-slate-900">
                  ZIP performance & map
                </h2>
                <p className="text-[11px] text-slate-500">
                  See where suggested services are responding best.
                </p>
              </div>
            </header>

            <div className="mt-3 space-y-4">
              <ZipMapPlaceholder />

              <div className="space-y-3">
                {/* ZIP chips */}
                <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                  {SS_ZIP_STATS.map((z) => {
                    const isActive = currentZip && currentZip.zip === z.zip;
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

                {/* ZIP detail panel */}
                {currentZip && (
                  <section className="mt-2 rounded-2xl bg-slate-50 border border-slate-200 p-4">
                    <div className="grid grid-cols-1 gap-4 text-xs text-slate-700 md:grid-cols-4 md:gap-6">
                      {/* Location */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          ZIP
                        </div>
                        <div className="text-sm font-semibold text-slate-900">
                          {currentZip.zip}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {currentZip.city}, {currentZip.state}
                        </div>
                      </div>

                      {/* Customers */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          Customers
                        </div>
                        <div className="text-sm font-semibold text-slate-900">
                          {currentZip.activeCustomers.toLocaleString()} active
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {currentZip.loyalCustomers.toLocaleString()} loyal
                          customers
                        </div>
                      </div>

                      {/* Responses */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          Suggested services results
                        </div>
                        <div
                          className={`text-sm font-semibold ${getRespColorClass(
                            currentZip.respPct
                          )}`}
                        >
                          {currentZip.respPct.toFixed(1)}% RESP
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {currentZip.responses.toLocaleString()} responses
                        </div>
                      </div>

                      {/* Vehicle age + revenue */}
                      <div className="space-y-1">
                        <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          Vehicle age & SS revenue
                        </div>
                        <div className="text-[11px] text-slate-500">
                          0–5 yrs: {currentZip.age0to5} · 6–10 yrs:{" "}
                          {currentZip.age6to10} · 11+ yrs:{" "}
                          {currentZip.age11plus}
                        </div>
                        <div className="text-sm font-semibold text-slate-900">
                          SS rev:{" "}
                          {currentZip.ssRevenue.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 text-[11px] leading-snug text-slate-600">
                      Use ZIP-level patterns here to tune timing, channel mix
                      and future one-off or automated suggested service
                      campaigns.
                    </div>
                  </section>
                )}
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN – AI tile on larger screens */}
        <div className="hidden lg:block">
          <AIInsightsTile {...aiInsightsProps} />
        </div>
      </div>
    </ShellLayout>
  );
};

export default SuggestedServicesPage;
