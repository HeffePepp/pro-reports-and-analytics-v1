import React from "react";
import { ShellLayout, MetricTile, AIInsightsTile, KpiCustomizeButton, DraggableKpiRow } from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";
import { CHANNEL_BAR_CLASS, CampaignChannel } from "@/styles/channelColors";
import { ChannelLegend } from "@/components/common/ChannelLegend";

type Channel = "postcard" | "email" | "sms";

interface ChannelMix {
  postcard: number;
  email: number;
  sms: number;
}

type DropStat = {
  label: string;
  date: string;
  sent: number;
  opens: number;
  responses: number;
  respPct: number;
  roas: number;
};

// New type for Details tab: one row per drop
type JourneyDropRow = {
  id: string;
  campaignName: string;
  dropNumber: number;
  dropDate: string;
  channels: Channel[];
  sent: number;
  opened: number;
  respPct: number;
  roas: number;
  revenue: number;
};

interface Campaign {
  id: string;
  name: string;
  audience: string;
  drops: number;
  lastDropDate: string;
  sent: number;
  opens: number;
  responses: number;
  respPct: number;
  roas: number;
  revenue: number;
  channels: Channel[];
  channelMix: ChannelMix;
  dropStats?: DropStat[];
}

const CAMPAIGNS: Campaign[] = [
  {
    id: "spring-has-sprung",
    name: "Spring Has Sprung",
    audience: "12–24 month inactive",
    drops: 1,
    lastDropDate: "Mar 5, 2024",
    sent: 1500,
    opens: 1120,
    responses: 194,
    respPct: 6.9,
    roas: 16.1,
    revenue: 8350,
    channels: ["email"],
    channelMix: { postcard: 0, email: 100, sms: 0 },
    dropStats: [
      { label: "Drop 1", date: "Mar 5, 2024", sent: 1500, opens: 1120, responses: 194, respPct: 6.9, roas: 16.1 },
    ],
  },
  {
    id: "tax-time-tune-up",
    name: "Tax Time Tune-Up",
    audience: "High LTV, due in 30 days",
    drops: 2,
    lastDropDate: "May 24, 2024",
    sent: 5000,
    opens: 1850,
    responses: 440,
    respPct: 6.8,
    roas: 17.6,
    revenue: 24600,
    channels: ["postcard", "email", "sms"],
    channelMix: { postcard: 33, email: 34, sms: 33 },
    dropStats: [
      { label: "Drop 1", date: "Apr 10, 2024", sent: 2500, opens: 900, responses: 220, respPct: 7.1, roas: 8.7 },
      { label: "Drop 2", date: "May 24, 2024", sent: 2500, opens: 950, responses: 220, respPct: 6.4, roas: 11.0 },
    ],
  },
  {
    id: "synthetic-upgrade",
    name: "Synthetic Upgrade Push",
    audience: "Conventional users",
    drops: 1,
    lastDropDate: "Jun 12, 2024",
    sent: 1800,
    opens: 720,
    responses: 210,
    respPct: 7.5,
    roas: 18.2,
    revenue: 17800,
    channels: ["postcard"],
    channelMix: { postcard: 100, email: 0, sms: 0 },
    dropStats: [
      { label: "Drop 1", date: "Jun 12, 2024", sent: 1800, opens: 720, responses: 210, respPct: 7.5, roas: 18.2 },
    ],
  },
  {
    id: "reactivation-18-24",
    name: "Reactivation 18–24 months",
    audience: "Lapsed",
    drops: 2,
    lastDropDate: "Sep 2, 2024",
    sent: 1900,
    opens: 890,
    responses: 250,
    respPct: 7.0,
    roas: 22.1,
    revenue: 9390,
    channels: ["email"],
    channelMix: { postcard: 0, email: 100, sms: 0 },
    dropStats: [
      { label: "Drop 1", date: "Aug 5, 2024", sent: 950, opens: 430, responses: 120, respPct: 6.8, roas: 19.2 },
      { label: "Drop 2", date: "Sep 2, 2024", sent: 950, opens: 460, responses: 130, respPct: 7.1, roas: 25.0 },
    ],
  },
  {
    id: "new-mover-welcome",
    name: "New Mover Welcome",
    audience: "New households",
    drops: 1,
    lastDropDate: "Oct 15, 2024",
    sent: 1500,
    opens: 540,
    responses: 140,
    respPct: 9.1,
    roas: 11.7,
    revenue: 9100,
    channels: ["postcard"],
    channelMix: { postcard: 100, email: 0, sms: 0 },
    dropStats: [
      { label: "Drop 1", date: "Oct 15, 2024", sent: 1500, opens: 540, responses: 140, respPct: 9.1, roas: 11.7 },
    ],
  },
  {
    id: "holiday-thank-you",
    name: "Holiday Thank You",
    audience: "Top 25% LTV",
    drops: 1,
    lastDropDate: "Dec 1, 2024",
    sent: 1200,
    opens: 500,
    responses: 135,
    respPct: 11.3,
    roas: 24.5,
    revenue: 2450,
    channels: ["email"],
    channelMix: { postcard: 0, email: 100, sms: 0 },
    dropStats: [
      { label: "Drop 1", date: "Dec 1, 2024", sent: 1200, opens: 500, responses: 135, respPct: 11.3, roas: 24.5 },
    ],
  },
];

// Map local Channel type to shared CampaignChannel
const channelToShared: Record<Channel, CampaignChannel> = {
  postcard: "postcard",
  email: "email",
  sms: "text",
};

const KPI_OPTIONS: KpiOption[] = [
  { id: "campaigns", label: "Campaigns" },
  { id: "boughtListCount", label: "Bought List Count" },
  { id: "postCardCount", label: "Post Card Count" },
  { id: "emailCount", label: "Email Count" },
  { id: "textCount", label: "Text Count" },
  { id: "surveysCompleted", label: "Surveys Completed" },
  { id: "scheduledAppointments", label: "Scheduled Appointments" },
  { id: "responseRate", label: "% Response Rate" },
  { id: "newCustomers", label: "New Customers" },
  { id: "coupons", label: "Coupons" },
  { id: "couponAmount", label: "Coupon Amount" },
  { id: "discounts", label: "Discounts" },
  { id: "discountAmount", label: "Discount Amount" },
  { id: "clicks", label: "Clicks" },
  { id: "revenue", label: "Revenue" },
];

// Mock KPI values - derived from 6 campaigns
const mockKpis = {
  campaigns: 6,
  boughtListCount: 12900, // Total sent
  postCardCount: 4800,    // Synthetic Upgrade (1800) + New Mover (1500) + Tax Time (1500)
  emailCount: 6550,       // Spring (1500) + Tax Time (2000) + Reactivation (1900) + Holiday (1200) - partial
  textCount: 1550,        // Tax Time mixed
  surveysCompleted: 342,
  scheduledAppointments: 187,
  responseRate: 7.9,      // Weighted average
  newCustomers: 370,      // Sum of vehicles
  coupons: 892,
  couponAmount: 18450,
  discounts: 234,
  discountAmount: 4890,
  clicks: 2340,
  revenue: 71690,         // Sum of all campaign revenue
};

const OneOffCampaignTrackerPage: React.FC = () => {

  const { selectedIds, setSelectedIds } = useKpiPreferences("one-off-campaign-tracker", KPI_OPTIONS);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "campaigns":
        return <MetricTile key={id} label="Campaigns" value={mockKpis.campaigns.toString()} helpText="Number of one-off campaigns run during the selected period." />;
      case "boughtListCount":
        return <MetricTile key={id} label="Bought List Count" value={mockKpis.boughtListCount.toLocaleString()} helpText="Total purchased prospect lists used across all campaigns." />;
      case "postCardCount":
        return <MetricTile key={id} label="Post Card Count" value={mockKpis.postCardCount.toLocaleString()} helpText="Total postcards sent across all one-off campaigns." />;
      case "emailCount":
        return <MetricTile key={id} label="Email Count" value={mockKpis.emailCount.toLocaleString()} helpText="Total emails sent across all one-off campaigns." />;
      case "textCount":
        return <MetricTile key={id} label="Text Count" value={mockKpis.textCount.toLocaleString()} helpText="Total text messages sent across all one-off campaigns." />;
      case "surveysCompleted":
        return <MetricTile key={id} label="Surveys Completed" value={mockKpis.surveysCompleted.toLocaleString()} helpText="Number of customer surveys completed from campaign recipients." />;
      case "scheduledAppointments":
        return <MetricTile key={id} label="Scheduled Appointments" value={mockKpis.scheduledAppointments.toLocaleString()} helpText="Total appointments scheduled as a result of campaigns." />;
      case "responseRate":
        return <MetricTile key={id} label="% Response Rate" value={`${mockKpis.responseRate.toFixed(1)}%`} helpText="Percentage of campaign recipients who responded with a visit." />;
      case "newCustomers":
        return <MetricTile key={id} label="New Customers" value={mockKpis.newCustomers.toLocaleString()} helpText="First-time customers acquired through one-off campaigns." />;
      case "coupons":
        return <MetricTile key={id} label="Coupons" value={mockKpis.coupons.toLocaleString()} helpText="Total coupons redeemed from one-off campaigns." />;
      case "couponAmount":
        return <MetricTile key={id} label="Coupon Amount" value={`$${mockKpis.couponAmount.toLocaleString()}`} helpText="Total dollar value of coupons redeemed from campaigns." />;
      case "discounts":
        return <MetricTile key={id} label="Discounts" value={mockKpis.discounts.toLocaleString()} helpText="Total discounts applied from one-off campaigns." />;
      case "discountAmount":
        return <MetricTile key={id} label="Discount Amount" value={`$${mockKpis.discountAmount.toLocaleString()}`} helpText="Total dollar value of discounts applied from campaigns." />;
      case "clicks":
        return <MetricTile key={id} label="Clicks" value={mockKpis.clicks.toLocaleString()} helpText="Total link clicks from email and text campaigns." />;
      case "revenue":
        return <MetricTile key={id} label="Revenue" value={`$${mockKpis.revenue.toLocaleString()}`} helpText="Total revenue attributed to one-off campaign responses." />;
      default:
        return null;
    }
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "One-Off Campaign Tracker" },
      ]}
      rightInfo={
        <>
          <span>
            Store group: <span className="font-medium">All Stores</span>
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
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">One-Off Campaign Tracker</h1>
          <p className="mt-1 text-sm text-slate-500">
            Compare one-off campaigns on response rate, ROAS, revenue and drops.
          </p>
        </div>
        <KpiCustomizeButton
          reportId="one-off-campaign-tracker"
          options={KPI_OPTIONS}
          selectedIds={selectedIds}
          onChangeSelected={setSelectedIds}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        <div className="lg:col-span-3 space-y-4">
          {/* KPI tiles - draggable */}
          {selectedIds.length > 0 && (
            <DraggableKpiRow
              reportKey="one-off-campaign-tracker"
              tiles={selectedIds
                .map((id) => {
                  const tile = renderKpiTile(id);
                  return tile ? { id, element: tile } : null;
                })
                .filter(Boolean) as { id: string; element: React.ReactNode }[]}
            />
          )}

          {/* Campaign details */}
          <DetailsTable />

          {/* AI stacked on small screens - after main content */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on one-off campaigns"
              bullets={[
                "Summer A/C Tune-Up and Black Friday have the strongest ROAS and RESP %, ideal patterns for future offers.",
                "Back to School underperforms on RESP %; consider stronger offer or more SMS.",
                "Use Drops view to compare multi-drop campaigns and tune channel mix.",
              ]}
            />
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-1 self-start">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on one-off campaigns"
            bullets={[
              "Summer A/C Tune-Up and Black Friday have the strongest ROAS and RESP %, ideal patterns for future offers.",
              "Back to School underperforms on RESP %; consider stronger offer or more SMS.",
              "Use Drops view to compare multi-drop campaigns and tune channel mix.",
            ]}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

// Channel pill styling helper
const channelPillClass = (channel: Channel) => {
  switch (channel) {
    case "email":
      return "bg-tp-pastel-green text-emerald-700";
    case "postcard":
      return "bg-tp-pastel-blue text-sky-700";
    case "sms":
      return "bg-tp-pastel-purple text-indigo-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
};

const channelDisplayName = (channel: Channel) => {
  switch (channel) {
    case "email":
      return "Email";
    case "postcard":
      return "Postcard";
    case "sms":
      return "Text";
    default:
      return channel;
  }
};

// Flatten campaigns into one row per drop for Details tab
const JOURNEY_DROPS: JourneyDropRow[] = CAMPAIGNS.flatMap((c) => {
  if (!c.dropStats || c.dropStats.length === 0) {
    // Single drop fallback
    return [{
      id: `${c.id}-1`,
      campaignName: c.name,
      dropNumber: 1,
      dropDate: c.lastDropDate,
      channels: c.channels,
      sent: c.sent,
      opened: c.opens,
      respPct: c.respPct,
      roas: c.roas,
      revenue: c.revenue,
    }];
  }
  
  // For multi-drop campaigns, calculate revenue per drop proportionally
  const revenuePerDrop = c.revenue / c.dropStats.length;
  
  return c.dropStats.map((drop, index) => ({
    id: `${c.id}-${index + 1}`,
    campaignName: c.name,
    dropNumber: index + 1,
    dropDate: drop.date,
    channels: c.channels, // Use campaign channels for each drop
    sent: drop.sent,
    opened: drop.opens,
    respPct: drop.respPct,
    roas: drop.roas,
    revenue: Math.round(revenuePerDrop),
  }));
});

// Group drops by campaign for visual grouping
const groupDropsByCampaign = (rows: JourneyDropRow[]) => {
  const map = new Map<string, JourneyDropRow[]>();

  rows.forEach((row) => {
    if (!map.has(row.campaignName)) {
      map.set(row.campaignName, []);
    }
    map.get(row.campaignName)!.push(row);
  });

  // Get campaign data for description
  return Array.from(map.entries()).map(([campaignName, campaignRows]) => {
    const campaign = CAMPAIGNS.find(c => c.name === campaignName);
    return {
      campaignId: campaign?.id || campaignName,
      campaignName,
      description: campaign?.audience || "",
      rows: campaignRows,
    };
  });
};

const DetailsTable: React.FC = () => {
  const grouped = React.useMemo(() => groupDropsByCampaign(JOURNEY_DROPS), []);

  const handleViewProofs = (campaignId: string) => {
    console.log("View proofs for:", campaignId);
  };

  return (
    <section className="space-y-4">
      {grouped.map((group) => (
        <div
          key={group.campaignId}
          className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
        >
          {/* Header row: campaign name/description + View proofs button */}
          <div className="mb-3 flex items-start justify-between gap-4">
            <div>
              <div className="text-sm font-semibold text-slate-900">
                {group.campaignName}
              </div>
              {group.description && (
                <div className="mt-0.5 text-[11px] text-slate-500">
                  {group.description}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => handleViewProofs(group.campaignId)}
              className="inline-flex items-center rounded-full border border-slate-200 px-4 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
            >
              View proof
            </button>
          </div>

          {/* Mini table for this campaign's drops */}
          <table className="w-full table-fixed text-xs">
            {/* Shared column widths so every pill lines up */}
            <colgroup>
              <col className="w-[190px]" />
              <col className="w-[100px]" />
              <col className="w-[70px]" />
              <col className="w-[70px]" />
              <col className="w-[60px]" />
              <col className="w-[60px]" />
              <col className="w-[90px]" />
            </colgroup>
            <thead>
              <tr className="border-b border-slate-200 text-[11px] tracking-wide text-slate-500">
                <th className="py-2 pr-3 text-left font-medium whitespace-nowrap">
                  Drop &amp; channels
                </th>
                <th className="py-2 px-2 text-right font-medium whitespace-nowrap">
                  Date
                </th>
                <th className="py-2 px-2 text-right font-medium whitespace-nowrap">
                  Sent
                </th>
                <th className="py-2 px-2 text-right font-medium whitespace-nowrap">
                  Opened
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
              {group.rows.map((row) => (
                <tr key={row.id} className="align-top">
                  {/* Drop & channels – left aligned */}
                  <td className="py-2 pr-3">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-700">
                      Drop {row.dropNumber}
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {row.channels.map((ch) => (
                        <span
                          key={ch}
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${channelPillClass(ch)}`}
                        >
                          {channelDisplayName(ch)}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Date – right aligned */}
                  <td className="py-2 px-2 text-right text-xs text-slate-900 whitespace-nowrap">
                    {row.dropDate}
                  </td>

                  {/* Sent */}
                  <td className="py-2 px-2 text-right text-xs text-slate-900">
                    {row.sent.toLocaleString()}
                  </td>

                  {/* Opened */}
                  <td className="py-2 px-2 text-right text-xs text-slate-900">
                    {row.opened.toLocaleString()}
                  </td>

                  {/* Resp % */}
                  <td className="py-2 px-2 text-right text-xs font-semibold text-emerald-600">
                    {row.respPct.toFixed(1)}%
                  </td>

                  {/* ROAS */}
                  <td className="py-2 px-2 text-right text-xs text-slate-900">
                    {row.roas.toFixed(1)}×
                  </td>

                  {/* Revenue */}
                  <td className="py-2 pl-2 pr-1 text-right text-xs text-slate-900">
                    {row.revenue.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                      maximumFractionDigits: 0,
                    })}
                  </td>
                </tr>
              ))}

              {/* Campaign totals row - only show for multi-drop campaigns */}
              {group.rows.length > 1 && (() => {
                const totals = {
                  sent: group.rows.reduce((sum, r) => sum + r.sent, 0),
                  opened: group.rows.reduce((sum, r) => sum + r.opened, 0),
                  revenue: group.rows.reduce((sum, r) => sum + r.revenue, 0),
                };
                const avgRespPct = group.rows.reduce((sum, r) => sum + r.respPct, 0) / group.rows.length;
                const avgRoas = group.rows.reduce((sum, r) => sum + r.roas, 0) / group.rows.length;
                
                return (
                  <tr className="border-t border-slate-200 font-semibold">
                    <td className="py-2 pr-3 text-[11px] uppercase tracking-wide text-slate-700">
                      Campaign Totals
                    </td>
                    <td className="py-2 px-2 text-right text-xs text-slate-900"></td>
                    <td className="py-2 px-2 text-right text-xs text-slate-900">
                      {totals.sent.toLocaleString()}
                    </td>
                    <td className="py-2 px-2 text-right text-xs text-slate-900">
                      {totals.opened.toLocaleString()}
                    </td>
                    <td className="py-2 px-2 text-right text-xs text-emerald-600">
                      {avgRespPct.toFixed(1)}%
                    </td>
                    <td className="py-2 px-2 text-right text-xs text-slate-900">
                      {avgRoas.toFixed(1)}×
                    </td>
                    <td className="py-2 pl-2 pr-1 text-right text-xs text-slate-900">
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
      ))}
    </section>
  );
};

export default OneOffCampaignTrackerPage;
