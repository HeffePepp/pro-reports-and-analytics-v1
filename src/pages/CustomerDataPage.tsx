import React, { useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile, KpiCustomizeButton, CustomerBaseTile } from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";

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

const KPI_OPTIONS: KpiOption[] = [
  { id: "customers", label: "Customers" },
  { id: "vehicles", label: "Vehicles" },
  { id: "vehiclesPerCustomer", label: "Vehicles / customer" },
  { id: "reachableEmail", label: "Reachable by email" },
  { id: "reachableMail", label: "Reachable by mail" },
];

const CustomerDataPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Most customers have at least one reachable channel, with email capture trailing postal.",
    "Multi-vehicle households are a major driver of LTV and should be prioritized in journey coverage.",
    "Store-level differences in email capture create different marketing leverage.",
  ]);

  const { selectedIds, setSelectedIds } = useKpiPreferences("customer-data", KPI_OPTIONS);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "customers":
        return <MetricTile key={id} label="Customers" value={customerDataSummary.customers.toLocaleString()} />;
      case "vehicles":
        return <MetricTile key={id} label="Vehicles" value={customerDataSummary.vehicles.toLocaleString()} />;
      case "vehiclesPerCustomer":
        return <MetricTile key={id} label="Vehicles / customer" value={customerDataSummary.avgVehiclesPerCustomer.toFixed(2)} />;
      case "reachableEmail":
        return <MetricTile key={id} label="Reachable by email" value={`${customerDataSummary.reachableEmailPct.toFixed(0)}%`} />;
      case "reachableMail":
        return <MetricTile key={id} label="Reachable by mail" value={`${customerDataSummary.reachableMailPct.toFixed(0)}%`} />;
      default:
        return null;
    }
  };

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
        <KpiCustomizeButton
          reportId="customer-data"
          options={KPI_OPTIONS}
          selectedIds={selectedIds}
          onChangeSelected={setSelectedIds}
        />
      </div>

      {/* Layout */}
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            {selectedIds.map(renderKpiTile)}
          </div>

          {/* AI Insights – stacked here on small/medium screens */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on customer & contactability data"
              bullets={insights}
              onRefresh={regenerateInsights}
            />
          </div>

          <CustomerBaseTile />
        </div>

        {/* RIGHT: AI Insights – only on large screens */}
        <div className="hidden lg:block lg:col-span-1">
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
