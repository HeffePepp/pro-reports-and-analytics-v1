import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";

type CustomerDataSummary = {
  customers: number;
  vehicles: number;
  avgVehiclesPerCustomer: number;
  reachableEmailPct: number;
  reachableMailPct: number;
};

type CustomerStoreRow = {
  storeName: string;
  customers: number;
  vehicles: number;
  reachableEmailPct: number;
};

const customerDataSummary: CustomerDataSummary = {
  customers: 18500,
  vehicles: 24600,
  avgVehiclesPerCustomer: 1.33,
  reachableEmailPct: 78,
  reachableMailPct: 86,
};

const customerStoreRows: CustomerStoreRow[] = [
  {
    storeName: "Vallejo, CA",
    customers: 5200,
    vehicles: 7000,
    reachableEmailPct: 79,
  },
  {
    storeName: "Napa, CA",
    customers: 4200,
    vehicles: 5600,
    reachableEmailPct: 81,
  },
  {
    storeName: "Fairfield, CA",
    customers: 3100,
    vehicles: 4080,
    reachableEmailPct: 74,
  },
  {
    storeName: "Vacaville, CA",
    customers: 4000,
    vehicles: 5420,
    reachableEmailPct: 80,
  },
];

const CustomerDataPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Most customers have at least one reachable channel, with email capture trailing postal.",
    "Multi-vehicle households are a major driver of LTV and should be prioritized in journey coverage.",
    "Store-level differences in email capture create different marketing leverage.",
  ]);

  const maxCustomers = useMemo(
    () => Math.max(...customerStoreRows.map((r) => r.customers), 1),
    []
  );

  const regenerateInsights = () => {
    const worstEmailStore = customerStoreRows.reduce((worst, r) =>
      !worst || r.reachableEmailPct < worst.reachableEmailPct ? r : worst
    );
    setInsights([
      `Average vehicles per customer is ${customerDataSummary.avgVehiclesPerCustomer.toFixed(
        2
      )}, which is strong for quick lube.`,
      `"${worstEmailStore.storeName}" has the weakest email capture (${worstEmailStore.reachableEmailPct.toFixed(
        1
      )}%), making it a focus for data capture improvements.`,
      "Use this report with Valid Email Capture and Valid Address Report to prioritize data cleanup projects.",
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Customer Data" },
      ]}
      rightInfo={
        <>
          <span>
            Customers:{" "}
            <span className="font-medium">
              {customerDataSummary.customers.toLocaleString()}
            </span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Customer Data
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Customer/vehicle roster with visits, lifetime value and
            contactability by channel.
          </p>
        </div>
      </div>

      {/* Layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <MetricTile
              label="Customers"
              value={customerDataSummary.customers.toLocaleString()}
            />
            <MetricTile
              label="Vehicles"
              value={customerDataSummary.vehicles.toLocaleString()}
            />
            <MetricTile
              label="Vehicles / customer"
              value={customerDataSummary.avgVehiclesPerCustomer.toFixed(2)}
            />
            <MetricTile
              label="Reachable by email"
              value={`${customerDataSummary.reachableEmailPct.toFixed(0)}%`}
            />
            <MetricTile
              label="Reachable by mail"
              value={`${customerDataSummary.reachableMailPct.toFixed(0)}%`}
            />
          </div>

          {/* Store-level view */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Customer base by store
              </h2>
              <span className="text-[11px] text-slate-500">
                Customers, vehicles and email capture
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              {customerStoreRows.map((r) => (
                <div key={r.storeName}>
                  <div className="flex justify-between text-[11px]">
                    <span>{r.storeName}</span>
                    <span>
                      {r.customers.toLocaleString()} customers ·{" "}
                      {r.reachableEmailPct.toFixed(1)}% email capture
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-sky-500"
                        style={{
                          width: `${(r.customers / maxCustomers) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 w-32 text-right">
                      {r.vehicles.toLocaleString()} vehicles
                    </span>
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
                Customers, vehicles and email capture
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Store</th>
                    <th className="py-2 pr-3 text-right">Customers</th>
                    <th className="py-2 pr-3 text-right">Vehicles</th>
                    <th className="py-2 pr-3 text-right">Email capture %</th>
                  </tr>
                </thead>
                <tbody>
                  {customerStoreRows.map((r) => (
                    <tr key={r.storeName} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-800">
                        {r.storeName}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {r.customers.toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {r.vehicles.toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {r.reachableEmailPct.toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* RIGHT */}
        <div className="lg:col-span-1">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on customer & contactability data"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default CustomerDataPage;
