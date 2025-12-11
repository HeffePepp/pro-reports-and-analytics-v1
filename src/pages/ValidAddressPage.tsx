import React, { useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile, KpiCustomizeButton } from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";
import InlineLegend from "@/components/common/InlineLegend";

type AddressSummary = {
  totalAddresses: number;
  validPct: number;
  badPct: number;
  blankPct: number;
};

type AddressStoreRow = {
  storeName: string;
  validPct: number;
  badPct: number;
  blankPct: number;
};

const addressSummary: AddressSummary = {
  totalAddresses: 18200,
  validPct: 86,
  badPct: 9,
  blankPct: 5,
};

const addressStoreRows: AddressStoreRow[] = [
  { storeName: "Vallejo, CA", validPct: 84, badPct: 10, blankPct: 6 },
  { storeName: "Napa, CA", validPct: 88, badPct: 7, blankPct: 5 },
  { storeName: "Fairfield, CA", validPct: 82, badPct: 11, blankPct: 7 },
  { storeName: "Vacaville, CA", validPct: 90, badPct: 6, blankPct: 4 },
];

const KPI_OPTIONS: KpiOption[] = [
  { id: "totalAddresses", label: "Total addresses" },
  { id: "valid", label: "Valid" },
  { id: "bad", label: "Bad" },
  { id: "blank", label: "Blank" },
  { id: "goal", label: "Goal bad-address rate" },
];

const ValidAddressPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Mail address quality is generally good, but a few stores are above the 10% bad-address threshold.",
    "Vacant and undeliverable addresses directly waste postcard spend.",
    "Cleaning up addresses in the worst stores will quickly improve ROAS on mail-heavy journeys.",
  ]);

  const { selectedIds, setSelectedIds } = useKpiPreferences("valid-address", KPI_OPTIONS);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "totalAddresses":
        return <MetricTile key={id} label="Total addresses" value={addressSummary.totalAddresses.toLocaleString()} helpText="Total mailing addresses on file in the customer database." />;
      case "valid":
        return <MetricTile key={id} label="Valid" value={`${addressSummary.validPct.toFixed(1)}%`} helpText="Percentage of addresses verified as deliverable by USPS." className="bg-emerald-50 border-emerald-100" />;
      case "bad":
        return <MetricTile key={id} label="Bad" value={`${addressSummary.badPct.toFixed(1)}%`} helpText="Percentage of addresses that failed USPS validation and are undeliverable." className="bg-amber-50 border-amber-100" />;
      case "blank":
        return <MetricTile key={id} label="Blank" value={`${addressSummary.blankPct.toFixed(1)}%`} helpText="Percentage of customer records with no address on file." className="bg-rose-50 border-rose-100" />;
      case "goal":
        return <MetricTile key={id} label="Goal bad-address rate" value="< 10%" helper="Per store" helpText="Target threshold for bad address rate to minimize wasted mail spend." />;
      default:
        return null;
    }
  };

  const regenerateInsights = () => {
    const worstStore = addressStoreRows.reduce((worst, r) =>
      !worst || r.badPct > worst.badPct ? r : worst
    );
    setInsights([
      `Valid address rate across the account is ${addressSummary.validPct.toFixed(1)}%, with ${addressSummary.badPct.toFixed(1)}% bad and ${addressSummary.blankPct.toFixed(1)}% blank.`,
      `"${worstStore.storeName}" has the worst address quality (${worstStore.badPct.toFixed(1)}% bad); clean-up here will have outsized impact.`,
      "Run this report before large mail campaigns to avoid wasting budget on undeliverable addresses.",
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Valid Address Report" },
      ]}
      rightInfo={
        <>
          <span>
            Addresses:{" "}
            <span className="font-medium">
              {addressSummary.totalAddresses.toLocaleString()}
            </span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Valid Address Report
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Mail & email reachability by store: valid, bad and blank records.
          </p>
        </div>
        <KpiCustomizeButton
          reportId="valid-address"
          options={KPI_OPTIONS}
          selectedIds={selectedIds}
          onChangeSelected={setSelectedIds}
        />
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs - only rendered when selected */}
          {selectedIds.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
              {selectedIds.map(renderKpiTile)}
            </div>
          )}

          {/* Store quality bars */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Address quality by store
              </h2>
              <span className="text-[11px] text-slate-500">
                Valid vs bad vs blank
              </span>
            </div>
            <div className="space-y-3 text-xs text-slate-700">
              {addressStoreRows.map((r) => (
                <div key={r.storeName}>
                  <div className="flex justify-between text-[11px]">
                    <span>{r.storeName}</span>
                    <span>{r.validPct.toFixed(1)}% valid</span>
                  </div>
                  <div className="mt-1 flex h-2 rounded-full overflow-hidden bg-slate-100">
                    <div
                      className="bg-tp-pastel-green"
                      style={{ width: `${r.validPct}%` }}
                    />
                    <div
                      className="bg-tp-pastel-yellow"
                      style={{ width: `${r.badPct}%` }}
                    />
                    <div
                      className="bg-tp-pastel-red"
                      style={{ width: `${r.blankPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <InlineLegend
              items={[
                { label: "Valid", colorClass: "bg-tp-green" },
                { label: "Bad", colorClass: "bg-tp-yellow" },
                { label: "Blank", colorClass: "bg-tp-red" },
              ]}
            />
          </section>

          {/* AI Insights – stacked here on small/medium screens - after main content */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on address quality"
              bullets={insights}
              onRefresh={regenerateInsights}
            />
          </div>
        </div>

        {/* RIGHT: AI Insights – only on large screens */}
        <div className="hidden lg:block lg:col-span-1 self-start">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on address quality"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default ValidAddressPage;
