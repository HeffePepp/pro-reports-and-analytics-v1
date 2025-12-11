import React, { useState } from "react";
import {
  ShellLayout,
  MetricTile,
  AIInsightsTile,
  KpiCustomizeButton,
} from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";
import { parseChannels, CHANNEL_BAR_CLASS } from "@/styles/channelColors";
import { ChannelLegend } from "@/components/common/ChannelLegend";

type JourneyTouchPoint = {
  id: number;
  name: string;
  offsetLabel: string;
  channel: string;
  respPct: number;
  roas: number;
  sends: number;
  revenue: number;
};

const journeySummary = {
  vehicles: 3343,
  avgRoas: 10.1,
  avgRespPct: 16.0,
  totalComms: 20520,
};

const TOUCH_POINTS: JourneyTouchPoint[] = [
  {
    id: 1,
    name: "Thank You Text",
    offsetLabel: "1 day after service",
    channel: "Text Message",
    respPct: 22.7,
    roas: 9.5,
    sends: 1850,
    revenue: 22400,
  },
  {
    id: 2,
    name: "Thank You",
    offsetLabel: "1 day after service",
    channel: "Email",
    respPct: 22.7,
    roas: 9.5,
    sends: 1850,
    revenue: 22400,
  },
  {
    id: 3,
    name: "Suggested Services",
    offsetLabel: "1 week after service",
    channel: "Email",
    respPct: 17.6,
    roas: 12.1,
    sends: 1760,
    revenue: 21300,
  },
  {
    id: 4,
    name: "2nd Vehicle Invitation",
    offsetLabel: "10 days after service",
    channel: "Email",
    respPct: 16.7,
    roas: 10.3,
    sends: 900,
    revenue: 9270,
  },
  {
    id: 5,
    name: "Suggested Services",
    offsetLabel: "1 month after service",
    channel: "Email",
    respPct: 14.6,
    roas: 11.2,
    sends: 1640,
    revenue: 18400,
  },
  {
    id: 6,
    name: "Suggested Services",
    offsetLabel: "3 months after service",
    channel: "Email",
    respPct: 15.1,
    roas: 10.9,
    sends: 1520,
    revenue: 16600,
  },
  {
    id: 7,
    name: "Suggested Services",
    offsetLabel: "6 months after service",
    channel: "Email",
    respPct: 15.2,
    roas: 10.8,
    sends: 1380,
    revenue: 14900,
  },
  {
    id: 8,
    name: "Monthly Newsletter",
    offsetLabel: "Once a month",
    channel: "Email",
    respPct: 12.4,
    roas: 7.8,
    sends: 4200,
    revenue: 32800,
  },
  {
    id: 9,
    name: "Reminder 1",
    offsetLabel: "5k after last service",
    channel: "Postcard + Email + Text",
    respPct: 20.3,
    roas: 16.4,
    sends: 1380,
    revenue: 22600,
  },
  {
    id: 10,
    name: "Reminder 2",
    offsetLabel: "30 days after Reminder 1",
    channel: "Postcard + Email + Text",
    respPct: 14.5,
    roas: 10.7,
    sends: 980,
    revenue: 10500,
  },
  {
    id: 11,
    name: "Reminder 3",
    offsetLabel: "10k after last service",
    channel: "Postcard + Email + Text",
    respPct: 14.0,
    roas: 9.8,
    sends: 860,
    revenue: 8400,
  },
  {
    id: 12,
    name: "Reminder 4",
    offsetLabel: "15k after last service",
    channel: "Postcard + Email + Text",
    respPct: 14.2,
    roas: 9.4,
    sends: 740,
    revenue: 6950,
  },
  {
    id: 13,
    name: "Reactivation",
    offsetLabel: "12 months after service",
    channel: "Email",
    respPct: 13.9,
    roas: 8.2,
    sends: 620,
    revenue: 5100,
  },
  {
    id: 14,
    name: "Reactivation",
    offsetLabel: "18 months after service",
    channel: "Email",
    respPct: 13.3,
    roas: 7.5,
    sends: 480,
    revenue: 3600,
  },
  {
    id: 15,
    name: "Reactivation",
    offsetLabel: "24 months after service",
    channel: "Email",
    respPct: 12.8,
    roas: 7.1,
    sends: 360,
    revenue: 2560,
  },
];

type CJTab = "visualization" | "details";

const KPI_OPTIONS: KpiOption[] = [
  { id: "vehicles", label: "Vehicles" },
  { id: "avgRoas", label: "Avg ROAS" },
  { id: "avgRespPct", label: "Avg resp %" },
  { id: "totalComms", label: "Total comms sent" },
];

const CustomerJourneyPage: React.FC = () => {
  const [tab, setTab] = useState<CJTab>("visualization");
  const { selectedIds, setSelectedIds } = useKpiPreferences("customer-journey", KPI_OPTIONS);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "vehicles":
        return (
          <MetricTile
            key={id}
            label="Vehicles"
            value={journeySummary.vehicles.toLocaleString()}
            helpText="Number of unique vehicles that have entered this journey in the selected time frame."
          />
        );
      case "avgRoas":
        return (
          <MetricTile
            key={id}
            label="Avg ROAS"
            value={`${journeySummary.avgRoas.toFixed(1)}x`}
            helpText="Average return on ad spend for all journey touch points combined."
          />
        );
      case "avgRespPct":
        return (
          <MetricTile
            key={id}
            label="Avg resp %"
            value={`${journeySummary.avgRespPct.toFixed(1)}%`}
            helpText="Average response rate across all customer journey touch points."
          />
        );
      case "totalComms":
        return (
          <MetricTile
            key={id}
            label="Total comms sent"
            value={journeySummary.totalComms.toLocaleString()}
            helpText="Total number of messages sent across all journey touch points."
          />
        );
      default:
        return null;
    }
  };

  const aiInsightsProps = {
    title: "AI Insights",
    timeframeLabel: "Based on 12 months data",
    bullets: [
      "Thank-you touch points drive the highest RESP % – protect these.",
      "Suggested Services after 1–3 months show strong ROAS; consider additional education.",
      "Reminder 1 delivers the best balance of RESP % and revenue per send.",
    ],
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
            Vehicles:{" "}
            <span className="font-medium">
              {journeySummary.vehicles.toLocaleString()}
            </span>
          </span>
          <span>
            Period: <span className="font-medium">Last 12 months</span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Customer Journey
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Performance of the standard Throttle journey touch points for this
            store: thank-you, suggested services, reminders and reactivation.
          </p>
        </div>
        <KpiCustomizeButton
          reportId="customer-journey"
          options={KPI_OPTIONS}
          selectedIds={selectedIds}
          onChangeSelected={setSelectedIds}
        />
      </div>

      {/* Layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPI tiles - only rendered when selected */}
          {selectedIds.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {selectedIds.map((id) => renderKpiTile(id))}
            </div>
          )}

          {/* Customer Journey tile */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <header className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[11px] text-slate-500">
                  Touch point + Response Rate + ROAS
                </p>
                <p className="text-[11px] text-slate-400">
                  {journeySummary.vehicles.toLocaleString()} journey vehicles ·{" "}
                  {journeySummary.totalComms.toLocaleString()} comms sent
                </p>
              </div>

              <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1 text-[11px]">
                {(["visualization", "details"] as CJTab[]).map((t) => {
                  const isActive = t === tab;
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTab(t)}
                      className={`rounded-full px-3 py-1 transition ${
                        isActive
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      {t === "visualization" ? "Visualization" : "Details"}
                    </button>
                  );
                })}
              </div>
            </header>

            {/* Visualization tab: stacked list of touch points with bars */}
            {tab === "visualization" && (
              <div className="mt-4 space-y-4">
                {TOUCH_POINTS.map((tp) => (
                  <div key={tp.id} className="space-y-1">
                    <div className="flex items-baseline justify-between gap-3">
                      <div>
                        <div className="text-base font-semibold text-slate-900">
                          {tp.id}. {tp.name}
                        </div>
                        <div className="text-sm text-slate-500">
                          {tp.offsetLabel}
                        </div>
                        <div className="text-sm text-slate-500">
                          {tp.channel}
                        </div>
                      </div>
                      <div className="text-right text-sm text-slate-500">
                        <div className="text-xl font-semibold text-emerald-600">
                          {tp.respPct.toFixed(1)}% RESP
                        </div>
                        <div className="text-sm text-slate-500">
                          {tp.roas.toFixed(1)}x ROAS
                        </div>
                        <div className="text-sm text-slate-400">
                          {tp.sends.toLocaleString()} sent ·{" "}
                          {tp.revenue.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          })}{" "}
                          rev
                        </div>
                      </div>
                    </div>

                    {/* Channel-colored bar */}
                    {(() => {
                      const channels = parseChannels(tp.channel);
                      const segmentWidth = 100 / channels.length;
                      return (
                        <div className="mt-1 h-1.5 w-full rounded-full bg-slate-100 overflow-hidden flex">
                          {channels.map((ch) => (
                            <div
                              key={ch}
                              className={CHANNEL_BAR_CLASS[ch]}
                              style={{ width: `${Math.min(tp.respPct, 100) * segmentWidth / 100}%` }}
                            />
                          ))}
                        </div>
                      );
                    })()}

                    {/* Channel legend for every touch point */}
                    <ChannelLegend channels={parseChannels(tp.channel)} />
                  </div>
                ))}
              </div>
            )}

            {/* Details tab: clean table with left-aligned metrics */}
            {tab === "details" && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full table-fixed text-xs">
                  {/* 6 columns: touch point + 5 metrics */}
                  <colgroup>
                    <col className="w-[40%]" />  {/* touch point / offset / channel */}
                    <col className="w-[12%]" />  {/* sent */}
                    <col className="w-[12%]" />  {/* responses */}
                    <col className="w-[12%]" />  {/* resp % */}
                    <col className="w-[12%]" />  {/* roas */}
                    <col className="w-[12%]" />  {/* revenue */}
                  </colgroup>

                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                      <th className="py-2 pr-3 text-left font-medium whitespace-nowrap">
                        Touch point
                      </th>
                      <th className="py-2 px-3 text-right font-medium whitespace-nowrap">
                        Sent
                      </th>
                      <th className="py-2 px-3 text-right font-medium whitespace-nowrap">
                        Responses
                      </th>
                      <th className="py-2 px-3 text-right font-medium whitespace-nowrap">
                        Resp %
                      </th>
                      <th className="py-2 px-3 text-right font-medium whitespace-nowrap">
                        ROAS
                      </th>
                      <th className="py-2 pl-3 text-right font-medium whitespace-nowrap">
                        Revenue
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {TOUCH_POINTS.map((tp) => {
                      const responses = Math.round(tp.sends * (tp.respPct / 100));
                      return (
                        <tr key={tp.id} className="align-top">
                          {/* LEFT: consolidated description column */}
                          <td className="py-3 pr-3">
                            <div className="text-xs font-semibold text-slate-900">
                              {tp.id}. {tp.name}
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-500">
                              {tp.offsetLabel}
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-500">
                              {tp.channel}
                            </div>
                          </td>

                          {/* Metrics – right aligned */}
                          <td className="py-3 px-3 text-right text-xs text-slate-900">
                            {tp.sends.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right text-xs text-slate-900">
                            {responses.toLocaleString()}
                          </td>
                          <td className="py-3 px-3 text-right text-xs font-semibold text-emerald-600">
                            {tp.respPct.toFixed(1)}%
                          </td>
                          <td className="py-3 px-3 text-right text-xs text-slate-900">
                            {tp.roas.toFixed(1)}x
                          </td>
                          <td className="py-3 pl-3 text-right text-xs text-slate-900">
                            {tp.revenue.toLocaleString("en-US", {
                              style: "currency",
                              currency: "USD",
                              maximumFractionDigits: 0,
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* AI stacked on small screens - after main content */}
          <div className="block lg:hidden">
            <AIInsightsTile {...aiInsightsProps} />
          </div>
        </div>

        {/* RIGHT: AI insights - top aligned with KPI tiles */}
        <div className="hidden lg:block lg:col-span-1 self-start">
          <AIInsightsTile {...aiInsightsProps} />
        </div>
      </div>
    </ShellLayout>
  );
};

export default CustomerJourneyPage;
