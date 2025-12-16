import React, { useMemo, useState } from "react";
import {
  ShellLayout,
  MetricTile,
  AIInsightsTile,
  KpiCustomizeButton,
  DraggableKpiRow,
} from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";
import {
  ReportTable,
  ReportTableHead,
  ReportTableBody,
  ReportTableRow,
  ReportTableHeaderCell,
  ReportTableCell,
} from "@/components/ui/report-table";

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

/* Capture group color system */
const CAPTURE_GROUP_COLORS: Record<string, { bar: string; pill: string; dot: string }> = {
  "mail-only": {
    bar: "bg-sky-200",
    pill: "bg-sky-50 border-sky-100 text-sky-700",
    dot: "bg-sky-300",
  },
  "email-only": {
    bar: "bg-emerald-200",
    pill: "bg-emerald-50 border-emerald-100 text-emerald-700",
    dot: "bg-emerald-300",
  },
  "mail-email": {
    bar: "bg-pink-200",
    pill: "bg-pink-50 border-pink-100 text-pink-700",
    dot: "bg-pink-300",
  },
  blank: {
    bar: "bg-slate-200",
    pill: "bg-slate-50 border-slate-200 text-slate-700",
    dot: "bg-slate-400",
  },
};

const CAPTURE_SEGMENTS: CaptureGroupSegment[] = [
  { id: "mail-only", label: "Mail only", percentage: 23, colorClass: "bg-sky-200" },
  { id: "email-only", label: "Email only", percentage: 17, colorClass: "bg-emerald-200" },
  { id: "mail-email", label: "Mail & email", percentage: 49, colorClass: "bg-pink-200" },
  { id: "blank", label: "Blank", percentage: 11, colorClass: "bg-slate-200" },
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
            helpText="Percentage of customers with both a valid mailing address and email on file. Multi-channel customers can be reached through multiple touch points, increasing engagement."
          />
        );
      case "blank":
        return (
          <MetricTile
            key={id}
            label="Blank (no contact)"
            value={`${CAPTURE_SUMMARY.blankPct.toFixed(0)}%`}
            helper="No mail or email"
            helpText="Percentage of customers with no valid contact information on file. These customers cannot be reached for marketing and represent lost engagement opportunities."
          />
        );
      case "multiTicket":
        return (
          <MetricTile
            key={id}
            label="Avg ticket – multi-channel"
            value={`$${CAPTURE_SUMMARY.multiTicket.toFixed(0)}`}
            helper="Mail + email customers"
            helpText="Average repair order value for customers reachable by both mail and email. Multi-channel customers typically have higher lifetime value and spend more per visit."
          />
        );
      case "blankTicket":
        return (
          <MetricTile
            key={id}
            label="Avg ticket – blank"
            value={`$${CAPTURE_SUMMARY.blankTicket.toFixed(0)}`}
            helper="No mail or email"
            helpText="Average repair order value for customers with no contact information. These customers tend to spend less and have lower retention rates."
          />
        );
      case "ticketLift":
        return (
          <MetricTile
            key={id}
            label="Ticket lift"
            value={`+$${CAPTURE_SUMMARY.ticketLift.toFixed(0)}`}
            helper="Multi-channel vs blank"
            helpText="Dollar difference in average ticket between multi-channel and blank customers. This represents the value of improving data capture rates."
          />
        );
      case "totalCustomers":
        return (
          <MetricTile
            key={id}
            label="Total customers"
            value={CAPTURE_SUMMARY.totalCustomers.toLocaleString()}
            helpText="Total number of unique customers in the database. This is the base population for all capture rate calculations."
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
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* Left content: KPIs + charts + table */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPI row - draggable */}
          {selectedIds.length > 0 && (
            <DraggableKpiRow
              reportKey="data-capture-ltv"
              tiles={selectedIds
                .map((id) => {
                  const tile = renderKpiTile(id);
                  return tile ? { id, element: tile } : null;
                })
                .filter(Boolean) as { id: string; element: React.ReactNode }[]}
            />
          )}

          {/* Customers by capture group */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <header className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[13px] font-semibold text-slate-900">
                  Customers by capture group
                </div>
                <div className="text-[11px] text-slate-500">
                  Share of total customers by data capture.
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                % of customers by data capture
              </div>
            </header>

            {/* Stacked bar */}
            <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
              {CAPTURE_SEGMENTS.map((seg) => {
                const color = CAPTURE_GROUP_COLORS[seg.id] ?? CAPTURE_GROUP_COLORS.blank;
                return (
                  <div
                    key={seg.id}
                    className={`h-full ${color.bar}`}
                    style={{ width: `${seg.percentage}%` }}
                  />
                );
              })}
            </div>

            {/* Ghost pill legend */}
            <div className="mt-3 flex flex-wrap gap-3 text-[11px] text-slate-600">
              {CAPTURE_SEGMENTS.map((seg) => {
                const color = CAPTURE_GROUP_COLORS[seg.id] ?? CAPTURE_GROUP_COLORS.blank;
                return (
                  <span
                    key={seg.id}
                    className={`inline-flex items-center rounded-full border px-2.5 py-0.5 ${color.pill}`}
                  >
                    <span className={`mr-1 h-2 w-2 rounded-full ${color.dot}`} />
                    <span className="font-medium">{seg.label}</span>
                    <span className="ml-1 text-slate-500">
                      – {seg.percentage.toFixed(1)}%
                    </span>
                  </span>
                );
              })}
            </div>
          </section>

          {/* Ticket average by capture group */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <header className="flex items-center justify-between gap-3">
              <div>
                <div className="text-[13px] font-semibold text-slate-900">
                  Ticket average by capture group
                </div>
                <div className="text-[11px] text-slate-500">
                  Relative ticket value by mail/email capture.
                </div>
              </div>
              <div className="text-[11px] text-slate-500">
                Relative ticket value
              </div>
            </header>

            <div className="mt-3 space-y-3">
              {TICKET_GROUPS.map((g) => {
                const color = CAPTURE_GROUP_COLORS[g.id] ?? CAPTURE_GROUP_COLORS.blank;
                return (
                  <div key={g.id} className="flex items-center gap-3">
                    {/* label */}
                    <div className="w-28 text-[11px] text-slate-700">
                      {g.label}
                    </div>

                    {/* bar */}
                    <div className="flex-1">
                      <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full ${color.bar}`}
                          style={{ width: `${(g.ticket / maxTicket) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* value */}
                    <div className="w-16 text-right text-[11px] text-slate-900">
                      ${g.ticket.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                );
              })}
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
              <ReportTable>
                <ReportTableHead>
                  <ReportTableRow>
                    <ReportTableHeaderCell label="Store" />
                    <ReportTableHeaderCell label="Customers" align="right" />
                    <ReportTableHeaderCell label="Mail only %" align="right" />
                    <ReportTableHeaderCell label="Email only %" align="right" />
                    <ReportTableHeaderCell label="Mail & email %" align="right" />
                    <ReportTableHeaderCell label="Blank %" align="right" />
                    <ReportTableHeaderCell label="Multi-channel %" align="right" />
                    <ReportTableHeaderCell label="Ticket – multi" align="right" />
                    <ReportTableHeaderCell label="Ticket – blank" align="right" />
                  </ReportTableRow>
                </ReportTableHead>
                <ReportTableBody>
                  {STORES.map((s) => (
                    <ReportTableRow key={s.store}>
                      <ReportTableCell>{s.store}</ReportTableCell>
                      <ReportTableCell align="right">{s.customers.toLocaleString()}</ReportTableCell>
                      <ReportTableCell align="right">{s.mailOnlyPct}%</ReportTableCell>
                      <ReportTableCell align="right">{s.emailOnlyPct}%</ReportTableCell>
                      <ReportTableCell align="right">{s.mailAndEmailPct}%</ReportTableCell>
                      <ReportTableCell align="right">{s.blankPct}%</ReportTableCell>
                      <ReportTableCell align="right">{s.multiChannelPct}%</ReportTableCell>
                      <ReportTableCell align="right">${s.ticketMulti.toFixed(0)}</ReportTableCell>
                      <ReportTableCell align="right">${s.ticketBlank.toFixed(0)}</ReportTableCell>
                    </ReportTableRow>
                  ))}
                </ReportTableBody>
              </ReportTable>
            </div>
          </section>

          {/* AI insights (mobile) - after main content */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on data capture & LTV"
              bullets={insights}
              onRefresh={regenerateInsights}
            />
          </div>
        </div>

        {/* AI Insights – desktop */}
        <div className="hidden lg:block lg:col-span-1 self-start">
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
