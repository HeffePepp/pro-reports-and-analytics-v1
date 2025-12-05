import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, BarStack } from "@/components/layout";

type CouponSummary = {
  storeName: string;
  periodLabel: string;
  totalRevenue: number;
  totalDiscounts: number;
  discountRate: number;
  couponsRedeemed: number;
};

type CouponRow = {
  couponCode: string;
  redemptions: number;
  discountTotal: number;
  revenueGenerated: number;
  avgTicket: number;
  profitability: "high" | "medium" | "low";
};

const summary: CouponSummary = {
  storeName: "All Stores",
  periodLabel: "Last 90 days",
  totalRevenue: 524000,
  totalDiscounts: 64452,
  discountRate: 12.3,
  couponsRedeemed: 2840,
};

const couponRows: CouponRow[] = [
  { couponCode: "SAVE10", redemptions: 820, discountTotal: 8200, revenueGenerated: 98400, avgTicket: 120, profitability: "high" },
  { couponCode: "OILCHANGE15", redemptions: 640, discountTotal: 9600, revenueGenerated: 64000, avgTicket: 100, profitability: "medium" },
  { couponCode: "LOYALTY20", redemptions: 480, discountTotal: 14400, revenueGenerated: 72000, avgTicket: 150, profitability: "medium" },
  { couponCode: "NEWCUST25", redemptions: 380, discountTotal: 19000, revenueGenerated: 57000, avgTicket: 150, profitability: "low" },
  { couponCode: "FLASH5", redemptions: 520, discountTotal: 2600, revenueGenerated: 52000, avgTicket: 100, profitability: "high" },
];

const CouponDiscountPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Overall discount rate is 12.3% — slightly above industry average of 10%.",
    "SAVE10 and FLASH5 have high profitability — they drive visits without excessive margin erosion.",
    "NEWCUST25 has low profitability; consider reducing the discount or adding minimum spend requirements.",
  ]);

  const highProfitCount = useMemo(() => couponRows.filter((c) => c.profitability === "high").length, []);
  const lowProfitCount = useMemo(() => couponRows.filter((c) => c.profitability === "low").length, []);

  const regenerateInsights = () => {
    setInsights([
      `${highProfitCount} coupons are highly profitable; ${lowProfitCount} are eroding margins.`,
      `Total discounts of $${summary.totalDiscounts.toLocaleString()} represent ${summary.discountRate}% of revenue.`,
      "Reducing NEWCUST25 from 25% to 15% could recover ~$7k in margin while retaining most traffic.",
    ]);
  };

  const breadcrumb = [
    { label: "Home", to: "/" },
    { label: "Reports & Insights", to: "/" },
    { label: "Coupon / Discount Analysis" },
  ];

  const rightInfo = (
    <>
      <span>Store: <span className="font-medium">{summary.storeName}</span></span>
      <span>Period: <span className="font-medium">{summary.periodLabel}</span></span>
    </>
  );

  return (
    <ShellLayout breadcrumb={breadcrumb} rightInfo={rightInfo}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Coupon / Discount Analysis</h1>
          <p className="mt-1 text-sm text-slate-500">
            See which offers drive profitable visits and where discounting erodes margin.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">Total revenue</div>
            <div className="mt-0.5 text-base font-semibold">${summary.totalRevenue.toLocaleString()}</div>
          </div>
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">Total discounts</div>
            <div className="mt-0.5 text-base font-semibold">${summary.totalDiscounts.toLocaleString()}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile label="Discount rate" value={`${summary.discountRate}%`} helper="Of total revenue" tone="warn" />
        <MetricTile label="Coupons redeemed" value={summary.couponsRedeemed.toLocaleString()} helper="Total redemptions" />
        <MetricTile label="Avg discount/coupon" value={`$${(summary.totalDiscounts / summary.couponsRedeemed).toFixed(2)}`} helper="Per redemption" />
        <MetricTile label="High profit coupons" value={highProfitCount.toString()} helper="Efficient offers" tone="positive" />
        <MetricTile label="Low profit coupons" value={lowProfitCount.toString()} helper="Margin erosion risk" tone="negative" />
      </div>

      <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">Discount distribution by coupon</h2>
            <span className="text-[11px] text-slate-400">Share of total discounts</span>
          </div>
          <BarStack
            segments={couponRows.map((row) => ({
              label: row.couponCode,
              value: Math.round((row.discountTotal / summary.totalDiscounts) * 100),
              color: row.profitability === "high" ? "bg-emerald-400" : row.profitability === "medium" ? "bg-sky-400" : "bg-rose-400",
            }))}
          />
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-sm font-semibold text-slate-800">AI insights (mock)</h2>
            <button onClick={regenerateInsights} className="text-[11px] px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600">Refresh</button>
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
            In the full app, this panel will call Lovable/OpenAI to analyze coupon profitability and suggest optimization strategies.
          </p>
        </div>
      </section>

      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between gap-2 mb-2">
          <h2 className="text-sm font-semibold text-slate-800">Coupon performance</h2>
          <span className="text-[11px] text-slate-400">Redemptions, discounts, revenue and profitability</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3">Coupon</th>
                <th className="py-2 pr-3 text-right">Redemptions</th>
                <th className="py-2 pr-3 text-right">Discount total</th>
                <th className="py-2 pr-3 text-right">Revenue</th>
                <th className="py-2 pr-3 text-right">Avg ticket</th>
                <th className="py-2 pr-3">Profitability</th>
              </tr>
            </thead>
            <tbody>
              {couponRows.map((row) => (
                <tr key={row.couponCode} className="border-t border-slate-100">
                  <td className="py-2 pr-3 text-slate-700 font-medium">{row.couponCode}</td>
                  <td className="py-2 pr-3 text-right">{row.redemptions.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-right text-rose-600">${row.discountTotal.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-right text-emerald-600">${row.revenueGenerated.toLocaleString()}</td>
                  <td className="py-2 pr-3 text-right">${row.avgTicket}</td>
                  <td className="py-2 pr-3">
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] ${
                      row.profitability === "high" ? "bg-emerald-50 text-emerald-700" :
                      row.profitability === "medium" ? "bg-sky-50 text-sky-700" :
                      "bg-rose-50 text-rose-700"
                    }`}>
                      {row.profitability}
                    </span>
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
