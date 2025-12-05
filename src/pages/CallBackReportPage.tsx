import React, { useState } from "react";
import { ShellLayout, SummaryTile } from "@/components/layout";
import MetricTile from "@/components/layout/MetricTile";

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

const CallBackReportPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "A small number of callbacks are overdue; these should be prioritized first.",
    "Most callbacks are customer-friendly touchpoints that support retention and trust.",
    "Use this view to manage the call queue and ensure issues are closed quickly.",
  ]);

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

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile
          label="Due today"
          value={callBackSummary.dueToday.toString()}
          tone="warn"
        />
        <MetricTile
          label="Overdue"
          value={callBackSummary.overdue.toString()}
          tone="negative"
        />
        <MetricTile
          label="Completed this week"
          value={callBackSummary.completedThisWeek.toString()}
          tone="positive"
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

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
        {/* Insights */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-800">
              AI insights (mock)
            </h2>
            <button
              onClick={regenerateInsights}
              className="text-[11px] px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600"
            >
              Refresh
            </button>
          </div>
          <ul className="space-y-1 text-xs text-slate-600">
            {insights.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-rose-500" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            In production, this panel could suggest callback scripts or SMS
            follow-ups based on the reason and customer history.
          </p>
        </div>

        {/* Guidance */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4 text-xs text-slate-600 space-y-2">
          <h2 className="text-sm font-semibold text-slate-800">
            How to use this report
          </h2>
          <ul className="list-disc pl-4 space-y-1">
            <li>Work overdue callbacks first.</li>
            <li>Then handle due-today and high-priority callbacks.</li>
            <li>Use this in morning huddles to plan workload.</li>
          </ul>
        </div>
      </section>

      {/* Table */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Callback queue
          </h2>
          <span className="text-[11px] text-slate-400">
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
                  <td className="py-2 pr-3 text-slate-700">
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
    </ShellLayout>
  );
};

export default CallBackReportPage;
