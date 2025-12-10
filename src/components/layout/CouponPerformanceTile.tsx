import React, { useState } from "react";

type CouponRow = {
  code: string;
  description: string;
  channel: string;
  redemptions: number;
  avgTicket: number;
  discountPct: number;
};

const COUPONS: CouponRow[] = [
  {
    code: "OIL10",
    description: "$10 off any oil change",
    channel: "Email",
    redemptions: 980,
    avgTicket: 94,
    discountPct: 9.8,
  },
  {
    code: "SYN20",
    description: "$20 off synthetic oil",
    channel: "Postcard",
    redemptions: 640,
    avgTicket: 138,
    discountPct: 12.7,
  },
  {
    code: "VIP25",
    description: "$25 off ticket over $150",
    channel: "Mixed",
    redemptions: 420,
    avgTicket: 186,
    discountPct: 13.4,
  },
  {
    code: "WEB15",
    description: "15% off web-only offer",
    channel: "Email",
    redemptions: 760,
    avgTicket: 112,
    discountPct: 15.0,
  },
  {
    code: "WELCOME5",
    description: "$5 off new customer",
    channel: "POS",
    redemptions: 1020,
    avgTicket: 76,
    discountPct: 6.2,
  },
];

type Tab = "overview" | "details";

const getDiscountColorClass = (pct: number): string => {
  if (pct >= 15) return "text-emerald-600";
  if (pct >= 10) return "text-sky-600";
  return "text-slate-700";
};

export const CouponPerformanceTile: React.FC = () => {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header + pill tabs */}
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900">
            Discount richness by coupon
          </h2>
          <p className="text-[11px] text-slate-500">
            Performance by coupon code – switch tabs for overview vs. details.
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

      {/* OVERVIEW TAB – formatted like Suggested Service overview (no bar) */}
      {tab === "overview" && (
        <div className="mt-4 divide-y divide-slate-100">
          {COUPONS.map((row) => (
            <div key={row.code} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-4">
                {/* Left side: code + description */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-900">
                    <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-mono">
                      {row.code}
                    </span>
                    <span className="truncate">{row.description}</span>
                  </div>

                  <div className="mt-1 text-[11px] text-slate-500">
                    Channel: <span className="font-medium">{row.channel}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    {row.redemptions.toLocaleString()} redemptions · Avg ticket{" "}
                    <span className="font-medium">
                      ${row.avgTicket.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>

                {/* Right side: discount % emphasis */}
                <div className="text-right">
                  <div className={`text-sm font-semibold ${getDiscountColorClass(row.discountPct)}`}>
                    {row.discountPct.toFixed(1)}% avg discount
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    Drives higher ticket value on {row.code.toUpperCase()} redemptions.
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILS TAB – same structure as current Coupon details table */}
      {tab === "details" && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3 text-left font-medium">Code</th>
                <th className="py-2 pr-3 text-left font-medium">Description</th>
                <th className="py-2 pr-3 text-left font-medium">Channel</th>
                <th className="py-2 pr-3 text-right font-medium">Redemptions</th>
                <th className="py-2 pr-3 text-right font-medium">Avg ticket</th>
                <th className="py-2 pl-3 text-right font-medium">Discount %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {COUPONS.map((row) => (
                <tr key={row.code}>
                  <td className="py-3 pr-3 align-middle font-mono text-xs text-slate-900">
                    {row.code}
                  </td>
                  <td className="py-3 pr-3 align-middle text-xs text-slate-900">
                    {row.description}
                  </td>
                  <td className="py-3 pr-3 align-middle text-xs text-slate-700">
                    {row.channel}
                  </td>
                  <td className="py-3 pr-3 text-right align-middle text-xs text-slate-900">
                    {row.redemptions.toLocaleString()}
                  </td>
                  <td className="py-3 pr-3 text-right align-middle text-xs text-slate-900">
                    ${row.avgTicket.toLocaleString("en-US", { maximumFractionDigits: 0 })}
                  </td>
                  <td className={`py-3 pl-3 text-right align-middle text-xs font-semibold ${getDiscountColorClass(row.discountPct)}`}>
                    {row.discountPct.toFixed(1)}%
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
