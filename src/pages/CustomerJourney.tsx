import React, { useMemo } from "react";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";

type JourneyStepDetail = {
  name: string;         // Comm Name (no timing embedded)
  interval: string;     // Interval Description / timing
  channel: string;      // primary delivery method(s)
  sent: number;
  vehicles: number;
  responseRate: number; // %
  roas: number;         // x
};

// Updated dummy data with a mix of RESP % buckets
const JOURNEY_STEPS: JourneyStepDetail[] = [
  {
    name: "Thank You Text",
    interval: "1 day after Service",
    channel: "Text",
    sent: 1850,
    vehicles: 420,
    responseRate: 22.7, // green
    roas: 9.5,
  },
  {
    name: "Thank You", // was "Thank You Eml"
    interval: "1 day after Service",
    channel: "Email",
    sent: 1850,
    vehicles: 420,
    responseRate: 22.7, // green
    roas: 9.5,
  },
  {
    name: "Suggested Services",
    interval: "1 week after Service",
    channel: "Email",
    sent: 1760,
    vehicles: 310,
    responseRate: 17.6, // green
    roas: 12.1,
  },
  {
    name: "2nd Vehicle Invitation",
    interval: "10 days after Service",
    channel: "Email",
    sent: 900,
    vehicles: 150,
    responseRate: 13.4, // orange
    roas: 10.3,
  },
  {
    name: "Suggested Services",
    interval: "1 month after Service",
    channel: "Email",
    sent: 1640,
    vehicles: 240,
    responseRate: 16.1, // green
    roas: 11.2,
  },
  {
    name: "Suggested Services",
    interval: "3 months after Service",
    channel: "Email",
    sent: 1520,
    vehicles: 230,
    responseRate: 15.8, // green
    roas: 10.9,
  },
  {
    name: "Suggested Services",
    interval: "6 months after Service",
    channel: "Email",
    sent: 1380,
    vehicles: 210,
    responseRate: 10.6, // orange
    roas: 10.8,
  },
  {
    name: "Monthly Newsletter",
    interval: "Once a month",
    channel: "Email",
    sent: 4200,
    vehicles: 520,
    responseRate: 7.8, // yellow
    roas: 7.8,
  },
  {
    name: "Reminder 1",
    interval: "5k after last Service",
    channel: "Postcard + Email + SMS",
    sent: 1380,
    vehicles: 280,
    responseRate: 20.3, // green
    roas: 16.4,
  },
  {
    name: "Reminder 2",
    interval: "30 days after Reminder 1",
    channel: "Postcard + Email + SMS",
    sent: 980,
    vehicles: 142,
    responseRate: 11.2, // orange
    roas: 10.7,
  },
  {
    name: "Reminder 3",
    interval: "10k after last Service",
    channel: "Postcard + Email + SMS",
    sent: 860,
    vehicles: 120,
    responseRate: 12.5, // orange
    roas: 9.8,
  },
  {
    name: "Reminder 4",
    interval: "15k after last Service",
    channel: "Postcard + Email + SMS",
    sent: 740,
    vehicles: 105,
    responseRate: 6.9, // yellow
    roas: 9.4,
  },
  {
    name: "Reactivation",
    interval: "12 months after Service",
    channel: "Email",
    sent: 620,
    vehicles: 86,
    responseRate: 15.2, // green
    roas: 8.2,
  },
  {
    name: "Reactivation",
    interval: "18 months after Service",
    channel: "Email",
    sent: 480,
    vehicles: 64,
    responseRate: 4.1, // red
    roas: 7.5,
  },
  {
    name: "Reactivation",
    interval: "24 months after Service",
    channel: "Email",
    sent: 360,
    vehicles: 46,
    responseRate: 3.2, // red
    roas: 7.1,
  },
];

// RESP coloring helper
const getRespColorClass = (rate: number): string => {
  if (rate >= 15) return "text-emerald-600"; // green
  if (rate >= 10) return "text-orange-500"; // orange
  if (rate >= 5) return "text-amber-500"; // yellow
  return "text-rose-600"; // red
};

// Channel "icon" helper
const ChannelIcons: React.FC<{ channel: string }> = ({ channel }) => {
  const lower = channel.toLowerCase();
  const hasPostcard = lower.includes("postcard");
  const hasEmail = lower.includes("email");
  const hasSms = lower.includes("sms") || lower.includes("text");

  return (
    <span className="inline-flex items-center gap-1 mr-1 align-middle">
      {hasPostcard && (
        <span className="h-4 w-4 rounded-full bg-slate-100 text-[9px] flex items-center justify-center text-slate-600">
          PC
        </span>
      )}
      {hasEmail && (
        <span className="h-4 w-4 rounded-full bg-slate-100 text-[9px] flex items-center justify-center text-slate-600">
          E
        </span>
      )}
      {hasSms && (
        <span className="h-4 w-4 rounded-full bg-slate-100 text-[9px] flex items-center justify-center text-slate-600">
          T
        </span>
      )}
    </span>
  );
};

const CustomerJourneyPage: React.FC = () => {
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
  const avgRespRate = useMemo(
    () =>
      JOURNEY_STEPS.reduce((sum, s) => sum + s.responseRate, 0) /
      JOURNEY_STEPS.length,
    []
  );
  const maxResponseRate = useMemo(
    () => Math.max(...JOURNEY_STEPS.map((s) => s.responseRate), 1),
    []
  );

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
            Store group:{" "}
            <span className="font-medium">North Bay Group</span>
          </span>
          <span>
            Period:{" "}
            <span className="font-medium">Last 12 months</span>
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

      {/* Main layout: left content (3/4) + right AI tile (1/4) */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT: all journey tiles and tables */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPI tiles */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricTile
              label="Vehicles"
              value={journeyVehicles.toLocaleString()}
            />
            <MetricTile
              label="Avg ROAS"
              value={`${avgStepRoas.toFixed(1)}x`}
            />
            <MetricTile
              label="Avg resp %"
              value={`${avgRespRate.toFixed(1)}%`}
            />
            <MetricTile
              label="Total comms sent"
              value={totalSent.toLocaleString()}
            />
          </div>

          {/* Journey steps visualization – single step-level tile */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-start justify-between mb-1 gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Customer Journey
                </h2>
                <p className="text-[11px] font-medium text-slate-700">
                  Touch Point + Response Rate + ROAS
                </p>
              </div>

              {/* Stacked summary stats – right aligned */}
              <div className="hidden lg:flex flex-col items-end text-right text-[11px] text-slate-500">
                <span>
                  {journeyVehicles.toLocaleString()} journey vehicles
                </span>
                <span>
                  {totalSent.toLocaleString()} comms sent
                </span>
              </div>
            </div>

            <p className="mt-2 text-[10px] text-slate-400">
              Bar length shows resp % vs other steps.
            </p>

            <div className="mt-3 space-y-3 text-xs text-slate-700">
              {JOURNEY_STEPS.map((step, idx) => {
                const respColor = getRespColorClass(step.responseRate);

                return (
                  <div key={`${step.name}-${step.interval}`}>
                    {/* Top row: step label left, metrics right */}
                    <div className="flex items-start justify-between gap-3 text-[11px]">
                      <div className="text-slate-700">
                        <span className="font-medium">
                          {idx + 1}.
                        </span>{" "}
                        <ChannelIcons channel={step.channel} />
                        <span className="font-medium">
                          {step.name}
                        </span>{" "}
                        <span className="text-slate-500">
                          ({step.interval})
                        </span>
                      </div>

                      {/* RESP · Sent · ROAS */}
                      <div className="flex items-start">
                        <div className="inline-flex items-center gap-2 text-[11px] md:text-xs font-medium">
                          <span className={respColor}>
                            {step.responseRate.toFixed(1)}% RESP
                          </span>
                          <span className="opacity-50 text-slate-500">•</span>
                          <span className="text-slate-600">
                            {step.sent.toLocaleString()} sent
                          </span>
                          <span className="opacity-50 text-slate-500">•</span>
                          <span className="text-slate-700">
                            {step.roas.toFixed(1)}x ROAS
                          </span>
                        </div>
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
                );
              })}
            </div>
          </section>

          {/* NOTE: no second "Touch point details" card anymore – 
              we avoid duplicating step-level info */}
        </div>

        {/* RIGHT: AI Insights tile, fixed 1/4-width column */}
        <div className="lg:col-span-1">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on 12 months data"
            bullets={[]} // empty = loading state
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default CustomerJourneyPage;
