import React, { useState } from "react";
import {
  ShellLayout,
  MetricTile,
  AIInsightsTile,
  KpiCustomizeButton,
  CouponPerformanceTile,
} from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";

type CouponSummary = {
  periodLabel: string;
  totalCouponAmount: number;
  totalDiscountAmount: number;
  avgDiscountPerInvoice: number;
  totalRevenue: number;
};

const couponSummary: CouponSummary = {
  periodLabel: "Last 90 days",
  totalCouponAmount: 15420,
  totalDiscountAmount: 28950,
  avgDiscountPerInvoice: 7.85,
  totalRevenue: 312400,
};

type CouponRow = {
  code: string;
  description: string;
  channel: "Email" | "Postcard" | "POS" | "Mixed";
  redemptions: number;
  avgTicket: number;
  discountPct: number;
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
  { id: "totalCouponAmount", label: "Total coupon amount" },
  { id: "totalDiscountAmount", label: "Total discount amount" },
  { id: "avgDiscountPerInvoice", label: "Avg coupon/discount" },
  { id: "totalRevenue", label: "Total revenue" },
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
      case "totalCouponAmount":
        return (
          <MetricTile
            key={id}
            label="Total coupon amount"
            value={couponSummary.totalCouponAmount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
            helpText="Total face value of all coupons redeemed during the selected period."
            variant="coupon"
          />
        );
      case "totalDiscountAmount":
        return (
          <MetricTile
            key={id}
            label="Total discount amount"
            value={couponSummary.totalDiscountAmount.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
            helpText="Total value of all discounts applied, including coupons and any other price reductions."
            variant="discount"
          />
        );
      case "avgDiscountPerInvoice":
        return (
          <MetricTile
            key={id}
            label="Avg coupon/discount"
            value={couponSummary.avgDiscountPerInvoice.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            helpText="Average discount amount per invoice, across all repair orders in the selected period."
          />
        );
      case "totalRevenue":
        return (
          <MetricTile
            key={id}
            label="Total revenue"
            value={couponSummary.totalRevenue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
            helpText="Total repair-order revenue generated in the selected period, after discounts."
          />
        );
      default:
        return null;
    }
  };

  const regenerateInsights = () => {
    const richest = couponRows.reduce((best, c) => (!best || c.discountPct > best.discountPct ? c : best));
    setInsights([
      `"${richest.code}" has the highest average discount (${richest.discountPct.toFixed(
        1,
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
            Period: <span className="font-medium">{couponSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Coupon / Discount Analysis</h1>
          <p className="mt-1 text-sm text-slate-500">
            See which offers drive profitable visits and where discounting may be eroding margin.
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{selectedIds.map(renderKpiTile)}</div>

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
