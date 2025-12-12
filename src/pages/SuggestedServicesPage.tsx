import React, { useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile, KpiCustomizeButton } from "@/components/layout";
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
  { service: "PCV VALVE", invoices: 2200, validEmailPct: 75, conversions: 13 },
  { service: "PWR STEERING FLUSH", invoices: 2160, validEmailPct: 78, conversions: 18 },
  { service: "REAR BRAKE SERVICE", invoices: 2120, validEmailPct: 81, conversions: 22 },
  { service: "REAR DIFF SERVICE", invoices: 2080, validEmailPct: 84, conversions: 9 },
  { service: "RADIATOR SERVICE", invoices: 2040, validEmailPct: 87, conversions: 15 },
  { service: "SERPENTINE BELT SVC.", invoices: 2000, validEmailPct: 75, conversions: 11 },
  { service: "SHOCK/STRUTS", invoices: 1960, validEmailPct: 78, conversions: 7 },
  { service: "TRANSFER CASE SERV", invoices: 1920, validEmailPct: 81, conversions: 12 },
  { service: "TIRE ROTATION", invoices: 1880, validEmailPct: 84, conversions: 25 },
  { service: "TRANSMISSION SERVICE", invoices: 1840, validEmailPct: 87, conversions: 8 },
  { service: "TUNE-UP", invoices: 1800, validEmailPct: 75, conversions: 14 },
  { service: "WIPER BLADES", invoices: 1760, validEmailPct: 78, conversions: 19 },
  { service: "AIR FILTER", invoices: 1720, validEmailPct: 81, conversions: 21 },
  { service: "BREATHER FILTER", invoices: 1680, validEmailPct: 84, conversions: 6 },
  { service: "BRAKE SERVICE", invoices: 1640, validEmailPct: 87, conversions: 16 },
  { service: "BATTERY SERVICE", invoices: 1600, validEmailPct: 75, conversions: 10 },
  { service: "CABIN AIR FILTER", invoices: 1560, validEmailPct: 78, conversions: 17 },
  { service: "ENGINE FLUSH", invoices: 1520, validEmailPct: 81, conversions: 5 },
  { service: "EXHAUST WORK", invoices: 1480, validEmailPct: 84, conversions: 8 },
  { service: "FRONT BRAKE SERVICE", invoices: 1440, validEmailPct: 87, conversions: 20 },
  { service: "FRONT DIFF SERVICE", invoices: 1400, validEmailPct: 75, conversions: 4 },
  { service: "FUEL FILTER", invoices: 1360, validEmailPct: 78, conversions: 11 },
  { service: "FUEL INJ. SERVICE", invoices: 1320, validEmailPct: 81, conversions: 9 },
  { service: "HOSES", invoices: 1280, validEmailPct: 84, conversions: 7 },
  { service: "LIGHT BULB", invoices: 1240, validEmailPct: 87, conversions: 3 },
];

type SuggestedServicesTouchPoint = {
  timing: string;
  channel: string;
  sent: number;
  opened: number;
  responses: number;
  respPct: number;
  roas: number;
};

const SS_TOUCHPOINTS: SuggestedServicesTouchPoint[] = [
  {
    timing: "1 week after Service",
    channel: "Email",
    sent: 1850,
    opened: 1295,
    responses: 420,
    respPct: 22.7,
    roas: 9.5,
  },
  {
    timing: "1 month after Service",
    channel: "Email",
    sent: 1760,
    opened: 1232,
    responses: 310,
    respPct: 17.6,
    roas: 12.1,
  },
  {
    timing: "3 months after Service",
    channel: "Email",
    sent: 1640,
    opened: 1148,
    responses: 240,
    respPct: 14.6,
    roas: 11.2,
  },
  {
    timing: "6 months after Service",
    channel: "Email",
    sent: 1380,
    opened: 966,
    responses: 280,
    respPct: 20.3,
    roas: 16.4,
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
            helpText="Total number of invoices during the selected period."
          />
        );
      case "suggestedServices":
        return (
          <MetricTile
            key={id}
            label="Suggested Services"
            value={ssSummary.suggestedServices.toLocaleString()}
            helpText="Total number of suggested service items recorded across all invoices."
          />
        );
      case "emailsSent":
        return (
          <MetricTile
            key={id}
            label="Emails Sent"
            value={ssSummary.emailsSent.toLocaleString()}
            helpText="Number of suggested-service follow-up emails sent during the selected period."
          />
        );
      case "emailsOpened":
        return (
          <MetricTile
            key={id}
            label="Emails Opened"
            value={ssSummary.emailsOpened.toLocaleString()}
            helpText="Number of suggested-service emails that were opened by customers."
          />
        );
      case "responses":
        return (
          <MetricTile
            key={id}
            label="Responses"
            value={ssSummary.responses.toLocaleString()}
            helpText="Number of customers who responded to a suggested-service message by clicking, calling, or booking."
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
            helpText="Total revenue tied to accepted suggested services during the selected period."
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
            helpText="Total invoice revenue for all invoices in the selected period."
          />
        );
      case "invoicesWithSs":
        return (
          <MetricTile
            key={id}
            label="% Invoices with a SS"
            value={`${ssSummary.invoicesWithSsPct.toFixed(1)}%`}
            helpText="Percent of all invoices that include at least one suggested-service line item."
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
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Suggested Services</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track how Suggested Services communications drive completed jobs and revenue by service type and touch
            point.
          </p>
        </div>
        <KpiCustomizeButton
          reportId="suggested-services"
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">{selectedIds.map((id) => renderKpiTile(id))}</div>
          )}

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

            {/* TOUCH POINTS TAB (default) – touch point timing table */}
            {ssTab === "touchpoints" && (
              <div className="mt-4 overflow-x-auto">
                <table className="min-w-full table-fixed text-[11px]">
                  <colgroup>
                    <col className="w-[40%]" />
                    <col className="w-[10%]" />
                    <col className="w-[10%]" />
                    <col className="w-[10%]" />
                    <col className="w-[10%]" />
                    <col className="w-[10%]" />
                    <col className="w-[10%]" />
                  </colgroup>

                  <thead className="border-b border-slate-100 text-slate-500 tracking-wide">
                    <tr>
                      <th className="py-2 pr-4 text-left font-medium">Touch point</th>
                      <th className="py-2 pl-4 text-right font-medium">Sent</th>
                      <th className="py-2 pl-4 text-right font-medium">Opened</th>
                      <th className="py-2 pl-4 text-right font-medium">Responses</th>
                      <th className="py-2 pl-4 text-right font-medium">Resp %</th>
                      <th className="py-2 pl-4 text-right font-medium">ROAS</th>
                      <th className="py-2 pl-4 text-right font-medium">Revenue</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {SS_TOUCHPOINTS.map((tp) => {
                      const revenue = Math.round(tp.responses * tp.roas * 50);
                      return (
                        <tr key={tp.timing}>
                          <td className="py-3 pr-4 align-top">
                            <div className="text-[14px] font-semibold text-slate-900">Suggested Services</div>
                            <div className="mt-0.5 text-[11px] text-slate-500">{tp.timing}</div>
                            <span className="mt-1 inline-flex items-center rounded-full bg-emerald-50 border border-emerald-100 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                              Email
                            </span>
                          </td>

                          <td className="py-3 pl-4 text-right align-middle text-slate-900">
                            {tp.sent.toLocaleString()}
                          </td>
                          <td className="py-3 pl-4 text-right align-middle text-slate-900">
                            {tp.opened.toLocaleString()}
                          </td>
                          <td className="py-3 pl-4 text-right align-middle text-slate-900">
                            {tp.responses.toLocaleString()}
                          </td>
                          <td className="py-3 pl-4 text-right align-middle">
                            <span className="font-semibold text-emerald-600">{tp.respPct.toFixed(1)}%</span>
                          </td>
                          <td className="py-3 pl-4 text-right align-middle text-slate-900">{tp.roas.toFixed(1)}x</td>
                          <td className="py-3 pl-4 text-right align-middle text-slate-900">
                            {revenue.toLocaleString("en-US", {
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

            {/* ACTIVE SS ITEMS TAB */}
            {ssTab === "activess" && (
              <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <header>
                  <h2 className="text-[13px] font-semibold text-slate-900">
                    Active Suggested Service Items
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Invoices and email reach by suggested service.
                  </p>
                </header>

                <ul className="mt-4 divide-y divide-slate-100">
                  {SS_SERVICE_TYPES.map((item) => (
                    <li
                      key={item.service}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      {/* LEFT: service name */}
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-[13px] font-semibold tracking-wide text-slate-900">
                          {(item.service || "").toUpperCase()}
                        </div>
                      </div>

                      {/* MIDDLE: two stats, stacked, left-justified */}
                      <div className="flex-1 text-[11px] text-slate-500">
                        <div>
                          <span className="font-semibold text-slate-900">
                            {item.invoices.toLocaleString()}
                          </span>{" "}
                          <span>Inv. w/ this SS</span>
                        </div>
                        <div className="mt-0.5">
                          <span className="font-semibold text-slate-900">
                            {item.validEmailPct.toFixed(1)}%
                          </span>{" "}
                          <span>Inv. w/ valid email address</span>
                        </div>
                      </div>

                      {/* RIGHT: conversions block */}
                      <div className="shrink-0 text-right">
                        <div className="text-[20px] font-semibold text-slate-900 leading-none">
                          {item.conversions.toLocaleString()}
                        </div>
                        <div className="mt-0.5 text-[11px] text-slate-500">
                          Conversions
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
                  {/* Summary tiles */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center">
                      <div className="text-lg font-semibold text-slate-900">{filteredResponses.length}</div>
                      <div className="text-[11px] text-slate-500">Responses</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center">
                      <div className="text-lg font-semibold text-slate-900">
                        {totalRevenue.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                      </div>
                      <div className="text-[11px] text-slate-500">SS Revenue</div>
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-center">
                      <div className="text-lg font-semibold text-emerald-600">{conversionRate.toFixed(1)}%</div>
                      <div className="text-[11px] text-slate-500">Conversion Rate</div>
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

          {/* AI stacked on small screens */}
          <div className="block lg:hidden">
            <AIInsightsTile {...aiInsightsProps} />
          </div>
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
