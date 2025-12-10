import React, { useMemo } from "react";

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

export const CouponPerformanceTile: React.FC = () => {
  const totalRedemptions = useMemo(
    () => COUPON_ROWS.reduce((sum, row) => sum + row.redemptions, 0),
    []
  );

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header: Pills as the title */}
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`${basePillClasses} ${couponColorClasses}`}>
            COUPONS
          </span>
          <span className={`${basePillClasses} ${discountColorClasses}`}>
            DISCOUNTS
          </span>
        </div>

        <p className="mt-2 text-[11px] text-slate-500">
          Performance by coupon or discount code. Color indicates offer type.
        </p>
      </header>

      {/* Details Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
              <th className="pb-2 font-medium">Code</th>
              <th className="pb-2 font-medium">Description</th>
              <th className="pb-2 font-medium text-right">Redemptions</th>
              <th className="pb-2 font-medium text-right">Avg Ticket</th>
              <th className="pb-2 font-medium text-right">Revenue</th>
              <th className="pb-2 font-medium text-right">% Usage</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {COUPON_ROWS.map((row) => {
              const usagePct =
                totalRedemptions > 0
                  ? (row.redemptions / totalRedemptions) * 100
                  : 0;

              return (
                <tr key={row.code}>
                  <td className="py-2.5">
                    <span className={getPillClassesForKind(row.kind)}>
                      {row.code}
                    </span>
                  </td>
                  <td className="py-2.5 text-sm text-slate-900">{row.description}</td>
                  <td className="py-2.5 text-right font-semibold text-slate-900">
                    {row.redemptions.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right font-semibold text-slate-900">
                    ${row.avgTicket.toLocaleString()}
                  </td>
                  <td className="py-2.5 text-right font-semibold text-slate-900">
                    {row.revenue.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    })}
                  </td>
                  <td className="py-2.5 text-right font-semibold text-emerald-600">
                    {usagePct.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default CouponPerformanceTile;
