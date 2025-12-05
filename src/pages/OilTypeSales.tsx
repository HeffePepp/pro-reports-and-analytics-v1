import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type OilType = {
  name: string;
  units: number;
  revenue: number;
  avgTicket: number;
  marginPercent: number;
};

const oilTypes: OilType[] = [
  { name: "Full Synthetic", units: 1420, revenue: 85200, avgTicket: 60, marginPercent: 42 },
  { name: "Synthetic Blend", units: 680, revenue: 27200, avgTicket: 40, marginPercent: 38 },
  { name: "High Mileage", units: 320, revenue: 14400, avgTicket: 45, marginPercent: 40 },
  { name: "Conventional", units: 180, revenue: 5400, avgTicket: 30, marginPercent: 35 },
  { name: "Diesel", units: 95, revenue: 7600, avgTicket: 80, marginPercent: 36 },
];

const OilTypeSales: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Full Synthetic dominates with 69% of units and 83% of revenue.",
    "Synthetic Blend is the second largest segment – consider upsell opportunities to Full Synthetic.",
    "Diesel has the highest average ticket at $80; target fleet accounts for growth.",
  ]);

  const totalUnits = useMemo(() => oilTypes.reduce((sum, o) => sum + o.units, 0), []);
  const totalRevenue = useMemo(() => oilTypes.reduce((sum, o) => sum + o.revenue, 0), []);
  const avgMargin = useMemo(() => {
    if (!oilTypes.length) return 0;
    return oilTypes.reduce((sum, o) => sum + o.marginPercent, 0) / oilTypes.length;
  }, []);

  const topOilType = useMemo(
    () => oilTypes.reduce((max, o) => (!max || o.revenue > max.revenue ? o : max)),
    []
  );

  const regenerateInsights = () => {
    setInsights([
      `${topOilType.name} generates ${((topOilType.revenue / totalRevenue) * 100).toFixed(0)}% of total oil revenue.`,
      "High Mileage shows strong margin at 40% – consider promoting to older vehicle owners.",
      "Conventional oil is declining; evaluate phasing out or repositioning as budget option.",
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
            <span className="font-medium text-slate-700">Oil Type Sales</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Store: <span className="font-medium">Vallejo, CA</span></span>
            <span>Period: <span className="font-medium">Last 90 days</span></span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
          {/* Title + hero tiles */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                Oil Type Sales
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Breakdown of oil change services by oil type: units sold, revenue, and margin analysis.
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Total units</div>
                <div className="mt-0.5 text-base font-semibold">
                  {totalUnits.toLocaleString()}
                </div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Total revenue</div>
                <div className="mt-0.5 text-base font-semibold">
                  ${totalRevenue.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <OilTile
              label="Total units"
              value={totalUnits.toLocaleString()}
              helper="Oil changes sold"
            />
            <OilTile
              label="Total revenue"
              value={`$${totalRevenue.toLocaleString()}`}
              helper="From oil services"
            />
            <OilTile
              label="Avg margin"
              value={`${avgMargin.toFixed(1)}%`}
              helper="Across all oil types"
            />
            <OilTile
              label="Top oil type"
              value={topOilType.name}
              helper={`$${topOilType.revenue.toLocaleString()} revenue`}
            />
            <OilTile
              label="Synthetic share"
              value={`${((oilTypes[0].units / totalUnits) * 100).toFixed(0)}%`}
              helper="Of total units"
            />
          </div>

          {/* Chart + insights */}
          <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chart */}
            <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-sm font-semibold text-slate-800">
                  Revenue by oil type
                </h2>
                <span className="text-[11px] text-slate-400">
                  Last 90 days (dummy data)
                </span>
              </div>
              <div className="space-y-3">
                {oilTypes.map((oil) => {
                  const revenuePercent = (oil.revenue / totalRevenue) * 100;
                  return (
                    <div key={oil.name} className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-600">
                        <span>{oil.name}</span>
                        <span>
                          ${oil.revenue.toLocaleString()} · {revenuePercent.toFixed(1)}%
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full bg-amber-400"
                            style={{ width: `${revenuePercent}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-slate-400 w-16 text-right">
                          {oil.units} units
                        </span>
                      </div>
                    </div>
                  );
                })}
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
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-slate-400">
                In the full app, this panel will call Lovable/OpenAI with live sales
                data for this store and period, then generate tailored guidance.
              </p>
            </div>
          </section>

          {/* Table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-sm font-semibold text-slate-800">
                Oil type details
              </h2>
              <span className="text-[11px] text-slate-400">
                Units, revenue, avg ticket and margin by oil type
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Oil Type</th>
                    <th className="py-2 pr-3 text-right">Units</th>
                    <th className="py-2 pr-3 text-right">Revenue</th>
                    <th className="py-2 pr-3 text-right">Avg Ticket</th>
                    <th className="py-2 pr-3 text-right">Margin %</th>
                    <th className="py-2 pr-3 text-right">% of Total</th>
                  </tr>
                </thead>
                <tbody>
                  {oilTypes.map((oil) => (
                    <tr key={oil.name} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-700">{oil.name}</td>
                      <td className="py-2 pr-3 text-right">{oil.units.toLocaleString()}</td>
                      <td className="py-2 pr-3 text-right">${oil.revenue.toLocaleString()}</td>
                      <td className="py-2 pr-3 text-right">${oil.avgTicket}</td>
                      <td className="py-2 pr-3 text-right">{oil.marginPercent}%</td>
                      <td className="py-2 pr-3 text-right">
                        {((oil.revenue / totalRevenue) * 100).toFixed(1)}%
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

interface OilTileProps {
  label: string;
  value: string;
  helper?: string;
}

const OilTile: React.FC<OilTileProps> = ({ label, value, helper }) => (
  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm flex flex-col justify-between">
    <span className="text-[11px] text-slate-500">{label}</span>
    <span className="mt-1 text-base font-semibold text-slate-900">{value}</span>
    {helper && <span className="mt-0.5 text-[11px] text-slate-500">{helper}</span>}
  </div>
);

export default OilTypeSales;
