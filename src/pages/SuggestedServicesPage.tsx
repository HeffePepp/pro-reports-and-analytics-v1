import React, { useMemo, useState } from "react";
import {
  ShellLayout,
  MetricTile,
  AIInsightsTile,
  ZipMapPlaceholder,
  useKpiPreferences,
  KpiCustomizeButton,
  KpiPreferencesModal,
} from "@/components/layout";

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

const SS_SERVICE_TYPES: SuggestedServiceTypeRow[] = [
  { service: "Cabin Air Filter", invoices: 1765, validEmailPct: 82.3, respPct: 24.6 },
  { service: "Engine Air Filter", invoices: 1890, validEmailPct: 79.4, respPct: 23.3 },
  { service: "Fuel System Cleaning", invoices: 960, validEmailPct: 76.8, respPct: 17.5 },
  { service: "Wiper Blades", invoices: 1420, validEmailPct: 84.1, respPct: 19.6 },
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
  { zip: "94110", city: "San Francisco", state: "CA", responses: 92, respPct: 21.5, ssRevenue: 18600, activeCustomers: 154, loyalCustomers: 48, age0to5: 37, age6to10: 43, age11plus: 20 },
  { zip: "94901", city: "San Rafael", state: "CA", responses: 66, respPct: 19.3, ssRevenue: 13200, activeCustomers: 118, loyalCustomers: 36, age0to5: 33, age6to10: 44, age11plus: 23 },
  { zip: "95401", city: "Santa Rosa", state: "CA", responses: 54, respPct: 17.1, ssRevenue: 10800, activeCustomers: 101, loyalCustomers: 29, age0to5: 28, age6to10: 40, age11plus: 32 },
];

type SsTab = "overview" | "details" | "map";
type MapMetric = "resp" | "revenue";

const kpiDefs = [
  { id: "ssMsgsSent", label: "SS msgs sent" },
  { id: "ssResponses", label: "SS responses" },
  { id: "respPct", label: "Resp %" },
  { id: "ssRevenue", label: "SS revenue" },
  { id: "totalInvRev", label: "Total inv. rev." },
  { id: "validEmail", label: "SS inv. valid email" },
  { id: "withSsItem", label: "% inv. w/ SS item" },
] as const;

const SuggestedServicesPage: React.FC = () => {
  const [ssTab, setSsTab] = useState<SsTab>("overview");
  const [selectedZip, setSelectedZip] = useState<ZipStat | null>(SS_ZIP_STATS[0]);
  const [mapMetric, setMapMetric] = useState<MapMetric>("resp");
  const [kpiModalOpen, setKpiModalOpen] = useState(false);

  const ssResponses = useMemo(
    () => Math.round(ssSummary.emailsSent * (ssSummary.acceptanceRate / 100)),
    []
  );

  const { visibleKpis, visibleIds, toggleKpi, resetKpis } = useKpiPreferences(
    "suggested-services",
    kpiDefs as unknown as { id: string; label: string }[]
  );

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "ssMsgsSent":
        return <MetricTile key={id} label="SS msgs sent" value={ssSummary.emailsSent.toLocaleString()} />;
      case "ssResponses":
        return <MetricTile key={id} label="SS responses" value={ssResponses.toLocaleString()} />;
      case "respPct":
        return <MetricTile key={id} label="Resp %" value={`${ssSummary.acceptanceRate.toFixed(1)}%`} />;
      case "ssRevenue":
        return <MetricTile key={id} label="SS revenue" value={`$${ssSummary.ssRevenue.toLocaleString()}`} />;
      case "totalInvRev":
        return <MetricTile key={id} label="Total inv. rev." value={`$${ssSummary.totalInvoiceRevenue.toLocaleString()}`} />;
      case "validEmail":
        return <MetricTile key={id} label="SS inv. valid email" value={`${ssSummary.validEmailOnSsInvoicesPct.toFixed(1)}%`} />;
      case "withSsItem":
        return <MetricTile key={id} label="% inv. w/ SS item" value={`${ssSummary.invoicesWithSsItemPct.toFixed(1)}%`} />;
      default:
        return null;
    }
  };

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
          <span>Store group: <span className="font-medium">{ssSummary.storeGroupName}</span></span>
          <span>Period: <span className="font-medium">{ssSummary.periodLabel}</span></span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Suggested Services</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track how Suggested Services communications drive completed jobs and revenue by service type and touch point.
          </p>
        </div>
        <KpiCustomizeButton onClick={() => setKpiModalOpen(true)} />
      </div>

      {/* Layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPI tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {visibleKpis.map((kpi) => renderKpiTile(kpi.id))}
          </div>

          {/* AI stacked on small screens */}
          <div className="block lg:hidden">
            <AIInsightsTile {...aiInsightsProps} />
          </div>

          {/* Performance by service type – tabbed card */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Performance by service type</h2>
                <p className="text-[11px] text-slate-600">Suggested Services: invoices, valid emails and RESP %</p>
              </div>
              <div className="inline-flex items-center rounded-full bg-slate-100 p-1 text-[11px]">
                {(["overview", "details", "map"] as SsTab[]).map((tab) => {
                  const label = tab === "overview" ? "Overview" : tab === "details" ? "Details" : "Map";
                  const isActive = ssTab === tab;
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setSsTab(tab)}
                      className={`px-3 py-1 rounded-full ${isActive ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
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
                  Bar length shows RESP % vs other services. Higher RESP % = stronger conversion from SS messages to completed jobs.
                </p>
                <div className="mt-3 space-y-4 text-xs text-slate-700">
                  {SS_SERVICE_TYPES.map((row) => {
                    const respColor = getRespColorClass(row.respPct);
                    const maxResp = Math.max(...SS_SERVICE_TYPES.map((r) => r.respPct), 1);
                    const width = (row.respPct / maxResp) * 100 || 0;
                    return (
                      <div key={row.service}>
                        <div className="flex items-start justify-between text-[11px] gap-3">
                          <div className="font-medium text-slate-800">{row.service}</div>
                          <div className="text-right text-slate-600">
                            <div className="text-[11px]">
                              {row.invoices.toLocaleString()} invoices · {row.validEmailPct.toFixed(1)}% valid emails ·{" "}
                              <span className={respColor}>{row.respPct.toFixed(1)}% RESP</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                            <div className="h-full bg-emerald-500" style={{ width: `${width}%` }} />
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
                      <tr key={tp.timing} className="border-t border-slate-100 align-top">
                        <td className="py-3 pr-3">
                          <div className="text-xs font-medium text-slate-800">Suggested Services</div>
                          <div className="text-[11px] text-slate-500">{tp.timing}</div>
                          <div className="text-[11px] text-slate-500">{tp.channel}</div>
                        </td>
                        <td className="py-3 pr-3 text-right">{tp.sent.toLocaleString()}</td>
                        <td className="py-3 pr-3 text-right">{tp.responses.toLocaleString()}</td>
                        <td className="py-3 pr-3 text-right">{tp.respPct.toFixed(1)}%</td>
                        <td className="py-3 pr-3 text-right">{tp.roas.toFixed(1)}x</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {ssTab === "map" && (
              <div className="mt-3 space-y-4">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1">
                    <span className="font-medium text-slate-700">Map: RESP % by ZIP</span>
                  </div>
                  <div className="inline-flex items-center rounded-full bg-slate-100 p-1">
                    {(["resp", "revenue"] as MapMetric[]).map((metric) => {
                      const isActive = mapMetric === metric;
                      const label = metric === "resp" ? "RESP %" : "SS revenue";
                      return (
                        <button
                          key={metric}
                          type="button"
                          onClick={() => setMapMetric(metric)}
                          className={`px-3 py-1 rounded-full text-[11px] ${isActive ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
                        >
                          {label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <ZipMapPlaceholder />

                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2 text-[11px] text-slate-600">
                    {SS_ZIP_STATS.map((z) => {
                      const isActive = currentZip && currentZip.zip === z.zip;
                      return (
                        <button
                          key={z.zip}
                          type="button"
                          onClick={() => setSelectedZip(z)}
                          className={`px-3 py-1 rounded-full border ${isActive ? "border-emerald-400 bg-emerald-50 text-emerald-700" : "border-slate-200 bg-white hover:border-emerald-300 hover:text-emerald-700"}`}
                        >
                          {z.zip}
                        </button>
                      );
                    })}
                  </div>

                  {currentZip && (
                    <section className="mt-3 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-8 text-xs text-slate-700">
                        <div className="space-y-2">
                          <div>
                            <div className="text-[11px] font-semibold text-slate-900">ZIP {currentZip.zip}</div>
                            <div className="text-[11px] text-slate-500">{currentZip.city}, {currentZip.state}</div>
                          </div>
                          <div>
                            <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Customers</div>
                            <div className="mt-0.5">Active · {currentZip.activeCustomers.toLocaleString()}</div>
                            <div>Loyal (3+ visits / 24 mo) · {currentZip.loyalCustomers.toLocaleString()}</div>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Vehicle age mix</div>
                          <div className="space-y-0.5">
                            <div>0–5 yrs · {currentZip.age0to5}%</div>
                            <div>6–10 yrs · {currentZip.age6to10}%</div>
                            <div>11+ yrs · {currentZip.age11plus}%</div>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">RESP % & SS metrics</div>
                          <div className="mt-0.5 text-[13px] font-semibold text-emerald-600">{currentZip.respPct.toFixed(1)}% RESP</div>
                          <div className="text-xs">
                            <span className="text-slate-500">SS responses · </span>
                            <span className="font-medium text-slate-800">{currentZip.responses.toLocaleString()}</span>
                          </div>
                          <div className="text-xs">
                            <span className="text-slate-500">SS revenue · </span>
                            <span className="font-medium text-slate-800">${currentZip.ssRevenue.toLocaleString()}</span>
                          </div>
                        </div>
                        <div className="space-y-1">
                          <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wide">Notes</div>
                          <p className="text-[11px] leading-snug text-slate-600">
                            Use these ZIP-level patterns here to tune timing, channel mix and future one-off campaigns.
                          </p>
                        </div>
                      </div>
                    </section>
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

      <KpiPreferencesModal
        open={kpiModalOpen}
        onClose={() => setKpiModalOpen(false)}
        reportName="Suggested Services"
        kpis={kpiDefs as unknown as { id: string; label: string }[]}
        visibleIds={visibleIds}
        onToggle={toggleKpi}
        onReset={resetKpis}
      />
    </ShellLayout>
  );
};

export default SuggestedServicesPage;
