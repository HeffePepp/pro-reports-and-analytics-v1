import React, { useState, useMemo } from "react";
import {
  ShellLayout,
  MetricTile,
  AIInsightsTile,
  KpiCustomizeButton,
} from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";
import {
  ReportTable,
  ReportTableHead,
  ReportTableBody,
  ReportTableRow,
  ReportTableHeaderCell,
  ReportTableCell,
} from "@/components/ui/report-table";

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

const KPI_OPTIONS: KpiOption[] = [
  { id: "totalCustomers", label: "Total customers" },
  { id: "current", label: "Current" },
  { id: "atRisk", label: "At-risk" },
  { id: "lost", label: "Lost" },
  { id: "avgDays", label: "Avg days since visit" },
];

const ServiceIntervalsPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Most customers are within 12 months of their last visit, but a meaningful group is drifting into at-risk and lost intervals.",
    "13–24 month customers should be the primary target for reminder and reactivation touches.",
    "Average ticket is strongest in the 7–12 month window, suggesting this is a sweet spot for visit timing.",
  ]);

  const currentPct = useMemo(() => (siSummary.currentCount / siSummary.totalCustomers) * 100, []);
  const atRiskPct = useMemo(() => (siSummary.atRiskCount / siSummary.totalCustomers) * 100, []);
  const lostPct = useMemo(() => (siSummary.lostCount / siSummary.totalCustomers) * 100, []);
  const maxBucketCustomers = useMemo(() => Math.max(...siBuckets.map((b) => b.customers), 1), []);

  const { selectedIds, setSelectedIds } = useKpiPreferences("service-intervals", KPI_OPTIONS);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "totalCustomers":
        return <MetricTile key={id} label="Total customers" value={siSummary.totalCustomers.toLocaleString()} helpText="Total unique customers in the database." />;
      case "current":
        return <MetricTile key={id} label="Current" value={siSummary.currentCount.toLocaleString()} helper={`${currentPct.toFixed(1)}%`} helpText="Customers whose last visit was within the expected service interval (typically 0–12 months)." />;
      case "atRisk":
        return <MetricTile key={id} label="At-risk" value={siSummary.atRiskCount.toLocaleString()} helper={`${atRiskPct.toFixed(1)}%`} helpText="Customers 13–24 months since their last visit who are at risk of defecting." />;
      case "lost":
        return <MetricTile key={id} label="Lost" value={siSummary.lostCount.toLocaleString()} helper={`${lostPct.toFixed(1)}%`} helpText="Customers 25+ months since their last visit who are considered lost." />;
      case "avgDays":
        return <MetricTile key={id} label="Avg days since visit" value={siSummary.avgDaysSinceVisit.toFixed(0)} helpText="Average number of days since the last service visit across all customers." />;
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
        <KpiCustomizeButton
          reportId="service-intervals"
          options={KPI_OPTIONS}
          selectedIds={selectedIds}
          onChangeSelected={setSelectedIds}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        <div className="lg:col-span-3 space-y-4">
          {selectedIds.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
              {selectedIds.map((id) => renderKpiTile(id))}
            </div>
          )}

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
                      <div className="h-full bg-tp-pastel-blue" style={{ width: `${(b.customers / maxBucketCustomers) * 100}%` }} />
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
              <ReportTable>
                <ReportTableHead>
                  <ReportTableRow>
                    <ReportTableHeaderCell label="Interval" />
                    <ReportTableHeaderCell label="Customers" align="right" />
                    <ReportTableHeaderCell label="Vehicles" align="right" />
                    <ReportTableHeaderCell label="Avg ticket" align="right" />
                  </ReportTableRow>
                </ReportTableHead>
                <ReportTableBody>
                  {siBuckets.map((b) => (
                    <ReportTableRow key={b.label}>
                      <ReportTableCell className="text-slate-800">{b.label}</ReportTableCell>
                      <ReportTableCell align="right">{b.customers.toLocaleString()}</ReportTableCell>
                      <ReportTableCell align="right">{b.vehicles.toLocaleString()}</ReportTableCell>
                      <ReportTableCell align="right">${b.avgTicket.toFixed(0)}</ReportTableCell>
                    </ReportTableRow>
                  ))}
                </ReportTableBody>
              </ReportTable>
            </div>
          </section>

          <div className="block lg:hidden">
            <AIInsightsTile title="AI Insights" subtitle="Based on interval & retention data" bullets={insights} onRefresh={regenerateInsights} />
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-1 self-start">
          <AIInsightsTile title="AI Insights" subtitle="Based on interval & retention data" bullets={insights} onRefresh={regenerateInsights} />
        </div>
      </div>
    </ShellLayout>
  );
};

export default ServiceIntervalsPage;
