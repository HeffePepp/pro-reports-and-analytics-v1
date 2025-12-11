import React, { useState } from "react";
import {
  ShellLayout,
  AIInsightsTile,
  OilTypePerformanceTile,
} from "@/components/layout";
import OilTypeMixSection from "@/components/reports/OilTypeMixSection";
import OilTypeUsageKpis from "@/components/reports/OilTypeUsageKpis";

type OilMixSummary = {
  periodLabel: string;
};

const oilMixSummary: OilMixSummary = {
  periodLabel: "Last 90 days",
};

const OilTypeSalesPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Synthetic and high mileage oils now account for the majority of oil change revenue.",
    "Conventional still represents a large number of visits but at a lower average ticket.",
    "Moving a small share of conventional customers into synthetic can significantly increase revenue.",
  ]);

  const regenerateInsights = () => {
    setInsights([
      "Full Syn has the highest average ticket at $99.",
      "Use Suggested Services and SS videos to educate customers on benefits of upgraded oils.",
      "Pair this report with Oil Type – Invoices to show vendors invoice-level proof of premium mix.",
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Oil Type Sales" },
      ]}
      rightInfo={<span>Period: <span className="font-medium">{oilMixSummary.periodLabel}</span></span>}
    >
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Oil Type Sales</h1>
          <p className="mt-1 text-sm text-slate-500">Volume and revenue mix across conventional, blend, synthetic and high mileage oils.</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        <div className="lg:col-span-3 space-y-4">
          {/* Oil type KPI tiles */}
          <OilTypeUsageKpis />

          {/* Mix by volume & revenue tiles */}
          <OilTypeMixSection />

          <OilTypePerformanceTile />

          <div className="block lg:hidden">
            <AIInsightsTile title="AI Insights" subtitle="Based on oil mix & revenue" bullets={insights} onRefresh={regenerateInsights} />
          </div>
        </div>

        <div className="hidden lg:block lg:col-span-1 self-start">
          <AIInsightsTile title="AI Insights" subtitle="Based on oil mix & revenue" bullets={insights} onRefresh={regenerateInsights} />
        </div>
      </div>
    </ShellLayout>
  );
};

export default OilTypeSalesPage;
