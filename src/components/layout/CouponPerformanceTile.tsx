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

      {/* Rows */}
      <div className="mt-4 divide-y divide-slate-100">
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
    </section>
  );
};

export default CouponPerformanceTile;
