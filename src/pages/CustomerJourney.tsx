import React, { useMemo, useState } from "react";
import {
  ShellLayout,
  MetricTile,
  AIInsightsTile,
  KpiCustomizeButton,
  DraggableKpiRow,
} from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";
import { parseChannels, CHANNEL_LABELS } from "@/styles/channelColors";
import { JourneyTouchpointMixTile } from "@/components/reports/JourneyTouchpointMixTile";
import { ShareReportModal, ShareReportButton } from "@/components/layout/ShareReportModal";
type ChannelType = "postcard" | "email" | "text";

type JourneyTouchPoint = {
  id: number;
  name: string;
  offsetLabel: string;
  channel: string;
  respPct: number;
  roas: number;
  sends: number;
  revenue: number;
  daysSinceLastSend?: number; // For response maturity calculation
  // Per-channel breakdowns for multi-channel touch points
  channelBreakdown?: {
    channel: ChannelType;
    sends: number;
    opened: number;
    responses: number;
    respPct: number;
    roas: number;
    revenue: number;
    daysSinceLastSend?: number;
  }[];
};

// Response maturity types and helpers
type ResponseMaturityLevel = "early" | "maturing" | "mature" | "unknown";

type ResponseMaturityInfo = {
  level: ResponseMaturityLevel;
  label: string;
  ratio: number | null;
  windowDays: number | null;
  daysSince: number | null;
};

const RESPONSE_WINDOWS: Record<ChannelType, number> = {
  postcard: 60,
  email: 10,
  text: 10,
};

const getResponseMaturity = (
  channel: ChannelType,
  daysSinceLastSend: number | null | undefined
): ResponseMaturityInfo => {
  const windowDays = RESPONSE_WINDOWS[channel];
  if (!windowDays || daysSinceLastSend == null) {
    return {
      level: "unknown",
      label: "Unknown",
      ratio: null,
      windowDays: null,
      daysSince: null,
    };
  }

  const clampedDays = Math.max(0, daysSinceLastSend);
  const ratio = Math.min(1, clampedDays / windowDays);

  let level: ResponseMaturityLevel;
  let label: string;

  if (ratio < 0.33) {
    level = "early";
    label = "Early";
  } else if (ratio < 0.75) {
    level = "maturing";
    label = "Maturing";
  } else {
    level = "mature";
    label = "Mature";
  }

  return { level, label, ratio, windowDays, daysSince: clampedDays };
};

// Response Maturity Pill component
const ResponseMaturityPill: React.FC<{ info: ResponseMaturityInfo; channel: ChannelType }> = ({
  info,
  channel,
}) => {
  if (info.level === "unknown") return null;

  const base =
    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium";

  let colorClasses = "";
  let dotClasses = "";

  switch (info.level) {
    case "early":
      colorClasses = "bg-amber-50 border-amber-100 text-amber-700";
      dotClasses = "bg-amber-400";
      break;
    case "maturing":
      colorClasses = "bg-sky-50 border-sky-100 text-sky-700";
      dotClasses = "bg-sky-400";
      break;
    case "mature":
      colorClasses = "bg-emerald-50 border-emerald-100 text-emerald-700";
      dotClasses = "bg-emerald-400";
      break;
  }

  const channelLabel =
    channel === "postcard" ? "postcard" : channel === "email" ? "email" : "text";
  const ratioPct = info.ratio != null ? Math.round(info.ratio * 100) : null;

  const tooltipText =
    info.windowDays && info.daysSince != null
      ? `Throttle uses a ${info.windowDays}-day response window for ${channelLabel} touch points. This touch point is ${info.label.toLowerCase()} (${info.daysSince} days since last send, about ${
          ratioPct ?? "?"
        }% of the window). Response % may continue to change until the window is complete.`
      : "Response maturity shows how far we are into Throttle's standard response window.";

  return (
    <div className="group relative inline-flex">
      <div className={`${base} ${colorClasses}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${dotClasses}`} />
        <span>{info.label}</span>
      </div>

      {/* Tooltip */}
      <div className="pointer-events-none absolute right-0 top-full z-20 mt-1 hidden w-64 rounded-md bg-slate-900 px-2 py-1.5 text-[10px] leading-snug text-white shadow-lg group-hover:block">
        {tooltipText}
      </div>
    </div>
  );
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
    daysSinceLastSend: 3,
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
    daysSinceLastSend: 3,
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
    daysSinceLastSend: 7,
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
    daysSinceLastSend: 12,
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
    daysSinceLastSend: 15,
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
    daysSinceLastSend: 14,
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
    daysSinceLastSend: 11,
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
    daysSinceLastSend: 5,
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
      { channel: "postcard", sends: 460, opened: 0, responses: 112, respPct: 24.3, roas: 18.2, revenue: 8380, daysSinceLastSend: 45 },
      { channel: "email", sends: 460, opened: 184, responses: 89, respPct: 19.3, roas: 15.1, revenue: 6950, daysSinceLastSend: 8 },
      { channel: "text", sends: 460, opened: 437, responses: 79, respPct: 17.2, roas: 15.8, revenue: 7270, daysSinceLastSend: 6 },
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
      { channel: "postcard", sends: 327, opened: 0, responses: 52, respPct: 15.9, roas: 11.4, revenue: 3730, daysSinceLastSend: 72 },
      { channel: "email", sends: 327, opened: 124, responses: 44, respPct: 13.5, roas: 10.2, revenue: 3340, daysSinceLastSend: 12 },
      { channel: "text", sends: 326, opened: 306, responses: 46, respPct: 14.1, roas: 10.5, revenue: 3430, daysSinceLastSend: 11 },
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
      { channel: "postcard", sends: 287, opened: 0, responses: 43, respPct: 15.0, roas: 10.2, revenue: 2930, daysSinceLastSend: 65 },
      { channel: "email", sends: 287, opened: 103, responses: 38, respPct: 13.2, roas: 9.5, revenue: 2730, daysSinceLastSend: 14 },
      { channel: "text", sends: 286, opened: 269, responses: 39, respPct: 13.6, roas: 9.6, revenue: 2740, daysSinceLastSend: 12 },
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
      { channel: "postcard", sends: 247, opened: 0, responses: 38, respPct: 15.4, roas: 9.8, revenue: 2420, daysSinceLastSend: 58 },
      { channel: "email", sends: 247, opened: 89, responses: 34, respPct: 13.8, roas: 9.1, revenue: 2250, daysSinceLastSend: 10 },
      { channel: "text", sends: 246, opened: 231, responses: 33, respPct: 13.4, roas: 9.3, revenue: 2280, daysSinceLastSend: 9 },
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
    daysSinceLastSend: 18,
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
    daysSinceLastSend: 16,
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
    daysSinceLastSend: 13,
  },
];

// Removed CJTab type - no longer using tabs

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
  const { selectedIds, setSelectedIds } = useKpiPreferences("customer-journey", KPI_OPTIONS);
  const [shareOpen, setShareOpen] = useState(false);

  const handleViewProofs = (tpId: number) => {
    console.log("View proofs for touch point:", tpId);
  };

  // Build flattened rows for Details table (one row per channel per touch point)
  type DetailRow = {
    tpId: number;
    tpName: string;
    offsetLabel: string;
    channel: ChannelType;
    sends: number;
    opened: number;
    responses: number;
    respPct: number;
    roas: number;
    revenue: number;
    isFirstInGroup: boolean;
    groupSize: number;
    daysSinceLastSend?: number;
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
            daysSinceLastSend: cb.daysSinceLastSend,
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
          channel: channelKey as ChannelType,
          sends: tp.sends,
          opened,
          responses,
          respPct: tp.respPct,
          roas: tp.roas,
          revenue: tp.revenue,
          isFirstInGroup: true,
          groupSize: 1,
          daysSinceLastSend: tp.daysSinceLastSend,
        });
      }
    });
    return rows;
  }, []);

  // Sort detail rows by touch point ID for consistent display
  const sortedDetailRows = useMemo(() => {
    return [...detailRows].sort((a, b) => a.tpId - b.tpId);
  }, [detailRows]);

  // Compute touchpoint mix items for the mix tile
  const touchpointMixItems = useMemo(() => {
    // Group by touch point and sum responses
    const tpMap = new Map<number, { id: number; name: string; totalResponses: number }>();
    detailRows.forEach((row) => {
      if (!tpMap.has(row.tpId)) {
        tpMap.set(row.tpId, { id: row.tpId, name: row.tpName, totalResponses: 0 });
      }
      tpMap.get(row.tpId)!.totalResponses += row.responses;
    });

    const totalResponses = Array.from(tpMap.values()).reduce((sum, tp) => sum + tp.totalResponses, 0);

    return Array.from(tpMap.values())
      .sort((a, b) => a.id - b.id)
      .map((tp) => ({
        id: tp.id,
        label: `${tp.id}. ${tp.name}`,
        responses: tp.totalResponses,
        respPct: totalResponses > 0 ? (tp.totalResponses / totalResponses) * 100 : 0,
      }));
  }, [detailRows]);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "validMailing":
        return (
          <MetricTile
            key={id}
            label="Valid Mailing Addresses"
            value={journeySummary.validMailingAddresses.toLocaleString()}
            helpText="Customers with verified mailing addresses for postcard delivery. Higher counts improve reach for mail-based journey touch points."
          />
        );
      case "validEmail":
        return (
          <MetricTile
            key={id}
            label="Valid Email Addresses"
            value={journeySummary.validEmailAddresses.toLocaleString()}
            helpText="Customers with verified email addresses for digital communications. Email is typically the most cost-effective channel for reminders and follow-ups."
          />
        );
      case "validCell":
        return (
          <MetricTile
            key={id}
            label="Valid Cell Numbers"
            value={journeySummary.validCellNumbers.toLocaleString()}
            helpText="Customers with verified cell phone numbers for text messaging. Text messages often have the highest open and response rates."
          />
        );
      case "avgInvoice":
        return (
          <MetricTile
            key={id}
            label="Avg Invoice"
            value={journeySummary.avgInvoice.toLocaleString("en-US", { style: "currency", currency: "USD" })}
            helpText="Average invoice amount across all journey-related transactions. This metric helps gauge overall ticket value driven by journey touches."
          />
        );
      case "emailReminders":
        return (
          <MetricTile
            key={id}
            label="Email Reminders"
            value={journeySummary.emailReminders.toLocaleString()}
            helpText="Total email reminders sent across all journey touch points. Email is a low-cost, high-reach channel for scheduled communications."
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
            helpText="Total text message reminders sent across all journey touch points. Text messages typically drive higher immediate response rates than other channels."
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
            helpText="Total postcard reminders sent across all journey touch points. Postcards are tangible and often have strong retention with customers."
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
        <div className="flex items-center gap-2">
          <ShareReportButton onClick={() => setShareOpen(true)} />
          <KpiCustomizeButton
            reportId="customer-journey"
            options={KPI_OPTIONS}
            selectedIds={selectedIds}
            onChangeSelected={setSelectedIds}
          />
        </div>
      </div>

      {/* Share Modal */}
      <ShareReportModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        context={{
          reportName: "Customer Journey",
          dateRangeLabel: "Last 12 months",
          storeCount: 5,
        }}
      />

      {/* Layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPI tiles - draggable and only rendered when selected */}
          {selectedIds.length > 0 && (
            <DraggableKpiRow
              reportKey="customer-journey"
              tiles={selectedIds
                .map((id) => {
                  const tile = renderKpiTile(id);
                  return tile ? { id, element: tile } : null;
                })
                .filter(Boolean) as { id: string; element: React.ReactNode }[]}
            />
          )}

          {/* Touchpoint mix tile */}
          <JourneyTouchpointMixTile items={touchpointMixItems} />

          {/* Response maturity note */}
          <p className="text-[11px] text-slate-500">
            Response maturity is based on Throttle standard windows: 60 days for
            postcards and 10 days for email and text.
          </p>

          {/* Touch point ghost pills */}
          <div className="space-y-4">
            {(() => {
              // Group rows by touch point
              type GroupedTP = {
                tpId: number;
                tpName: string;
                offsetLabel: string;
                rows: typeof sortedDetailRows;
              };
              const groupedMap = new Map<number, GroupedTP>();

              sortedDetailRows.forEach((row) => {
                if (!groupedMap.has(row.tpId)) {
                  groupedMap.set(row.tpId, {
                    tpId: row.tpId,
                    tpName: row.tpName,
                    offsetLabel: row.offsetLabel,
                    rows: [],
                  });
                }
                groupedMap.get(row.tpId)!.rows.push(row);
              });

              // Sort groups by touch point ID
              const groups = Array.from(groupedMap.values()).sort((a, b) => a.tpId - b.tpId);

              // Colors matching the mix tile
              const SEGMENT_DOT_COLORS = [
                "bg-tp-green",
                "bg-tp-blue-light",
                "bg-tp-purple",
                "bg-tp-yellow",
                "bg-tp-red",
                "bg-emerald-500",
                "bg-sky-500",
                "bg-indigo-500",
                "bg-amber-500",
                "bg-rose-500",
                "bg-teal-500",
                "bg-violet-500",
                "bg-orange-500",
                "bg-cyan-500",
                "bg-lime-500",
              ];

              return groups.map((group, groupIndex) => (
                <div
                  key={group.tpId}
                  className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  {/* Header row: touch point name/offset + View proofs button */}
                  <div className="mb-3 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-2">
                      <span
                        className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${SEGMENT_DOT_COLORS[groupIndex % SEGMENT_DOT_COLORS.length]}`}
                      />
                      <div>
                        <div className="text-sm font-semibold text-slate-900">
                          {group.tpId}. {group.tpName}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-500">
                          {group.offsetLabel}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleViewProofs(group.tpId)}
                      className="inline-flex items-center rounded-full border border-slate-200 px-4 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                    >
                      View proof
                    </button>
                  </div>

                  {/* Mini table for this touch point's channels */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs min-w-0">
                      <thead>
                        <tr className="border-b border-slate-200 text-[11px] tracking-wide text-slate-500">
                          <th className="py-2 pr-3 text-left font-medium whitespace-nowrap">
                            Channel
                          </th>
                          <th className="py-2 px-2 text-right font-medium whitespace-nowrap">
                            Sent
                          </th>
                          <th className="py-2 px-2 text-right font-medium whitespace-nowrap">
                            Opened
                          </th>
                          <th className="py-2 px-2 text-right font-medium whitespace-nowrap">
                            Responses
                          </th>
                          <th className="py-2 px-2 text-right font-medium whitespace-nowrap">
                            Resp %
                          </th>
                          <th className="py-2 px-2 text-right font-medium whitespace-nowrap">
                            ROAS
                          </th>
                          <th className="py-2 pl-2 pr-1 text-right font-medium whitespace-nowrap">
                            Revenue
                          </th>
                        </tr>
                      </thead>

                      <tbody className="divide-y divide-slate-100">
                        {group.rows.map((row, idx) => (
                          <tr key={`${row.tpId}-${row.channel}-${idx}`} className="align-top">
                            {/* Channel pill */}
                            <td className="py-2 pr-3">
                              <span
                                className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${
                                  row.channel === "postcard"
                                    ? "bg-tp-pastel-blue text-sky-700"
                                    : row.channel === "email"
                                    ? "bg-tp-pastel-green text-emerald-700"
                                    : "bg-tp-pastel-purple text-indigo-700"
                                }`}
                              >
                                {CHANNEL_LABELS[row.channel]}
                              </span>
                            </td>

                            {/* Sent */}
                            <td className="py-2 px-2 text-right text-xs text-slate-900 whitespace-nowrap">
                              {row.sends.toLocaleString()}
                            </td>

                            {/* Opened */}
                            <td className="py-2 px-2 text-right text-xs text-slate-900 whitespace-nowrap">
                              {row.channel === "postcard" ? "—" : row.opened.toLocaleString()}
                            </td>

                            {/* Responses */}
                            <td className="py-2 px-2 text-right text-xs text-slate-900 whitespace-nowrap">
                              {row.responses.toLocaleString()}
                            </td>

                            {/* Resp % with maturity pill */}
                            <td className="py-2 px-2 text-right align-middle whitespace-nowrap">
                              <div className="text-xs font-semibold text-emerald-600">
                                {row.respPct.toFixed(1)}%
                              </div>
                              <div className="mt-0.5 flex justify-end">
                                <ResponseMaturityPill
                                  channel={row.channel}
                                  info={getResponseMaturity(row.channel, row.daysSinceLastSend)}
                                />
                              </div>
                            </td>

                            {/* ROAS */}
                            <td className="py-2 px-2 text-right text-xs text-slate-900 whitespace-nowrap">
                              {row.roas.toFixed(1)}x
                            </td>

                            {/* Revenue */}
                            <td className="py-2 pl-2 pr-1 text-right text-xs text-slate-900 whitespace-nowrap">
                              {row.revenue.toLocaleString("en-US", {
                                style: "currency",
                                currency: "USD",
                                maximumFractionDigits: 0,
                              })}
                            </td>
                          </tr>
                        ))}

                        {/* Touch point totals row - only show for multi-channel touch points */}
                        {group.rows.length > 1 && (() => {
                          const totals = {
                            sent: group.rows.reduce((sum, r) => sum + r.sends, 0),
                            opened: group.rows.reduce((sum, r) => sum + r.opened, 0),
                            responses: group.rows.reduce((sum, r) => sum + r.responses, 0),
                            revenue: group.rows.reduce((sum, r) => sum + r.revenue, 0),
                          };
                          const avgRespPct = group.rows.reduce((sum, r) => sum + r.respPct, 0) / group.rows.length;
                          const avgRoas = group.rows.reduce((sum, r) => sum + r.roas, 0) / group.rows.length;

                          return (
                            <tr className="border-t border-slate-200 font-semibold">
                              <td className="py-2 pr-3 text-[11px] uppercase tracking-wide text-slate-700 whitespace-nowrap">
                                Touch Point Totals
                              </td>
                              <td className="py-2 px-2 text-right text-xs text-slate-900 whitespace-nowrap">
                                {totals.sent.toLocaleString()}
                              </td>
                              <td className="py-2 px-2 text-right text-xs text-slate-900 whitespace-nowrap">
                                {totals.opened.toLocaleString()}
                              </td>
                              <td className="py-2 px-2 text-right text-xs text-slate-900 whitespace-nowrap">
                                {totals.responses.toLocaleString()}
                              </td>
                              <td className="py-2 px-2 text-right text-xs text-emerald-600 whitespace-nowrap">
                                {avgRespPct.toFixed(1)}%
                              </td>
                              <td className="py-2 px-2 text-right text-xs text-slate-900 whitespace-nowrap">
                                {avgRoas.toFixed(1)}x
                              </td>
                              <td className="py-2 pl-2 pr-1 text-right text-xs text-slate-900 whitespace-nowrap">
                                {totals.revenue.toLocaleString("en-US", {
                                  style: "currency",
                                  currency: "USD",
                                  maximumFractionDigits: 0,
                                })}
                              </td>
                            </tr>
                          );
                        })()}
                      </tbody>
                    </table>
                  </div>
                </div>
              ));
            })()}
          </div>

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
