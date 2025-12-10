import React, { useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile, KpiCustomizeButton } from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";
import { DateRangePicker, DateRange } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";

type CustomerRecord = {
  name: string;
  previousVisits: number;
  lastServiceDate: string;
  phone: string;
  email: string;
  license: string;
  lastLocation: string;
  servicesPerformed: string;
};

const SAMPLE_CUSTOMERS: CustomerRecord[] = [
  {
    name: "Bob Goodfellow",
    previousVisits: 4,
    lastServiceDate: "5/24/2025",
    phone: "(555) 555-5555",
    email: "bgoodfellow@gmail.com",
    license: "MD-327Y6",
    lastLocation: "7040 :: SDF :: Vallejo, CA",
    servicesPerformed:
      "General Repair Parts; General Repair Labor; Job Supplies; Wiper Blades; Tire Replacement; Mount And Balance 4 Tires",
  },
  {
    name: "Sarah Mitchell",
    previousVisits: 7,
    lastServiceDate: "3/12/2025",
    phone: "(555) 123-4567",
    email: "smitchell@yahoo.com",
    license: "CA-8J4K2",
    lastLocation: "7041 :: SDF :: Napa, CA",
    servicesPerformed: "Oil Change; Air Filter; Brake Inspection",
  },
  {
    name: "James Rodriguez",
    previousVisits: 2,
    lastServiceDate: "1/08/2025",
    phone: "(555) 987-6543",
    email: "jrodriguez@hotmail.com",
    license: "CA-2M9P1",
    lastLocation: "7042 :: SDF :: Fairfield, CA",
    servicesPerformed: "Transmission Flush; Coolant Service",
  },
];

const KPI_OPTIONS: KpiOption[] = [
  { id: "active", label: "Active (0–8 mo)" },
  { id: "retained", label: "Retained (9–12 mo)" },
  { id: "lapsed", label: "Lapsed (13–18 mo)" },
  { id: "inactive", label: "Inactive (19–24 mo)" },
  { id: "lost", label: "Lost (25+ mo)" },
];

const CallBackReportPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });

  const [data] = useState<CustomerRecord[]>(SAMPLE_CUSTOMERS);

  const [insights, setInsights] = useState<string[]>([
    "126 active customers visited within 8 months – healthy retention base.",
    "68 lapsed customers (13–18 mo) are prime callback targets for re-engagement.",
    "31 lost customers (25+ mo) may require special win-back offers.",
  ]);

  const { selectedIds, setSelectedIds } = useKpiPreferences("call-back-report", KPI_OPTIONS);

  // Mock KPI segmentation counts
  const kpiValues: Record<string, { value: number; helper?: string }> = {
    active: { value: 126, helper: "Visited within 8 months" },
    retained: { value: 94, helper: "9–12 months since visit" },
    lapsed: { value: 68, helper: "13–18 months since visit" },
    inactive: { value: 52, helper: "19–24 months since visit" },
    lost: { value: 31, helper: "25+ months since visit" },
  };

  const renderKpiTile = (id: string) => {
    const kpi = KPI_OPTIONS.find((k) => k.id === id);
    const data = kpiValues[id];
    if (!kpi || !data) return null;
    return (
      <MetricTile
        key={id}
        label={kpi.label}
        value={data.value.toLocaleString()}
        helper={data.helper}
      />
    );
  };

  const regenerateInsights = () => {
    setInsights([
      `${kpiValues.active.value} active customers form your retention foundation.`,
      `${kpiValues.lapsed.value} lapsed customers should be prioritized for callbacks.`,
      `Consider win-back campaigns for ${kpiValues.lost.value} lost customers.`,
    ]);
  };

  const handleRunReport = () => {
    console.log("Running callback report for range:", dateRange);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Callback Report" },
      ]}
      rightInfo={
        <div className="flex items-center gap-2">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Button
            onClick={handleRunReport}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            Run Report
          </Button>
        </div>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Callback Report
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Identify customers who have not returned for service within a selected time frame.
          </p>
        </div>
        <KpiCustomizeButton
          reportId="call-back-report"
          options={KPI_OPTIONS}
          selectedIds={selectedIds}
          onChangeSelected={setSelectedIds}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {selectedIds.map(renderKpiTile)}
          </div>

          {/* AI Insights – stacked here on small/medium screens */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on customer segmentation data"
              bullets={insights}
              onRefresh={regenerateInsights}
            />
          </div>

          {/* Table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm">
            <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <h2 className="text-[13px] font-semibold text-slate-900">
                Customer Callback List
              </h2>
              <p className="text-[11px] text-slate-500">
                Customers not serviced within the selected date range
              </p>
            </header>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-2 text-left font-medium">Cust Name</th>
                    <th className="px-4 py-2 text-right font-medium"># Previous Visits</th>
                    <th className="px-4 py-2 text-right font-medium">Last Service Date</th>
                    <th className="px-4 py-2 text-left font-medium">Cust Ph</th>
                    <th className="px-4 py-2 text-left font-medium">Cust Eml</th>
                    <th className="px-4 py-2 text-left font-medium">Lic Plate</th>
                    <th className="px-4 py-2 text-left font-medium">Last Location Visited</th>
                    <th className="px-4 py-2 text-left font-medium">Services Performed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.map((row, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3 text-slate-900">{row.name}</td>
                      <td className="px-4 py-3 text-right text-slate-700">{row.previousVisits}</td>
                      <td className="px-4 py-3 text-right text-slate-700">{row.lastServiceDate}</td>
                      <td className="px-4 py-3 text-slate-700">{row.phone}</td>
                      <td className="px-4 py-3 text-emerald-700 underline">{row.email}</td>
                      <td className="px-4 py-3 text-slate-700">{row.license}</td>
                      <td className="px-4 py-3 text-slate-700">{row.lastLocation}</td>
                      <td className="px-4 py-3 text-slate-700 max-w-xs truncate" title={row.servicesPerformed}>
                        {row.servicesPerformed}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT: AI Insights – only on large screens */}
        <div className="hidden lg:block lg:col-span-1">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on customer segmentation data"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default CallBackReportPage;
