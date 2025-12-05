import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type DataCaptureSummary = {
  storeName: string;
  periodLabel: string;
  totalCustomers: number;
  emailCapturePct: number;
  phoneCapturePct: number;
  multiChannelPct: number;
  blankPct: number;
  avgLtvEmail: number;
  avgLtvPhone: number;
  avgLtvMulti: number;
  avgLtvBlank: number;
};

type StoreRow = {
  storeName: string;
  customers: number;
  emailPct: number;
  phonePct: number;
  multiPct: number;
  blankPct: number;
  ltvDelta: number;
};

const summary: DataCaptureSummary = {
  storeName: "All Stores",
  periodLabel: "Last 12 months",
  totalCustomers: 12840,
  emailCapturePct: 42,
  phoneCapturePct: 28,
  multiChannelPct: 18,
  blankPct: 12,
  avgLtvEmail: 248,
  avgLtvPhone: 215,
  avgLtvMulti: 312,
  avgLtvBlank: 156,
};

const storeRows: StoreRow[] = [
  {
    storeName: "Vallejo, CA",
    customers: 2840,
    emailPct: 45,
    phonePct: 26,
    multiPct: 20,
    blankPct: 9,
    ltvDelta: 62,
  },
  {
    storeName: "Napa, CA",
    customers: 2120,
    emailPct: 38,
    phonePct: 32,
    multiPct: 16,
    blankPct: 14,
    ltvDelta: 48,
  },
  {
    storeName: "Fairfield, CA",
    customers: 1960,
    emailPct: 44,
    phonePct: 25,
    multiPct: 19,
    blankPct: 12,
    ltvDelta: 56,
  },
];

const DataCaptureLtv: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Multi-channel customers have +$56 higher LTV vs blank records.",
    "Vallejo leads with 20% multi-channel capture and lowest blank rate at 9%.",
    "Improving blank rate from 12% to 6% could add ~$58K in annual LTV across all stores.",
  ]);

  const ltvDeltaMultiVsBlank = useMemo(
    () => summary.avgLtvMulti - summary.avgLtvBlank,
    []
  );

  const capturedPct = useMemo(
    () => summary.emailCapturePct + summary.phoneCapturePct + summary.multiChannelPct,
    []
  );

  const regenerateInsights = () => {
    setInsights([
      `Multi-channel customers generate $${ltvDeltaMultiVsBlank} more per year than blank records.`,
      `${capturedPct}% of customers have at least one contact method captured.`,
      "Focus on converting phone-only captures to email+phone for highest LTV impact.",
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
            <span className="font-medium text-slate-700">Data Capture & LTV</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              Store: <span className="font-medium">{summary.storeName}</span>
            </span>
            <span>
              Period: <span className="font-medium">{summary.periodLabel}</span>
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
          {/* Title + hero tiles */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                Data Capture & LTV
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Contact data capture rates and their correlation with customer lifetime value.
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Total customers</div>
                <div className="mt-0.5 text-base font-semibold">
                  {summary.totalCustomers.toLocaleString()}
                </div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Multi-channel LTV lift</div>
                <div className="mt-0.5 text-base font-semibold text-emerald-600">
                  +${ltvDeltaMultiVsBlank}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <LtvTile
              label="Email capture"
              value={`${summary.emailCapturePct}%`}
              helper={`$${summary.avgLtvEmail} avg LTV`}
            />
            <LtvTile
              label="Phone capture"
              value={`${summary.phoneCapturePct}%`}
              helper={`$${summary.avgLtvPhone} avg LTV`}
            />
            <LtvTile
              label="Multi-channel"
              value={`${summary.multiChannelPct}%`}
              helper={`$${summary.avgLtvMulti} avg LTV`}
            />
            <LtvTile
              label="Blank records"
              value={`${summary.blankPct}%`}
              helper={`$${summary.avgLtvBlank} avg LTV`}
            />
            <LtvTile
              label="Total captured"
              value={`${capturedPct}%`}
              helper="Have at least one contact"
            />
          </div>

          {/* Charts + insights */}
          <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Capture mix */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-slate-800">
                  Capture mix
                </h2>
                <span className="text-[11px] text-slate-400">
                  % of customers by capture type
                </span>
              </div>
              <BarStack
                segments={[
                  { label: "Email only", value: summary.emailCapturePct, color: "bg-sky-400" },
                  { label: "Phone only", value: summary.phoneCapturePct, color: "bg-violet-400" },
                  { label: "Multi-channel", value: summary.multiChannelPct, color: "bg-emerald-500" },
                  { label: "Blank", value: summary.blankPct, color: "bg-slate-300" },
                ]}
              />
            </div>

            {/* LTV by capture type */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-slate-800">
                  LTV by capture type
                </h2>
                <span className="text-[11px] text-slate-400">
                  Avg annual value per customer
                </span>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Multi-channel", value: summary.avgLtvMulti, color: "bg-emerald-500" },
                  { label: "Email only", value: summary.avgLtvEmail, color: "bg-sky-400" },
                  { label: "Phone only", value: summary.avgLtvPhone, color: "bg-violet-400" },
                  { label: "Blank", value: summary.avgLtvBlank, color: "bg-slate-300" },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>{item.label}</span>
                      <span>${item.value}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full ${item.color}`}
                        style={{ width: `${(item.value / summary.avgLtvMulti) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-2">
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
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-slate-400">
                In the full app, this panel will call Lovable/OpenAI with live capture
                and LTV data to generate actionable guidance.
              </p>
            </div>
          </section>

          {/* Store table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-sm font-semibold text-slate-800">
                Stores overview
              </h2>
              <span className="text-[11px] text-slate-400">
                Capture rates and LTV delta by store
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Store</th>
                    <th className="py-2 pr-3 text-right">Customers</th>
                    <th className="py-2 pr-3 text-right">Email %</th>
                    <th className="py-2 pr-3 text-right">Phone %</th>
                    <th className="py-2 pr-3 text-right">Multi %</th>
                    <th className="py-2 pr-3 text-right">Blank %</th>
                    <th className="py-2 pr-3 text-right">LTV Delta</th>
                  </tr>
                </thead>
                <tbody>
                  {storeRows.map((row) => (
                    <tr key={row.storeName} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-700">{row.storeName}</td>
                      <td className="py-2 pr-3 text-right">
                        {row.customers.toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-right text-slate-600">
                        {row.emailPct}%
                      </td>
                      <td className="py-2 pr-3 text-right text-slate-600">
                        {row.phonePct}%
                      </td>
                      <td className="py-2 pr-3 text-right text-emerald-600">
                        {row.multiPct}%
                      </td>
                      <td className="py-2 pr-3 text-right text-slate-400">
                        {row.blankPct}%
                      </td>
                      <td className="py-2 pr-3 text-right text-emerald-600">
                        +${row.ltvDelta}
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

interface LtvTileProps {
  label: string;
  value: string;
  helper?: string;
}

const LtvTile: React.FC<LtvTileProps> = ({ label, value, helper }) => (
  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm flex flex-col justify-between">
    <span className="text-[11px] text-slate-500">{label}</span>
    <span className="mt-1 text-base font-semibold text-slate-900">{value}</span>
    {helper && <span className="mt-0.5 text-[11px] text-slate-500">{helper}</span>}
  </div>
);

interface BarSegment {
  label: string;
  value: number;
  color: string;
}

const BarStack: React.FC<{ segments: BarSegment[] }> = ({ segments }) => {
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

export default DataCaptureLtv;
