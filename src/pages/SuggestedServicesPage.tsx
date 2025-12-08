import React, { useState, useMemo } from "react";
import { ShellLayout, MetricTile } from "@/components/layout";
import AIInsightsTile from "@/components/layout/AIInsightsTile";

type SuggestedServicesSummary = {
  storeGroupName: string;
  periodLabel: string;
  emailsSent: number;
  vehiclesWithSs: number;
  ssRevenue: number;
  acceptanceRate: number;
  avgTicketLift: number;
};

type SuggestedServiceTypeRow = {
  serviceName: string;
  suggestedCount: number;
  acceptedCount: number;
  avgRevenue: number;
};

const ssSummary: SuggestedServicesSummary = {
  storeGroupName: "All Stores",
  periodLabel: "Last 12 months",
  emailsSent: 18200,
  vehiclesWithSs: 4620,
  ssRevenue: 186400,
  acceptanceRate: 23.8,
  avgTicketLift: 22,
};

const ssTypes: SuggestedServiceTypeRow[] = [
  {
    serviceName: "Cabin Air Filter",
    suggestedCount: 5200,
    acceptedCount: 1280,
    avgRevenue: 68,
  },
  {
    serviceName: "Engine Air Filter",
    suggestedCount: 6100,
    acceptedCount: 1420,
    avgRevenue: 54,
  },
  {
    serviceName: "Fuel System Cleaning",
    suggestedCount: 2400,
    acceptedCount: 420,
    avgRevenue: 110,
  },
  {
    serviceName: "Wiper Blades",
    suggestedCount: 4800,
    acceptedCount: 940,
    avgRevenue: 38,
  },
];

const SuggestedServicesPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Cabin and engine air filters are the strongest Suggested Services, with solid response and high average revenue.",
    "Fuel system cleaning has high revenue per job but lower acceptance; consider stronger education or offer.",
    "Wiper blades perform well as an add-on and help boost ticket without adding much bay time.",
  ]);

  const maxAcceptance = useMemo(
    () =>
      Math.max(
        ...ssTypes.map((t) => (t.acceptedCount / t.suggestedCount) * 100),
        1
      ),
    []
  );

  const regenerateInsights = () => {
    const best = ssTypes.reduce((best, s) =>
      !best ||
      s.acceptedCount / s.suggestedCount >
        best.acceptedCount / best.suggestedCount
        ? s
        : best
    );

    setInsights([
      `"${best.serviceName}" has the highest acceptance rate among Suggested Services.`,
      "Use video content in Suggested Services emails to educate customers and nudge acceptance on lower-performing services.",
      "Pair this report with ROAS and Coupon / Discount Analysis to decide where to place stronger offers.",
    ]);
  };

  const totalAccepted = useMemo(
    () => ssTypes.reduce((sum, s) => sum + s.acceptedCount, 0),
    []
  );

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Suggested Services" },
      ]}
      rightInfo={
        <>
          <span>
            Store group:{" "}
            <span className="font-medium">{ssSummary.storeGroupName}</span>
          </span>
          <span>
            Period:{" "}
            <span className="font-medium">{ssSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Suggested Services
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Track how educational Suggested Services messages convert suggested services into
            accepted work and revenue.
          </p>
        </div>
      </div>

      {/* Main layout: left content + right AI tile */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <MetricTile
              label="Emails sent"
              value={ssSummary.emailsSent.toLocaleString()}
              helper="Suggested Services touchpoints"
            />
            <MetricTile
              label="Vehicles with Suggested Services"
              value={ssSummary.vehiclesWithSs.toLocaleString()}
            />
            <MetricTile
              label="Suggested Services acceptance"
              value={`${ssSummary.acceptanceRate.toFixed(1)}%`}
              helper={`${totalAccepted.toLocaleString()} accepted jobs`}
            />
            <MetricTile
              label="Suggested Services revenue"
              value={`$${ssSummary.ssRevenue.toLocaleString()}`}
            />
            <MetricTile
              label="Avg ticket lift"
              value={`$${ssSummary.avgTicketLift.toFixed(0)}`}
            />
          </div>

          {/* Performance by service type */}
          <section className="rounded-2xl bg-card border border-border shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Performance by service type
                </h2>
                <p className="text-[11px] text-slate-600">
                  Suggested vs accepted, response and average revenue
                </p>
              </div>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              {ssTypes.map((s) => {
                const rate = (s.acceptedCount / s.suggestedCount) * 100;
                return (
                  <div key={s.serviceName}>
                    <div className="flex justify-between text-[11px]">
                      <span>{s.serviceName}</span>
                      <span>
                        {rate.toFixed(1)}% accept · ${s.avgRevenue.toFixed(0)}{" "}
                        avg rev
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-emerald-500"
                          style={{
                            width: `${(rate / maxAcceptance) * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-500 w-40 text-right">
                        {s.acceptedCount.toLocaleString()} of{" "}
                        {s.suggestedCount.toLocaleString()} accepted
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Table */}
          <section className="rounded-2xl bg-card border border-border shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Suggested Services details
              </h2>
              <span className="text-[11px] text-slate-500">
                Totals and conversion by service
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Service</th>
                    <th className="py-2 pr-3 text-right">Suggested</th>
                    <th className="py-2 pr-3 text-right">Accepted</th>
                    <th className="py-2 pr-3 text-right">Acceptance %</th>
                    <th className="py-2 pr-3 text-right">Avg revenue</th>
                  </tr>
                </thead>
                <tbody>
                  {ssTypes.map((s) => {
                    const rate = (s.acceptedCount / s.suggestedCount) * 100;
                    return (
                      <tr key={s.serviceName} className="border-t border-border">
                        <td className="py-2 pr-3 text-slate-800">
                          {s.serviceName}
                        </td>
                        <td className="py-2 pr-3 text-right">
                          {s.suggestedCount.toLocaleString()}
                        </td>
                        <td className="py-2 pr-3 text-right">
                          {s.acceptedCount.toLocaleString()}
                        </td>
                        <td className="py-2 pr-3 text-right">
                          {rate.toFixed(1)}%
                        </td>
                        <td className="py-2 pr-3 text-right">
                          ${s.avgRevenue.toFixed(0)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT: AI panel */}
        <div className="lg:col-span-1">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on Suggested Services performance data"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default SuggestedServicesPage;
