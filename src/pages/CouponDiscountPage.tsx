import React, { useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile, KpiCustomizeButton, CouponPerformanceTile } from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";

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

const KPI_OPTIONS: KpiOption[] = [
  { id: "totalDiscounts", label: "Total discounts given" },
  { id: "avgDiscountPct", label: "Avg discount %" },
  { id: "redemptions", label: "Coupon redemptions" },
  { id: "revenueWithDiscounts", label: "Revenue with discounts" },
  { id: "avgDiscountPerRedemption", label: "Avg discount per redemption" },
];

const CouponDiscountPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Most discount dollars are concentrated in a small set of high-usage coupons.",
    "Some offers are richer than necessary given their strong response rates.",
    "New customer and web-only offers can often be tuned independently of core oil-change coupons.",
  ]);

  const { selectedIds, setSelectedIds } = useKpiPreferences("coupon-discount", KPI_OPTIONS);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "totalDiscounts":
        return <MetricTile key={id} label="Total discounts given" value={`$${couponSummary.totalDiscount.toLocaleString()}`} helpText="Total dollar value of discounts applied during the selected period." />;
      case "avgDiscountPct":
        return <MetricTile key={id} label="Avg discount %" value={`${couponSummary.avgDiscountPct.toFixed(1)}%`} helpText="Average discount percentage across all coupon redemptions." />;
      case "redemptions":
        return <MetricTile key={id} label="Coupon redemptions" value={couponSummary.redemptions.toLocaleString()} helpText="Total number of coupons redeemed during the selected period." />;
      case "revenueWithDiscounts":
        return <MetricTile key={id} label="Revenue with discounts" value={`$${couponSummary.revenueWithDiscounts.toLocaleString()}`} helpText="Total revenue from transactions that included a coupon discount." />;
      case "avgDiscountPerRedemption":
        return <MetricTile key={id} label="Avg discount per redemption" value={`$${(couponSummary.totalDiscount / couponSummary.redemptions).toFixed(1)}`} helpText="Average dollar discount per coupon redemption." />;
      default:
        return null;
    }
  };

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
        <KpiCustomizeButton
          reportId="coupon-discount"
          options={KPI_OPTIONS}
          selectedIds={selectedIds}
          onChangeSelected={setSelectedIds}
        />
      </div>

      {/* Layout: left content + right AI tile */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPI tiles */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {selectedIds.map(renderKpiTile)}
          </div>

          {/* AI Insights – stacked here on small/medium screens */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on coupon & discount data"
              bullets={insights}
              onRefresh={regenerateInsights}
            />
          </div>

          {/* Coupon performance tile with Overview/Details tabs */}
          <CouponPerformanceTile />
        </div>

        {/* RIGHT: AI Insights – only on large screens */}
        <div className="hidden lg:block lg:col-span-1">
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
