import React, { useState, useMemo } from "react";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";

type CouponSummary = {
  periodLabel: string;
  totalDiscount: number;
  avgDiscountPct: number;
  redemptions: number;
  revenueWithDiscounts: number;
};

type CouponRow = {
  code: string;
  description: string;
  channel: "Email" | "Postcard" | "POS" | "Mixed";
  redemptions: number;
  avgTicket: number;
  discountPct: number;
};

const couponSummary: CouponSummary = {
  periodLabel: "Last 90 days",
  totalDiscount: 18400,
  avgDiscountPct: 14.2,
  redemptions: 3820,
  revenueWithDiscounts: 264800,
};

const couponRows: CouponRow[] = [
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

const CouponDiscountPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Most discount dollars are concentrated in a small set of high-usage coupons.",
    "Some offers are richer than necessary given their strong response rates.",
    "New customer and web-only offers can often be tuned independently of core oil-change coupons.",
  ]);

  const maxDiscountPct = useMemo(
    () => Math.max(...couponRows.map((c) => c.discountPct), 1),
    []
  );

  const regenerateInsights = () => {
    const richest = couponRows.reduce((best, c) =>
      !best || c.discountPct > best.discountPct ? c : best
    );
    setInsights([
      `"${richest.code}" has the highest average discount (${richest.discountPct.toFixed(
        1
      )}%). Review its ROAS to ensure margin is acceptable.`,
      "Consider small tests lowering discount amounts on top-performing coupons to protect margin.",
      "Use this report with ROAS and Oil Type Sales to spot where discounts are eroding premium oil margins.",
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
            Period:{" "}
            <span className="font-medium">{couponSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Coupon / Discount Analysis
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            See which offers drive profitable visits and where discounting may
            be eroding margin.
          </p>
        </div>
      </div>

      {/* Layout: left content + right AI tile */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPI tiles */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <MetricTile
              label="Total discounts given"
              value={`$${couponSummary.totalDiscount.toLocaleString()}`}
            />
            <MetricTile
              label="Avg discount %"
              value={`${couponSummary.avgDiscountPct.toFixed(1)}%`}
            />
            <MetricTile
              label="Coupon redemptions"
              value={couponSummary.redemptions.toLocaleString()}
            />
            <MetricTile
              label="Revenue with discounts"
              value={`$${couponSummary.revenueWithDiscounts.toLocaleString()}`}
            />
            <MetricTile
              label="Avg discount per redemption"
              value={`$${(
                couponSummary.totalDiscount / couponSummary.redemptions
              ).toFixed(1)}`}
            />
          </div>

          {/* Discount richness by coupon */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Discount richness by coupon
              </h2>
              <span className="text-[11px] text-slate-500">
                Average discount % and volume
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              {couponRows.map((c) => (
                <div key={c.code}>
                  <div className="flex justify-between text-[11px]">
                    <span>
                      {c.code} · {c.description}
                    </span>
                    <span>
                      {c.discountPct.toFixed(1)}% ·{" "}
                      {c.redemptions.toLocaleString()} redemptions
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-rose-400"
                        style={{
                          width: `${(c.discountPct / maxDiscountPct) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 w-32 text-right">
                      Avg ticket ${c.avgTicket.toFixed(0)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Coupon details
              </h2>
              <span className="text-[11px] text-slate-500">
                Usage, ticket and discount by code
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Code</th>
                    <th className="py-2 pr-3">Description</th>
                    <th className="py-2 pr-3">Channel</th>
                    <th className="py-2 pr-3 text-right">Redemptions</th>
                    <th className="py-2 pr-3 text-right">Avg ticket</th>
                    <th className="py-2 pr-3 text-right">Discount %</th>
                  </tr>
                </thead>
                <tbody>
                  {couponRows.map((c) => (
                    <tr key={c.code} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-800">{c.code}</td>
                      <td className="py-2 pr-3 text-slate-700">
                        {c.description}
                      </td>
                      <td className="py-2 pr-3 text-slate-600">
                        {c.channel}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {c.redemptions.toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        ${c.avgTicket.toFixed(0)}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {c.discountPct.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT: AI panel */}
        <div className="lg:col-span-1">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on coupon & discount data"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default CouponDiscountPage;
