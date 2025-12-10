import React, { useMemo, useState } from "react";
import {
  ShellLayout,
  MetricTile,
  AIInsightsTile,
  KpiCustomizeButton,
  OilTypePerformanceTile,
} from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";

type OilMixSummary = {
  periodLabel: string;
  totalOilROs: number;
  totalRevenue: number;
  syntheticSharePct: number;
  highMileageSharePct: number;
};

type OilMixRow = {
  oilType: string;
  roCount: number;
  revenue: number;
  avgTicket: number;
};

const oilMixSummary: OilMixSummary = {
  periodLabel: "Last 90 days",
  totalOilROs: 4280,
  totalRevenue: 392400,
  syntheticSharePct: 61,
  highMileageSharePct: 14,
};

const oilMixRows: OilMixRow[] = [
  { oilType: "Conventional", roCount: 1320, revenue: 101200, avgTicket: 76 },
  { oilType: "High Mileage", roCount: 620, revenue: 61200, avgTicket: 99 },
  { oilType: "Synthetic Blend", roCount: 980, revenue: 95600, avgTicket: 98 },
  { oilType: "Full Synthetic", roCount: 1360, revenue: 134400, avgTicket: 99 },
];

const KPI_OPTIONS: KpiOption[] = [
  { id: "oilRos", label: "Oil change ROs" },
  { id: "oilRevenue", label: "Oil revenue" },
  { id: "syntheticShare", label: "Synthetic share" },
  { id: "highMileageShare", label: "High mileage share" },
  { id: "avgTicket", label: "Avg ticket (all)" },
];

const OilTypeSalesPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Synthetic and high mileage oils now account for the majority of oil change revenue.",
    "Conventional still represents a large number of visits but at a lower average ticket.",
    "Moving a small share of conventional customers into synthetic can significantly increase revenue.",
  ]);

  const { selectedIds, setSelectedIds } = useKpiPreferences("oil-type-sales", KPI_OPTIONS);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "oilRos":
        return <MetricTile key={id} label="Oil change ROs" value={oilMixSummary.totalOilROs.toLocaleString()} />;
      case "oilRevenue":
        return <MetricTile key={id} label="Oil revenue" value={`$${oilMixSummary.totalRevenue.toLocaleString()}`} />;
      case "syntheticShare":
        return <MetricTile key={id} label="Synthetic share" value={`${oilMixSummary.syntheticSharePct.toFixed(0)}%`} />;
      case "highMileageShare":
        return <MetricTile key={id} label="High mileage share" value={`${oilMixSummary.highMileageSharePct.toFixed(0)}%`} />;
      case "avgTicket":
        return <MetricTile key={id} label="Avg ticket (all)" value={`$${(oilMixSummary.totalRevenue / oilMixSummary.totalOilROs).toFixed(0)}`} />;
      default:
        return null;
    }
  };

  const regenerateInsights = () => {
    const best = oilMixRows.reduce((best, r) => (!best || r.avgTicket > best.avgTicket ? r : best));
    setInsights([
      `"${best.oilType}" has the highest average ticket at $${best.avgTicket.toFixed(0)}.`,
      "Use Suggested Services and SS videos to educate customers on benefits of upgraded oils.",
      "Pair this report with Oil Type – Invoices to show vendors invoice-level proof of premium mix.",
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Oil Type Sales" },
      ]}
      rightInfo={<span>Period: <span className="font-medium">{oilMixSummary.periodLabel}</span></span>}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Oil Type Sales</h1>
          <p className="mt-1 text-sm text-slate-500">Volume and revenue mix across conventional, blend, synthetic and high mileage oils.</p>
        </div>
        <KpiCustomizeButton
          reportId="oil-type-sales"
          options={KPI_OPTIONS}
          selectedIds={selectedIds}
          onChangeSelected={setSelectedIds}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {selectedIds.map((id) => renderKpiTile(id))}
          </div>

          <div className="block lg:hidden">
            <AIInsightsTile title="AI Insights" subtitle="Based on oil mix & revenue" bullets={insights} onRefresh={regenerateInsights} />
          </div>

          <OilTypePerformanceTile />
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <AIInsightsTile title="AI Insights" subtitle="Based on oil mix & revenue" bullets={insights} onRefresh={regenerateInsights} />
        </div>
      </div>
    </ShellLayout>
  );
};

export default OilTypeSalesPage;
