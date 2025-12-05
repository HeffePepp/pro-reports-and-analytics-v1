import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type ProductSalesSummary = {
  storeGroupName: string;
  periodLabel: string;
  totalSales: number;
  vendorName: string;
  vendorRevenue: number;
  vendorInvCount: number;
};

type ProductSalesRow = {
  storeName: string;
  month: string;
  totalSales: number;
  vendorRevenue: number;
  vendorInvCount: number;
};

const productSummary: ProductSalesSummary = {
  storeGroupName: "All Stores",
  periodLabel: "Last 6 months",
  totalSales: 640000,
  vendorName: "Royal Purple",
  vendorRevenue: 204000,
  vendorInvCount: 4620,
};

const productRows: ProductSalesRow[] = [
  {
    storeName: "Vallejo, CA",
    month: "2024-07",
    totalSales: 112000,
    vendorRevenue: 38400,
    vendorInvCount: 980,
  },
  {
    storeName: "Napa, CA",
    month: "2024-07",
    totalSales: 88000,
    vendorRevenue: 29400,
    vendorInvCount: 720,
  },
  {
    storeName: "Fairfield, CA",
    month: "2024-07",
    totalSales: 76000,
    vendorRevenue: 25600,
    vendorInvCount: 640,
  },
];

const ProductSalesPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Royal Purple represents roughly one-third of total oil-related revenue across this store group.",
    "A few stores are driving outsized vendor performance and can be used as best-practice examples.",
    "Under-penetrated stores are ideal candidates for joint upgrade campaigns with your distributor.",
  ]);

  const vendorSharePct = useMemo(
    () => Math.round((productSummary.vendorRevenue / productSummary.totalSales) * 100),
    []
  );

  const avgTicketVendor = useMemo(
    () =>
      productSummary.vendorInvCount
        ? productSummary.vendorRevenue / productSummary.vendorInvCount
        : 0,
    []
  );

  const regenerateInsights = () => {
    setInsights([
      `${productSummary.vendorName} is generating about ${vendorSharePct}% of oil-related revenue.`,
      `Avg ticket for invoices including ${productSummary.vendorName} is roughly $${avgTicketVendor.toFixed(
        0
      )}.`,
      "Use this report in vendor meetings to highlight growth, co-op wins and upgrade opportunities by store.",
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
            <span className="font-medium text-slate-700">Product Sales</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              Store group:{" "}
              <span className="font-medium">{productSummary.storeGroupName}</span>
            </span>
            <span>
              Period:{" "}
              <span className="font-medium">{productSummary.periodLabel}</span>
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
          {/* Title + tiles */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                Product Sales – {productSummary.vendorName}
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Vendor revenue and invoices by store and month. Use this view in
                distributor meetings to highlight growth and opportunities.
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Total sales</div>
                <div className="mt-0.5 text-base font-semibold">
                  ${productSummary.totalSales.toLocaleString()}
                </div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">{productSummary.vendorName} revenue</div>
                <div className="mt-0.5 text-base font-semibold">
                  ${productSummary.vendorRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <ProductTile
              label={`${productSummary.vendorName} share`}
              value={`${vendorSharePct}%`}
            />
            <ProductTile
              label="Vendor invoices"
              value={productSummary.vendorInvCount.toLocaleString()}
            />
            <ProductTile
              label="Avg ticket (vendor)"
              value={`$${avgTicketVendor.toFixed(0)}`}
            />
            <ProductTile
              label="Total stores (demo)"
              value="3"
            />
            <ProductTile
              label="Period"
              value={productSummary.periodLabel}
            />
          </div>

          {/* Insights + table */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
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
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-slate-400">
                In the full app, this panel will call Lovable/OpenAI with live vendor
                metrics to generate talking points and opportunity lists for vendor
                reps.
              </p>
            </div>

            {/* Table */}
            <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-sm font-semibold text-slate-800">
                  Store/month breakdown
                </h2>
                <span className="text-[11px] text-slate-400">
                  Vendor revenue and invoices by store (dummy data)
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                      <th className="py-2 pr-3">Store</th>
                      <th className="py-2 pr-3">Month</th>
                      <th className="py-2 pr-3 text-right">Total sales</th>
                      <th className="py-2 pr-3 text-right">
                        {productSummary.vendorName} revenue
                      </th>
                      <th className="py-2 pr-3 text-right">
                        {productSummary.vendorName} invoices
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {productRows.map((row) => (
                      <tr key={row.storeName + row.month} className="border-t border-slate-100">
                        <td className="py-2 pr-3 text-slate-700">{row.storeName}</td>
                        <td className="py-2 pr-3 text-slate-600">{row.month}</td>
                        <td className="py-2 pr-3 text-right">
                          ${row.totalSales.toLocaleString()}
                        </td>
                        <td className="py-2 pr-3 text-right text-indigo-600">
                          ${row.vendorRevenue.toLocaleString()}
                        </td>
                        <td className="py-2 pr-3 text-right text-indigo-600">
                          {row.vendorInvCount.toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

const ProductTile: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm flex flex-col justify-between">
    <span className="text-[11px] text-slate-500">{label}</span>
    <span className="mt-1 text-base font-semibold text-slate-900">
      {value}
    </span>
  </div>
);

export default ProductSalesPage;
