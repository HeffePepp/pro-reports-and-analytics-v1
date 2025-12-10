import React, { useMemo, useState } from "react";
import {
  ShellLayout,
  MetricTile,
  AIInsightsTile,
  KpiCustomizeButton,
} from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";

/* ------------------------------------------------------------------ */
/* Types & dummy data                                                  */
/* ------------------------------------------------------------------ */

type CaptureSummary = {
  totalCustomers: number;
  multiChannelPct: number;
  blankPct: number;
  multiTicket: number;
  blankTicket: number;
  ticketLift: number;
};

type CaptureGroupSegment = {
  id: string;
  label: string;
  percentage: number;
  colorClass: string;
};

type TicketGroupRow = {
  id: string;
  label: string;
  ticket: number;
};

type StoreRow = {
  store: string;
  customers: number;
  mailOnlyPct: number;
  emailOnlyPct: number;
  mailAndEmailPct: number;
  blankPct: number;
  multiChannelPct: number;
  ticketMulti: number;
  ticketBlank: number;
};

const CAPTURE_SUMMARY: CaptureSummary = {
  totalCustomers: 5030,
  multiChannelPct: 49,
  blankPct: 11,
  multiTicket: 98,
  blankTicket: 42,
  ticketLift: 56,
};

const CAPTURE_SEGMENTS: CaptureGroupSegment[] = [
  { id: "mail-only", label: "Mail only", percentage: 23, colorClass: "bg-sky-200" },
  { id: "email-only", label: "Email only", percentage: 17, colorClass: "bg-emerald-200" },
  { id: "mail-email", label: "Mail & email", percentage: 49, colorClass: "bg-indigo-300" },
  { id: "blank", label: "Blank", percentage: 11, colorClass: "bg-rose-200" },
];

const TICKET_GROUPS: TicketGroupRow[] = [
  { id: "mail-only", label: "Mail only", ticket: 88 },
  { id: "email-only", label: "Email only", ticket: 90 },
  { id: "mail-email", label: "Mail & email", ticket: 98 },
  { id: "blank", label: "Blank", ticket: 42 },
];

const STORES: StoreRow[] = [
  {
    store: "Vallejo, CA",
    customers: 1850,
    mailOnlyPct: 17,
    emailOnlyPct: 12,
    mailAndEmailPct: 58,
    blankPct: 13,
    multiChannelPct: 58,
    ticketMulti: 99,
    ticketBlank: 41,
  },
  {
    store: "Napa, CA",
    customers: 1420,
    mailOnlyPct: 21,
    emailOnlyPct: 19,
    mailAndEmailPct: 46,
    blankPct: 14,
    multiChannelPct: 46,
    ticketMulti: 94,
    ticketBlank: 43,
  },
  {
    store: "Fairfield, CA",
    customers: 1310,
    mailOnlyPct: 13,
    emailOnlyPct: 11,
    mailAndEmailPct: 63,
    blankPct: 13,
    multiChannelPct: 63,
    ticketMulti: 101,
    ticketBlank: 40,
  },
];

/* ------------------------------------------------------------------ */
/* KPI customization                                                   */
/* ------------------------------------------------------------------ */

const KPI_OPTIONS: KpiOption[] = [
  { id: "multiChannel", label: "Multi-channel customers" },
  { id: "blank", label: "Blank (no contact)" },
  { id: "multiTicket", label: "Avg ticket – multi-channel" },
  { id: "blankTicket", label: "Avg ticket – blank" },
  { id: "ticketLift", label: "Ticket lift" },
  { id: "totalCustomers", label: "Total customers" },
];

const DataCaptureLtvPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Multi-channel customers (mail + email) generate the highest ticket averages.",
    "Blank customers have the lowest ticket average; improving capture here is the biggest lift.",
    "Stores with higher multi-channel mix consistently outperform on revenue per visit.",
  ]);

  const { selectedIds, setSelectedIds } = useKpiPreferences(
    "data-capture-ltv",
    KPI_OPTIONS
  );

  const maxTicket = useMemo(
    () => Math.max(...TICKET_GROUPS.map((g) => g.ticket), 1),
    []
  );

  const regenerateInsights = () => {
    setInsights([
      "Multi-channel customers are delivering the strongest ticket lift vs. blank.",
      "Focus capture campaigns on segments and stores with the highest blank %.",
      "Use the customers-by-capture-group chart to monitor progress as capture improves.",
    ]);
  };

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "multiChannel":
        return (
          <MetricTile
            key={id}
            label="Multi-channel customers"
            value={`${CAPTURE_SUMMARY.multiChannelPct.toFixed(0)}%`}
            helper="Mail + email on file"
          />
        );
      case "blank":
        return (
          <MetricTile
            key={id}
            label="Blank (no contact)"
            value={`${CAPTURE_SUMMARY.blankPct.toFixed(0)}%`}
            helper="No mail or email"
          />
        );
      case "multiTicket":
        return (
          <MetricTile
            key={id}
            label="Avg ticket – multi-channel"
            value={`$${CAPTURE_SUMMARY.multiTicket.toFixed(0)}`}
            helper="Mail + email customers"
          />
        );
      case "blankTicket":
        return (
          <MetricTile
            key={id}
            label="Avg ticket – blank"
            value={`$${CAPTURE_SUMMARY.blankTicket.toFixed(0)}`}
            helper="No mail or email"
          />
        );
      case "ticketLift":
        return (
          <MetricTile
            key={id}
            label="Ticket lift"
            value={`+$${CAPTURE_SUMMARY.ticketLift.toFixed(0)}`}
            helper="Multi-channel vs blank"
          />
        );
      case "totalCustomers":
        return (
          <MetricTile
            key={id}
            label="Total customers"
            value={CAPTURE_SUMMARY.totalCustomers.toLocaleString()}
          />
        );
      default:
        return null;
    }
  };

  /* ------------------------------------------------------------------ */
  /* Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Data Capture + Lifetime Value" },
      ]}
      rightInfo={
        <span>
          Customers:{" "}
          <span className="font-medium">
            {CAPTURE_SUMMARY.totalCustomers.toLocaleString()}
          </span>
        </span>
      }
    >
      {/* Header with title + KPI customize pill */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Data Capture + Lifetime Value
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            See how mail/email capture translates into customer value and ticket
            averages across your store network.
          </p>
        </div>
        <KpiCustomizeButton
          reportId="data-capture-ltv"
          options={KPI_OPTIONS}
          selectedIds={selectedIds}
          onChangeSelected={setSelectedIds}
        />
      </div>

      {/* Main layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left content: KPIs + charts + table */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPI row */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {selectedIds.map((id) => renderKpiTile(id))}
          </div>

          {/* AI insights (mobile) */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on data capture & LTV"
              bullets={insights}
              onRefresh={regenerateInsights}
            />
          </div>

          {/* Customers by capture group */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Customers by capture group
              </h2>
              <span className="text-[11px] text-slate-500">
                % of customers by data capture
              </span>
            </div>

            <div className="space-y-3">
              <div className="h-3 w-full rounded-full bg-slate-100 overflow-hidden flex">
                {CAPTURE_SEGMENTS.map((seg) => (
                  <div
                    key={seg.id}
                    className={seg.colorClass + " h-full"}
                    style={{ width: `${seg.percentage}%` }}
                  />
                ))}
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
                {CAPTURE_SEGMENTS.map((seg) => (
                  <div key={seg.id} className="flex items-center gap-1">
                    <span
                      className={
                        "h-2 w-2 rounded-full inline-block " + seg.colorClass
                      }
                    />
                    <span>
                      {seg.label} · {seg.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Ticket average by capture group */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Ticket average by capture group
              </h2>
              <span className="text-[11px] text-slate-500">
                Relative ticket value (dummy)
              </span>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              {TICKET_GROUPS.map((g) => (
                <div key={g.id}>
                  <div className="flex justify-between text-[11px]">
                    <span>{g.label}</span>
                    <span>${g.ticket.toFixed(0)}</span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${(g.ticket / maxTicket) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Stores overview table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Stores overview
              </h2>
              <span className="text-[11px] text-slate-500">
                Data capture and ticket averages by store
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Store</th>
                    <th className="py-2 pr-3 text-right">Customers</th>
                    <th className="py-2 pr-3 text-right">Mail only %</th>
                    <th className="py-2 pr-3 text-right">Email only %</th>
                    <th className="py-2 pr-3 text-right">Mail &amp; email %</th>
                    <th className="py-2 pr-3 text-right">Blank %</th>
                    <th className="py-2 pr-3 text-right">Multi-channel %</th>
                    <th className="py-2 pr-3 text-right">Ticket – multi</th>
                    <th className="py-2 pr-3 text-right">Ticket – blank</th>
                  </tr>
                </thead>
                <tbody>
                  {STORES.map((s) => (
                    <tr key={s.store} className="border-t border-slate-100">
                      <td className="py-2 pr-3">{s.store}</td>
                      <td className="py-2 pr-3 text-right">
                        {s.customers.toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {s.mailOnlyPct}%
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {s.emailOnlyPct}%
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {s.mailAndEmailPct}%
                      </td>
                      <td className="py-2 pr-3 text-right">{s.blankPct}%</td>
                      <td className="py-2 pr-3 text-right">
                        {s.multiChannelPct}%
                      </td>
                      <td className="py-2 pr-3 text-right">
                        ${s.ticketMulti.toFixed(0)}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        ${s.ticketBlank.toFixed(0)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* AI Insights – desktop */}
        <div className="hidden lg:block lg:col-span-1">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on data capture & LTV"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default DataCaptureLtvPage;
