import React, { useState, useMemo } from "react";
import {
  ShellLayout,
  MetricTile,
  AIInsightsTile,
  useKpiPreferences,
  KpiCustomizeButton,
  KpiPreferencesModal,
} from "@/components/layout";

type ServiceIntervalSummary = {
  totalCustomers: number;
  currentCount: number;
  atRiskCount: number;
  lostCount: number;
  avgDaysSinceVisit: number;
};

type ServiceIntervalBucket = {
  label: string;
  daysMin: number;
  daysMax: number | null;
  customers: number;
  vehicles: number;
  avgTicket: number;
};

const siSummary: ServiceIntervalSummary = {
  totalCustomers: 12480,
  currentCount: 8900,
  atRiskCount: 2200,
  lostCount: 1380,
  avgDaysSinceVisit: 164,
};

const siBuckets: ServiceIntervalBucket[] = [
  { label: "0–6 months", daysMin: 0, daysMax: 180, customers: 5400, vehicles: 6800, avgTicket: 104 },
  { label: "7–12 months", daysMin: 181, daysMax: 365, customers: 3500, vehicles: 4100, avgTicket: 112 },
  { label: "13–18 months", daysMin: 366, daysMax: 545, customers: 1420, vehicles: 1660, avgTicket: 96 },
  { label: "19–24 months", daysMin: 546, daysMax: 730, customers: 780, vehicles: 880, avgTicket: 92 },
  { label: "25+ months", daysMin: 731, daysMax: null, customers: 1380, vehicles: 1540, avgTicket: 88 },
];

const kpiDefs = [
  { id: "totalCustomers", label: "Total customers" },
  { id: "current", label: "Current" },
  { id: "atRisk", label: "At-risk" },
  { id: "lost", label: "Lost" },
  { id: "avgDays", label: "Avg days since visit" },
] as const;

const ServiceIntervalsPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Most customers are within 12 months of their last visit, but a meaningful group is drifting into at-risk and lost intervals.",
    "13–24 month customers should be the primary target for reminder and reactivation touches.",
    "Average ticket is strongest in the 7–12 month window, suggesting this is a sweet spot for visit timing.",
  ]);
  const [kpiModalOpen, setKpiModalOpen] = useState(false);

  const currentPct = useMemo(() => (siSummary.currentCount / siSummary.totalCustomers) * 100, []);
  const atRiskPct = useMemo(() => (siSummary.atRiskCount / siSummary.totalCustomers) * 100, []);
  const lostPct = useMemo(() => (siSummary.lostCount / siSummary.totalCustomers) * 100, []);
  const maxBucketCustomers = useMemo(() => Math.max(...siBuckets.map((b) => b.customers), 1), []);

  const { visibleKpis, visibleIds, toggleKpi, resetKpis } = useKpiPreferences(
    "service-intervals",
    kpiDefs as unknown as { id: string; label: string }[]
  );

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "totalCustomers":
        return <MetricTile key={id} label="Total customers" value={siSummary.totalCustomers.toLocaleString()} />;
      case "current":
        return <MetricTile key={id} label="Current" value={siSummary.currentCount.toLocaleString()} helper={`${currentPct.toFixed(1)}%`} />;
      case "atRisk":
        return <MetricTile key={id} label="At-risk" value={siSummary.atRiskCount.toLocaleString()} helper={`${atRiskPct.toFixed(1)}%`} />;
      case "lost":
        return <MetricTile key={id} label="Lost" value={siSummary.lostCount.toLocaleString()} helper={`${lostPct.toFixed(1)}%`} />;
      case "avgDays":
        return <MetricTile key={id} label="Avg days since visit" value={siSummary.avgDaysSinceVisit.toFixed(0)} />;
      default:
        return null;
    }
  };

  const regenerateInsights = () => {
    const worstBucket = siBuckets[siBuckets.length - 1];
    setInsights([
      `${currentPct.toFixed(1)}% of customers are current, with ${atRiskPct.toFixed(1)}% at-risk and ${lostPct.toFixed(1)}% lost.`,
      `"${worstBucket.label}" has ${worstBucket.customers.toLocaleString()} customers; pair this report with Reactivation and One-Off Campaign Tracker to win them back.`,
      "Use this report to validate your journey intervals and adjust reminder timing by store or region.",
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Service Intervals" },
      ]}
      rightInfo={<span>Customers: <span className="font-medium">{siSummary.totalCustomers.toLocaleString()}</span></span>}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Service Intervals</h1>
          <p className="mt-1 text-sm text-slate-500">Snapshot of current, at-risk and lost customers by time since last visit and mileage interval.</p>
        </div>
        <KpiCustomizeButton onClick={() => setKpiModalOpen(true)} />
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3 space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {visibleKpis.map((kpi) => renderKpiTile(kpi.id))}
          </div>

          <div className="block lg:hidden">
            <AIInsightsTile title="AI Insights" subtitle="Based on interval & retention data" bullets={insights} onRefresh={regenerateInsights} />
          </div>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">Customers by service interval</h2>
                <p className="text-[11px] text-slate-600">Buckets by time since last visit (dummy data)</p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              {siBuckets.map((b) => (
                <div key={b.label}>
                  <div className="flex justify-between text-[11px]">
                    <span>{b.label}</span>
                    <span>{b.customers.toLocaleString()} customers · {b.vehicles.toLocaleString()} vehicles</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full bg-sky-500" style={{ width: `${(b.customers / maxBucketCustomers) * 100}%` }} />
                    </div>
                    <span className="text-[10px] text-slate-500 w-32 text-right">Avg ticket ${b.avgTicket.toFixed(0)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">Interval details</h2>
              <span className="text-[11px] text-slate-500">Customers, vehicles and revenue potential by bucket</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Interval</th>
                    <th className="py-2 pr-3 text-right">Customers</th>
                    <th className="py-2 pr-3 text-right">Vehicles</th>
                    <th className="py-2 pr-3 text-right">Avg ticket</th>
                  </tr>
                </thead>
                <tbody>
                  {siBuckets.map((b) => (
                    <tr key={b.label} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-800">{b.label}</td>
                      <td className="py-2 pr-3 text-right">{b.customers.toLocaleString()}</td>
                      <td className="py-2 pr-3 text-right">{b.vehicles.toLocaleString()}</td>
                      <td className="py-2 pr-3 text-right">${b.avgTicket.toFixed(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <div className="hidden lg:block lg:col-span-1">
          <AIInsightsTile title="AI Insights" subtitle="Based on interval & retention data" bullets={insights} onRefresh={regenerateInsights} />
        </div>
      </div>

      <KpiPreferencesModal
        open={kpiModalOpen}
        onClose={() => setKpiModalOpen(false)}
        reportName="Service Intervals"
        kpis={kpiDefs as unknown as { id: string; label: string }[]}
        visibleIds={visibleIds}
        onToggle={toggleKpi}
        onReset={resetKpis}
      />
    </ShellLayout>
  );
};

export default ServiceIntervalsPage;
