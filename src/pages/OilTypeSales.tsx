import React, { useMemo, useState } from "react";
import {
  ShellLayout,
  MetricTile,
  AIInsightsTile,
  KpiCustomizeButton,
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

  const maxRev = useMemo(() => Math.max(...oilMixRows.map((r) => r.revenue), 1), []);

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

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">Revenue mix by oil type</h2>
              <span className="text-[11px] text-slate-500">Relative revenue by oil type</span>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              {oilMixRows.map((r) => (
                <div key={r.oilType}>
                  <div className="flex justify-between text-[11px]">
                    <span>{r.oilType}</span>
                    <span>${r.revenue.toLocaleString()} · {r.roCount.toLocaleString()} ROs</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-sky-500" style={{ width: `${(r.revenue / maxRev) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-500 w-32 text-right">Avg ticket ${r.avgTicket.toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">Oil type details</h2>
              <span className="text-[11px] text-slate-500">Volume and average ticket by oil type</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Oil type</th>
                    <th className="py-2 pr-3 text-right">ROs</th>
                    <th className="py-2 pr-3 text-right">Revenue</th>
                    <th className="py-2 pr-3 text-right">Avg ticket</th>
                  </tr>
                </thead>
                <tbody>
                  {oilMixRows.map((r) => (
                    <tr key={r.oilType} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-800">{r.oilType}</td>
                      <td className="py-2 pr-3 text-right">{r.roCount.toLocaleString()}</td>
                      <td className="py-2 pr-3 text-right">${r.revenue.toLocaleString()}</td>
                      <td className="py-2 pr-3 text-right">${r.avgTicket.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <AIInsightsTile title="AI Insights" subtitle="Based on oil mix & revenue" bullets={insights} onRefresh={regenerateInsights} />
        </div>
      </div>
    </ShellLayout>
  );
};

export default OilTypeSalesPage;
