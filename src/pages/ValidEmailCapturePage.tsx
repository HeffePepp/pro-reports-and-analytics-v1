import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, BarStack } from "@/components/layout";

type EmailCaptureSummary = {
  storeName: string;
  periodLabel: string;
  newValidEmails: number;
  totalCustomers: number;
  captureRate: number;
  weekOverWeekChange: number;
};

type StoreRow = {
  storeName: string;
  techName: string;
  newEmails: number;
  invoices: number;
  captureRate: number;
  weekTrend: "up" | "down" | "flat";
};

const summary: EmailCaptureSummary = {
  storeName: "All Stores",
  periodLabel: "Last 7 days",
  newValidEmails: 228,
  totalCustomers: 1420,
  captureRate: 16.1,
  weekOverWeekChange: 2.3,
};

const storeRows: StoreRow[] = [
  { storeName: "Vallejo, CA", techName: "Mike T.", newEmails: 42, invoices: 186, captureRate: 22.6, weekTrend: "up" },
  { storeName: "Vallejo, CA", techName: "Sarah L.", newEmails: 38, invoices: 168, captureRate: 22.6, weekTrend: "up" },
  { storeName: "Napa, CA", techName: "James R.", newEmails: 28, invoices: 152, captureRate: 18.4, weekTrend: "flat" },
  { storeName: "Napa, CA", techName: "Kevin M.", newEmails: 24, invoices: 144, captureRate: 16.7, weekTrend: "down" },
  { storeName: "Fairfield, CA", techName: "Lisa P.", newEmails: 52, invoices: 198, captureRate: 26.3, weekTrend: "up" },
  { storeName: "Fairfield, CA", techName: "Tom B.", newEmails: 44, invoices: 172, captureRate: 25.6, weekTrend: "flat" },
];

const ValidEmailCapturePage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "228 new valid emails captured this week — a 2.3% increase over last week.",
    "Fairfield leads with 26% capture rate; Lisa P. is the top-performing tech.",
    "Kevin M. at Napa is trending down — consider coaching or script refresh.",
  ]);

  const topTech = useMemo(() => storeRows.reduce((max, row) => row.captureRate > max.captureRate ? row : max, storeRows[0]), []);
  const avgCaptureRate = useMemo(() => (storeRows.reduce((sum, row) => sum + row.captureRate, 0) / storeRows.length).toFixed(1), []);

  const regenerateInsights = () => {
    setInsights([
      `Average capture rate is ${avgCaptureRate}% across all techs.`,
      `${topTech.techName} at ${topTech.storeName} leads with ${topTech.captureRate}% capture rate.`,
      "Stores with capture rates below 18% should implement the email-ask script at checkout.",
    ]);
  };

  const breadcrumb = [
    { label: "Home", to: "/" },
    { label: "Reports & Insights", to: "/" },
    { label: "Valid Email Capture" },
  ];

  const rightInfo = (
    <>
      <span>Store: <span className="font-medium">{summary.storeName}</span></span>
      <span>Period: <span className="font-medium">{summary.periodLabel}</span></span>
    </>
  );

  return (
    <ShellLayout breadcrumb={breadcrumb} rightInfo={rightInfo}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Valid Email Capture</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track new valid emails captured by store, tech and week to improve customer reachability.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">New valid emails</div>
            <div className="mt-0.5 text-base font-semibold">{summary.newValidEmails}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">WoW change</div>
            <div className="mt-0.5 text-base font-semibold text-emerald-600">+{summary.weekOverWeekChange}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile label="New valid emails" value={summary.newValidEmails.toString()} helper="This week" tone="positive" />
        <MetricTile label="Capture rate" value={`${summary.captureRate}%`} helper="Emails / invoices" />
        <MetricTile label="Total invoices" value={summary.totalCustomers.toLocaleString()} helper="This week" />
        <MetricTile label="WoW change" value={`+${summary.weekOverWeekChange}%`} helper="vs last week" tone="positive" />
        <MetricTile label="Top tech rate" value={`${topTech.captureRate}%`} helper={topTech.techName} />
      </div>

      <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">Capture rate by store</h2>
            <span className="text-[11px] text-slate-400">Aggregated by location</span>
          </div>
          <BarStack
            segments={[
              { label: "Vallejo, CA", value: 22, color: "bg-emerald-400" },
              { label: "Napa, CA", value: 17, color: "bg-sky-400" },
              { label: "Fairfield, CA", value: 26, color: "bg-indigo-500" },
            ]}
          />
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-sm font-semibold text-slate-800">AI insights (mock)</h2>
            <button onClick={regenerateInsights} className="text-[11px] px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600">Refresh</button>
          </div>
          <ul className="space-y-1 text-xs text-slate-600">
            {insights.map((line, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            In the full app, this panel will call Lovable/OpenAI with live capture data to identify coaching opportunities.
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="text-sm font-semibold text-slate-800">Tech performance</h2>
          <span className="text-[11px] text-slate-400">New emails, invoices and capture rate by tech</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3">Store</th>
                <th className="py-2 pr-3">Tech</th>
                <th className="py-2 pr-3 text-right">New emails</th>
                <th className="py-2 pr-3 text-right">Invoices</th>
                <th className="py-2 pr-3 text-right">Capture %</th>
                <th className="py-2 pr-3">Trend</th>
              </tr>
            </thead>
            <tbody>
              {storeRows.map((row, idx) => (
                <tr key={idx} className="border-t border-slate-100">
                  <td className="py-2 pr-3 text-slate-700">{row.storeName}</td>
                  <td className="py-2 pr-3 text-slate-600">{row.techName}</td>
                  <td className="py-2 pr-3 text-right text-emerald-600">{row.newEmails}</td>
                  <td className="py-2 pr-3 text-right">{row.invoices}</td>
                  <td className="py-2 pr-3 text-right text-sky-600">{row.captureRate}%</td>
                  <td className="py-2 pr-3">
                    <span className={`text-[11px] ${row.weekTrend === "up" ? "text-emerald-600" : row.weekTrend === "down" ? "text-rose-600" : "text-slate-400"}`}>
                      {row.weekTrend === "up" ? "↑" : row.weekTrend === "down" ? "↓" : "→"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ShellLayout>
  );
};

export default ValidEmailCapturePage;
