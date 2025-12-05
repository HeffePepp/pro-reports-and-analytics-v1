import React, { useState, useMemo } from "react";
import { ShellLayout, MetricTile, SummaryTile } from "@/components/layout";

type SuggestedServiceSummary = {
  storeName: string;
  periodLabel: string;
  messagesSent: number;
  customersReached: number;
  clicks: number;
  responses: number;
  revenue: number;
};

type SuggestedServiceRow = {
  serviceName: string;
  sent: number;
  clicks: number;
  responses: number;
  revenue: number;
};

const ssSummary: SuggestedServiceSummary = {
  storeName: "Vallejo, CA",
  periodLabel: "Last 90 days",
  messagesSent: 4200,
  customersReached: 3100,
  clicks: 780,
  responses: 520,
  revenue: 18400,
};

const ssRows: SuggestedServiceRow[] = [
  {
    serviceName: "Engine air filter",
    sent: 2100,
    clicks: 420,
    responses: 210,
    revenue: 5400,
  },
  {
    serviceName: "Cabin air filter",
    sent: 1900,
    clicks: 320,
    responses: 165,
    revenue: 4800,
  },
  {
    serviceName: "Tire rotation",
    sent: 2600,
    clicks: 260,
    responses: 95,
    revenue: 3600,
  },
  {
    serviceName: "Wiper blades",
    sent: 1800,
    clicks: 180,
    responses: 50,
    revenue: 2600,
  },
];

const SuggestedServicesPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Engine and cabin air filters generate the highest Suggested Services revenue.",
    "Tire rotation has room to grow: high impressions but lower acceptance.",
    "Wipers perform best when paired with rainy-season campaigns or safety messaging.",
  ]);

  const acceptRate = useMemo(
    () => (ssSummary.responses / ssSummary.customersReached) * 100,
    []
  );
  const clickRate = useMemo(
    () => (ssSummary.clicks / ssSummary.messagesSent) * 100,
    []
  );
  const revPerThousand = useMemo(
    () => (ssSummary.revenue / ssSummary.messagesSent) * 1000,
    []
  );
  const revPerResponse = useMemo(
    () => (ssSummary.revenue / ssSummary.responses) || 0,
    []
  );

  const maxRevenue = useMemo(
    () => Math.max(...ssRows.map((r) => r.revenue), 1),
    []
  );

  const regenerateInsights = () => {
    const top = ssRows.reduce((best, r) =>
      !best || r.revenue > best.revenue ? r : best
    );
    const weakest = ssRows.reduce((worst, r) =>
      !worst || r.revenue < worst.revenue ? r : worst
    );

    setInsights([
      `${top.serviceName} is currently the strongest Suggested Service by revenue ($${top.revenue.toLocaleString()}).`,
      `${weakest.serviceName} is underperforming; consider different copy, timing or a stronger offer.`,
      `Overall acceptance is ${acceptRate.toFixed(
        1
      )}% with about $${revPerThousand.toFixed(
        0
      )} in revenue per 1,000 messages.`,
    ]);
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
            Store: <span className="font-medium">{ssSummary.storeName}</span>
          </span>
          <span>
            Period:{" "}
            <span className="font-medium">{ssSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Suggested Services
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Performance of educational Suggested Services emails and how they
            translate into upsell revenue.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <SummaryTile
            label="Messages sent"
            value={ssSummary.messagesSent.toLocaleString()}
          />
          <SummaryTile
            label="SS revenue"
            value={`$${ssSummary.revenue.toLocaleString()}`}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile
          label="Acceptance rate"
          value={`${acceptRate.toFixed(1)}%`}
          helper={`${ssSummary.responses} responses`}
        />
        <MetricTile
          label="Click-through rate"
          value={`${clickRate.toFixed(1)}%`}
          helper={`${ssSummary.clicks} clicks`}
        />
        <MetricTile
          label="Revenue / 1,000 msgs"
          value={`$${revPerThousand.toFixed(0)}`}
          helper="SS revenue efficiency"
        />
        <MetricTile
          label="Rev per SS response"
          value={`$${revPerResponse.toFixed(0)}`}
          helper="Avg upsell value"
        />
        <MetricTile
          label="Customers reached"
          value={ssSummary.customersReached.toLocaleString()}
        />
      </div>

      <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Per-service performance */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-sm font-semibold text-slate-800">
              Performance by Suggested Service
            </h2>
            <span className="text-[11px] text-slate-400">
              Revenue and acceptance by service (dummy data)
            </span>
          </div>
          <div className="space-y-2">
            {ssRows.map((row) => {
              const rate = (row.responses / row.sent) * 100;
              return (
                <div key={row.serviceName} className="space-y-1">
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>{row.serviceName}</span>
                    <span>
                      {rate.toFixed(1)}% acc · $
                      {row.revenue.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-indigo-500"
                        style={{
                          width: `${(row.revenue / maxRevenue) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 w-20 text-right">
                      {row.responses} resp
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Insights */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-sm font-semibold text-slate-800">
              AI insights (mock)
            </h2>
            <button
              onClick={regenerateInsights}
              className="text-[11px] px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600"
            >
              Refresh
            </button>
          </div>
          <ul className="space-y-1 text-xs text-slate-600">
            {insights.map((line, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            In the full app, this panel will call Lovable/OpenAI with live SS
            stats to generate store- and vendor-specific recommendations.
          </p>
        </div>
      </section>
    </ShellLayout>
  );
};

export default SuggestedServicesPage;
