import React, { useState } from "react";
import { Link } from "react-router-dom";

type CustomerDataSummary = {
  storeName: string;
  periodLabel: string;
  totalCustomers: number;
  withEmail: number;
  withPhone: number;
  withAddress: number;
  avgDataCompleteness: number;
};

type StoreRow = {
  storeName: string;
  totalCustomers: number;
  emailPercent: number;
  phonePercent: number;
  addressPercent: number;
};

const summary: CustomerDataSummary = {
  storeName: "Vallejo, CA",
  periodLabel: "Last 12 months",
  totalCustomers: 8420,
  withEmail: 6315,
  withPhone: 5894,
  withAddress: 4210,
  avgDataCompleteness: 72,
};

const storeRows: StoreRow[] = [
  { storeName: "Vallejo, CA", totalCustomers: 8420, emailPercent: 75, phonePercent: 70, addressPercent: 50 },
  { storeName: "Napa, CA", totalCustomers: 4560, emailPercent: 68, phonePercent: 62, addressPercent: 45 },
  { storeName: "Fairfield, CA", totalCustomers: 3210, emailPercent: 82, phonePercent: 78, addressPercent: 55 },
];

const CustomerDataPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Email capture is strongest at 75%, but address capture lags at 50%.",
    "Fairfield leads in data completeness – consider sharing their best practices.",
    "Focus on collecting addresses at checkout to improve direct mail ROI.",
  ]);

  const emailPercent = Math.round((summary.withEmail / summary.totalCustomers) * 100);
  const phonePercent = Math.round((summary.withPhone / summary.totalCustomers) * 100);
  const addressPercent = Math.round((summary.withAddress / summary.totalCustomers) * 100);

  const regenerateInsights = () => {
    setInsights([
      "Phone capture improved 8% this quarter – keep up the momentum.",
      "Customers with complete data have 2.3x higher LTV.",
      "Target the 25% without email with SMS opt-in campaigns.",
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
            <span className="font-medium text-slate-700">Customer Data</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline text-slate-500">Store: <span className="font-medium">{summary.storeName}</span></span>
            <span className="hidden sm:inline text-slate-500">Period: <span className="font-medium">{summary.periodLabel}</span></span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Customer Data</h1>
              <p className="mt-1 text-sm text-slate-500">Data completeness overview for {summary.storeName}. Track email, phone, and address capture rates.</p>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Total customers</div>
                <div className="mt-0.5 text-base font-semibold">{summary.totalCustomers.toLocaleString()}</div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Avg completeness</div>
                <div className="mt-0.5 text-base font-semibold">{summary.avgDataCompleteness}%</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Tile label="With email" value={`${emailPercent}%`} helper={`${summary.withEmail.toLocaleString()} customers`} tone="positive" />
            <Tile label="With phone" value={`${phonePercent}%`} helper={`${summary.withPhone.toLocaleString()} customers`} tone="positive" />
            <Tile label="With address" value={`${addressPercent}%`} helper={`${summary.withAddress.toLocaleString()} customers`} tone="warn" />
            <Tile label="Total customers" value={summary.totalCustomers.toLocaleString()} helper="Unique customers in period" />
          </div>

          <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-sm font-semibold text-slate-800">Data capture rates</h2>
                <span className="text-[11px] text-slate-400">% of customers with each data type</span>
              </div>
              <div className="space-y-3">
                <DataBar label="Email" percent={emailPercent} colorClass="bg-emerald-400" />
                <DataBar label="Phone" percent={phonePercent} colorClass="bg-sky-400" />
                <DataBar label="Address" percent={addressPercent} colorClass="bg-amber-400" />
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
              <span className="text-[11px] text-slate-400">Capture rates by store</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-4">Store</th>
                    <th className="py-2 pr-4 text-right">Total customers</th>
                    <th className="py-2 pr-4 text-right">Email %</th>
                    <th className="py-2 pr-4 text-right">Phone %</th>
                    <th className="py-2 pr-4 text-right">Address %</th>
                  </tr>
                </thead>
                <tbody>
                  {storeRows.map((row) => (
                    <tr key={row.storeName} className="border-t border-slate-100">
                      <td className="py-2 pr-4 text-slate-700">{row.storeName}</td>
                      <td className="py-2 pr-4 text-right">{row.totalCustomers.toLocaleString()}</td>
                      <td className="py-2 pr-4 text-right text-emerald-600">{row.emailPercent}%</td>
                      <td className="py-2 pr-4 text-right text-sky-600">{row.phonePercent}%</td>
                      <td className="py-2 pr-4 text-right text-amber-600">{row.addressPercent}%</td>
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

const DataBar: React.FC<{ label: string; percent: number; colorClass: string }> = ({ label, percent, colorClass }) => (
  <div className="space-y-1">
    <div className="flex justify-between text-[11px] text-slate-600">
      <span>{label}</span>
      <span>{percent}%</span>
    </div>
    <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden">
      <div className={`h-full ${colorClass}`} style={{ width: `${percent}%` }} />
    </div>
  </div>
);

export default CustomerDataPage;
