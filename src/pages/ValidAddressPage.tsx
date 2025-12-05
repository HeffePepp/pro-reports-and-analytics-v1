import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

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
  {
    storeName: "Vallejo, CA",
    invCount: 8420,
    validAddrPct: 89,
    badAddrPct: 5,
    blankAddrPct: 6,
    validEmailPct: 76,
    blankEmailPct: 18,
  },
  {
    storeName: "Napa, CA",
    invCount: 6240,
    validAddrPct: 84,
    badAddrPct: 7,
    blankAddrPct: 9,
    validEmailPct: 72,
    blankEmailPct: 22,
  },
  {
    storeName: "Fairfield, CA",
    invCount: 5920,
    validAddrPct: 81,
    badAddrPct: 9,
    blankAddrPct: 10,
    validEmailPct: 68,
    blankEmailPct: 24,
  },
];

const ValidAddressPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Mail reach is strong overall, with ~85% valid addresses across stores.",
    "Email reach is lower, with around 74% valid and 23% blank emails.",
    "A handful of stores have higher blank address/email rates and should be prioritized for data cleanup.",
  ]);

  const mailReachPct = useMemo(
    () => Math.round((validSummary.validAddrCount / validSummary.invCount) * 100),
    []
  );
  const badBlankPct = 100 - mailReachPct;
  const emailReachPct = useMemo(
    () => Math.round((validSummary.validEmailCount / validSummary.invCount) * 100),
    []
  );
  const blankEmailPct = useMemo(
    () => Math.round((validSummary.blankEmailCount / validSummary.invCount) * 100),
    []
  );

  const regenerateInsights = () => {
    setInsights([
      `Mail reach is about ${mailReachPct}%, but ${badBlankPct}% of invoices still have bad or blank addresses.`,
      `Email reach is about ${emailReachPct}% with roughly ${blankEmailPct}% blank emails.`,
      "Improving address/email quality at just a few underperforming stores can unlock more deliverable campaigns and better ROAS.",
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-slate-900 text-slate-100">
        <div className="flex items-center gap-2 px-5 h-14 border-b border-slate-800">
          <div className="h-8 w-8 rounded-xl bg-emerald-400 flex items-center justify-center font-bold text-slate-900">
            TP
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Throttle Pro</span>
            <span className="text-[11px] text-slate-400">Reporting Prototype</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 text-sm space-y-1">
          {["Dashboard", "Customers", "Campaigns", "Reports & Insights", "Organizations", "Settings"].map(
            (item) => (
              <Link
                key={item}
                to={item === "Reports & Insights" ? "/" : "#"}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 ${
                  item === "Reports & Insights" ? "bg-slate-800 font-medium" : "text-slate-300"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                <span>{item}</span>
              </Link>
            )
          )}
        </nav>
        <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-400">
          Signed in as<br />
          <span className="text-slate-200">demo@throttlepro.com</span>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-slate-400 hover:text-slate-600">
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <Link to="/" className="text-slate-400 hover:text-slate-600">
              Reports & Insights
            </Link>
            <span className="text-slate-400">/</span>
            <span className="font-medium text-slate-700">Valid Address</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              Store: <span className="font-medium">{validSummary.storeName}</span>
            </span>
            <span>
              Period:{" "}
              <span className="font-medium">{validSummary.periodLabel}</span>
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                Valid Address Report
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Mail and email address quality by store: valid, bad and blank records.
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Invoices</div>
                <div className="mt-0.5 text-base font-semibold">
                  {validSummary.invCount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <AddrTile label="Mail reach" value={`${mailReachPct}%`} />
            <AddrTile label="Bad + blank mail" value={`${badBlankPct}%`} />
            <AddrTile label="Email reach" value={`${emailReachPct}%`} />
            <AddrTile label="Blank emails" value={`${blankEmailPct}%`} />
            <AddrTile label="Valid email count" value={validSummary.validEmailCount.toLocaleString()} />
          </div>

          {/* Charts + insights */}
          <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-slate-800">
                  Address quality
                </h2>
                <span className="text-[11px] text-slate-400">
                  % of invoices by address status
                </span>
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
                <h2 className="text-sm font-semibold text-slate-800">
                  Email quality
                </h2>
                <span className="text-[11px] text-slate-400">
                  Valid vs invalid/blank
                </span>
              </div>
              <SimpleStackBar
                segments={[
                  { label: "Valid", value: emailReachPct, color: "bg-sky-400" },
                  {
                    label: "Invalid + blank",
                    value: 100 - emailReachPct,
                    color: "bg-slate-400",
                  },
                ]}
              />
            </div>

            {/* Insights */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-slate-800">
                  AI insights (mock)
                </h2>
                <button
                  onClick={regenerateInsights}
                  className="text-[11px] px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600"
                >
                  Refresh
                </button>
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
                In the full app, this panel will call Lovable/OpenAI with live data
                quality metrics and suggest where to focus cleanup efforts.
              </p>
            </div>
          </section>

          {/* Table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-800">
                Stores overview
              </h2>
              <span className="text-[11px] text-slate-400">
                Address and email reach by store
              </span>
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
                      <td className="py-2 pr-3 text-right">
                        {row.invCount.toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-right text-emerald-600">
                        {row.validAddrPct}%
                      </td>
                      <td className="py-2 pr-3 text-right text-rose-600">
                        {row.badAddrPct}%
                      </td>
                      <td className="py-2 pr-3 text-right text-rose-600">
                        {row.blankAddrPct}%
                      </td>
                      <td className="py-2 pr-3 text-right text-sky-600">
                        {row.validEmailPct}%
                      </td>
                      <td className="py-2 pr-3 text-right text-slate-600">
                        {row.blankEmailPct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

const AddrTile: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm flex flex-col justify-between">
    <span className="text-[11px] text-slate-500">{label}</span>
    <span className="mt-1 text-base font-semibold text-slate-900">
      {value}
    </span>
  </div>
);

const SimpleStackBar: React.FC<{
  segments: { label: string; value: number; color: string }[];
}> = ({ segments }) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  return (
    <div className="space-y-3">
      <div className="flex w-full h-4 rounded-full overflow-hidden bg-slate-100">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`h-full ${seg.color}`}
            style={{ width: `${(seg.value / total) * 100}%` }}
            title={`${seg.label} · ${seg.value}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-[11px] text-slate-600">
        {segments.map((seg) => (
          <span key={seg.label} className="inline-flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${seg.color}`} />
            <span>
              {seg.label} · {seg.value}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default ValidAddressPage;
