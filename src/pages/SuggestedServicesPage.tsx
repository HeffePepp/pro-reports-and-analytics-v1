import React, { useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile, KpiCustomizeButton, DraggableKpiRow, ReportPageLayout } from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";
import { SuggestedServiceResponseCard, type SuggestedServiceResponse } from "@/components/reports/SuggestedServiceResponseCard";

type SuggestedServicesSummary = {
  storeGroupName: string;
  periodLabel: string;
  invoices: number;
  suggestedServices: number;
  emailsSent: number;
  emailsOpened: number;
  responses: number;
  ssRevenue: number;
  totalRevenue: number;
  invoicesWithSsPct: number;
};

const ssSummary: SuggestedServicesSummary = {
  storeGroupName: "All Stores",
  periodLabel: "Last 12 months",
  invoices: 21500,
  suggestedServices: 8420,
  emailsSent: 18200,
  emailsOpened: 12740,
  responses: 4331,
  ssRevenue: 186400,
  totalRevenue: 742000,
  invoicesWithSsPct: 34.5,
};

type SuggestedServiceTypeRow = {
  service: string;
  invoices: number;
  validEmailPct: number;
  conversions: number;
};

const SS_SERVICE_TYPES: SuggestedServiceTypeRow[] = [
  { service: "PCV Valve", invoices: 2200, validEmailPct: 75, conversions: 13 },
  { service: "Pwr Steering Flush", invoices: 2160, validEmailPct: 78, conversions: 18 },
  { service: "Rear Brake Service", invoices: 2120, validEmailPct: 81, conversions: 22 },
  { service: "Rear Diff Service", invoices: 2080, validEmailPct: 84, conversions: 9 },
  { service: "Radiator Service", invoices: 2040, validEmailPct: 87, conversions: 15 },
  { service: "Serpentine Belt Svc.", invoices: 2000, validEmailPct: 75, conversions: 11 },
  { service: "Shock/Struts", invoices: 1960, validEmailPct: 78, conversions: 7 },
  { service: "Transfer Case Serv", invoices: 1920, validEmailPct: 81, conversions: 12 },
  { service: "Tire Rotation", invoices: 1880, validEmailPct: 84, conversions: 25 },
  { service: "Transmission Service", invoices: 1840, validEmailPct: 87, conversions: 8 },
  { service: "Tune-Up", invoices: 1800, validEmailPct: 75, conversions: 14 },
  { service: "Wiper Blades", invoices: 1760, validEmailPct: 78, conversions: 19 },
  { service: "Air Filter", invoices: 1720, validEmailPct: 81, conversions: 21 },
  { service: "Breather Filter", invoices: 1680, validEmailPct: 84, conversions: 6 },
  { service: "Brake Service", invoices: 1640, validEmailPct: 87, conversions: 16 },
  { service: "Battery Service", invoices: 1600, validEmailPct: 75, conversions: 10 },
  { service: "Cabin Air Filter", invoices: 1560, validEmailPct: 78, conversions: 17 },
  { service: "Engine Flush", invoices: 1520, validEmailPct: 81, conversions: 5 },
  { service: "Exhaust Work", invoices: 1480, validEmailPct: 84, conversions: 8 },
  { service: "Front Brake Service", invoices: 1440, validEmailPct: 87, conversions: 20 },
  { service: "Front Diff Service", invoices: 1400, validEmailPct: 75, conversions: 4 },
  { service: "Fuel Filter", invoices: 1360, validEmailPct: 78, conversions: 11 },
  { service: "Fuel Inj. Service", invoices: 1320, validEmailPct: 81, conversions: 9 },
  { service: "Hoses", invoices: 1280, validEmailPct: 84, conversions: 7 },
  { service: "Light Bulb", invoices: 1240, validEmailPct: 87, conversions: 3 },
];

// Response maturity types and helpers (same as Customer Journey)
type ChannelType = "email" | "text" | "postcard";
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
    return { level: "unknown", label: "", ratio: null, windowDays: null, daysSince: null };
  }

  const clampedDays = Math.max(0, daysSinceLastSend);
  const ratio = Math.min(1, clampedDays / windowDays);
  const pct = Math.round(ratio * 100);

  let level: ResponseMaturityLevel;
  if (ratio < 0.5) level = "early";
  else if (ratio < 0.8) level = "maturing";
  else level = "mature";

  return { level, label: `${pct}%`, ratio, windowDays, daysSince: clampedDays };
};

const getMaturityColorClasses = (level: ResponseMaturityLevel) => {
  switch (level) {
    case "early":
      return {
        bg: "bg-rose-50",
        border: "border-rose-200",
        text: "text-rose-700",
        dot: "bg-rose-500",
      };
    case "maturing":
      return {
        bg: "bg-amber-50",
        border: "border-amber-200",
        text: "text-amber-700",
        dot: "bg-amber-500",
      };
    case "mature":
      return {
        bg: "bg-emerald-50",
        border: "border-emerald-200",
        text: "text-emerald-700",
        dot: "bg-emerald-500",
      };
    default:
      return {
        bg: "bg-slate-50",
        border: "border-slate-200",
        text: "text-slate-600",
        dot: "bg-slate-400",
      };
  }
};

// Response Maturity Pill component
const ResponseMaturityPill: React.FC<{ info: ResponseMaturityInfo }> = ({ info }) => {
  if (info.level === "unknown") return null;

  const base =
    "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium";
  const colors = getMaturityColorClasses(info.level);

  return (
    <div className={`${base} ${colors.bg} ${colors.border} ${colors.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${colors.dot}`} />
      <span>Maturity {info.label}</span>
    </div>
  );
};

type SuggestedServicesTouchPoint = {
  id: number;
  name: string;
  timing: string;
  channel: "Email" | "Text";
  sent: number;
  opened: number;
  responses: number;
  respPct: number;
  roas: number;
  revenue: number;
  daysSinceLastSend?: number;
};

const SS_TOUCHPOINTS: SuggestedServicesTouchPoint[] = [
  {
    id: 1,
    name: "Suggested Services",
    timing: "1 week after service",
    channel: "Email",
    sent: 1850,
    opened: 1295,
    responses: 420,
    respPct: 22.7,
    roas: 9.5,
    revenue: 199500,
    daysSinceLastSend: 3,
  },
  {
    id: 2,
    name: "Suggested Services",
    timing: "1 month after service",
    channel: "Email",
    sent: 1760,
    opened: 1232,
    responses: 310,
    respPct: 17.6,
    roas: 12.1,
    revenue: 187550,
    daysSinceLastSend: 7,
  },
  {
    id: 3,
    name: "Suggested Services",
    timing: "3 months after service",
    channel: "Email",
    sent: 1640,
    opened: 1148,
    responses: 240,
    respPct: 14.6,
    roas: 11.2,
    revenue: 134400,
    daysSinceLastSend: 12,
  },
  {
    id: 4,
    name: "Suggested Services",
    timing: "6 months after service",
    channel: "Email",
    sent: 1380,
    opened: 966,
    responses: 280,
    respPct: 20.3,
    roas: 16.4,
    revenue: 229600,
    daysSinceLastSend: 15,
  },
];

// Mock response data for the new Responses tab
const SS_RESPONSES: SuggestedServiceResponse[] = [
  {
    id: "r1",
    customerName: "Sarah Johnson",
    customerEmail: "sarah.j@email.com",
    storeLabel: "0334 · GMF · Richmond, VA",
    vehicleLabel: "2019 Honda Accord – VA-ABC1234",
    original: {
      invoiceNumber: "198001",
      date: "10-01-2025",
      amount: 89.95,
      mileage: 52340,
      touchpointLabel: "Suggested Services – 1 week",
      channelLabel: "Email",
      sentDate: "10-05-2025",
      openedDate: "10-05-2025",
    },
    suggestions: [
      { id: "s1", name: "Transmission Service", videoWatched: true, couponOpened: true, offerText: "$20 off" },
      { id: "s2", name: "Cabin Air Filter", videoWatched: false, couponOpened: true },
    ],
    response: {
      invoiceNumber: "198041",
      date: "10-12-2025",
      amount: 245.00,
      daysLater: 7,
      milesLater: 120,
      servicesPurchased: ["Transmission Service", "Cabin Air Filter"],
      offerType: "coupon",
      offerCode: "TRANS20",
      offerDescription: "$20 off transmission service",
    },
  },
  {
    id: "r2",
    customerName: "Michael Chen",
    customerEmail: "mchen@gmail.com",
    storeLabel: "0221 · Express Lube · Arlington, VA",
    vehicleLabel: "2017 Toyota Camry – VA-XYZ5678",
    original: {
      invoiceNumber: "197845",
      date: "09-28-2025",
      amount: 45.99,
      mileage: 78200,
      touchpointLabel: "Suggested Services – 1 month",
      channelLabel: "Email",
      sentDate: "10-28-2025",
      openedDate: "10-29-2025",
    },
    suggestions: [
      { id: "s3", name: "Brake Service", videoWatched: true, couponOpened: false, offerText: "$15 off" },
      { id: "s4", name: "Serpentine Belt", videoWatched: false, couponOpened: false },
    ],
    response: {
      invoiceNumber: "198102",
      date: "11-02-2025",
      amount: 189.00,
      daysLater: 5,
      milesLater: 85,
      servicesPurchased: ["Brake Service"],
      offerType: "discount",
      offerCode: "BRAKE15",
      offerDescription: "$15 off brake service",
    },
  },
  {
    id: "r3",
    customerName: "Emily Rodriguez",
    customerEmail: "emily.rod@yahoo.com",
    storeLabel: "0445 · Quick Oil · Fairfax, VA",
    vehicleLabel: "2020 Mazda CX-5 – VA-DEF9012",
    original: {
      invoiceNumber: "197990",
      date: "10-15-2025",
      amount: 62.50,
      mileage: 34500,
      touchpointLabel: "Suggested Services – 1 week",
      channelLabel: "Email",
      sentDate: "10-22-2025",
      openedDate: "10-23-2025",
    },
    suggestions: [
      { id: "s5", name: "Air Filter", videoWatched: false, couponOpened: false },
      { id: "s6", name: "Wiper Blades", videoWatched: false, couponOpened: false },
    ],
    response: {},
  },
  {
    id: "r4",
    customerName: "David Thompson",
    customerEmail: "dthompson@work.com",
    storeLabel: "0334 · GMF · Richmond, VA",
    vehicleLabel: "2016 Ford F-150 – VA-TRK4567",
    original: {
      invoiceNumber: "197802",
      date: "09-20-2025",
      amount: 125.00,
      mileage: 95200,
      touchpointLabel: "Suggested Services – 3 months",
      channelLabel: "Email",
      sentDate: "12-20-2025",
      openedDate: "12-21-2025",
    },
    suggestions: [
      { id: "s7", name: "Transfer Case Service", videoWatched: true, couponOpened: true, offerText: "$25 off" },
      { id: "s8", name: "Rear Diff Service", videoWatched: true, couponOpened: false },
      { id: "s9", name: "Front Diff Service", videoWatched: false, couponOpened: false },
    ],
    response: {
      invoiceNumber: "198250",
      date: "12-28-2025",
      amount: 385.00,
      daysLater: 8,
      milesLater: 450,
      servicesPurchased: ["Transfer Case Service", "Rear Diff Service"],
      offerType: "coupon",
      offerCode: "TRANSFER25",
      offerDescription: "$25 off transfer case service",
    },
  },
  {
    id: "r5",
    customerName: "Jennifer Martinez",
    storeLabel: "0221 · Express Lube · Arlington, VA",
    vehicleLabel: "2021 Hyundai Sonata – VA-HYU8901",
    original: {
      invoiceNumber: "198050",
      date: "10-25-2025",
      amount: 55.00,
      mileage: 22100,
      touchpointLabel: "Suggested Services – 1 week",
      channelLabel: "Email",
      sentDate: "11-01-2025",
      openedDate: "11-02-2025",
    },
    suggestions: [
      { id: "s10", name: "Fuel Injection Service", videoWatched: true, couponOpened: true, offerText: "$10 off" },
    ],
    response: {},
  },
  {
    id: "r6",
    customerName: "Robert Williams",
    customerEmail: "rwilliams@mail.com",
    storeLabel: "0445 · Quick Oil · Fairfax, VA",
    vehicleLabel: "2018 Chevrolet Silverado – VA-SLV2468",
    original: {
      invoiceNumber: "197920",
      date: "10-10-2025",
      amount: 98.50,
      mileage: 67800,
      touchpointLabel: "Suggested Services – 1 month",
      channelLabel: "Email",
      sentDate: "11-10-2025",
      openedDate: "11-11-2025",
    },
    suggestions: [
      { id: "s11", name: "Power Steering Flush", videoWatched: true, couponOpened: true, offerText: "10% off" },
      { id: "s12", name: "Radiator Service", videoWatched: false, couponOpened: false },
    ],
    response: {
      invoiceNumber: "198320",
      date: "11-18-2025",
      amount: 275.00,
      daysLater: 8,
      milesLater: 180,
      servicesPurchased: ["Power Steering Flush", "Radiator Service"],
      offerType: "discount",
      offerCode: "STEERING10",
      offerDescription: "10% off power steering flush",
    },
  },
  {
    id: "r7",
    customerName: "Amanda Foster",
    customerEmail: "afoster@company.com",
    storeLabel: "0334 · GMF · Richmond, VA",
    vehicleLabel: "2022 Subaru Outback – VA-SUB1357",
    original: {
      invoiceNumber: "198100",
      date: "10-30-2025",
      amount: 72.00,
      mileage: 18500,
      touchpointLabel: "Suggested Services – 1 week",
      channelLabel: "Email",
      sentDate: "11-06-2025",
      openedDate: "11-06-2025",
    },
    suggestions: [
      { id: "s13", name: "Engine Air Filter", videoWatched: true, couponOpened: true, offerText: "$8 off" },
    ],
    response: {
      invoiceNumber: "198380",
      date: "11-12-2025",
      amount: 45.00,
      daysLater: 6,
      milesLater: 95,
      servicesPurchased: ["Engine Air Filter"],
      offerType: "coupon",
      offerCode: "AIRFILTER8",
      offerDescription: "$8 off engine air filter",
    },
  },
];

const getRespColorClass = (rate: number): string => {
  if (rate >= 15) return "text-emerald-600";
  if (rate >= 10) return "text-orange-500";
  if (rate >= 5) return "text-amber-500";
  return "text-rose-600";
};

type SsTab = "touchpoints" | "activess" | "responses";

const KPI_OPTIONS: KpiOption[] = [
  { id: "invoices", label: "Invoices" },
  { id: "suggestedServices", label: "Suggested Services" },
  { id: "emailsSent", label: "Emails Sent" },
  { id: "emailsOpened", label: "Emails Opened" },
  { id: "responses", label: "Responses" },
  { id: "ssRevenue", label: "SS Revenue" },
  { id: "totalRevenue", label: "Total Revenue" },
  { id: "invoicesWithSs", label: "% Invoices with a SS" },
];

const SuggestedServicesPage: React.FC = () => {
  const [ssTab, setSsTab] = useState<SsTab>("touchpoints");

  const { selectedIds, setSelectedIds } = useKpiPreferences("suggested-services", KPI_OPTIONS);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "invoices":
        return (
          <MetricTile
            key={id}
            label="Invoices"
            value={ssSummary.invoices.toLocaleString()}
            helpText="Total number of invoices during the selected period. This is the base count for calculating suggested service attachment rates."
          />
        );
      case "suggestedServices":
        return (
          <MetricTile
            key={id}
            label="Suggested Services"
            value={ssSummary.suggestedServices.toLocaleString()}
            helpText="Total number of suggested service items recorded across all invoices. Higher counts indicate technicians are actively identifying upsell opportunities."
          />
        );
      case "emailsSent":
        return (
          <MetricTile
            key={id}
            label="Emails Sent"
            value={ssSummary.emailsSent.toLocaleString()}
            helpText="Number of suggested-service follow-up emails sent during the selected period. These automated messages help convert declined services into future revenue."
          />
        );
      case "emailsOpened":
        return (
          <MetricTile
            key={id}
            label="Emails Opened"
            value={ssSummary.emailsOpened.toLocaleString()}
            helpText="Number of suggested-service emails that were opened by customers. Open rates indicate email deliverability and subject line effectiveness."
          />
        );
      case "responses":
        return (
          <MetricTile
            key={id}
            label="Responses"
            value={ssSummary.responses.toLocaleString()}
            helpText="Number of customers who responded to a suggested-service message by clicking, calling, or booking. This measures the conversion power of your follow-up sequence."
          />
        );
      case "ssRevenue":
        return (
          <MetricTile
            key={id}
            label="SS Revenue"
            value={ssSummary.ssRevenue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
            helpText="Total revenue tied to accepted suggested services during the selected period. This is incremental revenue that would likely be lost without follow-up."
          />
        );
      case "totalRevenue":
        return (
          <MetricTile
            key={id}
            label="Total Revenue"
            value={ssSummary.totalRevenue.toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            })}
            helpText="Total invoice revenue for all invoices in the selected period. Compare SS Revenue to this to see suggested services' contribution to overall sales."
          />
        );
      case "invoicesWithSs":
        return (
          <MetricTile
            key={id}
            label="% Invoices with a SS"
            value={`${ssSummary.invoicesWithSsPct.toFixed(1)}%`}
            helpText="Percent of all invoices that include at least one suggested-service line item. Higher rates indicate technicians are consistently identifying opportunities."
          />
        );
      default:
        return null;
    }
  };

  const aiInsightsProps = {
    title: "AI insights: Suggested services",
    timeframeLabel: ssSummary.periodLabel,
    bullets: [
      `Suggested services emails generated ${ssSummary.ssRevenue.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
      })} in revenue with ${ssSummary.responses.toLocaleString()} responses.`,
      "Focus on service types with higher RESP% and strong email coverage to lift total RO value.",
      "The 1-week touch point has the highest response rate — consider adding a second reminder at 2 weeks.",
    ],
  };

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
            Store group: <span className="font-medium">{ssSummary.storeGroupName}</span>
          </span>
          <span>
            Period: <span className="font-medium">{ssSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Suggested Services</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track how Suggested Services communications drive customers back on Declined Services.<br />
            Response maturity is based on Throttle standard response windows:<br />
            <span className="font-semibold">60 days for postcards</span> and <span className="font-semibold">10 days for email and text</span>
          </p>
        </div>
        <KpiCustomizeButton
          reportId="suggested-services"
          options={KPI_OPTIONS}
          selectedIds={selectedIds}
          onChangeSelected={setSelectedIds}
        />
      </div>

      {/* KPI tiles - above the grid when present */}
      {selectedIds.length > 0 && (
        <div className="mt-4">
          <DraggableKpiRow
            reportKey="suggested-services"
            tiles={selectedIds
              .map((id) => {
                const tile = renderKpiTile(id);
                return tile ? { id, element: tile } : null;
              })
              .filter(Boolean) as { id: string; element: React.ReactNode }[]}
          />
        </div>
      )}

      {/* Layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4 self-start">
          {/* AI Insights – mobile: below KPIs, above main content */}
          <div className="block lg:hidden">
            <AIInsightsTile {...aiInsightsProps} />
          </div>

          {/* MAIN TWO-TAB TILE: Touch Points / Active SS Items */}
          <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <header className="flex items-center justify-end gap-3">

            {/* Three-tab pill */}
              <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1 text-[11px]">
                {(["touchpoints", "responses", "activess"] as SsTab[]).map((tab) => {
                  const isActive = ssTab === tab;
                  const label = tab === "touchpoints" ? "Touch Points" : tab === "responses" ? "Responses" : "Active SS Items";
                  return (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setSsTab(tab)}
                      className={`rounded-full px-3 py-1 transition ${
                        isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-800"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </header>

            {/* TOUCH POINTS TAB (default) – ghost pill layout like Customer Journey */}
            {ssTab === "touchpoints" && (() => {
              // Mix data for the bar
              const totalResponses = SS_TOUCHPOINTS.reduce((sum, tp) => sum + tp.responses, 0);
              
              // Segment colors matching CJ
              const SEGMENT_COLORS = [
                { bar: "bg-tp-pastel-green", dot: "bg-tp-green" },
                { bar: "bg-tp-pastel-blue", dot: "bg-tp-blue-light" },
                { bar: "bg-tp-pastel-purple", dot: "bg-tp-purple" },
                { bar: "bg-tp-pastel-yellow", dot: "bg-tp-yellow" },
              ];

              const getColor = (index: number) => SEGMENT_COLORS[index % SEGMENT_COLORS.length];

              const channelPillClass = (channel: string) => {
                switch (channel) {
                  case "Email":
                    return "bg-emerald-50 border-emerald-100 text-emerald-700";
                  case "Text":
                    return "bg-indigo-50 border-indigo-100 text-indigo-700";
                  default:
                    return "bg-slate-50 border-slate-200 text-slate-700";
                }
              };

              return (
                <div className="mt-4 space-y-4">
                  {/* Touchpoint mix by contribution */}
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <header>
                      <h2 className="text-[13px] font-semibold text-slate-900">
                        Touchpoint mix by contribution
                      </h2>
                      <p className="text-[11px] text-slate-500">
                        Share of total responses by touch point.
                      </p>
                    </header>

                    {/* Segmented bar */}
                    <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-slate-100">
                      {SS_TOUCHPOINTS.map((tp, index) => {
                        const share = totalResponses > 0 ? (tp.responses / totalResponses) * 100 : 0;
                        if (share <= 0) return null;
                        return (
                          <div
                            key={tp.id}
                            className={`${getColor(index).bar} h-full`}
                            style={{ width: `${share}%` }}
                          />
                        );
                      })}
                    </div>

                    {/* Legend */}
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5">
                      {SS_TOUCHPOINTS.map((tp, index) => {
                        const share = totalResponses > 0 ? (tp.responses / totalResponses) * 100 : 0;
                        return (
                          <div
                            key={tp.id}
                            className="inline-flex items-center gap-1.5 text-[11px] text-slate-700"
                          >
                            <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${getColor(index).dot}`} />
                            <span className="font-medium whitespace-nowrap">{tp.id}. {tp.name}</span>
                            <span className="text-slate-500">· {share.toFixed(1)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Ghost pill cards for each touch point */}
                  {SS_TOUCHPOINTS.map((tp, index) => (
                    <div
                      key={tp.id}
                      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                    >
                      {/* Header row: touch point name/timing + View proofs button */}
                      <div className="mb-3 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-2">
                          <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${getColor(index).dot}`} />
                          <div>
                            <div className="text-sm font-semibold text-slate-900">
                              {tp.id}. {tp.name}
                            </div>
                            <div className="mt-0.5 text-[11px] text-slate-500">
                              {tp.timing}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          className="inline-flex items-center rounded-full border border-slate-200 px-4 py-1.5 text-[11px] font-medium text-slate-700 hover:border-slate-300 hover:bg-slate-50"
                        >
                          View proof
                        </button>
                      </div>

                      {/* Mini table for this touch point */}
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs min-w-0">
                          <thead>
                            <tr className="border-b border-slate-200 text-[11px] tracking-wide text-slate-500">
                              <th className="py-2 pr-3 text-left font-medium whitespace-nowrap">Channel</th>
                              <th className="py-2 px-2 text-right font-medium whitespace-nowrap">Sent</th>
                              <th className="py-2 px-2 text-right font-medium whitespace-nowrap">Opened</th>
                              <th className="py-2 px-2 text-right font-medium whitespace-nowrap">Responses</th>
                              <th className="py-2 px-2 text-right font-medium whitespace-nowrap">Resp %</th>
                              <th className="py-2 px-2 text-right font-medium whitespace-nowrap">ROAS</th>
                              <th className="py-2 pl-2 pr-1 text-right font-medium whitespace-nowrap">Revenue</th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr>
                              <td className="py-2 pr-3">
                                <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${channelPillClass(tp.channel)}`}>
                                  {tp.channel}
                                </span>
                              </td>
                              <td className="py-2 px-2 text-right text-slate-900 whitespace-nowrap">{tp.sent.toLocaleString()}</td>
                              <td className="py-2 px-2 text-right text-slate-900 whitespace-nowrap">{tp.opened.toLocaleString()}</td>
                              <td className="py-2 px-2 text-right text-slate-900 whitespace-nowrap">{tp.responses.toLocaleString()}</td>
                              <td className="py-2 px-2 text-right whitespace-nowrap align-middle">
                                {(() => {
                                  const channelKey = tp.channel.toLowerCase() as ChannelType;
                                  const maturityInfo = getResponseMaturity(channelKey, tp.daysSinceLastSend);
                                  const colors = getMaturityColorClasses(maturityInfo.level);
                                  return (
                                    <>
                                      <div className={`font-semibold ${colors.text}`}>
                                        {tp.respPct.toFixed(1)}%
                                      </div>
                                      <div className="mt-0.5 flex justify-end">
                                        <ResponseMaturityPill info={maturityInfo} />
                                      </div>
                                    </>
                                  );
                                })()}
                              </td>
                              <td className="py-2 px-2 text-right text-slate-900 whitespace-nowrap">{tp.roas.toFixed(1)}x</td>
                              <td className="py-2 pl-2 pr-1 text-right text-slate-900 whitespace-nowrap">
                                {tp.revenue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}

            {/* ACTIVE SS ITEMS TAB */}
            {ssTab === "activess" && (
              <div className="mt-4">
                <header>
                  <h2 className="text-[13px] font-semibold text-slate-900">
                    Active Suggested Service Items
                  </h2>
                </header>

                <ul className="mt-4 divide-y divide-slate-100">
                  {SS_SERVICE_TYPES.map((item) => (
                    <li
                      key={item.service}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      {/* LEFT: service name - vertically centered */}
                      <div className="min-w-0 flex-1 flex items-center">
                        <div className="truncate text-[15px] font-semibold tracking-wide text-slate-900">
                          {item.service}
                        </div>
                      </div>

                      {/* RIGHT: both metrics side by side */}
                      <div className="shrink-0 flex items-center gap-4">
                        {/* Invoice stat pill */}
                        <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-2 text-center min-w-[120px]">
                          <div className="text-[18px] font-semibold text-slate-700 leading-none">
                            {item.invoices.toLocaleString()}
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            Inv. w/ this SS
                          </div>
                        </div>

                        {/* Conversions stat pill */}
                        <div className="rounded-xl bg-slate-50 border border-slate-200 px-4 py-2 text-center min-w-[120px]">
                          <div className="text-[18px] font-semibold text-slate-700 leading-none">
                            {item.conversions.toLocaleString()}
                          </div>
                          <div className="mt-0.5 text-[11px] text-slate-500">
                            SS Inv. w/ email
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* RESPONSES TAB – card-based before/after layout */}
            {ssTab === "responses" && (() => {
              // Filter: only Converted OR Email Opened - No Response Yet
              const filteredResponses = SS_RESPONSES.filter(r => 
                r.response.invoiceNumber || r.original.openedDate
              );
              const convertedCount = filteredResponses.filter(r => r.response.invoiceNumber).length;
              const totalRevenue = filteredResponses
                .filter(r => r.response.amount)
                .reduce((sum, r) => sum + (r.response.amount || 0), 0);
              const conversionRate = filteredResponses.length > 0 
                ? (convertedCount / filteredResponses.length) * 100 
                : 0;

              return (
                <div className="mt-4 space-y-4">
                  {/* Summary stats - colored pills evenly distributed */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="rounded-xl bg-sky-50 border border-sky-200 px-5 py-2.5 text-center flex-1">
                      <div className="text-lg font-semibold text-sky-700">{filteredResponses.length}</div>
                      <div className="text-[11px] text-sky-600">Responses</div>
                    </div>
                    <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-5 py-2.5 text-center flex-1">
                      <div className="text-lg font-semibold text-emerald-700">
                        {totalRevenue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-[11px] text-emerald-600">SS Revenue</div>
                    </div>
                    <div className="rounded-xl bg-indigo-50 border border-indigo-200 px-5 py-2.5 text-center flex-1">
                      <div className="text-lg font-semibold text-indigo-700">{conversionRate.toFixed(1)}%</div>
                      <div className="text-[11px] text-indigo-600">Conversion Rate</div>
                    </div>
                  </div>

                  {/* Response cards */}
                  {filteredResponses.map((row) => (
                    <SuggestedServiceResponseCard key={row.id} row={row} />
                  ))}
                </div>
              );
            })()}
          </section>
        </div>

        {/* RIGHT: AI on large screens */}
        <div className="hidden lg:block lg:col-span-1 self-start">
          <AIInsightsTile {...aiInsightsProps} />
        </div>
      </div>
    </ShellLayout>
  );
};

export default SuggestedServicesPage;
