import React, { useState } from "react";

type CouponRow = {
  code: string;
  name: string;
  redemptions: number;
  avgDiscountPct: number;
  avgTicket: number;
  revenue: number;
};

const COUPON_ROWS: CouponRow[] = [
  {
    code: "OIL10",
    name: "$10 off any oil change",
    redemptions: 980,
    avgDiscountPct: 9.8,
    avgTicket: 94,
    revenue: 92200,
  },
  {
    code: "SYN20",
    name: "$20 off synthetic oil",
    redemptions: 640,
    avgDiscountPct: 12.7,
    avgTicket: 138,
    revenue: 88320,
  },
  {
    code: "VIP25",
    name: "$25 off ticket over $150",
    redemptions: 420,
    avgDiscountPct: 13.4,
    avgTicket: 186,
    revenue: 78120,
  },
  {
    code: "WEB15",
    name: "15% off web-only offer",
    redemptions: 760,
    avgDiscountPct: 15.0,
    avgTicket: 112,
    revenue: 85120,
  },
  {
    code: "WELCOME5",
    name: "$5 off new customer",
    redemptions: 1020,
    avgDiscountPct: 6.2,
    avgTicket: 76,
    revenue: 77520,
  },
];

type Tab = "overview" | "details";

export const CouponPerformanceTile: React.FC = () => {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header + pill tabs */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Coupon/Discount Details
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            Performance by coupon code – switch tabs for overview vs. details.
          </p>
        </div>

        <div className="inline-flex rounded-full bg-slate-100 p-1 text-[11px]">
          <button
            type="button"
            onClick={() => setTab("overview")}
            className={`px-3 py-1 rounded-full font-medium ${
              tab === "overview"
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Overview
          </button>
          <button
            type="button"
            onClick={() => setTab("details")}
            className={`px-3 py-1 rounded-full font-medium ${
              tab === "details"
                ? "bg-white shadow-sm text-slate-900"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            Details
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {tab === "overview" && (
        <div className="divide-y divide-slate-100 text-xs text-slate-800">
          {COUPON_ROWS.map((row) => (
            <div key={row.code} className="py-3 flex items-start justify-between gap-4">
              {/* Left: code + name + basics */}
              <div>
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full border border-slate-200 text-[11px] font-semibold text-slate-700">
                    {row.code}
                  </span>
                  <span className="text-sm font-semibold text-slate-900">
                    {row.name}
                  </span>
                </div>
                <div className="mt-1 text-[11px] text-slate-500">
                  {row.redemptions.toLocaleString()} redemptions · Avg ticket $
                  {row.avgTicket.toLocaleString()}
                </div>
              </div>

              {/* Right: key discount metric only */}
              <div className="text-right min-w-[120px]">
                <div className="text-sm font-semibold text-emerald-600">
                  {row.avgDiscountPct.toFixed(1)}% avg discount
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  ${row.revenue.toLocaleString()} revenue
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILS TAB */}
      {tab === "details" && (
        <div className="mt-1 overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3 text-left">Coupon / Discount</th>
                <th className="py-2 pr-3 text-right">Redemptions</th>
                <th className="py-2 pr-3 text-right">Avg discount %</th>
                <th className="py-2 pr-3 text-right">Avg ticket</th>
                <th className="py-2 pr-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {COUPON_ROWS.map((row) => (
                <tr key={row.code} className="border-t border-slate-100">
                  <td className="py-2 pr-3 text-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full border border-slate-200 text-[11px] font-semibold text-slate-700">
                        {row.code}
                      </span>
                      <span>{row.name}</span>
                    </div>
                  </td>
                  <td className="py-2 pr-3 text-right">
                    {row.redemptions.toLocaleString()}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    {row.avgDiscountPct.toFixed(1)}%
                  </td>
                  <td className="py-2 pr-3 text-right">
                    ${row.avgTicket.toLocaleString()}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    ${row.revenue.toLocaleString()}
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

export default CouponPerformanceTile;
