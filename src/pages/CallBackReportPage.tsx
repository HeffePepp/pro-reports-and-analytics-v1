import React, { useState } from "react";
import { ShellLayout, SummaryTile, MetricTile, AIInsightsTile, KpiCustomizeButton } from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";

type CallBackSummary = {
  storeGroupName: string;
  openCount: number;
  dueToday: number;
  overdue: number;
  completedThisWeek: number;
};

type CallBackRow = {
  customerName: string;
  vehicle: string;
  storeName: string;
  reason: string;
  priority: "High" | "Medium" | "Low";
  dueDate: string;
  requestedBy: string;
  status: "Open" | "Completed";
};

const callBackSummary: CallBackSummary = {
  storeGroupName: "North Bay Group",
  openCount: 34,
  dueToday: 9,
  overdue: 5,
  completedThisWeek: 17,
};

const callBackRows: CallBackRow[] = [
  {
    customerName: "Jane Smith",
    vehicle: "2018 Toyota Camry",
    storeName: "Vallejo, CA",
    reason: "Post-service concern",
    priority: "High",
    dueDate: "2024-12-05",
    requestedBy: "Service Advisor – Mark",
    status: "Open",
  },
  {
    customerName: "Michael Johnson",
    vehicle: "2016 Ford F-150",
    storeName: "Napa, CA",
    reason: "Coupon question",
    priority: "Medium",
    dueDate: "2024-12-04",
    requestedBy: "Call Center",
    status: "Open",
  },
  {
    customerName: "Laura Chen",
    vehicle: "2021 Subaru Outback",
    storeName: "Fairfield, CA",
    reason: "Follow-up suggestion",
    priority: "Low",
    dueDate: "2024-12-07",
    requestedBy: "Service Advisor – Kelly",
    status: "Open",
  },
  {
    customerName: "Carlos Garcia",
    vehicle: "2012 Honda Civic",
    storeName: "Vallejo, CA",
    reason: "Callback on inspection",
    priority: "High",
    dueDate: "2024-12-02",
    requestedBy: "Store Manager",
    status: "Open",
  },
];

const KPI_OPTIONS: KpiOption[] = [
  { id: "dueToday", label: "Due today" },
  { id: "overdue", label: "Overdue" },
  { id: "completedThisWeek", label: "Completed this week" },
  { id: "priorityFocus", label: "Priority focus" },
  { id: "owner", label: "Owner" },
];

const CallBackReportPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "A small number of callbacks are overdue; these should be prioritized first.",
    "Most callbacks are customer-friendly touchpoints that support retention and trust.",
    "Use this view to manage the call queue and ensure issues are closed quickly.",
  ]);

  const { selectedIds, setSelectedIds } = useKpiPreferences("call-back-report", KPI_OPTIONS);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "dueToday": return <MetricTile key={id} label="Due today" value={callBackSummary.dueToday.toString()} />;
      case "overdue": return <MetricTile key={id} label="Overdue" value={callBackSummary.overdue.toString()} />;
      case "completedThisWeek": return <MetricTile key={id} label="Completed this week" value={callBackSummary.completedThisWeek.toString()} />;
      case "priorityFocus": return <MetricTile key={id} label="Priority focus" value="High" helper="High-priority, overdue first" />;
      case "owner": return <MetricTile key={id} label="Owner" value="Store / call center" helper="Shared responsibility" />;
      default: return null;
    }
  };

  const regenerateInsights = () => {
    setInsights([
      `${callBackSummary.overdue} callback(s) are overdue; complete these before end of day.`,
      `${callBackSummary.dueToday} callback(s) are due today across the group.`,
      `This week, ${callBackSummary.completedThisWeek} callback(s) have already been completed.`,
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Call Back Report" },
      ]}
      rightInfo={
        <>
          <span>
            Group:{" "}
            <span className="font-medium">
              {callBackSummary.storeGroupName}
            </span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Call Back Report
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Operational queue of customers needing follow-up calls, with
            priorities and due dates.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <SummaryTile
            label="Open callbacks"
            value={callBackSummary.openCount.toString()}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <MetricTile
              label="Due today"
              value={callBackSummary.dueToday.toString()}
            />
            <MetricTile
              label="Overdue"
              value={callBackSummary.overdue.toString()}
            />
            <MetricTile
              label="Completed this week"
              value={callBackSummary.completedThisWeek.toString()}
            />
            <MetricTile
              label="Priority focus"
              value="High"
              helper="High-priority, overdue first"
            />
            <MetricTile
              label="Owner"
              value="Store / call center"
              helper="Shared responsibility"
            />
          </div>

          {/* AI Insights – stacked here on small/medium screens */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on callback queue data"
              bullets={insights}
              onRefresh={regenerateInsights}
            />
          </div>

          {/* Table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Callback queue
              </h2>
              <span className="text-[11px] text-slate-500">
                Customers awaiting follow-up (dummy data)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Customer</th>
                    <th className="py-2 pr-3">Vehicle</th>
                    <th className="py-2 pr-3">Store</th>
                    <th className="py-2 pr-3">Reason</th>
                    <th className="py-2 pr-3">Priority</th>
                    <th className="py-2 pr-3">Due date</th>
                    <th className="py-2 pr-3">Requested by</th>
                    <th className="py-2 pr-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {callBackRows.map((row, idx) => (
                    <tr key={idx} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-800">
                        {row.customerName}
                      </td>
                      <td className="py-2 pr-3 text-slate-600">{row.vehicle}</td>
                      <td className="py-2 pr-3 text-slate-600">{row.storeName}</td>
                      <td className="py-2 pr-3 text-slate-600">{row.reason}</td>
                      <td className="py-2 pr-3 text-slate-600">{row.priority}</td>
                      <td className="py-2 pr-3 text-slate-600">{row.dueDate}</td>
                      <td className="py-2 pr-3 text-slate-600">
                        {row.requestedBy}
                      </td>
                      <td className="py-2 pr-3 text-slate-600">{row.status}</td>
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
            subtitle="Based on callback queue data"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default CallBackReportPage;
