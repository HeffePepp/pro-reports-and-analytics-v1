import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile, KpiCustomizeButton } from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";
import { DateRangePicker, DateRange } from "@/components/ui/date-range-picker";
import { Button } from "@/components/ui/button";

type Segment = "active" | "retained" | "lapsed" | "inactive" | "lost";

type CallbackCustomer = {
  id: string;
  name: string;
  phone: string;
  email: string;
  lastVisitDate: string;
  lastInvoiceNumber: string;
  totalVisits: number;
  lastVisitServices: string;
  segment: Segment;
};

const SAMPLE_CUSTOMERS: CallbackCustomer[] = [
  {
    id: "1",
    name: "Bob GoodFellow",
    phone: "(555) 555-5555",
    email: "bgoodfellow@gmail.com",
    lastVisitDate: "05/24/2025",
    lastInvoiceNumber: "INV-732145",
    totalVisits: 4,
    lastVisitServices:
      "General Repair Parts; General Repair Labor; Job Supplies; Wiper Blades; Tire Replacement; Mount And Balance 4 Tires",
    segment: "lapsed",
  },
  {
    id: "2",
    name: "Jane Driver",
    phone: "(555) 555-1234",
    email: "jdriver@example.com",
    lastVisitDate: "03/10/2025",
    lastInvoiceNumber: "INV-731882",
    totalVisits: 6,
    lastVisitServices: "Full Synthetic Oil Change; Cabin Air Filter",
    segment: "inactive",
  },
  {
    id: "3",
    name: "Sarah Mitchell",
    phone: "(555) 123-4567",
    email: "smitchell@yahoo.com",
    lastVisitDate: "08/15/2025",
    lastInvoiceNumber: "INV-733021",
    totalVisits: 7,
    lastVisitServices: "Oil Change; Air Filter; Brake Inspection",
    segment: "active",
  },
];

const KPI_OPTIONS: KpiOption[] = [
  { id: "active", label: "Active (0–8 mo)" },
  { id: "retained", label: "Retained (9–12 mo)" },
  { id: "lapsed", label: "Lapsed (13–18 mo)" },
  { id: "inactive", label: "Inactive (19–24 mo)" },
  { id: "lost", label: "Lost (25+ mo)" },
];

const segmentLabels: Record<Segment, string> = {
  active: "Active Cust (0–8 mo)",
  retained: "Retained Cust (9–12 mo)",
  lapsed: "Lapsed Cust (13–18 mo)",
  inactive: "Inactive Cust (19–24 mo)",
  lost: "Lost Cust (25+ mo)",
};

const CallBackReportPage: React.FC = () => {
  const [dateRange, setDateRange] = useState<DateRange>({
    start: null,
    end: null,
  });
  const [customers, setCustomers] = useState<CallbackCustomer[]>(SAMPLE_CUSTOMERS);
  const [selectedCustomer, setSelectedCustomer] = useState<CallbackCustomer | null>(null);

  const [insights, setInsights] = useState<string[]>([
    "126 active customers visited within 8 months – healthy retention base.",
    "68 lapsed customers (13–18 mo) are prime callback targets for re-engagement.",
    "31 lost customers (25+ mo) may require special win-back offers.",
  ]);

  const { selectedIds, setSelectedIds } = useKpiPreferences("call-back-report", KPI_OPTIONS);

  const segmentCounts = useMemo(() => {
    const base: Record<Segment, number> = {
      active: 126,
      retained: 94,
      lapsed: 68,
      inactive: 52,
      lost: 31,
    };
    // In production, calculate from customers array
    return base;
  }, []);

  const segmentHelpText: Record<Segment, string> = {
    active: "Customers whose last visit was 0–8 months ago and are still considered active.",
    retained: "Customers whose last visit was 9–12 months ago and are still on track to stay retained.",
    lapsed: "Customers 13–18 months since their last visit who are at risk of defecting.",
    inactive: "Customers 19–24 months since their last visit who typically require proactive outreach.",
    lost: "Customers 25+ months since their last visit who are treated as lost unless reactivated.",
  };

  const renderKpiTile = (id: string) => {
    const segment = id as Segment;
    const count = segmentCounts[segment];
    if (count === undefined) return null;
    return (
      <MetricTile
        key={id}
        label={segmentLabels[segment]}
        value={count.toLocaleString()}
        helpText={segmentHelpText[segment]}
      />
    );
  };

  const regenerateInsights = () => {
    setInsights([
      `${segmentCounts.active} active customers form your retention foundation.`,
      `${segmentCounts.lapsed} lapsed customers should be prioritized for callbacks.`,
      `Consider win-back campaigns for ${segmentCounts.lost} lost customers.`,
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
            Run report
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
            Find customers who have not been in for service during the selected
            time frame so your team can call and invite them back.
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

          {/* Main callback list */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm">
            <header className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <div>
                <h2 className="text-[13px] font-semibold text-slate-900">
                  Customers to call back
                </h2>
                <p className="text-[11px] text-slate-500">
                  Click any row for more details before you call.
                </p>
              </div>
            </header>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="px-4 py-2 text-left font-medium">Customer name</th>
                    <th className="px-4 py-2 text-left font-medium">Phone</th>
                    <th className="px-4 py-2 text-left font-medium">Email</th>
                    <th className="px-4 py-2 text-left font-medium">
                      Last visit (date / invoice #)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {customers.map((cust) => (
                    <tr
                      key={cust.id}
                      onClick={() => setSelectedCustomer(cust)}
                      className="cursor-pointer hover:bg-slate-50"
                    >
                      <td className="px-4 py-3 text-slate-900">
                        {cust.name}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        {cust.phone}
                      </td>
                      <td className="px-4 py-3 text-emerald-700 underline">
                        {cust.email}
                      </td>
                      <td className="px-4 py-3 text-slate-700">
                        <span className="font-medium">{cust.lastVisitDate}</span>{" "}
                        <span className="text-slate-400">·</span>{" "}
                        <span>Inv #{cust.lastInvoiceNumber}</span>
                      </td>
                    </tr>
                  ))}

                  {customers.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-[11px] text-slate-500"
                      >
                        No customers found for this time frame.
                      </td>
                    </tr>
                  )}
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

      {/* Detail modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-xl">
            <header className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h3 className="text-sm font-semibold text-slate-900">
                Customer details
              </h3>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="rounded-full px-2 py-1 text-xs text-slate-500 hover:bg-slate-100 hover:text-slate-700"
              >
                Close
              </button>
            </header>

            <div className="space-y-4 px-4 py-4 text-xs text-slate-800">
              {/* Basic info */}
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500">
                  Customer name
                </div>
                <div className="text-sm font-semibold text-slate-900">
                  {selectedCustomer.name}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">
                    Phone
                  </div>
                  <div className="text-sm text-slate-900">
                    {selectedCustomer.phone}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">
                    Email
                  </div>
                  <div className="text-sm text-emerald-700 underline">
                    {selectedCustomer.email}
                  </div>
                </div>
              </div>

              {/* Last visit stats */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">
                    Last visit date
                  </div>
                  <div className="text-sm text-slate-900">
                    {selectedCustomer.lastVisitDate}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">
                    Last invoice #
                  </div>
                  <div className="text-sm text-slate-900">
                    {selectedCustomer.lastInvoiceNumber}
                  </div>
                </div>
              </div>

              {/* Total visits */}
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500">
                  Total visits
                </div>
                <div className="text-sm text-slate-900">
                  {selectedCustomer.totalVisits.toLocaleString()}
                </div>
              </div>

              {/* Services performed at last visit */}
              <div>
                <div className="text-[11px] uppercase tracking-wide text-slate-500">
                  Services performed at last visit
                </div>
                <div className="mt-1 text-xs leading-snug text-slate-800">
                  {selectedCustomer.lastVisitServices}
                </div>
              </div>
            </div>

            <footer className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3">
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Close
              </button>
            </footer>
          </div>
        </div>
      )}
    </ShellLayout>
  );
};

export default CallBackReportPage;
