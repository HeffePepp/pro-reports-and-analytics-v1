import React, { useState, useMemo } from "react";
import { ShellLayout, MetricTile, SummaryTile, AIInsightsTile } from "@/components/layout";

type CustomerJourneySummary = {
  storeGroupName: string;
  periodLabel: string;
  journeyRoas: number;
  activeCustomers: number;
  carCount: number;
  journeyRevenue: number;
  touchesPerCustomer: number;
};

type JourneyStepRow = {
  name: string;
  interval: string;
  channel: string;
  sent: number;
  vehicles: number;
  revenue: number;
};

const cjSummary: CustomerJourneySummary = {
  storeGroupName: "North Bay Group",
  periodLabel: "Last 12 months",
  journeyRoas: 14.8,
  activeCustomers: 12400,
  carCount: 18500,
  journeyRevenue: 864000,
  touchesPerCustomer: 6.2,
};

const cjSteps: JourneyStepRow[] = [
  {
    name: "Thank You Email",
    interval: "1 day after service",
    channel: "Email",
    sent: 11800,
    vehicles: 7600,
    revenue: 0,
  },
  {
    name: "Suggested Services",
    interval: "1–6 months after",
    channel: "Email",
    sent: 9200,
    vehicles: 2100,
    revenue: 148000,
  },
  {
    name: "Reminder 1",
    interval: "5k after last service",
    channel: "Postcard + Email/MMS",
    sent: 8600,
    vehicles: 3100,
    revenue: 394000,
  },
  {
    name: "Reminder 2",
    interval: "30 days after reminder 1",
    channel: "Postcard + Email/MMS",
    sent: 5400,
    vehicles: 1520,
    revenue: 184000,
  },
  {
    name: "Reactivation",
    interval: "12–24 months after",
    channel: "Email",
    sent: 4300,
    vehicles: 580,
    revenue: 138000,
  },
];

const CustomerJourneyPage: React.FC = () => {
  const [aiInsights, setAiInsights] = useState<string[]>([
    "Your full Throttle journey (thank-you, SS, reminders, reactivation) is active for this group.",
    "Reminder 1 and 2 drive the majority of returning vehicles and revenue.",
    "Suggested Services emails contribute meaningful upsell revenue between visits.",
  ]);

  const bestRevenueStep = useMemo(
    () =>
      cjSteps.reduce((best, step) =>
        !best || step.revenue > best.revenue ? step : best
      ),
    []
  );

  const handleRefreshAi = () => {
    setAiInsights([
      `"${bestRevenueStep.name}" is currently the strongest step by revenue ($${bestRevenueStep.revenue.toLocaleString()}).`,
      "Consider small A/B tests on subject lines and offers at 3 and 6 months to push more volume into Reminder 1.",
      "Use this report with ROAS and Coupon/Discount Analysis to decide where to add or reduce touches.",
    ]);
  };

  const totalSent = useMemo(
    () => cjSteps.reduce((sum, s) => sum + s.sent, 0),
    []
  );
  const totalVehicles = useMemo(
    () => cjSteps.reduce((sum, s) => sum + s.vehicles, 0),
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
            Group:{" "}
            <span className="font-medium">{cjSummary.storeGroupName}</span>
          </span>
          <span>
            Period:{" "}
            <span className="font-medium">{cjSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-foreground">
            Customer Journey
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Step-by-step performance of your full lifecycle journey (thank-you,
            Suggested Services, reminders, reactivation).
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <SummaryTile
            label="Journey ROAS"
            value={`${cjSummary.journeyRoas.toFixed(1)}x`}
          />
          <SummaryTile
            label="Journey revenue"
            value={`$${cjSummary.journeyRevenue.toLocaleString()}`}
          />
        </div>
      </div>

      {/* KPI tiles + AI Insights tile in a shared band */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Left: metric tiles */}
        <div className="lg:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-3">
          <MetricTile
            label="Active journey customers"
            value={cjSummary.activeCustomers.toLocaleString()}
            helper={`${cjSummary.carCount.toLocaleString()} cars`}
          />
          <MetricTile
            label="Touches per customer"
            value={cjSummary.touchesPerCustomer.toFixed(1)}
            helper="Avg journey touches"
          />
          <MetricTile
            label="Messages sent (12m)"
            value={totalSent.toLocaleString()}
          />
          <MetricTile
            label="Vehicles from journey"
            value={totalVehicles.toLocaleString()}
          />
        </div>

        {/* Right: AI Insights tile (fixed location across reports) */}
        <AIInsightsTile
          subtitle="Based on last 12 months of journey performance"
          bullets={aiInsights}
        />
      </div>

      {/* Journey steps + channel mix (simple drill-down) */}
      <section className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Steps list */}
        <div className="rounded-2xl bg-card border border-border shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-card-foreground">
              Journey steps and performance
            </h2>
            <span className="text-[11px] text-muted-foreground">
              Dummy data for prototype
            </span>
          </div>
          <div className="space-y-2 text-xs text-muted-foreground">
            {cjSteps.map((step) => (
              <div
                key={step.name}
                className="border-b border-border pb-2 last:border-0 last:pb-0"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-card-foreground">
                      {step.name}
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {step.interval} · {step.channel}
                    </div>
                  </div>
                  <div className="text-right text-[11px]">
                    <div>{step.vehicles.toLocaleString()} vehicles</div>
                    {step.revenue > 0 && (
                      <div className="text-primary">
                        ${step.revenue.toLocaleString()} rev
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to use / drill into other reports */}
        <div className="rounded-2xl bg-card border border-border shadow-sm p-4 text-xs text-muted-foreground space-y-2">
          <h2 className="text-sm font-semibold text-card-foreground">
            Make this report actionable
          </h2>
          <ul className="list-disc pl-4 space-y-1">
            <li>
              Use <span className="font-medium">ROAS</span> to compare journey
              performance vs one-off campaigns.
            </li>
            <li>
              Pair with{" "}
              <span className="font-medium">Coupon / Discount Analysis</span> to
              spot over- or under-discounted journey offers.
            </li>
            <li>
              Jump to <span className="font-medium">Service Intervals</span> to
              compare "coverage" (who's on the journey) vs actual due dates.
            </li>
          </ul>
          <p className="mt-2 text-[11px] text-muted-foreground">
            In the full Throttle Pro app, these links can become one-click
            pivots into the related reports with the same filters (store,
            period, audience) applied.
          </p>
        </div>
      </section>
    </ShellLayout>
  );
};

export default CustomerJourneyPage;
