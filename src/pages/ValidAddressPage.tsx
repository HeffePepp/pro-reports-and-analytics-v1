import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, SimpleStackBar } from "@/components/layout";

type ValidAddressSummary = {
  storeName: string;
  periodLabel: string;
  invCount: number;
  validAddrCount: number;
  badAddrCount: number;
  blankAddrCount: number;
  validEmailCount: number;
  invalidEmailCount: number;
  blankEmailCount: number;
};

type ValidAddressStoreRow = {
  storeName: string;
  invCount: number;
  validAddrPct: number;
  badAddrPct: number;
  blankAddrPct: number;
  validEmailPct: number;
  blankEmailPct: number;
};

const validSummary: ValidAddressSummary = {
  storeName: "All Stores",
  periodLabel: "Last 12 months",
  invCount: 24580,
  validAddrCount: 20980,
  badAddrCount: 1820,
  blankAddrCount: 1780,
  validEmailCount: 18120,
  invalidEmailCount: 920,
  blankEmailCount: 5540,
};

const validRows: ValidAddressStoreRow[] = [
  { storeName: "Vallejo, CA", invCount: 8420, validAddrPct: 89, badAddrPct: 5, blankAddrPct: 6, validEmailPct: 76, blankEmailPct: 18 },
  { storeName: "Napa, CA", invCount: 6240, validAddrPct: 84, badAddrPct: 7, blankAddrPct: 9, validEmailPct: 72, blankEmailPct: 22 },
  { storeName: "Fairfield, CA", invCount: 5920, validAddrPct: 81, badAddrPct: 9, blankAddrPct: 10, validEmailPct: 68, blankEmailPct: 24 },
];

const ValidAddressPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Mail reach is strong overall, with ~85% valid addresses across stores.",
    "Email reach is lower, with around 74% valid and 23% blank emails.",
    "A handful of stores have higher blank address/email rates and should be prioritized for data cleanup.",
  ]);

  const mailReachPct = useMemo(() => Math.round((validSummary.validAddrCount / validSummary.invCount) * 100), []);
  const badBlankPct = 100 - mailReachPct;
  const emailReachPct = useMemo(() => Math.round((validSummary.validEmailCount / validSummary.invCount) * 100), []);
  const blankEmailPct = useMemo(() => Math.round((validSummary.blankEmailCount / validSummary.invCount) * 100), []);

  const regenerateInsights = () => {
    setInsights([
      `Mail reach is about ${mailReachPct}%, but ${badBlankPct}% of invoices still have bad or blank addresses.`,
      `Email reach is about ${emailReachPct}% with roughly ${blankEmailPct}% blank emails.`,
      "Improving address/email quality at just a few underperforming stores can unlock more deliverable campaigns and better ROAS.",
    ]);
  };

  const breadcrumb = [
    { label: "Home", to: "/" },
    { label: "Reports & Insights", to: "/" },
    { label: "Valid Address" },
  ];

  const rightInfo = (
    <>
      <span>Store: <span className="font-medium">{validSummary.storeName}</span></span>
      <span>Period: <span className="font-medium">{validSummary.periodLabel}</span></span>
    </>
  );

  return (
    <ShellLayout breadcrumb={breadcrumb} rightInfo={rightInfo}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Valid Address Report</h1>
          <p className="mt-1 text-sm text-slate-500">
            Mail and email address quality by store: valid, bad and blank records.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">Invoices</div>
            <div className="mt-0.5 text-base font-semibold">{validSummary.invCount.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile label="Mail reach" value={`${mailReachPct}%`} />
        <MetricTile label="Bad + blank mail" value={`${badBlankPct}%`} />
        <MetricTile label="Email reach" value={`${emailReachPct}%`} />
        <MetricTile label="Blank emails" value={`${blankEmailPct}%`} />
        <MetricTile label="Valid email count" value={validSummary.validEmailCount.toLocaleString()} />
      </div>

      {/* Charts + insights */}
      <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-800">Address quality</h2>
            <span className="text-[11px] text-slate-400">% of invoices by address status</span>
          </div>
          <SimpleStackBar
            segments={[
              { label: "Valid", value: mailReachPct, color: "bg-emerald-400" },
              { label: "Bad + blank", value: badBlankPct, color: "bg-rose-400" },
            ]}
          />
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-800">Email quality</h2>
            <span className="text-[11px] text-slate-400">Valid vs invalid/blank</span>
          </div>
          <SimpleStackBar
            segments={[
              { label: "Valid", value: emailReachPct, color: "bg-sky-400" },
              { label: "Invalid + blank", value: 100 - emailReachPct, color: "bg-slate-400" },
            ]}
          />
        </div>

        {/* Insights */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
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
            In the full app, this panel will call Lovable/OpenAI with live data quality metrics and suggest where to focus cleanup efforts.
          </p>
        </div>
      </section>

      {/* Table */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-800">Stores overview</h2>
          <span className="text-[11px] text-slate-400">Address and email reach by store</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3">Store</th>
                <th className="py-2 pr-3 text-right">Invoices</th>
                <th className="py-2 pr-3 text-right">Valid addr %</th>
                <th className="py-2 pr-3 text-right">Bad addr %</th>
                <th className="py-2 pr-3 text-right">Blank addr %</th>
                <th className="py-2 pr-3 text-right">Valid email %</th>
                <th className="py-2 pr-3 text-right">Blank email %</th>
              </tr>
            </thead>
            <tbody>
              {validRows.map((row) => (
                <tr key={row.storeName} className="border-t border-slate-100">
                  <td className="py-2 pr-3 text-slate-700">{row.storeName}</td>
                  <td className="py-2 pr-3 text-right">{row.invCount.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-right text-emerald-600">{row.validAddrPct}%</td>
                  <td className="py-2 pr-3 text-right text-rose-600">{row.badAddrPct}%</td>
                  <td className="py-2 pr-3 text-right text-rose-600">{row.blankAddrPct}%</td>
                  <td className="py-2 pr-3 text-right text-sky-600">{row.validEmailPct}%</td>
                  <td className="py-2 pr-3 text-right text-slate-600">{row.blankEmailPct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ShellLayout>
  );
};

export default ValidAddressPage;
