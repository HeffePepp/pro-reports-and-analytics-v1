import React, { useMemo, useState } from "react";
import {
  ShellLayout,
  MetricTile,
  AIInsightsTile,
  KpiCustomizeButton,
  DraggableKpiRow,
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
  liftVsBlank: number;
  captureMomPct: number;
};

type StoreRow = {
  store: string;
  mailOnlyPct: number;
  mailOnlyMomPct: number;
  emailOnlyPct: number;
  emailOnlyMomPct: number;
  mailAndEmailPct: number;
  mailAndEmailMomPct: number;
  blankPct: number;
  blankMomPct: number;
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
  { id: "mail-only", label: "Mail only", ticket: 88, liftVsBlank: 46, captureMomPct: 1.2 },
  { id: "email-only", label: "Email only", ticket: 90, liftVsBlank: 48, captureMomPct: 2.8 },
  { id: "mail-email", label: "Mail & email", ticket: 98, liftVsBlank: 56, captureMomPct: 4.2 },
  { id: "blank", label: "Blank", ticket: 42, liftVsBlank: 0, captureMomPct: -3.1 },
];



const formatSignedCurrency = (value: number) => {
  if (!value) return "$0";
  const sign = value > 0 ? "+" : "";
  return sign + value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).replace("$", "$");
};

const formatSignedPercent = (value: number) => {
  if (!value) return "0.0%";
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(1)}%`;
};

const STORES: StoreRow[] = [
  { store: "Vallejo, CA", mailOnlyPct: 17, mailOnlyMomPct: 1.2, emailOnlyPct: 12, emailOnlyMomPct: 0.8, mailAndEmailPct: 58, mailAndEmailMomPct: 2.1, blankPct: 13, blankMomPct: -1.5 },
  { store: "Napa, CA", mailOnlyPct: 21, mailOnlyMomPct: -0.5, emailOnlyPct: 19, emailOnlyMomPct: 1.4, mailAndEmailPct: 46, mailAndEmailMomPct: 3.2, blankPct: 14, blankMomPct: 0.3 },
  { store: "Fairfield, CA", mailOnlyPct: 13, mailOnlyMomPct: 0.0, emailOnlyPct: 11, emailOnlyMomPct: -0.2, mailAndEmailPct: 63, mailAndEmailMomPct: 4.8, blankPct: 13, blankMomPct: -2.1 },
];

// Multi-location detection (hardcoded for demo; wire to filter state)
const isMultiLocation = STORES.length > 1;

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
            <header>
              <div className="text-[13px] font-semibold text-slate-900">
                Customers by Communication Channel
              </div>
              <div className="text-[11px] text-slate-500">
                % of customers by Communication Channel
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

          {/* Avg Invoice by capture group */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <header>
              <div className="text-[13px] font-semibold text-slate-900">
                Avg Invoice by Communication Channel
              </div>
              {isMultiLocation && (
                <div className="text-[11px] text-slate-500">
                  All locations combined
                </div>
              )}
            </header>

            {/* Column headers for the three right-side metrics */}
            <div className="mt-3 flex justify-end gap-6 pr-1 text-[11px] text-slate-500">
              <div className="w-16 text-right">Avg Invoice</div>
              <div className="w-24 text-right">Avg lift vs blank</div>
              <div className="w-24 text-right">MoM Trend</div>
            </div>

            <div className="mt-1 space-y-3">
              {TICKET_GROUPS.map((g) => {
                const color = CAPTURE_GROUP_COLORS[g.id] ?? CAPTURE_GROUP_COLORS.blank;
                return (
                  <div key={g.id} className="flex items-center gap-3 text-[11px]">
                    {/* label */}
                    <div className="w-28 text-slate-700">{g.label}</div>

                    {/* bar */}
                    <div className="flex-1">
                      <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                        <div
                          className={`h-full ${color.bar}`}
                          style={{ width: `${(g.ticket / maxTicket) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* RIGHT: 3 numeric columns */}
                    <div className="flex gap-6 pr-1 text-right">
                      {/* Avg Invoice */}
                      <div className="w-16 text-slate-900">
                        ${g.ticket.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                      </div>

                      {/* Avg lift vs blank */}
                      <div className={g.id === "mail-email" ? "w-24 font-semibold text-emerald-600" : "w-24 text-slate-900"}>
                        {g.id === "blank" ? "$0" : formatSignedCurrency(g.liftVsBlank)}
                      </div>

                      {/* Data capture MoM */}
                      <div className={
                        g.captureMomPct > 0
                          ? "w-24 font-semibold text-emerald-600"
                          : g.captureMomPct < 0
                          ? "w-24 font-semibold text-red-500"
                          : "w-24 text-slate-900"
                      }>
                        {formatSignedPercent(g.captureMomPct)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Data Capture by location */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <header className="mb-3">
              <div className="text-[13px] font-semibold text-slate-900">
                Data Capture by location
              </div>
              <div className="text-[11px] text-slate-500">
                Data capture mix and MoM trends by store to guide coaching and goals.
              </div>
            </header>

            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed text-[11px]">
                <colgroup>
                  <col className="w-[18%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                </colgroup>
                <thead className="border-b border-slate-100 text-slate-500">
                  <tr>
                    <th className="py-2 pr-3 text-left font-medium">Store</th>
                    <th className="py-2 pr-2 text-right font-medium">Mail only %</th>
                    <th className="py-2 pr-3 text-right font-medium">MoM Trend</th>
                    <th className="py-2 pr-2 text-right font-medium">Email only %</th>
                    <th className="py-2 pr-3 text-right font-medium">MoM Trend</th>
                    <th className="py-2 pr-2 text-right font-medium">Mail &amp; email %</th>
                    <th className="py-2 pr-3 text-right font-medium">MoM Trend</th>
                    <th className="py-2 pr-2 text-right font-medium">Blank %</th>
                    <th className="py-2 pl-1 text-right font-medium">MoM Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {STORES.map((s) => (
                    <tr key={s.store}>
                      <td className="py-2 pr-3 text-slate-800">{s.store}</td>
                      <td className="py-2 pr-2 text-right text-slate-900">{s.mailOnlyPct}%</td>
                      <td className={
                        s.mailOnlyMomPct > 0
                          ? "py-2 pr-3 text-right font-semibold text-emerald-600"
                          : s.mailOnlyMomPct < 0
                          ? "py-2 pr-3 text-right font-semibold text-red-500"
                          : "py-2 pr-3 text-right text-slate-900"
                      }>{formatSignedPercent(s.mailOnlyMomPct)}</td>
                      <td className="py-2 pr-2 text-right text-slate-900">{s.emailOnlyPct}%</td>
                      <td className={
                        s.emailOnlyMomPct > 0
                          ? "py-2 pr-3 text-right font-semibold text-emerald-600"
                          : s.emailOnlyMomPct < 0
                          ? "py-2 pr-3 text-right font-semibold text-red-500"
                          : "py-2 pr-3 text-right text-slate-900"
                      }>{formatSignedPercent(s.emailOnlyMomPct)}</td>
                      <td className="py-2 pr-2 text-right text-slate-900">{s.mailAndEmailPct}%</td>
                      <td className={
                        s.mailAndEmailMomPct > 0
                          ? "py-2 pr-3 text-right font-semibold text-emerald-600"
                          : s.mailAndEmailMomPct < 0
                          ? "py-2 pr-3 text-right font-semibold text-red-500"
                          : "py-2 pr-3 text-right text-slate-900"
                      }>{formatSignedPercent(s.mailAndEmailMomPct)}</td>
                      <td className="py-2 pr-2 text-right text-slate-900">{s.blankPct}%</td>
                      <td className={
                        s.blankMomPct > 0
                          ? "py-2 pl-1 text-right font-semibold text-red-500"
                          : s.blankMomPct < 0
                          ? "py-2 pl-1 text-right font-semibold text-emerald-600"
                          : "py-2 pl-1 text-right text-slate-900"
                      }>{formatSignedPercent(s.blankMomPct)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
