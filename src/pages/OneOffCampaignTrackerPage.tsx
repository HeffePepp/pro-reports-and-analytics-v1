import React, { useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile, KpiCustomizeButton } from "@/components/layout";
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
    name: "Don's Garage: Spring Has Sprung",
    audience: "Current synthetic customers · last 9 months",
    drops: 1,
    lastDropDate: "Mar 5, 2024",
    sent: 2800,
    opens: 1120,
    responses: 194,
    respPct: 6.9,
    roas: 16.1,
    revenue: 22400,
    channels: ["email"],
    channelMix: { postcard: 0, email: 100, sms: 0 },
    dropStats: [
      { label: "Drop 1", date: "Mar 5, 2024", sent: 2800, opens: 1120, responses: 194, respPct: 6.9, roas: 16.1 },
    ],
  },
  {
    id: "summer-ac-tuneup-1",
    name: "Summer A/C Tune-Up",
    audience: "Vehicles in warm-weather ZIPs · last 18 months",
    drops: 2,
    lastDropDate: "May 24, 2024",
    sent: 5000,
    opens: 1850,
    responses: 220,
    respPct: 6.8,
    roas: 9.9,
    revenue: 40900,
    channels: ["postcard", "email", "sms"],
    channelMix: { postcard: 40, email: 30, sms: 30 },
    dropStats: [
      { label: "Drop 1", date: "Apr 10, 2024", sent: 2500, opens: 900, responses: 110, respPct: 7.1, roas: 8.7 },
      { label: "Drop 2", date: "May 24, 2024", sent: 2500, opens: 950, responses: 110, respPct: 6.4, roas: 11.0 },
    ],
  },
  {
    id: "back-to-school",
    name: "Back to School",
    audience: "Minivan/SUV households · schools within 10 miles",
    drops: 1,
    lastDropDate: "Aug 15, 2024",
    sent: 2600,
    opens: 0,
    responses: 162,
    respPct: 6.2,
    roas: 7.6,
    revenue: 19500,
    channels: ["postcard"],
    channelMix: { postcard: 100, email: 0, sms: 0 },
    dropStats: [
      { label: "Drop 1", date: "Aug 15, 2024", sent: 2600, opens: 0, responses: 162, respPct: 6.2, roas: 7.6 },
    ],
  },
  {
    id: "black-friday-synthetic",
    name: "Black Friday Synthetic Push",
    audience: "High-mileage synthetic customers · last 24 months",
    drops: 2,
    lastDropDate: "Nov 27, 2024",
    sent: 5500,
    opens: 1980,
    responses: 337,
    respPct: 9.1,
    roas: 10.7,
    revenue: 64800,
    channels: ["postcard", "email"],
    channelMix: { postcard: 60, email: 40, sms: 0 },
    dropStats: [
      { label: "Drop 1", date: "Nov 15, 2024", sent: 2750, opens: 990, responses: 165, respPct: 8.4, roas: 9.8 },
      { label: "Drop 2", date: "Nov 27, 2024", sent: 2750, opens: 990, responses: 172, respPct: 9.8, roas: 11.6 },
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

// Mock KPI values
const mockKpis = {
  campaigns: 4,
  boughtListCount: 12500,
  postCardCount: 8400,
  emailCount: 15900,
  textCount: 3200,
  surveysCompleted: 342,
  scheduledAppointments: 187,
  responseRate: 7.2,
  newCustomers: 156,
  coupons: 892,
  couponAmount: 18450,
  discounts: 234,
  discountAmount: 4890,
  clicks: 2340,
  revenue: 147600,
};

const OneOffCampaignTrackerPage: React.FC = () => {
  const [tab, setTab] = useState<"overview" | "drops">("overview");

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
          {/* KPI tiles - only rendered when selected */}
          {selectedIds.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">{selectedIds.map((id) => renderKpiTile(id))}</div>
          )}

          {/* Main card with tabs */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-900"></h2>

              <div className="inline-flex items-center rounded-full bg-slate-100 p-1 text-[11px]">
                <button
                  type="button"
                  onClick={() => setTab("overview")}
                  className={`px-3 py-1 rounded-full font-medium ${tab === "overview" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Overview
                </button>
                <button
                  type="button"
                  onClick={() => setTab("drops")}
                  className={`px-3 py-1 rounded-full font-medium ${tab === "drops" ? "bg-white shadow-sm text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Drops
                </button>
              </div>
            </div>

            {tab === "overview" ? <OverviewList /> : <DropsTable />}
          </section>

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

const OverviewList: React.FC = () => {
  const handleViewProofs = (campaign: Campaign) => {
    // TODO: open modal / navigate to proofs view
    console.log("View proofs for:", campaign.name);
  };

  return (
    <div className="divide-y divide-slate-100">
      {CAMPAIGNS.map((c) => (
        <section key={c.id} className="py-4 first:pt-0 last:pb-0">
          <div className="flex items-start justify-between gap-4">
            {/* LEFT: campaign copy + drops + channel pills */}
            <div className="min-w-0 flex-1">
              {/* Title */}
              <div className="text-[13px] font-semibold text-slate-900">
                {c.name}
              </div>

              {/* Audience / description */}
              <div className="mt-0.5 text-[11px] text-slate-500">
                {c.audience}
              </div>

              {/* Drops list */}
              <div className="mt-1 text-[11px] text-slate-500">
                {c.dropStats?.map((drop, index) => (
                  <div key={drop.label}>
                    Drop {index + 1} · {drop.date}
                  </div>
                ))}
              </div>

              {/* Channel pills */}
              <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                {c.channels.map((ch) => (
                  <span
                    key={ch}
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 font-medium ${channelPillClass(ch)}`}
                  >
                    {channelDisplayName(ch)}
                  </span>
                ))}
              </div>
            </div>

            {/* RIGHT: responses + revenue + proof button */}
            <div className="shrink-0 text-right text-[11px]">
              {/* Response Count (Response %) */}
              <div className="text-[16px] font-semibold text-emerald-600 leading-none">
                {c.responses.toLocaleString()}
              </div>
              <div className="mt-0.5 text-[11px] text-slate-500">
                Responses ({c.respPct.toFixed(1)}%)
              </div>

              {/* Revenue */}
              <div className="mt-3 text-[11px] text-slate-500">Revenue</div>
              <div className="text-[13px] font-semibold text-slate-900">
                {c.revenue.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0,
                })}
              </div>

              {/* View proofs button */}
              <button
                type="button"
                onClick={() => handleViewProofs(c)}
                className="mt-3 inline-flex items-center rounded-full border border-slate-200 px-3 py-1 text-[11px] font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
              >
                View proofs
              </button>
            </div>
          </div>
        </section>
      ))}
    </div>
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

const DropsTable: React.FC = () => {
  return (
    <div className="mt-2 overflow-x-auto">
      <table className="w-full text-xs">
        <thead>
          <tr className="border-b border-slate-200 text-[11px] tracking-wide text-slate-500">
            <th className="py-2 pr-3 text-left font-medium whitespace-nowrap">
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
            <th className="py-2 pl-2 text-right font-medium whitespace-nowrap">
              Revenue
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100">
          {CAMPAIGNS.map((c) => (
            <tr key={c.id} className="align-top">
              {/* LEFT: stacked campaign info + channel pills + per-drop breakdown */}
              <td className="py-3 pr-3">
                <div className="text-sm font-semibold text-slate-900">
                  {c.name}
                </div>
                <div className="mt-0.5 text-[11px] text-slate-500">
                  {c.drops} {c.drops === 1 ? "drop" : "drops"} · Last drop {c.lastDropDate}
                </div>

                {/* Channel pills – horizontal row */}
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {c.channels.map((ch) => (
                    <span
                      key={ch}
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${channelPillClass(ch)}`}
                    >
                      {channelDisplayName(ch)}
                    </span>
                  ))}
                </div>

                {/* Per-drop stat lines – only show if more than one drop */}
                {c.dropStats && c.dropStats.length > 1 && (
                  <div className="mt-2 space-y-0.5 rounded-md bg-slate-50 p-2">
                    {c.dropStats.map((drop) => (
                      <div
                        key={drop.label}
                        className="flex justify-between gap-2 text-[11px] text-slate-600"
                      >
                        <span className="font-medium text-slate-700">
                          {drop.label} · {drop.date}
                        </span>
                        <span className="text-right">
                          {drop.sent.toLocaleString()} sent · {drop.respPct.toFixed(1)}% resp · {drop.roas.toFixed(1)}x ROAS
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </td>

              {/* Metrics – right aligned (aggregate for the whole campaign) */}
              <td className="py-3 px-2 text-right text-xs text-slate-900">
                {c.sent.toLocaleString()}
              </td>
              <td className="py-3 px-2 text-right text-xs text-slate-900">
                {c.opens.toLocaleString()}
              </td>
              <td className="py-3 px-2 text-right text-xs text-slate-900">
                {c.responses.toLocaleString()}
              </td>
              <td className="py-3 px-2 text-right text-xs font-semibold text-amber-600">
                {c.respPct.toFixed(1)}%
              </td>
              <td className="py-3 px-2 text-right text-xs text-slate-900">
                {c.roas.toFixed(1)}x
              </td>
              <td className="py-3 pl-2 pr-2 text-right text-xs text-slate-900">
                {c.revenue.toLocaleString("en-US", {
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
  );
};

export default OneOffCampaignTrackerPage;
