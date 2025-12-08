import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";

type JourneyStepDetail = {
  name: string;
  interval: string;
  channel: string;
  sent: number;
  vehicles: number;
  responseRate: number;
  roas: number;
};

const JOURNEY_STEPS: JourneyStepDetail[] = [
  {
    name: "Thank You Email",
    interval: "1 day after service",
    channel: "Email",
    sent: 1850,
    vehicles: 420,
    responseRate: 22.7,
    roas: 9.5,
  },
  {
    name: "Suggested Services – 1 week",
    interval: "7 days after service",
    channel: "Email",
    sent: 1760,
    vehicles: 310,
    responseRate: 17.6,
    roas: 12.1,
  },
  {
    name: "Suggested Services – 1 month",
    interval: "30 days after service",
    channel: "Email",
    sent: 1640,
    vehicles: 240,
    responseRate: 14.6,
    roas: 11.2,
  },
  {
    name: "Reminder 1",
    interval: "5k after last service",
    channel: "Postcard + Email + SMS",
    sent: 1380,
    vehicles: 280,
    responseRate: 20.3,
    roas: 16.4,
  },
  {
    name: "Reminder 2",
    interval: "30 days after Reminder 1",
    channel: "Postcard + Email + SMS",
    sent: 980,
    vehicles: 142,
    responseRate: 14.5,
    roas: 10.7,
  },
  {
    name: "Reactivation – 12 months",
    interval: "12 months after service",
    channel: "Email",
    sent: 620,
    vehicles: 86,
    responseRate: 13.9,
    roas: 8.2,
  },
];

const CustomerJourneyPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "The Thank You email sees strong engagement and sets up the relationship.",
    "Reminder 1 (postcard + email + SMS) has the highest ROAS in the journey.",
    "Consider stronger reactivation offers for the 12-month lapsed segment.",
  ]);

  const totalSent = useMemo(
    () => JOURNEY_STEPS.reduce((sum, s) => sum + s.sent, 0),
    []
  );
  const journeyVehicles = useMemo(
    () => JOURNEY_STEPS.reduce((sum, s) => sum + s.vehicles, 0),
    []
  );
  const avgStepRoas = useMemo(
    () =>
      JOURNEY_STEPS.reduce((sum, s) => sum + s.roas, 0) /
      JOURNEY_STEPS.length,
    []
  );
  const bestStep = useMemo(
    () =>
      JOURNEY_STEPS.reduce((best, s) =>
        !best || s.responseRate > best.responseRate ? s : best
      ),
    []
  );
  const maxResponseRate = useMemo(
    () => Math.max(...JOURNEY_STEPS.map((s) => s.responseRate), 1),
    []
  );

  const regenerateInsights = () => {
    const highestRoasStep = JOURNEY_STEPS.reduce((best, s) =>
      !best || s.roas > best.roas ? s : best
    );
    setInsights([
      `"${highestRoasStep.name}" has the highest ROAS at ${highestRoasStep.roas.toFixed(1)}x.`,
      `Journey coverage is generating ${journeyVehicles.toLocaleString()} vehicles from ${totalSent.toLocaleString()} comms sent.`,
      "Review underperforming steps for creative refresh or timing adjustments.",
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Customer Journey" },
      ]}
      rightInfo={
        <>
          <span>
            Store group: <span className="font-medium">North Bay Group</span>
          </span>
          <span>
            Period: <span className="font-medium">Last 12 months</span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Customer Journey
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Performance of the standard Throttle journey steps for this store:
            thank-you, suggested services, reminders and reactivation.
          </p>
        </div>
      </div>

      {/* Main layout: left content + right AI tile */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT: all journey tiles and tables */}
        <div className="lg:col-span-3 space-y-4">
          {/* Highlight metric tiles – all same size now */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            <MetricTile
              label="Journey vehicles"
              value={journeyVehicles.toLocaleString()}
              helper="Visits attributed to journey steps"
            />
            <MetricTile
              label="Avg step ROAS"
              value={`${avgStepRoas.toFixed(1)}x`}
              helper="Across all journey steps"
            />
            <MetricTile
              label="Best-performing step"
              value={bestStep.name}
              helper={`${bestStep.vehicles.toLocaleString()} vehicles`}
            />
            <MetricTile
              label="Total comms sent"
              value={totalSent.toLocaleString()}
              helper="All journey communications"
            />
          </div>

          {/* Journey steps by response and ROAS (updated layout) */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-1">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Journey steps by response and ROAS
                </h2>
                <p className="text-[11px] text-slate-600">
                  Relative performance (dummy data)
                </p>
              </div>
              <span className="hidden text-[11px] text-slate-500 lg:inline">
                {journeyVehicles.toLocaleString()} journey vehicles ·{" "}
                {totalSent.toLocaleString()} comms sent
              </span>
            </div>

            <div className="mt-3 space-y-3 text-xs text-slate-700">
              {JOURNEY_STEPS.map((step, idx) => (
                <div key={step.name}>
                  {/* Top row: step name + timing on left, stacked stats on right */}
                  <div className="flex items-start justify-between gap-3 text-[11px]">
                    <div className="text-slate-700">
                      <span className="font-medium">
                        {idx + 1}. {step.name}
                      </span>{" "}
                      <span className="text-slate-500">
                        ({step.interval})
                      </span>
                    </div>

                    <div className="text-right text-slate-600 min-w-[72px]">
                      <div>{step.responseRate.toFixed(1)}% resp</div>
                      <div>{step.roas.toFixed(1)}x ROAS</div>
                    </div>
                  </div>

                  {/* Bar row */}
                  <div className="mt-2 flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-sky-500"
                        style={{
                          width: `${
                            (step.responseRate / maxResponseRate) * 100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Step details table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Step details
              </h2>
              <span className="text-[11px] text-slate-600">
                Sent, vehicles, response and ROAS by journey step
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500">
                    <th className="py-2 pr-3">Step</th>
                    <th className="py-2 pr-3">Interval</th>
                    <th className="py-2 pr-3">Channel</th>
                    <th className="py-2 pr-3 text-right">Sent</th>
                    <th className="py-2 pr-3 text-right">Vehicles</th>
                    <th className="py-2 pr-3 text-right">Response %</th>
                    <th className="py-2 pr-3 text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {JOURNEY_STEPS.map((step) => (
                    <tr key={step.name} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-800">
                        {step.name}
                      </td>
                      <td className="py-2 pr-3 text-slate-700">
                        {step.interval}
                      </td>
                      <td className="py-2 pr-3 text-slate-700">
                        {step.channel}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {step.sent.toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {step.vehicles.toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {step.responseRate.toFixed(1)}%
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {step.roas.toFixed(1)}x
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT: AI Insights tile, fixed 1/4-width column */}
        <div className="lg:col-span-1">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on 12 months data"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default CustomerJourneyPage;
