import React, { useState, useMemo } from "react";

type CouponKind = "coupon" | "discount";

type CouponRow = {
  code: string;
  description: string;
  kind: CouponKind;
  redemptions: number;
  avgTicket: number;
  revenue: number;
};

const COUPON_ROWS: CouponRow[] = [
  {
    code: "OIL10",
    description: "$10 off any oil change",
    kind: "coupon",
    redemptions: 980,
    avgTicket: 94,
    revenue: 92200,
  },
  {
    code: "SYN20",
    description: "$20 off synthetic oil",
    kind: "coupon",
    redemptions: 640,
    avgTicket: 138,
    revenue: 88320,
  },
  {
    code: "VIP25",
    description: "$25 off ticket over $150",
    kind: "coupon",
    redemptions: 420,
    avgTicket: 186,
    revenue: 78120,
  },
  {
    code: "WEB15",
    description: "15% off web-only offer",
    kind: "discount",
    redemptions: 760,
    avgTicket: 112,
    revenue: 85120,
  },
  {
    code: "WELCOME5",
    description: "$5 off new customer",
    kind: "coupon",
    redemptions: 1020,
    avgTicket: 76,
    revenue: 77520,
  },
];

const basePillClasses =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase";
const couponColorClasses = "bg-sky-50 border-sky-100 text-sky-700";
const discountColorClasses = "bg-emerald-50 border-emerald-100 text-emerald-700";

const getPillClassesForKind = (kind: CouponKind) =>
  `${basePillClasses} ${kind === "coupon" ? couponColorClasses : discountColorClasses}`;

type Tab = "overview" | "details";

export const CouponPerformanceTile: React.FC = () => {
  const [tab, setTab] = useState<Tab>("overview");

  const totalRedemptions = useMemo(
    () => COUPON_ROWS.reduce((sum, row) => sum + row.redemptions, 0),
    []
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header + pill tabs */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Coupon/Discount Details
          </h2>
          <p className="mt-1 text-[11px] text-slate-500">
            Performance by coupon or discount code. Color indicates offer type.
          </p>

          {/* Visual key */}
          <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className={`${basePillClasses} ${couponColorClasses}`}>
                CODE
              </span>
              <span>Coupon</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`${basePillClasses} ${discountColorClasses}`}>
                CODE
              </span>
              <span>Discount</span>
            </div>
          </div>
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
        <div className="divide-y divide-slate-100">
          {COUPON_ROWS.map((row) => {
            const usagePct =
              totalRedemptions > 0
                ? (row.redemptions / totalRedemptions) * 100
                : 0;

            return (
              <div key={row.code} className="py-3 first:pt-0 last:pb-0">
                <div className="flex items-start justify-between gap-4">
                  {/* Left: code pill + description */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={getPillClassesForKind(row.kind)}>
                        {row.code}
                      </span>
                      <span className="truncate text-sm font-semibold text-slate-900">
                        {row.description}
                      </span>
                    </div>
                  </div>

                  {/* Right: metrics (redemptions, avg ticket, revenue, % usage) */}
                  <div className="shrink-0 min-w-[220px] text-[11px] text-slate-500 text-right">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
                      <div>Redemptions</div>
                      <div className="font-semibold text-slate-900">
                        {row.redemptions.toLocaleString()}
                      </div>

                      <div>Avg ticket</div>
                      <div className="font-semibold text-slate-900">
                        ${row.avgTicket.toLocaleString("en-US", {
                          maximumFractionDigits: 0,
                        })}
                      </div>

                      <div>Revenue</div>
                      <div className="font-semibold text-slate-900">
                        {row.revenue.toLocaleString("en-US", {
                          style: "currency",
                          currency: "USD",
                          maximumFractionDigits: 0,
                        })}
                      </div>

                      <div>% of redemptions</div>
                      <div className="font-semibold text-emerald-600">
                        {usagePct.toFixed(1)}%
                      </div>
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
        <div className="mt-1 overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-[11px] uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3 text-left">Coupon / Discount</th>
                <th className="py-2 pr-3 text-right">Redemptions</th>
                <th className="py-2 pr-3 text-right">Avg ticket</th>
                <th className="py-2 pr-3 text-right">Revenue</th>
                <th className="py-2 pr-3 text-right">% Usage</th>
              </tr>
            </thead>
            <tbody>
              {COUPON_ROWS.map((row) => {
                const usagePct =
                  totalRedemptions > 0
                    ? (row.redemptions / totalRedemptions) * 100
                    : 0;

                return (
                  <tr key={row.code} className="border-t border-slate-100">
                    <td className="py-2 pr-3 text-slate-800">
                      <div className="flex items-center gap-2">
                        <span className={getPillClassesForKind(row.kind)}>
                          {row.code}
                        </span>
                        <span>{row.description}</span>
                      </div>
                    </td>
                    <td className="py-2 pr-3 text-right">
                      {row.redemptions.toLocaleString()}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      ${row.avgTicket.toLocaleString()}
                    </td>
                    <td className="py-2 pr-3 text-right">
                      ${row.revenue.toLocaleString()}
                    </td>
                    <td className="py-2 pr-3 text-right text-emerald-600 font-semibold">
                      {usagePct.toFixed(1)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default CouponPerformanceTile;
