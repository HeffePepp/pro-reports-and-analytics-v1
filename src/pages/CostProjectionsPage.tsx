import React, { useState, useMemo } from "react";
import { ShellLayout, SummaryTile, BarStack } from "@/components/layout";
import MetricTile from "@/components/layout/MetricTile";

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

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
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

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
        {/* Cost mix */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">
              Journey cost mix
            </h2>
            <span className="text-[11px] text-slate-400">
              Share of projected cost by step
            </span>
          </div>
          <BarStack segments={segments} />
        </div>

        {/* Step details */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-semibold text-slate-800">
              Step projections
            </h2>
            <span className="text-[11px] text-slate-400">
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
        </div>

        {/* Insights */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
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
            {insights.map((line, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            In production, this report would recalc projections nightly based on
            latest journey settings and store volumes.
          </p>
        </div>
      </section>
    </ShellLayout>
  );
};

export default CostProjectionsPage;
