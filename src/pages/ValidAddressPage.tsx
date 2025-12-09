import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";

type AddressSummary = {
  totalAddresses: number;
  validPct: number;
  badPct: number;
  vacantPct: number;
};

type AddressStoreRow = {
  storeName: string;
  validPct: number;
  badPct: number;
  vacantPct: number;
};

const addressSummary: AddressSummary = {
  totalAddresses: 18200,
  validPct: 86,
  badPct: 9,
  vacantPct: 5,
};

const addressStoreRows: AddressStoreRow[] = [
  { storeName: "Vallejo, CA", validPct: 84, badPct: 10, vacantPct: 6 },
  { storeName: "Napa, CA", validPct: 88, badPct: 7, vacantPct: 5 },
  {
    storeName: "Fairfield, CA",
    validPct: 82,
    badPct: 11,
    vacantPct: 7,
  },
  {
    storeName: "Vacaville, CA",
    validPct: 90,
    badPct: 6,
    vacantPct: 4,
  },
];

const ValidAddressPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Mail address quality is generally good, but a few stores are above the 10% bad-address threshold.",
    "Vacant and undeliverable addresses directly waste postcard spend.",
    "Cleaning up addresses in the worst stores will quickly improve ROAS on mail-heavy journeys.",
  ]);

  const regenerateInsights = () => {
    const worstStore = addressStoreRows.reduce((worst, r) =>
      !worst || r.badPct > worst.badPct ? r : worst
    );
    setInsights([
      `Valid address rate across the account is ${addressSummary.validPct.toFixed(
        1
      )}%, with ${addressSummary.badPct.toFixed(1)}% bad and ${addressSummary.vacantPct.toFixed(
        1
      )}% vacant.`,
      `"${worstStore.storeName}" has the worst address quality (${worstStore.badPct.toFixed(
        1
      )}% bad); clean-up here will have outsized impact.`,
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
            Mail & email reachability by store: valid, bad and vacant records.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <MetricTile
              label="Total addresses"
              value={addressSummary.totalAddresses.toLocaleString()}
            />
            <MetricTile
              label="Valid"
              value={`${addressSummary.validPct.toFixed(1)}%`}
            />
            <MetricTile
              label="Bad"
              value={`${addressSummary.badPct.toFixed(1)}%`}
            />
            <MetricTile
              label="Vacant"
              value={`${addressSummary.vacantPct.toFixed(1)}%`}
            />
            <MetricTile
              label="Goal bad-address rate"
              value="< 10%"
              helper="Per store"
            />
          </div>

          {/* AI Insights – stacked here on small/medium screens */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on address quality"
              bullets={insights}
              onRefresh={regenerateInsights}
            />
          </div>

          {/* Store quality bars */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Address quality by store
              </h2>
              <span className="text-[11px] text-slate-500">
                Valid vs bad vs vacant
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
                      className="bg-emerald-500"
                      style={{ width: `${r.validPct}%` }}
                    />
                    <div
                      className="bg-amber-400"
                      style={{ width: `${r.badPct}%` }}
                    />
                    <div
                      className="bg-rose-400"
                      style={{ width: `${r.vacantPct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Store details
              </h2>
              <span className="text-[11px] text-slate-500">
                Valid vs bad vs vacant by store
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Store</th>
                    <th className="py-2 pr-3 text-right">Valid %</th>
                    <th className="py-2 pr-3 text-right">Bad %</th>
                    <th className="py-2 pr-3 text-right">Vacant %</th>
                  </tr>
                </thead>
                <tbody>
                  {addressStoreRows.map((r) => (
                    <tr key={r.storeName} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-800">
                        {r.storeName}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {r.validPct.toFixed(1)}%
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {r.badPct.toFixed(1)}%
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {r.vacantPct.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT: AI Insights – only on large screens */}
        <div className="hidden lg:block lg:col-span-1">
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
