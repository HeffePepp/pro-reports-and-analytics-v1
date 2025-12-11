import React, { useMemo } from "react";

type DiscountByCouponRow = {
  code: string;
  discountAmount: number;
};

type Props = {
  rows: DiscountByCouponRow[];
};

const SEGMENT_COLORS = [
  "bg-sky-200",
  "bg-violet-200",
  "bg-emerald-200",
  "bg-amber-200",
  "bg-rose-200",
  "bg-slate-200",
];

const DOT_COLORS = [
  "bg-sky-300",
  "bg-violet-300",
  "bg-emerald-300",
  "bg-amber-300",
  "bg-rose-300",
  "bg-slate-300",
];

export const DiscountByCouponShareChart: React.FC<Props> = ({ rows }) => {
  const totalDiscount = useMemo(
    () => rows.reduce((sum, row) => sum + row.discountAmount, 0),
    [rows]
  );

  if (!rows.length || totalDiscount <= 0) return null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="text-[13px] font-semibold text-slate-900">
          Discount $ by coupon
        </div>
        <div className="text-[11px] text-slate-500">
          Share of total discount amount
        </div>
      </div>

      {/* Segmented bar */}
      <div className="mt-3 flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
        {rows.map((row, index) => {
          const sharePct = (row.discountAmount / totalDiscount) * 100;
          if (sharePct <= 0) return null;

          return (
            <div
              key={row.code}
              className={`${SEGMENT_COLORS[index % SEGMENT_COLORS.length]} h-full`}
              style={{ width: `${sharePct}%` }}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-slate-600">
        {rows.map((row, index) => {
          const sharePct = (row.discountAmount / totalDiscount) * 100;
          if (sharePct <= 0) return null;

          const colorClass = DOT_COLORS[index % DOT_COLORS.length];

          return (
            <div key={row.code} className="inline-flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${colorClass}`} />
              <span className="font-medium text-slate-700">{row.code}</span>
              <span className="text-slate-500">
                {sharePct.toFixed(1)}%
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default DiscountByCouponShareChart;
