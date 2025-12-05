import React, { useState } from "react";
import { Link } from "react-router-dom";

type ProductSalesSummary = {
  storeName: string;
  periodLabel: string;
  totalSales: number;
  totalRevenue: number;
  topProduct: string;
  avgTicket: number;
};

type ProductRow = {
  productName: string;
  unitsSold: number;
  revenue: number;
  percentOfSales: number;
};

type StoreRow = {
  storeName: string;
  totalSales: number;
  revenue: number;
  avgTicket: number;
};

const summary: ProductSalesSummary = {
  storeName: "Vallejo, CA",
  periodLabel: "Last 12 months",
  totalSales: 12450,
  totalRevenue: 523800,
  topProduct: "Full Synthetic Oil Change",
  avgTicket: 42.07,
};

const productRows: ProductRow[] = [
  { productName: "Full Synthetic Oil Change", unitsSold: 5820, revenue: 290820, percentOfSales: 47 },
  { productName: "Synthetic Blend Oil Change", unitsSold: 3480, revenue: 121800, percentOfSales: 28 },
  { productName: "Conventional Oil Change", unitsSold: 1860, revenue: 55800, percentOfSales: 15 },
  { productName: "High Mileage Oil Change", unitsSold: 1290, revenue: 55380, percentOfSales: 10 },
];

const storeRows: StoreRow[] = [
  { storeName: "Vallejo, CA", totalSales: 12450, revenue: 523800, avgTicket: 42.07 },
  { storeName: "Napa, CA", totalSales: 8920, revenue: 374640, avgTicket: 42.00 },
  { storeName: "Fairfield, CA", totalSales: 6780, revenue: 298320, avgTicket: 44.00 },
];

const ProductSalesPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Full Synthetic leads with 47% of sales – upsell opportunities exist.",
    "Fairfield has the highest average ticket at $44.00.",
    "High Mileage products are underperforming – consider targeted promotions.",
  ]);

  const regenerateInsights = () => {
    setInsights([
      "Synthetic blend customers convert to full synthetic 23% of the time.",
      "Bundle opportunities: air filter add-on increases ticket by $12 avg.",
      "Seasonal trend: synthetic sales peak in winter months.",
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
            <span className="font-medium text-slate-700">Product Sales</span>
          </div>
          <div className="flex items-center gap-3 text-xs">
            <span className="hidden sm:inline text-slate-500">Store: <span className="font-medium">{summary.storeName}</span></span>
            <span className="hidden sm:inline text-slate-500">Period: <span className="font-medium">{summary.periodLabel}</span></span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Product Sales</h1>
              <p className="mt-1 text-sm text-slate-500">Sales breakdown by product for {summary.storeName}. Track revenue and product mix.</p>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Total revenue</div>
                <div className="mt-0.5 text-base font-semibold">${summary.totalRevenue.toLocaleString()}</div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Avg ticket</div>
                <div className="mt-0.5 text-base font-semibold">${summary.avgTicket.toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Tile label="Total sales" value={summary.totalSales.toLocaleString()} helper="Transactions in period" tone="positive" />
            <Tile label="Total revenue" value={`$${summary.totalRevenue.toLocaleString()}`} helper="Gross revenue" tone="positive" />
            <Tile label="Avg ticket" value={`$${summary.avgTicket.toFixed(2)}`} helper="Per transaction" />
            <Tile label="Top product" value={summary.topProduct} helper="47% of sales" />
          </div>

          <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-sm font-semibold text-slate-800">Product breakdown</h2>
                <span className="text-[11px] text-slate-400">Units sold and revenue by product</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                      <th className="py-2 pr-4">Product</th>
                      <th className="py-2 pr-4 text-right">Units sold</th>
                      <th className="py-2 pr-4 text-right">Revenue</th>
                      <th className="py-2 pr-4 text-right">% of sales</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productRows.map((row) => (
                      <tr key={row.productName} className="border-t border-slate-100">
                        <td className="py-2 pr-4 text-slate-700">{row.productName}</td>
                        <td className="py-2 pr-4 text-right">{row.unitsSold.toLocaleString()}</td>
                        <td className="py-2 pr-4 text-right">${row.revenue.toLocaleString()}</td>
                        <td className="py-2 pr-4 text-right text-emerald-600">{row.percentOfSales}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              <span className="text-[11px] text-slate-400">Sales performance by store</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-4">Store</th>
                    <th className="py-2 pr-4 text-right">Total sales</th>
                    <th className="py-2 pr-4 text-right">Revenue</th>
                    <th className="py-2 pr-4 text-right">Avg ticket</th>
                  </tr>
                </thead>
                <tbody>
                  {storeRows.map((row) => (
                    <tr key={row.storeName} className="border-t border-slate-100">
                      <td className="py-2 pr-4 text-slate-700">{row.storeName}</td>
                      <td className="py-2 pr-4 text-right">{row.totalSales.toLocaleString()}</td>
                      <td className="py-2 pr-4 text-right">${row.revenue.toLocaleString()}</td>
                      <td className="py-2 pr-4 text-right text-emerald-600">${row.avgTicket.toFixed(2)}</td>
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

export default ProductSalesPage;
