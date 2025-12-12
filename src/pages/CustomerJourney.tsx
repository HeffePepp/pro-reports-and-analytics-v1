import React, { useState, useMemo } from "react";
import {
  ShellLayout,
  MetricTile,
  AIInsightsTile,
  KpiCustomizeButton,
} from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";
import { parseChannels, CHANNEL_BAR_CLASS, CHANNEL_LABELS } from "@/styles/channelColors";
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
  // Per-channel breakdowns for multi-channel touch points
  channelBreakdown?: {
    channel: "postcard" | "email" | "text";
    sends: number;
    opened: number;
    responses: number;
    respPct: number;
    roas: number;
    revenue: number;
  }[];
};

const journeySummary = {
  vehicles: 3343,
  avgRoas: 10.1,
  avgRespPct: 16.0,
  totalComms: 20520,
  // New KPI data
  validMailingAddresses: 2856,
  validEmailAddresses: 2934,
  validCellNumbers: 2412,
  avgInvoice: 87.50,
  emailReminders: 8420,
  textReminders: 3960,
  pcReminders: 3960,
};

const TOUCH_POINTS: JourneyTouchPoint[] = [
  {
    id: 1,
    name: "Thank You",
    offsetLabel: "1 day after service",
    channel: "Text",
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
    channelBreakdown: [
      { channel: "postcard", sends: 460, opened: 0, responses: 112, respPct: 24.3, roas: 18.2, revenue: 8380 },
      { channel: "email", sends: 460, opened: 184, responses: 89, respPct: 19.3, roas: 15.1, revenue: 6950 },
      { channel: "text", sends: 460, opened: 437, responses: 79, respPct: 17.2, roas: 15.8, revenue: 7270 },
    ],
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
    channelBreakdown: [
      { channel: "postcard", sends: 327, opened: 0, responses: 52, respPct: 15.9, roas: 11.4, revenue: 3730 },
      { channel: "email", sends: 327, opened: 124, responses: 44, respPct: 13.5, roas: 10.2, revenue: 3340 },
      { channel: "text", sends: 326, opened: 306, responses: 46, respPct: 14.1, roas: 10.5, revenue: 3430 },
    ],
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
    channelBreakdown: [
      { channel: "postcard", sends: 287, opened: 0, responses: 43, respPct: 15.0, roas: 10.2, revenue: 2930 },
      { channel: "email", sends: 287, opened: 103, responses: 38, respPct: 13.2, roas: 9.5, revenue: 2730 },
      { channel: "text", sends: 286, opened: 269, responses: 39, respPct: 13.6, roas: 9.6, revenue: 2740 },
    ],
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
    channelBreakdown: [
      { channel: "postcard", sends: 247, opened: 0, responses: 38, respPct: 15.4, roas: 9.8, revenue: 2420 },
      { channel: "email", sends: 247, opened: 89, responses: 34, respPct: 13.8, roas: 9.1, revenue: 2250 },
      { channel: "text", sends: 246, opened: 231, responses: 33, respPct: 13.4, roas: 9.3, revenue: 2280 },
    ],
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
  { id: "validMailing", label: "Valid Mailing Addresses" },
  { id: "validEmail", label: "Valid Email Addresses" },
  { id: "validCell", label: "Valid Cell Numbers" },
  { id: "avgInvoice", label: "Avg Invoice" },
  { id: "emailReminders", label: "Email Reminders" },
  { id: "textReminders", label: "Text Reminders" },
  { id: "pcReminders", label: "PC Reminders" },
];

type DetailsSortKey = "id" | "channel" | "sends" | "opened" | "responses" | "respPct" | "roas" | "revenue";
type SortDir = "asc" | "desc";

// Channel sort order for consistent sorting
const CHANNEL_SORT_ORDER: Record<string, number> = {
  postcard: 1,
  email: 2,
  text: 3,
};

const CustomerJourneyPage: React.FC = () => {
  const [tab, setTab] = useState<CJTab>("visualization");
  const { selectedIds, setSelectedIds } = useKpiPreferences("customer-journey", KPI_OPTIONS);
  const [detailsSortKey, setDetailsSortKey] = useState<DetailsSortKey>("id");
  const [detailsSortDir, setDetailsSortDir] = useState<SortDir>("asc");

  const handleDetailsSort = (key: DetailsSortKey) => {
    if (key === detailsSortKey) {
      setDetailsSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setDetailsSortKey(key);
      setDetailsSortDir(key === "id" ? "asc" : "desc");
    }
  };

  // Build flattened rows for Details table (one row per channel per touch point)
  type DetailRow = {
    tpId: number;
    tpName: string;
    offsetLabel: string;
    channel: "postcard" | "email" | "text";
    sends: number;
    opened: number;
    responses: number;
    respPct: number;
    roas: number;
    revenue: number;
    isFirstInGroup: boolean;
    groupSize: number;
  };

  const detailRows = useMemo(() => {
    const rows: DetailRow[] = [];
    TOUCH_POINTS.forEach((tp) => {
      if (tp.channelBreakdown && tp.channelBreakdown.length > 0) {
        tp.channelBreakdown.forEach((cb, idx) => {
          rows.push({
            tpId: tp.id,
            tpName: tp.name,
            offsetLabel: tp.offsetLabel,
            channel: cb.channel,
            sends: cb.sends,
            opened: cb.opened,
            responses: cb.responses,
            respPct: cb.respPct,
            roas: cb.roas,
            revenue: cb.revenue,
            isFirstInGroup: idx === 0,
            groupSize: tp.channelBreakdown!.length,
          });
        });
      } else {
        const channels = parseChannels(tp.channel);
        const channelKey = channels[0] || "email";
        const responses = Math.round(tp.sends * (tp.respPct / 100));
        const opened = channelKey === "email" 
          ? Math.round(tp.sends * 0.4) 
          : channelKey === "text" 
            ? Math.round(tp.sends * 0.95) 
            : 0;
        rows.push({
          tpId: tp.id,
          tpName: tp.name,
          offsetLabel: tp.offsetLabel,
          channel: channelKey as "postcard" | "email" | "text",
          sends: tp.sends,
          opened,
          responses,
          respPct: tp.respPct,
          roas: tp.roas,
          revenue: tp.revenue,
          isFirstInGroup: true,
          groupSize: 1,
        });
      }
    });
    return rows;
  }, []);

  const sortedDetailRows = useMemo(() => {
    const sorted = [...detailRows];
    sorted.sort((a, b) => {
      let aVal: number | string;
      let bVal: number | string;

      switch (detailsSortKey) {
        case "id":
          aVal = a.tpId;
          bVal = b.tpId;
          break;
        case "channel":
          aVal = CHANNEL_SORT_ORDER[a.channel] ?? 99;
          bVal = CHANNEL_SORT_ORDER[b.channel] ?? 99;
          break;
        case "sends":
          aVal = a.sends;
          bVal = b.sends;
          break;
        case "opened":
          aVal = a.opened;
          bVal = b.opened;
          break;
        case "responses":
          aVal = a.responses;
          bVal = b.responses;
          break;
        case "respPct":
          aVal = a.respPct;
          bVal = b.respPct;
          break;
        case "roas":
          aVal = a.roas;
          bVal = b.roas;
          break;
        case "revenue":
          aVal = a.revenue;
          bVal = b.revenue;
          break;
        default:
          aVal = a.tpId;
          bVal = b.tpId;
      }

      if (aVal < bVal) return detailsSortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return detailsSortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [detailRows, detailsSortKey, detailsSortDir]);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "validMailing":
        return (
          <MetricTile
            key={id}
            label="Valid Mailing Addresses"
            value={journeySummary.validMailingAddresses.toLocaleString()}
            helpText="Number of customers with verified mailing addresses for postcard delivery."
          />
        );
      case "validEmail":
        return (
          <MetricTile
            key={id}
            label="Valid Email Addresses"
            value={journeySummary.validEmailAddresses.toLocaleString()}
            helpText="Number of customers with verified email addresses for digital communications."
          />
        );
      case "validCell":
        return (
          <MetricTile
            key={id}
            label="Valid Cell Numbers"
            value={journeySummary.validCellNumbers.toLocaleString()}
            helpText="Number of customers with verified cell phone numbers for text messaging."
          />
        );
      case "avgInvoice":
        return (
          <MetricTile
            key={id}
            label="Avg Invoice"
            value={journeySummary.avgInvoice.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            helpText="Average invoice amount across all journey-related transactions."
          />
        );
      case "emailReminders":
        return (
          <MetricTile
            key={id}
            label="Email Reminders"
            value={journeySummary.emailReminders.toLocaleString()}
            helpText="Total email reminders sent across all journey touch points."
            className="bg-tp-pastel-green border-emerald-200"
            valueHighlightClass="bg-emerald-100 text-emerald-700"
          />
        );
      case "textReminders":
        return (
          <MetricTile
            key={id}
            label="Text Reminders"
            value={journeySummary.textReminders.toLocaleString()}
            helpText="Total text message reminders sent across all journey touch points."
            className="bg-tp-pastel-purple border-indigo-200"
            valueHighlightClass="bg-indigo-100 text-indigo-700"
          />
        );
      case "pcReminders":
        return (
          <MetricTile
            key={id}
            label="PC Reminders"
            value={journeySummary.pcReminders.toLocaleString()}
            helpText="Total postcard reminders sent across all journey touch points."
            className="bg-tp-pastel-blue border-sky-200"
            valueHighlightClass="bg-sky-100 text-sky-700"
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
                        <div className="mt-1 flex flex-wrap gap-1">
                          {parseChannels(tp.channel).map((ch) => (
                            <span
                              key={ch}
                              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                                ch === "postcard"
                                  ? "bg-tp-pastel-blue text-sky-700 border-sky-200"
                                  : ch === "email"
                                  ? "bg-tp-pastel-green text-emerald-700 border-emerald-200"
                                  : "bg-tp-pastel-purple text-indigo-700 border-indigo-200"
                              }`}
                            >
                              {CHANNEL_LABELS[ch]}
                            </span>
                          ))}
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

            {/* Details tab: expanded table with per-channel rows */}
            {tab === "details" && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full table-fixed text-xs">
                  {/* 8 columns: touch point, channel, sent, opened, responses, resp %, roas, revenue */}
                  <colgroup>
                    <col className="w-[28%]" />  {/* touch point */}
                    <col className="w-[12%]" />  {/* channel */}
                    <col className="w-[10%]" />  {/* sent */}
                    <col className="w-[10%]" />  {/* opened */}
                    <col className="w-[10%]" />  {/* responses */}
                    <col className="w-[10%]" />  {/* resp % */}
                    <col className="w-[10%]" />  {/* roas */}
                    <col className="w-[10%]" />  {/* revenue */}
                  </colgroup>

                  <thead>
                    <tr className="border-b border-slate-200 text-[11px] tracking-wide text-slate-500">
                      <th className="py-2 pr-3 text-left font-medium whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDetailsSort("id")}
                          className="inline-flex items-center gap-1 hover:text-slate-700"
                        >
                          Touch point
                          {detailsSortKey === "id" && (
                            <span className="text-[9px] text-slate-400">
                              {detailsSortDir === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </button>
                      </th>
                      <th className="py-2 px-3 text-left font-medium whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDetailsSort("channel")}
                          className="inline-flex items-center gap-1 hover:text-slate-700"
                        >
                          Channel
                          {detailsSortKey === "channel" && (
                            <span className="text-[9px] text-slate-400">
                              {detailsSortDir === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </button>
                      </th>
                      <th className="py-2 px-3 text-right font-medium whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDetailsSort("sends")}
                          className="inline-flex items-center gap-1 justify-end w-full hover:text-slate-700"
                        >
                          Sent
                          {detailsSortKey === "sends" && (
                            <span className="text-[9px] text-slate-400">
                              {detailsSortDir === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </button>
                      </th>
                      <th className="py-2 px-3 text-right font-medium whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDetailsSort("opened")}
                          className="inline-flex items-center gap-1 justify-end w-full hover:text-slate-700"
                        >
                          Opened
                          {detailsSortKey === "opened" && (
                            <span className="text-[9px] text-slate-400">
                              {detailsSortDir === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </button>
                      </th>
                      <th className="py-2 px-3 text-right font-medium whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDetailsSort("responses")}
                          className="inline-flex items-center gap-1 justify-end w-full hover:text-slate-700"
                        >
                          Responses
                          {detailsSortKey === "responses" && (
                            <span className="text-[9px] text-slate-400">
                              {detailsSortDir === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </button>
                      </th>
                      <th className="py-2 px-3 text-right font-medium whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDetailsSort("respPct")}
                          className="inline-flex items-center gap-1 justify-end w-full hover:text-slate-700"
                        >
                          Resp %
                          {detailsSortKey === "respPct" && (
                            <span className="text-[9px] text-slate-400">
                              {detailsSortDir === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </button>
                      </th>
                      <th className="py-2 px-3 text-right font-medium whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDetailsSort("roas")}
                          className="inline-flex items-center gap-1 justify-end w-full hover:text-slate-700"
                        >
                          ROAS
                          {detailsSortKey === "roas" && (
                            <span className="text-[9px] text-slate-400">
                              {detailsSortDir === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </button>
                      </th>
                      <th className="py-2 pl-3 text-right font-medium whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleDetailsSort("revenue")}
                          className="inline-flex items-center gap-1 justify-end w-full hover:text-slate-700"
                        >
                          Revenue
                          {detailsSortKey === "revenue" && (
                            <span className="text-[9px] text-slate-400">
                              {detailsSortDir === "asc" ? "▲" : "▼"}
                            </span>
                          )}
                        </button>
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {sortedDetailRows.map((row, idx) => (
                      <tr key={`${row.tpId}-${row.channel}-${idx}`} className="align-top">
                        {/* Touch point info */}
                        <td className="py-3 pr-3">
                          <div className="text-base font-semibold text-slate-900">
                            {row.tpId}. {row.tpName}
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            {row.offsetLabel}
                          </div>
                        </td>
                        {/* Channel pill */}
                        <td className="py-3 px-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                              row.channel === "postcard"
                                ? "bg-tp-pastel-blue text-sky-700 border-sky-200"
                                : row.channel === "email"
                                ? "bg-tp-pastel-green text-emerald-700 border-emerald-200"
                                : "bg-tp-pastel-purple text-indigo-700 border-indigo-200"
                            }`}
                          >
                            {CHANNEL_LABELS[row.channel]}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-right text-xs text-slate-900">
                          {row.sends.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right text-xs text-slate-500">
                          {row.channel === "postcard" ? "—" : row.opened.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right text-xs text-slate-900">
                          {row.responses.toLocaleString()}
                        </td>
                        <td className="py-3 px-3 text-right text-xs font-semibold text-emerald-600">
                          {row.respPct.toFixed(1)}%
                        </td>
                        <td className="py-3 px-3 text-right text-xs text-slate-900">
                          {row.roas.toFixed(1)}x
                        </td>
                        <td className="py-3 pl-3 text-right text-xs text-slate-900">
                          {row.revenue.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                            maximumFractionDigits: 0,
                          })}
                        </td>
                      </tr>
                    ))}
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
