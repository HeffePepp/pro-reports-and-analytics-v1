import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile, KpiCustomizeButton } from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";

type SuggestedServicesSummary = {
  storeGroupName: string;
  periodLabel: string;
  invoices: number;
  suggestedServices: number;
  emailsSent: number;
  emailsOpened: number;
  responses: number;
  ssRevenue: number;
  totalRevenue: number;
  invoicesWithSsPct: number;
};

const ssSummary: SuggestedServicesSummary = {
  storeGroupName: "All Stores",
  periodLabel: "Last 12 months",
  invoices: 21500,
  suggestedServices: 8420,
  emailsSent: 18200,
  emailsOpened: 12740,
  responses: 4331,
  ssRevenue: 186400,
  totalRevenue: 742000,
  invoicesWithSsPct: 34.5,
};

type SuggestedServiceTypeRow = {
  service: string;
  invoices: number;
  validEmailPct: number;
  respPct: number;
};

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
  opened: number;
  responses: number;
  respPct: number;
  roas: number;
};

const SS_TOUCHPOINTS: SuggestedServicesTouchPoint[] = [
  { timing: "1 week after Service", channel: "Email", sent: 1850, opened: 1295, responses: 420, respPct: 22.7, roas: 9.5 },
  { timing: "1 month after Service", channel: "Email", sent: 1760, opened: 1232, responses: 310, respPct: 17.6, roas: 12.1 },
  { timing: "3 months after Service", channel: "Email", sent: 1640, opened: 1148, responses: 240, respPct: 14.6, roas: 11.2 },
  { timing: "6 months after Service", channel: "Email", sent: 1380, opened: 966, responses: 280, respPct: 20.3, roas: 16.4 },
];

const getRespColorClass = (rate: number): string => {
  if (rate >= 15) return "text-emerald-600";
  if (rate >= 10) return "text-orange-500";
  if (rate >= 5) return "text-amber-500";
  return "text-rose-600";
};

type SsTab = "touchpoints" | "activess";

const KPI_OPTIONS: KpiOption[] = [
  { id: "invoices", label: "Invoices" },
  { id: "suggestedServices", label: "Suggested Services" },
  { id: "emailsSent", label: "Emails Sent" },
  { id: "emailsOpened", label: "Emails Opened" },
  { id: "responses", label: "Responses" },
  { id: "ssRevenue", label: "SS Revenue" },
  { id: "totalRevenue", label: "Total Revenue" },
  { id: "invoicesWithSs", label: "% Invoices with a SS" },
];

const SuggestedServicesPage: React.FC = () => {
  const [ssTab, setSsTab] = useState<SsTab>("touchpoints");

  const { selectedIds, setSelectedIds } = useKpiPreferences("suggested-services", KPI_OPTIONS);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "invoices":
        return (
          <MetricTile
            key={id}
            label="Invoices"
            value={ssSummary.invoices.toLocaleString()}
            helpText="Total number of invoices during the selected period."
          />
        );
      case "suggestedServices":
        return (
          <MetricTile
            key={id}
            label="Suggested Services"
            value={ssSummary.suggestedServices.toLocaleString()}
            helpText="Total number of suggested service items recorded across all invoices."
          />
        );
      case "emailsSent":
        return (
          <MetricTile
            key={id}
            label="Emails Sent"
            value={ssSummary.emailsSent.toLocaleString()}
            helpText="Number of suggested-service follow-up emails sent during the selected period."
          />
        );
      case "emailsOpened":
        return (
          <MetricTile
            key={id}
            label="Emails Opened"
            value={ssSummary.emailsOpened.toLocaleString()}
            helpText="Number of suggested-service emails that were opened by customers."
          />
        );
      case "responses":
        return (
          <MetricTile
            key={id}
            label="Responses"
            value={ssSummary.responses.toLocaleString()}
            helpText="Number of customers who responded to a suggested-service message by clicking, calling, or booking."
          />
        );
      case "ssRevenue":
        return (
          <MetricTile
            key={id}
            label="SS Revenue"
            value={ssSummary.ssRevenue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
            helpText="Total revenue tied to accepted suggested services during the selected period."
          />
        );
      case "totalRevenue":
        return (
          <MetricTile
            key={id}
            label="Total Revenue"
            value={ssSummary.totalRevenue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
            helpText="Total invoice revenue for all invoices in the selected period."
          />
        );
      case "invoicesWithSs":
        return (
          <MetricTile
            key={id}
            label="% Invoices with a SS"
            value={`${ssSummary.invoicesWithSsPct.toFixed(1)}%`}
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
      `Suggested services emails generated ${ssSummary.ssRevenue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })} in revenue with ${ssSummary.responses.toLocaleString()} responses.`,
      "Focus on service types with higher RESP% and strong email coverage to lift total RO value.",
      "The 1-week touch point has the highest response rate — consider adding a second reminder at 2 weeks.",
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

          {/* MAIN TWO-TAB TILE: Touch Points / Active SS Items */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <header className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[13px] font-semibold text-slate-900">Suggested Services Performance</h2>
              </div>

              {/* Two-tab pill */}
              <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1 text-[11px]">
                {(["touchpoints", "activess"] as SsTab[]).map((tab) => {
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
                      {tab === "touchpoints" ? "Touch Points" : "Active SS Items"}
                    </button>
                  );
                })}
              </div>
            </header>

            {/* TOUCH POINTS TAB (default) – touch point timing table */}
            {ssTab === "touchpoints" && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full table-fixed text-[11px]">
                  <colgroup>
                    <col className="w-[40%]" />
                    <col className="w-[10%]" />
                    <col className="w-[10%]" />
                    <col className="w-[10%]" />
                    <col className="w-[10%]" />
                    <col className="w-[10%]" />
                    <col className="w-[10%]" />
                  </colgroup>

                  <thead className="border-b border-slate-100 text-slate-500 tracking-wide">
                    <tr>
                      <th className="py-2 pr-4 text-left font-medium">Touch point</th>
                      <th className="py-2 pl-4 text-right font-medium">Sent</th>
                      <th className="py-2 pl-4 text-right font-medium">Opened</th>
                      <th className="py-2 pl-4 text-right font-medium">Responses</th>
                      <th className="py-2 pl-4 text-right font-medium">Resp %</th>
                      <th className="py-2 pl-4 text-right font-medium">ROAS</th>
                      <th className="py-2 pl-4 text-right font-medium">Revenue</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {SS_TOUCHPOINTS.map((tp) => {
                      const revenue = Math.round(tp.responses * tp.roas * 50);
                      return (
                        <tr key={tp.timing}>
                          <td className="py-3 pr-4 align-top">
                            <div className="text-[14px] font-semibold text-slate-900">Suggested Services</div>
                            <div className="mt-0.5 text-[11px] text-slate-500">{tp.timing}</div>
                            <span className="mt-1 inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                              Email
                            </span>
                          </td>

                          <td className="py-3 pl-4 text-right align-middle text-slate-900">
                            {tp.sent.toLocaleString()}
                          </td>
                          <td className="py-3 pl-4 text-right align-middle text-slate-900">
                            {tp.opened.toLocaleString()}
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

            {/* ACTIVE SS ITEMS TAB – list styling like campaign overview */}
            {ssTab === "activess" && (
              <div className="mt-4 divide-y divide-slate-100">
                {SS_SERVICE_TYPES.map((row) => {
                  const responses = Math.round(row.invoices * (row.respPct / 100));
                  const respClass = getRespColorClass(row.respPct);

                  return (
                    <div key={row.service} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-xs font-medium text-slate-900">{row.service}</div>
                          <div className="mt-1 text-[11px] text-slate-500">
                            {row.invoices.toLocaleString()} invoices with this service
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            {row.validEmailPct.toFixed(1)}% of these invoices have a valid email address
                          </div>
                        </div>

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
          </section>

          {/* AI stacked on small screens */}
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
