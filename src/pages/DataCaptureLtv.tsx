import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, BarStack } from "@/components/layout";

type CaptureGroup = "mailOnly" | "emailOnly" | "mailEmail" | "blank";

type CaptureSummary = {
  storeName: string;
  periodLabel: string;
  groups: Record<CaptureGroup, { label: string; count: number; ticketAvg: number; revenue: number }>;
};

type StoreRow = {
  storeName: string;
  totalCustomers: number;
  mailOnlyPct: number;
  emailOnlyPct: number;
  mailEmailPct: number;
  blankPct: number;
  multiChannelPct: number;
  blankTicketAvg: number;
  multiChannelTicketAvg: number;
};

const captureSummary: CaptureSummary = {
  storeName: "All Stores",
  periodLabel: "Last 12 months",
  groups: {
    mailOnly: { label: "Mail only", count: 1180, ticketAvg: 78, revenue: 92000 },
    emailOnly: { label: "Email only", count: 860, ticketAvg: 82, revenue: 70500 },
    mailEmail: { label: "Mail & email", count: 2450, ticketAvg: 98, revenue: 240000 },
    blank: { label: "Blank", count: 540, ticketAvg: 42, revenue: 22700 },
  },
};

const storeRows: StoreRow[] = [
  { storeName: "Vallejo, CA", totalCustomers: 1850, mailOnlyPct: 17, emailOnlyPct: 12, mailEmailPct: 58, blankPct: 13, multiChannelPct: 58, blankTicketAvg: 41, multiChannelTicketAvg: 99 },
  { storeName: "Napa, CA", totalCustomers: 1420, mailOnlyPct: 21, emailOnlyPct: 19, mailEmailPct: 46, blankPct: 14, multiChannelPct: 46, blankTicketAvg: 43, multiChannelTicketAvg: 94 },
  { storeName: "Fairfield, CA", totalCustomers: 1310, mailOnlyPct: 13, emailOnlyPct: 11, mailEmailPct: 63, blankPct: 13, multiChannelPct: 63, blankTicketAvg: 40, multiChannelTicketAvg: 101 },
];

const DataCaptureLtv: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Multi-channel customers (mail + email) generate the highest ticket average at about $98 per visit.",
    "Blank records account for ~11% of customers and have a much lower ticket average (~$42).",
    "Converting half of blank customers to multi-channel could drive a meaningful lift in annual revenue.",
  ]);

  const totalCustomers = useMemo(() => Object.values(captureSummary.groups).reduce((sum, g) => sum + g.count, 0), []);
  const multiChannelCount = captureSummary.groups.mailEmail.count;
  const blankCount = captureSummary.groups.blank.count;
  const multiChannelPct = Math.round((multiChannelCount / totalCustomers) * 100);
  const blankPct = Math.round((blankCount / totalCustomers) * 100);
  const avgTicketMultiChannel = captureSummary.groups.mailEmail.ticketAvg;
  const avgTicketBlank = captureSummary.groups.blank.ticketAvg;

  const captureMix = useMemo(() => {
    return (Object.keys(captureSummary.groups) as CaptureGroup[]).map((key) => {
      const group = captureSummary.groups[key];
      return { key, label: group.label, pct: Math.round((group.count / totalCustomers) * 100), ticketAvg: group.ticketAvg };
    });
  }, [totalCustomers]);

  const maxTicket = useMemo(() => Math.max(...captureMix.map((g) => g.ticketAvg), 1), [captureMix]);

  const regenerateInsights = () => {
    setInsights([
      `About ${multiChannelPct}% of customers are multi-channel, but ${blankPct}% are still blank.`,
      `Multi-channel tickets average ~$${avgTicketMultiChannel.toFixed(0)} vs ~$${avgTicketBlank.toFixed(0)} for blank records.`,
      "Focusing data capture efforts on just two or three low-performing stores could quickly improve both revenue and retention.",
    ]);
  };

  const breadcrumb = [
    { label: "Home", to: "/" },
    { label: "Reports & Insights", to: "/" },
    { label: "Data Capture + LTV" },
  ];

  const rightInfo = (
    <>
      <span>Store: <span className="font-medium">{captureSummary.storeName}</span></span>
      <span>Period: <span className="font-medium">{captureSummary.periodLabel}</span></span>
    </>
  );

  return (
    <ShellLayout breadcrumb={breadcrumb} rightInfo={rightInfo}>
      {/* Title + hero tiles */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Data Capture + Lifetime Value</h1>
          <p className="mt-1 text-sm text-slate-500">
            See how mail/email capture translates into customer value and ticket averages across the store network.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">Total customers</div>
            <div className="mt-0.5 text-base font-semibold">{totalCustomers.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile label="Multi-channel customers" value={`${multiChannelPct}%`} helper={`${multiChannelCount.toLocaleString()} customers`} />
        <MetricTile label="Blank (no contact)" value={`${blankPct}%`} helper={`${blankCount.toLocaleString()} customers`} />
        <MetricTile label="Avg ticket – multi-channel" value={`$${avgTicketMultiChannel.toFixed(0)}`} helper="Mail & email" />
        <MetricTile label="Avg ticket – blank" value={`$${avgTicketBlank.toFixed(0)}`} helper="No mail or email" />
        <MetricTile label="Ticket lift" value={`+$${(avgTicketMultiChannel - avgTicketBlank).toFixed(0)}`} helper="Multi-channel vs blank" />
      </div>

      {/* Charts + insights */}
      <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">Customers by capture group</h2>
            <span className="text-[11px] text-slate-400">% of customers by data capture</span>
          </div>
          <BarStack
            segments={captureMix.map((g) => ({
              label: g.label,
              value: g.pct,
              color: g.label === "Mail & email" ? "bg-indigo-500" : g.label === "Blank" ? "bg-rose-400" : g.label === "Email only" ? "bg-sky-400" : "bg-slate-400",
            }))}
          />
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">Ticket average by capture group</h2>
            <span className="text-[11px] text-slate-400">Relative ticket value (dummy)</span>
          </div>
          <div className="space-y-2">
            {captureMix.map((g) => (
              <div key={g.label} className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>{g.label}</span>
                  <span>${g.ticketAvg.toFixed(0)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${g.label === "Mail & email" ? "bg-indigo-500" : g.label === "Blank" ? "bg-rose-400" : g.label === "Email only" ? "bg-sky-400" : "bg-slate-400"}`}
                      style={{ width: `${(g.ticketAvg / maxTicket) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-sm font-semibold text-slate-800">AI insights (mock)</h2>
            <button onClick={regenerateInsights} className="text-[11px] px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600">Refresh</button>
          </div>
          <ul className="space-y-1 text-xs text-slate-600">
            {insights.map((line, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            In the full app, this panel will call Lovable/OpenAI with live capture and LTV metrics to generate store-specific recommendations.
          </p>
        </div>
      </section>

      {/* Store table */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="text-sm font-semibold text-slate-800">Stores overview</h2>
          <span className="text-[11px] text-slate-400">Data capture and ticket averages by store</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3">Store</th>
                <th className="py-2 pr-3 text-right">Customers</th>
                <th className="py-2 pr-3 text-right">Mail only %</th>
                <th className="py-2 pr-3 text-right">Email only %</th>
                <th className="py-2 pr-3 text-right">Mail & email %</th>
                <th className="py-2 pr-3 text-right">Blank %</th>
                <th className="py-2 pr-3 text-right">Multi-channel %</th>
                <th className="py-2 pr-3 text-right">Ticket – multi</th>
                <th className="py-2 pr-3 text-right">Ticket – blank</th>
              </tr>
            </thead>
            <tbody>
              {storeRows.map((row) => (
                <tr key={row.storeName} className="border-t border-slate-100">
                  <td className="py-2 pr-3 text-slate-700">{row.storeName}</td>
                  <td className="py-2 pr-3 text-right">{row.totalCustomers.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-right text-slate-600">{row.mailOnlyPct}%</td>
                  <td className="py-2 pr-3 text-right text-slate-600">{row.emailOnlyPct}%</td>
                  <td className="py-2 pr-3 text-right text-indigo-600">{row.mailEmailPct}%</td>
                  <td className="py-2 pr-3 text-right text-rose-600">{row.blankPct}%</td>
                  <td className="py-2 pr-3 text-right text-indigo-600">{row.multiChannelPct}%</td>
                  <td className="py-2 pr-3 text-right text-indigo-600">${row.multiChannelTicketAvg.toFixed(0)}</td>
                  <td className="py-2 pr-3 text-right text-rose-600">${row.blankTicketAvg.toFixed(0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ShellLayout>
  );
};

export default DataCaptureLtv;
