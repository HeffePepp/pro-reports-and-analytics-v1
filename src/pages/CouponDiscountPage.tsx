import React, { useState, useMemo } from "react";
import { ShellLayout, MetricTile, SummaryTile, BarStack } from "@/components/layout";

type CouponSummary = {
  storeName: string;
  periodLabel: string;
  totalRevenue: number;
  totalDiscount: number;
  redemptions: number;
  couponsCount: number;
};

type CouponRow = {
  code: string;
  label: string;
  redemptions: number;
  revenue: number;
  discountAmount: number;
  avgDiscountPct: number;
};

const couponSummary: CouponSummary = {
  storeName: "Vallejo, CA",
  periodLabel: "Last 90 days",
  totalRevenue: 101300,
  totalDiscount: 12400,
  redemptions: 1860,
  couponsCount: 5,
};

const couponRows: CouponRow[] = [
  {
    code: "OIL10",
    label: "10% off oil change",
    redemptions: 620,
    revenue: 38200,
    discountAmount: 4200,
    avgDiscountPct: 10,
  },
  {
    code: "SYN20",
    label: "$20 off synthetic",
    redemptions: 420,
    revenue: 28900,
    discountAmount: 5200,
    avgDiscountPct: 13,
  },
  {
    code: "FILTER15",
    label: "Filter bundle $15 off",
    redemptions: 320,
    revenue: 16200,
    discountAmount: 1700,
    avgDiscountPct: 9,
  },
  {
    code: "WELCOME25",
    label: "New customer $25 off",
    redemptions: 260,
    revenue: 14200,
    discountAmount: 2100,
    avgDiscountPct: 15,
  },
  {
    code: "WINTER5",
    label: "$5 off any service",
    redemptions: 240,
    revenue: 14000,
    discountAmount: 1200,
    avgDiscountPct: 6,
  },
];

const CouponDiscountPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "SYN20 drives strong revenue but has a higher average discount than other offers.",
    "WELCOME25 is effective for acquisition but should be monitored for margin impact.",
    "WINTER5 is a low-risk coupon that can be used for broad awareness without heavy margin erosion.",
  ]);

  const discountPctOfRev = useMemo(
    () => (couponSummary.totalDiscount / couponSummary.totalRevenue) * 100,
    []
  );

  const avgDiscountPerRedemption = useMemo(
    () => couponSummary.totalDiscount / couponSummary.redemptions,
    []
  );

  const discountSegments = useMemo(
    () =>
      couponRows.map((c, idx) => ({
        label: c.code,
        value: c.discountAmount,
        color:
          idx === 0
            ? "bg-sky-400"
            : idx === 1
            ? "bg-indigo-500"
            : idx === 2
            ? "bg-emerald-400"
            : idx === 3
            ? "bg-amber-400"
            : "bg-slate-400",
      })),
    []
  );

  const regenerateInsights = () => {
    const topRev = couponRows.reduce((best, r) =>
      !best || r.revenue > best.revenue ? r : best
    );
    const highestDiscPct = couponRows.reduce((best, r) =>
      !best || r.avgDiscountPct > best.avgDiscountPct ? r : best
    );

    setInsights([
      `${topRev.code} (${topRev.label}) generates the most revenue at $${topRev.revenue.toLocaleString()}.`,
      `${highestDiscPct.code} averages a ${highestDiscPct.avgDiscountPct}% discount; ensure add-on services offset the margin hit.`,
      `Overall discounts are ${discountPctOfRev.toFixed(
        1
      )}% of revenue, or about $${avgDiscountPerRedemption.toFixed(
        2
      )} per redemption.`,
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Coupon / Discount Analysis" },
      ]}
      rightInfo={
        <>
          <span>
            Store: <span className="font-medium">{couponSummary.storeName}</span>
          </span>
          <span>
            Period:{" "}
            <span className="font-medium">{couponSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Coupon / Discount Analysis
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            See which offers drive profitable visits and where discounting may be
            eroding margin.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <SummaryTile
            label="Total revenue"
            value={`$${couponSummary.totalRevenue.toLocaleString()}`}
          />
          <SummaryTile
            label="Total discount"
            value={`$${couponSummary.totalDiscount.toLocaleString()}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile
          label="Discount as % of rev"
          value={`${discountPctOfRev.toFixed(1)}%`}
        />
        <MetricTile
          label="Redemptions"
          value={couponSummary.redemptions.toLocaleString()}
        />
        <MetricTile
          label="Avg discount / redemption"
          value={`$${avgDiscountPerRedemption.toFixed(2)}`}
        />
        <MetricTile
          label="Active coupons"
          value={couponSummary.couponsCount.toString()}
        />
        <MetricTile
          label="Avg ticket (approx)"
          value={`$${(
            couponSummary.totalRevenue / couponSummary.redemptions
          ).toFixed(0)}`}
        />
      </div>

      <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Discount mix */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">
              Discount $ by coupon
            </h2>
            <span className="text-[11px] text-slate-400">
              Share of total discount amount
            </span>
          </div>
          <BarStack segments={discountSegments} />
        </div>

        {/* Per-coupon details */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">
              Per-coupon performance
            </h2>
            <span className="text-[11px] text-slate-400">
              Redemptions & discount % (dummy)
            </span>
          </div>
          <div className="space-y-2">
            {couponRows.map((c) => (
              <div key={c.code} className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>
                    {c.code} · {c.label}
                  </span>
                  <span>
                    {c.avgDiscountPct}% disc · {c.redemptions} redemptions
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{
                        width: `${Math.min(c.avgDiscountPct * 4, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-slate-400 w-24 text-right">
                    ${c.revenue.toLocaleString()} rev
                  </span>
                </div>
              </div>
            ))}
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
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-500" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            In the full app, this panel will call Lovable/OpenAI to flag coupons
            that are over-discounted or under-used given their ROAS.
          </p>
        </div>
      </section>

      {/* Table */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Coupon details
          </h2>
          <span className="text-[11px] text-slate-400">
            Redemptions, revenue and discount by coupon
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3">Code</th>
                <th className="py-2 pr-3">Description</th>
                <th className="py-2 pr-3 text-right">Redemptions</th>
                <th className="py-2 pr-3 text-right">Revenue</th>
                <th className="py-2 pr-3 text-right">Discount $</th>
                <th className="py-2 pr-3 text-right">Avg disc %</th>
              </tr>
            </thead>
            <tbody>
              {couponRows.map((c) => (
                <tr key={c.code} className="border-t border-slate-100">
                  <td className="py-2 pr-3 text-slate-700">{c.code}</td>
                  <td className="py-2 pr-3 text-slate-600">{c.label}</td>
                  <td className="py-2 pr-3 text-right">
                    {c.redemptions.toLocaleString()}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    ${c.revenue.toLocaleString()}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    ${c.discountAmount.toLocaleString()}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    {c.avgDiscountPct.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ShellLayout>
  );
};

export default CouponDiscountPage;
