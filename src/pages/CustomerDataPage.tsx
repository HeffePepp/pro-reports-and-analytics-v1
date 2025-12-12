import React, { useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile, KpiCustomizeButton, CustomerBaseTile, DraggableKpiRow } from "@/components/layout";
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
        return <MetricTile key={id} label="Customers" value={customerDataSummary.customers.toLocaleString()} helpText="Total unique customers in the database across all locations. This count includes both active and inactive customer records." />;
      case "vehicles":
        return <MetricTile key={id} label="Vehicles" value={customerDataSummary.vehicles.toLocaleString()} helpText="Total vehicles associated with customer records. Vehicles are the primary unit for journey targeting and service reminders." />;
      case "vehiclesPerCustomer":
        return <MetricTile key={id} label="Vehicles / customer" value={customerDataSummary.avgVehiclesPerCustomer.toFixed(2)} helpText="Average number of vehicles per customer household. Higher ratios indicate multi-vehicle households with greater lifetime value potential." />;
      case "reachableEmail":
        return <MetricTile key={id} label="Reachable by email" value={`${customerDataSummary.reachableEmailPct.toFixed(0)}%`} helpText="Percentage of customers with a valid email address on file. Email is typically the most cost-effective channel for regular communications." />;
      case "reachableMail":
        return <MetricTile key={id} label="Reachable by mail" value={`${customerDataSummary.reachableMailPct.toFixed(0)}%`} helpText="Percentage of customers with a valid mailing address on file. Mail is essential for postcard-based reminders and high-impact campaigns." />;
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
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs - draggable */}
          {selectedIds.length > 0 && (
            <DraggableKpiRow
              reportKey="customer-data"
              tiles={selectedIds
                .map((id) => {
                  const tile = renderKpiTile(id);
                  return tile ? { id, element: tile } : null;
                })
                .filter(Boolean) as { id: string; element: React.ReactNode }[]}
            />
          )}

          <CustomerBaseTile />

          {/* AI Insights – stacked here on small/medium screens - after main content */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on customer & contactability data"
              bullets={insights}
              onRefresh={regenerateInsights}
            />
          </div>
        </div>

        {/* RIGHT: AI Insights – only on large screens */}
        <div className="hidden lg:block lg:col-span-1 self-start">
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
