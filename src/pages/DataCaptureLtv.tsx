import React, { useState, useMemo } from "react";
import {
  ShellLayout,
  MetricTile,
  AIInsightsTile,
  KpiCustomizeButton,
} from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";

type LtvSummary = {
  totalCustomers: number;
  avgLtv: number;
  topQuartileLtv: number;
  multiVehiclePct: number;
  emailCaptureRate: number;
};

type LtvSegmentRow = {
  segment: string;
  customers: number;
  avgLtv: number;
  avgVisits: number;
  emailCaptureRate: number;
};

const ltvSummary: LtvSummary = {
  totalCustomers: 18500,
  avgLtv: 462,
  topQuartileLtv: 980,
  multiVehiclePct: 34,
  emailCaptureRate: 78,
};

const ltvSegments: LtvSegmentRow[] = [
  { segment: "Top 25% LTV", customers: 4625, avgLtv: 980, avgVisits: 6.4, emailCaptureRate: 92 },
  { segment: "Middle 50% LTV", customers: 9250, avgLtv: 410, avgVisits: 3.2, emailCaptureRate: 81 },
  { segment: "Bottom 25% LTV", customers: 4625, avgLtv: 118, avgVisits: 1.4, emailCaptureRate: 52 },
  { segment: "Multi-vehicle households", customers: 6300, avgLtv: 720, avgVisits: 5.1, emailCaptureRate: 88 },
];

const KPI_OPTIONS: KpiOption[] = [
  { id: "totalCustomers", label: "Total customers" },
  { id: "avgLtv", label: "Avg LTV per customer" },
  { id: "topQuartile", label: "Top quartile LTV" },
  { id: "multiVehicle", label: "Multi-vehicle households" },
  { id: "emailCapture", label: "Email capture rate" },
];

const DataCaptureLtvPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Top LTV customers visit more often and almost all have valid email on file.",
    "Lower LTV segments have weaker data capture, which limits your ability to move them up the value ladder.",
    "Multi-vehicle households are extremely valuable and should be prioritized for journey enrollment.",
  ]);

  const maxAvgLtv = useMemo(() => Math.max(...ltvSegments.map((s) => s.avgLtv), 1), []);

  const { selectedIds, setSelectedIds } = useKpiPreferences("data-capture-ltv", KPI_OPTIONS);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "totalCustomers":
        return <MetricTile key={id} label="Total customers" value={ltvSummary.totalCustomers.toLocaleString()} />;
      case "avgLtv":
        return <MetricTile key={id} label="Avg LTV per customer" value={`$${ltvSummary.avgLtv.toFixed(0)}`} />;
      case "topQuartile":
        return <MetricTile key={id} label="Top quartile LTV" value={`$${ltvSummary.topQuartileLtv.toFixed(0)}`} />;
      case "multiVehicle":
        return <MetricTile key={id} label="Multi-vehicle households" value={`${ltvSummary.multiVehiclePct.toFixed(0)}%`} helper="Of total customers" />;
      case "emailCapture":
        return <MetricTile key={id} label="Email capture rate" value={`${ltvSummary.emailCaptureRate.toFixed(0)}%`} />;
      default:
        return null;
    }
  };

  const regenerateInsights = () => {
    const worstCapture = ltvSegments.reduce((worst, s) => (!worst || s.emailCaptureRate < worst.emailCaptureRate ? s : worst));
    setInsights([
      `Average LTV across the base is $${ltvSummary.avgLtv.toFixed(0)}, with top quartile at ~$${ltvSummary.topQuartileLtv.toFixed(0)}.`,
      `"${worstCapture.segment}" has the weakest email capture (${worstCapture.emailCaptureRate.toFixed(1)}%), limiting upsell and retention potential.`,
      "Focus data cleanup and capture efforts on low-LTV segments to unlock more upside from the base.",
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Data Capture + Life Time Value" },
      ]}
      rightInfo={
        <span>Customers: <span className="font-medium">{ltvSummary.totalCustomers.toLocaleString()}</span></span>
      }
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Data Capture + Life Time Value</h1>
          <p className="mt-1 text-sm text-slate-500">Show how mail/email capture impacts revenue and ticket averages across customer segments.</p>
        </div>
        <KpiCustomizeButton
          reportId="data-capture-ltv"
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
            <AIInsightsTile title="AI Insights" subtitle="Based on LTV & data capture" bullets={insights} onRefresh={regenerateInsights} />
          </div>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">LTV and visits by segment</h2>
              <span className="text-[11px] text-slate-500">Avg LTV, visits and email capture</span>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              {ltvSegments.map((s) => (
                <div key={s.segment}>
                  <div className="flex justify-between text-[11px]">
                    <span>{s.segment}</span>
                    <span>${s.avgLtv.toFixed(0)} LTV · {s.avgVisits.toFixed(1)} visits</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${(s.avgLtv / maxAvgLtv) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-500 w-40 text-right">{s.emailCaptureRate.toFixed(1)}% email capture</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">Segment details</h2>
              <span className="text-[11px] text-slate-500">Customers, LTV and data capture by segment</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Segment</th>
                    <th className="py-2 pr-3 text-right">Customers</th>
                    <th className="py-2 pr-3 text-right">Avg LTV</th>
                    <th className="py-2 pr-3 text-right">Avg visits</th>
                    <th className="py-2 pr-3 text-right">Email capture %</th>
                  </tr>
                </thead>
                <tbody>
                  {ltvSegments.map((s) => (
                    <tr key={s.segment} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-800">{s.segment}</td>
                      <td className="py-2 pr-3 text-right">{s.customers.toLocaleString()}</td>
                      <td className="py-2 pr-3 text-right">${s.avgLtv.toFixed(0)}</td>
                      <td className="py-2 pr-3 text-right">{s.avgVisits.toFixed(1)}</td>
                      <td className="py-2 pr-3 text-right">{s.emailCaptureRate.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <AIInsightsTile title="AI Insights" subtitle="Based on LTV & data capture" bullets={insights} onRefresh={regenerateInsights} />
        </div>
      </div>
    </ShellLayout>
  );
};

export default DataCaptureLtvPage;
