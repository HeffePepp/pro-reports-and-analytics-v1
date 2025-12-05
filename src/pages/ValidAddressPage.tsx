import React, { useState } from "react";
import { Link } from "react-router-dom";

type ValidAddressSummary = {
  storeName: string;
  periodLabel: string;
  totalAddresses: number;
  validCount: number;
  invalidCount: number;
  unverifiedCount: number;
  validPercent: number;
};

type StoreRow = {
  storeName: string;
  totalAddresses: number;
  validPercent: number;
  invalidPercent: number;
  unverifiedPercent: number;
};

const summary: ValidAddressSummary = {
  storeName: "Vallejo, CA",
  periodLabel: "Last 12 months",
  totalAddresses: 4210,
  validCount: 3368,
  invalidCount: 421,
  unverifiedCount: 421,
  validPercent: 80,
};

const storeRows: StoreRow[] = [
  { storeName: "Vallejo, CA", totalAddresses: 4210, validPercent: 80, invalidPercent: 10, unverifiedPercent: 10 },
  { storeName: "Napa, CA", totalAddresses: 2052, validPercent: 75, invalidPercent: 15, unverifiedPercent: 10 },
  { storeName: "Fairfield, CA", totalAddresses: 1766, validPercent: 85, invalidPercent: 8, unverifiedPercent: 7 },
];

const ValidAddressPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "80% of addresses are valid – industry benchmark is 85%.",
    "Invalid addresses cost ~$0.50 each in wasted direct mail.",
    "Run address validation at point of capture to improve accuracy.",
  ]);

  const invalidPercent = Math.round((summary.invalidCount / summary.totalAddresses) * 100);
  const unverifiedPercent = Math.round((summary.unverifiedCount / summary.totalAddresses) * 100);

  const regenerateInsights = () => {
    setInsights([
      "Fairfield has the best address quality at 85% valid.",
      "Consider USPS address verification API integration.",
      "Customers with valid addresses have 18% higher retention.",
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      <aside className="hidden md:flex md:flex-col w-64 bg-slate-900 text-slate-100">
        <div className="flex items-center gap-2 px-5 h-14 border-b border-slate-800">
          <div className="h-8 w-8 rounded-xl bg-emerald-400 flex items-center justify-center font-bold text-slate-900">TP</div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Throttle Pro</span>
            <span className="text-[11px] text-slate-400">Reporting Prototype</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 text-sm space-y-1">
          {["Dashboard", "Customers", "Campaigns", "Reports & Insights", "Organizations", "Settings"].map((item) => (
            <Link key={item} to={item === "Reports & Insights" ? "/" : "#"} className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 ${item === "Reports & Insights" ? "bg-slate-800 font-medium" : "text-slate-300"}`}>
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
              <span>{item}</span>
            </Link>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-400">
          Signed in as<br /><span className="text-slate-200">demo@throttlepro.com</span>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-slate-400 hover:text-slate-600">Home</Link>
            <span className="text-slate-400">/</span>
            <Link to="/" className="text-slate-400 hover:text-slate-600">Reports & Insights</Link>
            <span className="text-slate-400">/</span>
            <span className="font-medium text-slate-700">Valid Address</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline text-slate-500">Store: <span className="font-medium">{summary.storeName}</span></span>
            <span className="hidden sm:inline text-slate-500">Period: <span className="font-medium">{summary.periodLabel}</span></span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Valid Address</h1>
              <p className="mt-1 text-sm text-slate-500">Address validation overview for {summary.storeName}. Monitor valid, invalid, and unverified addresses.</p>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Total addresses</div>
                <div className="mt-0.5 text-base font-semibold">{summary.totalAddresses.toLocaleString()}</div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Valid rate</div>
                <div className="mt-0.5 text-base font-semibold">{summary.validPercent}%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Tile label="Valid addresses" value={`${summary.validPercent}%`} helper={`${summary.validCount.toLocaleString()} addresses`} tone="positive" />
            <Tile label="Invalid addresses" value={`${invalidPercent}%`} helper={`${summary.invalidCount.toLocaleString()} addresses`} tone="negative" />
            <Tile label="Unverified" value={`${unverifiedPercent}%`} helper={`${summary.unverifiedCount.toLocaleString()} addresses`} tone="warn" />
            <Tile label="Total addresses" value={summary.totalAddresses.toLocaleString()} helper="With address on file" />
          </div>

          <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-sm font-semibold text-slate-800">Address validation status</h2>
                <span className="text-[11px] text-slate-400">% of addresses by validation status</span>
              </div>
              <div className="space-y-3">
                <div className="flex w-full h-4 rounded-full overflow-hidden bg-slate-100">
                  <div className="h-full bg-emerald-400" style={{ width: `${summary.validPercent}%` }} title={`Valid ${summary.validPercent}%`} />
                  <div className="h-full bg-rose-400" style={{ width: `${invalidPercent}%` }} title={`Invalid ${invalidPercent}%`} />
                  <div className="h-full bg-amber-400" style={{ width: `${unverifiedPercent}%` }} title={`Unverified ${unverifiedPercent}%`} />
                </div>
                <div className="flex flex-wrap gap-3 text-[11px] text-slate-600">
                  <LegendDot colorClass="bg-emerald-400" label={`Valid · ${summary.validPercent}%`} />
                  <LegendDot colorClass="bg-rose-400" label={`Invalid · ${invalidPercent}%`} />
                  <LegendDot colorClass="bg-amber-400" label={`Unverified · ${unverifiedPercent}%`} />
                </div>
              </div>
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
            </div>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-sm font-semibold text-slate-800">Stores overview</h2>
              <span className="text-[11px] text-slate-400">Address validation by store</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-4">Store</th>
                    <th className="py-2 pr-4 text-right">Total addresses</th>
                    <th className="py-2 pr-4 text-right">Valid %</th>
                    <th className="py-2 pr-4 text-right">Invalid %</th>
                    <th className="py-2 pr-4 text-right">Unverified %</th>
                  </tr>
                </thead>
                <tbody>
                  {storeRows.map((row) => (
                    <tr key={row.storeName} className="border-t border-slate-100">
                      <td className="py-2 pr-4 text-slate-700">{row.storeName}</td>
                      <td className="py-2 pr-4 text-right">{row.totalAddresses.toLocaleString()}</td>
                      <td className="py-2 pr-4 text-right text-emerald-600">{row.validPercent}%</td>
                      <td className="py-2 pr-4 text-right text-rose-600">{row.invalidPercent}%</td>
                      <td className="py-2 pr-4 text-right text-amber-600">{row.unverifiedPercent}%</td>
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

interface TileProps {
  label: string;
  value: string;
  helper?: string;
  tone?: "positive" | "warn" | "negative";
}

const Tile: React.FC<TileProps> = ({ label, value, helper, tone }) => {
  const toneClasses = tone === "positive" ? "border-emerald-100 bg-emerald-50" : tone === "warn" ? "border-amber-100 bg-amber-50" : tone === "negative" ? "border-rose-100 bg-rose-50" : "border-slate-200 bg-white";
  return (
    <div className={`rounded-2xl border ${toneClasses} px-3 py-2 shadow-sm flex flex-col justify-between`}>
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="mt-1 text-base font-semibold text-slate-900">{value}</span>
      {helper && <span className="mt-0.5 text-[11px] text-slate-500">{helper}</span>}
    </div>
  );
};

const LegendDot: React.FC<{ colorClass: string; label: string }> = ({ colorClass, label }) => (
  <span className="inline-flex items-center gap-1">
    <span className={`h-2 w-2 rounded-full ${colorClass}`} />
    <span>{label}</span>
  </span>
);

export default ValidAddressPage;
