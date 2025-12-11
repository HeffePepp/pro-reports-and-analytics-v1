import React, { useState, useMemo } from "react";
import { ShellLayout, MetricTile, AIInsightsTile, KpiCustomizeButton } from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";
import {
  ReportTable,
  ReportTableHead,
  ReportTableBody,
  ReportTableRow,
  ReportTableHeaderCell,
  ReportTableCell,
} from "@/components/ui/report-table";

type OilInvoiceSummary = {
  storeGroupName: string;
  periodLabel: string;
  invoiceCount: number;
  vendorName: string;
  vendorInvoices: number;
  vendorRevenue: number;
};

type OilInvoiceRow = {
  invoiceNumber: string;
  date: string;
  storeName: string;
  customerName: string;
  vehicle: string;
  oilType: string;
  brand: string;
  invoiceTotal: number;
  couponCode?: string;
  discountAmount: number;
};

const oilInvoiceSummary: OilInvoiceSummary = {
  storeGroupName: "All Stores",
  periodLabel: "Last 90 days",
  invoiceCount: 2480,
  vendorName: "Royal Purple",
  vendorInvoices: 462,
  vendorRevenue: 20400,
};

const oilInvoiceRows: OilInvoiceRow[] = [
  {
    invoiceNumber: "A178-12001",
    date: "2024-11-28",
    storeName: "Vallejo, CA",
    customerName: "Jane Smith",
    vehicle: "2018 Toyota Camry",
    oilType: "Full Synthetic",
    brand: "Royal Purple",
    invoiceTotal: 128,
    couponCode: "SYN20",
    discountAmount: 20,
  },
  {
    invoiceNumber: "A178-12002",
    date: "2024-11-28",
    storeName: "Vallejo, CA",
    customerName: "Michael Johnson",
    vehicle: "2016 Ford F-150",
    oilType: "Synthetic Blend",
    brand: "House Brand",
    invoiceTotal: 96,
    couponCode: undefined,
    discountAmount: 0,
  },
  {
    invoiceNumber: "N101-12018",
    date: "2024-11-29",
    storeName: "Napa, CA",
    customerName: "Laura Chen",
    vehicle: "2021 Subaru Outback",
    oilType: "Full Synthetic",
    brand: "Royal Purple",
    invoiceTotal: 132,
    couponCode: "OIL10",
    discountAmount: 13,
  },
  {
    invoiceNumber: "F220-12044",
    date: "2024-11-30",
    storeName: "Fairfield, CA",
    customerName: "Carlos Garcia",
    vehicle: "2012 Honda Civic",
    oilType: "Conventional",
    brand: "House Brand",
    invoiceTotal: 79,
    couponCode: "WINTER5",
    discountAmount: 5,
  },
];

const KPI_OPTIONS: KpiOption[] = [
  { id: "totalInvoices", label: "Total oil invoices" },
  { id: "vendorInvoices", label: "Vendor invoices" },
  { id: "vendorShare", label: "Vendor share" },
  { id: "vendorRevenue", label: "Vendor revenue" },
  { id: "avgTicketVendor", label: "Avg ticket – vendor" },
];

const OilTypeInvoicesPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "You can use this detail view in vendor meetings to show invoice-level examples.",
    "Vendor-branded invoices often include higher-value tickets and may use specific coupons.",
    "Filter this view in the future by store, vendor brand or coupon code to answer ad-hoc questions.",
  ]);

  const vendorInvoicePct = useMemo(
    () => (oilInvoiceSummary.vendorInvoices / oilInvoiceSummary.invoiceCount) * 100,
    []
  );

  const avgTicketVendor = useMemo(
    () => oilInvoiceSummary.vendorInvoices ? oilInvoiceSummary.vendorRevenue / oilInvoiceSummary.vendorInvoices : 0,
    []
  );

  const { selectedIds, setSelectedIds } = useKpiPreferences("oil-type-invoices", KPI_OPTIONS);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "totalInvoices": return <MetricTile key={id} label="Total oil invoices" value={oilInvoiceSummary.invoiceCount.toLocaleString()} helpText="Total number of oil change invoices during the selected period." />;
      case "vendorInvoices": return <MetricTile key={id} label={`${oilInvoiceSummary.vendorName} invoices`} value={oilInvoiceSummary.vendorInvoices.toLocaleString()} helpText={`Number of invoices that included ${oilInvoiceSummary.vendorName} products.`} />;
      case "vendorShare": return <MetricTile key={id} label={`${oilInvoiceSummary.vendorName} share`} value={`${vendorInvoicePct.toFixed(1)}%`} helpText={`Percentage of oil invoices that used ${oilInvoiceSummary.vendorName} products.`} />;
      case "vendorRevenue": return <MetricTile key={id} label="Vendor revenue" value={`$${oilInvoiceSummary.vendorRevenue.toLocaleString()}`} helpText="Total revenue from invoices containing vendor-branded products." />;
      case "avgTicketVendor": return <MetricTile key={id} label="Avg ticket – vendor" value={`$${avgTicketVendor.toFixed(0)}`} helpText="Average invoice value for transactions including vendor products." />;
      default: return null;
    }
  };

  const regenerateInsights = () => {
    setInsights([
      `${oilInvoiceSummary.vendorName} appears on about ${vendorInvoicePct.toFixed(
        1
      )}% of oil invoices in this period.`,
      `Average ticket for invoices including ${oilInvoiceSummary.vendorName} is about $${avgTicketVendor.toFixed(
        0
      )}.`,
      "Use this report to drill from high-level oil mix down to individual tickets and offers used.",
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Oil Type – Invoices" },
      ]}
      rightInfo={
        <>
          <span>
            Group:{" "}
            <span className="font-medium">
              {oilInvoiceSummary.storeGroupName}
            </span>
          </span>
          <span>
            Period:{" "}
            <span className="font-medium">{oilInvoiceSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Oil Type – Invoices
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Invoice-level detail for oil changes, including vendor-brand oils,
            coupons and ticket value.
          </p>
        </div>
        <KpiCustomizeButton
          reportId="oil-type-invoices"
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

          {/* Table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Sample invoices
              </h2>
              <span className="text-[11px] text-slate-500">
                Invoice-level view (dummy data)
              </span>
            </div>
            <div className="overflow-x-auto">
              <ReportTable>
                <ReportTableHead>
                  <ReportTableRow>
                    <ReportTableHeaderCell label="Invoice" />
                    <ReportTableHeaderCell label="Date" />
                    <ReportTableHeaderCell label="Store" />
                    <ReportTableHeaderCell label="Customer" />
                    <ReportTableHeaderCell label="Vehicle" />
                    <ReportTableHeaderCell label="Oil type" />
                    <ReportTableHeaderCell label="Brand" />
                    <ReportTableHeaderCell label="Invoice total" align="right" />
                    <ReportTableHeaderCell label="Coupon" />
                    <ReportTableHeaderCell label="Discount" align="right" />
                  </ReportTableRow>
                </ReportTableHead>
                <ReportTableBody>
                  {oilInvoiceRows.map((row) => (
                    <ReportTableRow key={row.invoiceNumber}>
                      <ReportTableCell className="text-slate-800">{row.invoiceNumber}</ReportTableCell>
                      <ReportTableCell className="text-slate-600">{row.date}</ReportTableCell>
                      <ReportTableCell className="text-slate-600">{row.storeName}</ReportTableCell>
                      <ReportTableCell className="text-slate-600">{row.customerName}</ReportTableCell>
                      <ReportTableCell className="text-slate-600">{row.vehicle}</ReportTableCell>
                      <ReportTableCell className="text-slate-600">{row.oilType}</ReportTableCell>
                      <ReportTableCell className="text-slate-600">{row.brand}</ReportTableCell>
                      <ReportTableCell align="right">${row.invoiceTotal}</ReportTableCell>
                      <ReportTableCell className="text-slate-600">{row.couponCode ?? "–"}</ReportTableCell>
                      <ReportTableCell align="right">${row.discountAmount}</ReportTableCell>
                    </ReportTableRow>
                  ))}
                </ReportTableBody>
              </ReportTable>
            </div>
          </section>

          {/* AI Insights – stacked here on small/medium screens - after main content */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on oil invoice data"
              bullets={insights}
              onRefresh={regenerateInsights}
            />
          </div>
        </div>

        {/* RIGHT: AI Insights – only on large screens */}
        <div className="hidden lg:block lg:col-span-1 self-start">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on oil invoice data"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default OilTypeInvoicesPage;
