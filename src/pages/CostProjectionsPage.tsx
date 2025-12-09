import React, { useState, useMemo } from "react";
import { ShellLayout, SummaryTile, BarStack, MetricTile, AIInsightsTile } from "@/components/layout";

type CostProjectionSummary = {
  storeGroupName: string;
  periodLabel: string;
  monthlyCost: number;
  projectedVehicles: number;
  projectedRevenue: number;
};

type CostProjectionStep = {
  name: string;
  channel: string;
  estCost: number;
  estVehicles: number;
  estRevenue: number;
};

const costSummary: CostProjectionSummary = {
  storeGroupName: "North Bay Group",
  periodLabel: "Next 30 days",
  monthlyCost: 12800,
  projectedVehicles: 520,
  projectedRevenue: 186000,
};

const costSteps: CostProjectionStep[] = [
  {
    name: "Reminder 1 postcard",
    channel: "Postcard",
    estCost: 8200,
    estVehicles: 280,
    estRevenue: 98000,
  },
  {
    name: "Reminder 1 email + SMS",
    channel: "Email + SMS",
    estCost: 1400,
    estVehicles: 110,
    estRevenue: 32000,
  },
  {
    name: "Reminder 2 postcard",
    channel: "Postcard",
    estCost: 2600,
    estVehicles: 82,
    estRevenue: 34000,
  },
  {
    name: "Reactivation 12 months",
    channel: "Email",
    estCost: 600,
    estVehicles: 48,
    estRevenue: 22000,
  },
];

const CostProjectionsPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Most projected spend is in Reminder 1 postcards, which also drive the largest share of vehicles.",
    "Email and SMS steps are low-cost but high-ROAS and should almost always be enabled.",
    "Use this report when planning budgets with owners and vendor partners.",
  ]);

  const overallRoas = useMemo(
    () => costSummary.projectedRevenue / costSummary.monthlyCost,
    []
  );

  const segments = useMemo(
    () =>
      costSteps.map((s, idx) => ({
        label: s.name,
        value: s.estCost,
        color:
          idx === 0
            ? "bg-indigo-500"
            : idx === 1
            ? "bg-sky-400"
            : idx === 2
            ? "bg-emerald-400"
            : "bg-amber-400",
      })),
    []
  );

  const regenerateInsights = () => {
    const best = costSteps.reduce((b, s) =>
      !b || s.estRevenue / s.estCost > b.estRevenue / b.estCost ? s : b
    );
    setInsights([
      `Projected ROAS for the journey is about ${overallRoas.toFixed(
        1
      )}x this month.`,
      `"${best.name}" currently has the highest projected ROAS among journey steps.`,
      "If budget is constrained, reduce postcard volume before cutting low-cost email/SMS touches.",
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Cost Projections" },
      ]}
      rightInfo={
        <>
          <span>
            Group:{" "}
            <span className="font-medium">{costSummary.storeGroupName}</span>
          </span>
          <span>
            Period:{" "}
            <span className="font-medium">{costSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Cost Projections (Journey)
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Forecast journey step costs, expected vehicles and projected ROAS for
            planning and budgeting.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <SummaryTile
            label="Projected monthly cost"
            value={`$${costSummary.monthlyCost.toLocaleString()}`}
          />
          <SummaryTile
            label="Projected revenue"
            value={`$${costSummary.projectedRevenue.toLocaleString()}`}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <MetricTile
              label="Projected vehicles"
              value={costSummary.projectedVehicles.toString()}
            />
            <MetricTile
              label="Projected ROAS"
              value={`${overallRoas.toFixed(1)}x`}
            />
            <MetricTile
              label="Postcard-heavy?"
              value="Yes"
              helper="Most cost is postcards"
            />
            <MetricTile
              label="Email/SMS cost"
              value="Low"
              helper="High ROAS potential"
            />
            <MetricTile
              label="Scenario"
              value="Standard"
              helper="Demo only"
            />
          </div>

          {/* AI Insights – stacked here on small/medium screens */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on cost projection data"
              bullets={insights}
              onRefresh={regenerateInsights}
            />
          </div>

          {/* Cost mix */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Journey cost mix
              </h2>
              <span className="text-[11px] text-slate-500">
                Share of projected cost by step
              </span>
            </div>
            <BarStack segments={segments} />
          </section>

          {/* Step details */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Step projections
              </h2>
              <span className="text-[11px] text-slate-500">
                Est. cost, vehicles & revenue
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-600">
              {costSteps.map((s) => {
                const roas = s.estRevenue / s.estCost;
                return (
                  <div key={s.name} className="border-b border-slate-100 pb-1 last:border-0">
                    <div className="flex justify-between">
                      <span>{s.name}</span>
                      <span>{s.channel}</span>
                    </div>
                    <div className="flex justify-between mt-1 text-[11px]">
                      <span>Cost: ${s.estCost.toLocaleString()}</span>
                      <span>Vehicles: {s.estVehicles}</span>
                      <span>ROAS: {roas.toFixed(1)}x</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>

        {/* RIGHT: AI Insights – only on large screens */}
        <div className="hidden lg:block lg:col-span-1">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on cost projection data"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default CostProjectionsPage;
