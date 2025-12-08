import React, { useState, useMemo } from "react";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";

type EmailCaptureSummary = {
  totalCustomers: number;
  withEmail: number;
  validEmail: number;
  bouncedEmail: number;
  optedOut: number;
};

type EmailCaptureRow = {
  storeName: string;
  customers: number;
  validEmails: number;
  captureRate: number; // %
};

const emailSummary: EmailCaptureSummary = {
  totalCustomers: 18500,
  withEmail: 14200,
  validEmail: 13400,
  bouncedEmail: 800,
  optedOut: 920,
};

const emailRows: EmailCaptureRow[] = [
  {
    storeName: "Vallejo, CA",
    customers: 5200,
    validEmails: 4100,
    captureRate: 78.8,
  },
  {
    storeName: "Napa, CA",
    customers: 4200,
    validEmails: 3400,
    captureRate: 81.0,
  },
  {
    storeName: "Fairfield, CA",
    customers: 3100,
    validEmails: 2320,
    captureRate: 74.8,
  },
  {
    storeName: "Vacaville, CA",
    customers: 4000,
    validEmails: 3580,
    captureRate: 89.5,
  },
];

const ValidEmailCapturePage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Overall email capture is strong, but a few stores lag behind the group.",
    "Reducing bounce volume will immediately improve deliverability and ROI on email-heavy campaigns.",
    "Opt-out counts are within a normal range given total volume.",
  ]);

  const overallCaptureRate = useMemo(
    () => (emailSummary.validEmail / emailSummary.totalCustomers) * 100,
    []
  );

  const maxCaptureRate = useMemo(
    () => Math.max(...emailRows.map((r) => r.captureRate), 1),
    []
  );

  const regenerateInsights = () => {
    const worstStore = emailRows.reduce((worst, r) =>
      !worst || r.captureRate < worst.captureRate ? r : worst
    );
    setInsights([
      `Overall valid email capture is ${overallCaptureRate.toFixed(
        1
      )}% across the account.`,
      `"${worstStore.storeName}" has the lowest capture rate (${worstStore.captureRate.toFixed(
        1
      )}%) and is a good target for staff training.`,
      "Consider tablet or QR-based capture at checkout to boost valid emails without slowing the lane.",
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Valid Email Capture" },
      ]}
      rightInfo={
        <>
          <span>
            Customers:{" "}
            <span className="font-medium">
              {emailSummary.totalCustomers.toLocaleString()}
            </span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Valid Email Capture
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track email capture and validity so that lifecycle and campaign
            reports reflect real reachable customers.
          </p>
        </div>
      </div>

      {/* Layout: left content + right AI tile */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <MetricTile
              label="Total customers"
              value={emailSummary.totalCustomers.toLocaleString()}
            />
            <MetricTile
              label="With email on file"
              value={emailSummary.withEmail.toLocaleString()}
            />
            <MetricTile
              label="Valid email capture"
              value={`${overallCaptureRate.toFixed(1)}%`}
              helper={`${emailSummary.validEmail.toLocaleString()} valid`}
            />
            <MetricTile
              label="Bounced emails"
              value={emailSummary.bouncedEmail.toLocaleString()}
            />
            <MetricTile
              label="Opted-out"
              value={emailSummary.optedOut.toLocaleString()}
            />
          </div>

          {/* Capture rate by store */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Capture rate by store
              </h2>
              <span className="text-[11px] text-slate-500">
                Valid email % by location
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              {emailRows.map((r) => (
                <div key={r.storeName}>
                  <div className="flex justify-between text-[11px]">
                    <span>{r.storeName}</span>
                    <span>{r.captureRate.toFixed(1)}% valid</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-sky-500"
                        style={{
                          width: `${(r.captureRate / maxCaptureRate) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 w-40 text-right">
                      {r.validEmails.toLocaleString()} valid of{" "}
                      {r.customers.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Email capture details
              </h2>
              <span className="text-[11px] text-slate-500">
                Valid email rate by store
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Store</th>
                    <th className="py-2 pr-3 text-right">Customers</th>
                    <th className="py-2 pr-3 text-right">Valid emails</th>
                    <th className="py-2 pr-3 text-right">Capture %</th>
                  </tr>
                </thead>
                <tbody>
                  {emailRows.map((r) => (
                    <tr key={r.storeName} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-800">
                        {r.storeName}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {r.customers.toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {r.validEmails.toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {r.captureRate.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT: AI panel */}
        <div className="lg:col-span-1">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on email capture & deliverability"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default ValidEmailCapturePage;
