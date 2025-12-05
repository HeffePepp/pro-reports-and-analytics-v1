import React, { useState, useMemo } from "react";
import { ShellLayout, SummaryTile } from "@/components/layout";
import MetricTile from "@/components/layout/MetricTile";

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

const OilTypeInvoicesPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "You can use this detail view in vendor meetings to show invoice-level examples.",
    "Vendor-branded invoices often include higher-value tickets and may use specific coupons.",
    "Filter this view in the future by store, vendor brand or coupon code to answer ad-hoc questions.",
  ]);

  const vendorInvoicePct = useMemo(
    () =>
      (oilInvoiceSummary.vendorInvoices / oilInvoiceSummary.invoiceCount) *
      100,
    []
  );

  const avgTicketVendor = useMemo(
    () =>
      oilInvoiceSummary.vendorInvoices
        ? oilInvoiceSummary.vendorRevenue / oilInvoiceSummary.vendorInvoices
        : 0,
    []
  );

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
        <div className="flex gap-3 text-xs">
          <SummaryTile
            label="Total oil invoices"
            value={oilInvoiceSummary.invoiceCount.toString()}
          />
          <SummaryTile
            label={`${oilInvoiceSummary.vendorName} invoices`}
            value={oilInvoiceSummary.vendorInvoices.toString()}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile
          label={`${oilInvoiceSummary.vendorName} share`}
          value={`${vendorInvoicePct.toFixed(1)}%`}
        />
        <MetricTile
          label="Vendor revenue"
          value={`$${oilInvoiceSummary.vendorRevenue.toLocaleString()}`}
        />
        <MetricTile
          label="Avg ticket – vendor"
          value={`$${avgTicketVendor.toFixed(0)}`}
        />
        <MetricTile
          label="Example coupons"
          value="SYN20, OIL10"
          helper="Vendor + house offers"
        />
        <MetricTile
          label="Usage"
          value="Vendor reporting"
          helper="Invoice-level proof"
        />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
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
            In production, this report would support CSV export and filtering by
            vendor brand, coupon or oil type.
          </p>
        </div>

        {/* Quick notes */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4 text-xs text-slate-600 space-y-2">
          <h2 className="text-sm font-semibold text-slate-800">
            How vendors use this
          </h2>
          <ul className="list-disc pl-4 space-y-1">
            <li>Validate that co-op campaigns are driving real tickets.</li>
            <li>Review invoice examples and upsell patterns.</li>
            <li>Spot stores with low vendor penetration for training or promos.</li>
          </ul>
        </div>
      </section>

      {/* Table */}
      <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-slate-800">
            Sample invoices
          </h2>
          <span className="text-[11px] text-slate-400">
            Invoice-level view (dummy data)
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                <th className="py-2 pr-3">Invoice</th>
                <th className="py-2 pr-3">Date</th>
                <th className="py-2 pr-3">Store</th>
                <th className="py-2 pr-3">Customer</th>
                <th className="py-2 pr-3">Vehicle</th>
                <th className="py-2 pr-3">Oil type</th>
                <th className="py-2 pr-3">Brand</th>
                <th className="py-2 pr-3 text-right">Invoice total</th>
                <th className="py-2 pr-3">Coupon</th>
                <th className="py-2 pr-3 text-right">Discount</th>
              </tr>
            </thead>
            <tbody>
              {oilInvoiceRows.map((row) => (
                <tr
                  key={row.invoiceNumber}
                  className="border-t border-slate-100"
                >
                  <td className="py-2 pr-3 text-slate-700">
                    {row.invoiceNumber}
                  </td>
                  <td className="py-2 pr-3 text-slate-600">{row.date}</td>
                  <td className="py-2 pr-3 text-slate-600">
                    {row.storeName}
                  </td>
                  <td className="py-2 pr-3 text-slate-600">
                    {row.customerName}
                  </td>
                  <td className="py-2 pr-3 text-slate-600">{row.vehicle}</td>
                  <td className="py-2 pr-3 text-slate-600">{row.oilType}</td>
                  <td className="py-2 pr-3 text-slate-600">{row.brand}</td>
                  <td className="py-2 pr-3 text-right">
                    ${row.invoiceTotal}
                  </td>
                  <td className="py-2 pr-3 text-slate-600">
                    {row.couponCode ?? "–"}
                  </td>
                  <td className="py-2 pr-3 text-right">
                    ${row.discountAmount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </ShellLayout>
  );
};

export default OilTypeInvoicesPage;
