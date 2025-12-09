import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";
import {
  JOURNEY_TOUCH_POINTS,
  JourneyTouchPoint,
} from "@/data/customerJourney";

// RESP coloring
const getRespColorClass = (rate: number): string => {
  if (rate >= 15) return "text-emerald-600";
  if (rate >= 10) return "text-orange-500";
  if (rate >= 5) return "text-amber-500";
  return "text-rose-600";
};

type ChannelKey = "postcard" | "email" | "sms";

type ChannelSegment = {
  key: ChannelKey;
  percent: number;
  colorClass: string;
  dotColorClass: string;
  label: string;
};

const CHANNEL_META: Record<
  ChannelKey,
  Omit<ChannelSegment, "percent">
> = {
  postcard: {
    key: "postcard",
    colorClass: "bg-sky-100",
    dotColorClass: "bg-sky-300",
    label: "Postcard",
  },
  email: {
    key: "email",
    colorClass: "bg-emerald-100",
    dotColorClass: "bg-emerald-300",
    label: "Email",
  },
  sms: {
    key: "sms",
    colorClass: "bg-violet-100",
    dotColorClass: "bg-violet-300",
    label: "Text Message",
  },
};

const getChannelSegments = (channel: string): ChannelSegment[] => {
  const lower = channel.toLowerCase();
  const keys: ChannelKey[] = [];
  if (lower.includes("postcard")) keys.push("postcard");
  if (lower.includes("email")) keys.push("email");
  if (lower.includes("sms") || lower.includes("text")) keys.push("sms");
  if (keys.length === 0) keys.push("email");
  const share = 100 / keys.length;
  return keys.map((key) => ({
    ...CHANNEL_META[key],
    percent: share,
  }));
};

const CustomerJourneyPage: React.FC = () => {
  const navigate = useNavigate();
  const [journeyTab, setJourneyTab] = React.useState<"visualization" | "details">("visualization");

  const totalSent = useMemo(
    () => JOURNEY_TOUCH_POINTS.reduce((sum, tp) => sum + tp.sent, 0),
    []
  );
  const journeyVehicles = useMemo(
    () => JOURNEY_TOUCH_POINTS.reduce((sum, tp) => sum + tp.vehicles, 0),
    []
  );
  const avgTouchPointRoas = useMemo(
    () =>
      JOURNEY_TOUCH_POINTS.reduce((sum, tp) => sum + tp.roas, 0) /
      JOURNEY_TOUCH_POINTS.length,
    []
  );
  const avgRespRate = useMemo(
    () =>
      JOURNEY_TOUCH_POINTS.reduce(
        (sum, tp) => sum + tp.responseRate,
        0
      ) / JOURNEY_TOUCH_POINTS.length,
    []
  );

  const aiInsightsProps = {
    title: "AI Insights",
    subtitle: "Based on 12 months data",
    bullets: [] as string[],
  };

  const handleTouchPointClick = (tp: JourneyTouchPoint) => {
    navigate(`/reports/customer-journey/touch-point/${tp.id}`);
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
            Performance of the standard Throttle journey touch points for this
            store: thank-you, suggested services, reminders and reactivation.
          </p>
        </div>
      </div>

      {/* Main layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricTile
              label="Vehicles"
              value={journeyVehicles.toLocaleString()}
            />
            <MetricTile
              label="Avg ROAS"
              value={`${avgTouchPointRoas.toFixed(1)}x`}
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

          {/* AI stacked on small screens */}
          <div className="block lg:hidden">
            <AIInsightsTile {...aiInsightsProps} />
          </div>

          {/* Journey touch points tile */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-start justify-between mb-1 gap-3">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Customer Journey
                </h2>
                <p className="text-[11px] font-medium text-slate-700">
                  Touch point + Response Rate + ROAS
                </p>
              </div>
              <div className="hidden lg:flex flex-col items-end text-right text-[11px] text-slate-500">
                <span>
                  {journeyVehicles.toLocaleString()} journey vehicles
                </span>
                <span>
                  {totalSent.toLocaleString()} comms sent
                </span>
              </div>
            </div>

            {/* Tab switcher */}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => setJourneyTab("visualization")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  journeyTab === "visualization"
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Visualization
              </button>
              <button
                type="button"
                onClick={() => setJourneyTab("details")}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
                  journeyTab === "details"
                    ? "bg-slate-800 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Details
              </button>
            </div>

            {journeyTab === "visualization" && (
              <>
                <p className="mt-3 text-[10px] text-slate-400">
                  Channel bar shows mix of Postcard, Email and Text Message per touch
                  point. Bar length shows resp % vs other touch points.
                </p>

                <div className="mt-3 space-y-5 text-xs text-slate-700">
                  {JOURNEY_TOUCH_POINTS.map((tp, idx) => {
                    const respColor = getRespColorClass(tp.responseRate);
                    const segments = getChannelSegments(tp.channel);

                    return (
                      <button
                        key={`${tp.name}-${tp.interval}`}
                        type="button"
                        onClick={() => handleTouchPointClick(tp)}
                        className="w-full text-left pt-1"
                      >
                        {/* Top row */}
                        <div className="flex items-start justify-between gap-3 text-[11px]">
                          <div className="text-slate-700">
                            <div className="font-medium">
                              {idx + 1}. {tp.name}
                            </div>
                            <div className="text-[11px] text-slate-500">
                              {tp.interval}
                            </div>
                          </div>

                          <div className="flex flex-col items-end text-right gap-0.5">
                            <div className="inline-flex items-center gap-2 text-[11px] md:text-xs font-medium">
                              <span className={respColor}>
                                {tp.responseRate.toFixed(1)}% RESP
                              </span>
                              <span className="opacity-50 text-slate-500">
                                •
                              </span>
                              <span className="text-slate-700">
                                {tp.roas.toFixed(1)}x ROAS
                              </span>
                            </div>
                            <div className="text-[10px] text-slate-500">
                              {tp.sent.toLocaleString()} sent •{" "}
                              {tp.vehicles.toLocaleString()} resp
                            </div>
                          </div>
                        </div>

                        {/* Channel bar + legend */}
                        <div className="mt-3">
                          <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden flex">
                            {segments.map((seg) => (
                              <div
                                key={seg.key}
                                className={`h-full ${seg.colorClass}`}
                                style={{ width: `${seg.percent}%` }}
                              />
                            ))}
                          </div>

                          <div className="mt-2 flex items-center gap-3 text-[10px] text-slate-500">
                            {segments.map((seg) => (
                              <span
                                key={seg.key}
                                className="inline-flex items-center gap-1"
                              >
                                <span
                                  className={`h-3 w-3 rounded-full ${seg.dotColorClass}`}
                                />
                                <span>{seg.label}</span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </>
            )}

            {journeyTab === "details" && (
              <div className="mt-3 overflow-x-auto">
                <table className="min-w-full text-xs">
                  <thead>
                    <tr className="text-left text-[11px] uppercase tracking-wide text-slate-500">
                      <th className="py-2 pr-3">Touch point</th>
                      <th className="py-2 pr-3 text-right">Sent</th>
                      <th className="py-2 pr-3 text-right">Responses</th>
                      <th className="py-2 pr-3 text-right">Resp %</th>
                      <th className="py-2 pr-3 text-right">ROAS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {JOURNEY_TOUCH_POINTS.map((tp) => (
                      <tr
                        key={tp.id}
                        className="border-t border-slate-100 align-top"
                      >
                        <td className="py-3 pr-3">
                          <div className="text-xs font-medium text-slate-800">
                            {tp.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {tp.interval}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {tp.channel}
                          </div>
                        </td>
                        <td className="py-3 pr-3 text-right">
                          {tp.sent.toLocaleString()}
                        </td>
                        <td className="py-3 pr-3 text-right">
                          {tp.vehicles.toLocaleString()}
                        </td>
                        <td className="py-3 pr-3 text-right">
                          {tp.responseRate.toFixed(1)}%
                        </td>
                        <td className="py-3 pr-3 text-right">
                          {tp.roas.toFixed(1)}x
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>

        {/* RIGHT: AI on large screens */}
        <div className="hidden lg:block lg:col-span-1">
          <AIInsightsTile {...aiInsightsProps} />
        </div>
      </div>
    </ShellLayout>
  );
};

export default CustomerJourneyPage;
