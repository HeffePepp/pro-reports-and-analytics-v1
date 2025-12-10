import React, { useMemo, useState } from "react";

type OilTypeRow = {
  oilType: string;
  ros: number;
  revenue: number;
  avgTicket: number;
};

const OIL_TYPES: OilTypeRow[] = [
  { oilType: "Conventional", ros: 1320, revenue: 101200, avgTicket: 76 },
  { oilType: "High Mileage", ros: 620, revenue: 61200, avgTicket: 99 },
  { oilType: "Synthetic Blend", ros: 980, revenue: 95600, avgTicket: 98 },
  { oilType: "Full Synthetic", ros: 1360, revenue: 134400, avgTicket: 99 },
];

type Tab = "overview" | "details";

const getShareColorClass = (pct: number): string => {
  if (pct >= 35) return "text-emerald-600";
  if (pct >= 25) return "text-sky-600";
  return "text-slate-800";
};

export const OilTypePerformanceTile: React.FC = () => {
  const [tab, setTab] = useState<Tab>("overview");

  const totalRevenue = useMemo(
    () => OIL_TYPES.reduce((sum, row) => sum + row.revenue, 0),
    []
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header + pill tabs */}
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900">
            Revenue mix by oil type
          </h2>
          <p className="text-[11px] text-slate-500">
            Relative revenue and RO mix by oil type – switch tabs for overview
            vs. details.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1 text-[11px]">
          {(["overview", "details"] as Tab[]).map((t) => {
            const isActive = t === tab;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full px-3 py-1 transition ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                {t === "overview" ? "Overview" : "Details"}
              </button>
            );
          })}
        </div>
      </header>

      {/* OVERVIEW TAB */}
      {tab === "overview" && (
        <div className="mt-4 divide-y divide-slate-100">
          {OIL_TYPES.map((row) => {
            const sharePct =
              totalRevenue > 0 ? (row.revenue / totalRevenue) * 100 : 0;

            return (
              <div key={row.oilType} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: oil type + basic stats */}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-xs font-semibold text-slate-900">
                      {row.oilType}
                    </div>
                    <div className="mt-1 text-[11px] text-slate-500">
                      {row.ros.toLocaleString()} ROs · Avg ticket{" "}
                      <span className="font-medium">
                        $
                        {row.avgTicket.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Right: revenue + share */}
                  <div className="text-right">
                    <div className="text-[11px] uppercase tracking-wide text-slate-500">
                      Revenue
                    </div>
                    <div className="text-sm font-semibold text-slate-900">
                      {row.revenue.toLocaleString("en-US", {
                        style: "currency",
                        currency: "USD",
                        maximumFractionDigits: 0,
                      })}
                    </div>
                    <div
                      className={`mt-0.5 text-[11px] font-medium ${getShareColorClass(
                        sharePct
                      )}`}
                    >
                      {sharePct.toFixed(1)}% of oil revenue
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* DETAILS TAB */}
      {tab === "details" && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3 text-left font-medium">Oil type</th>
                <th className="py-2 pr-3 text-right font-medium">ROs</th>
                <th className="py-2 pr-3 text-right font-medium">Revenue</th>
                <th className="py-2 pl-3 text-right font-medium">Avg ticket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {OIL_TYPES.map((row) => (
                <tr key={row.oilType}>
                  <td className="py-3 pr-3 align-middle text-xs text-slate-900">
                    {row.oilType}
                  </td>
                  <td className="py-3 pr-3 text-right align-middle text-xs text-slate-900">
                    {row.ros.toLocaleString()}
                  </td>
                  <td className="py-3 pr-3 text-right align-middle text-xs text-slate-900">
                    {row.revenue.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="py-3 pl-3 text-right align-middle text-xs text-slate-900">
                    $
                    {row.avgTicket.toLocaleString("en-US", {
                      maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default OilTypePerformanceTile;
