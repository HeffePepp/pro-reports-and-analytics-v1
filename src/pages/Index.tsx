import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ShellLayout, SummaryTile, DeepLink } from "@/components/layout";

type CategoryId = "all" | "marketing" | "sales" | "customers" | "vendors" | "internal";
type ReportType = "chart" | "table" | "kpi" | "mixed";

interface Category {
  id: Exclude<CategoryId, "all">;
  label: string;
  description: string;
}

interface Report {
  id: string;
  name: string;
  primaryCategory: Exclude<CategoryId, "all">;
  secondaryCategories?: Exclude<CategoryId, "all">[];
  type: ReportType;
  purpose: string;
  previewMetric?: string;
}

const CATEGORIES: Category[] = [
  { id: "marketing", label: "Marketing", description: "Journeys, campaigns, ROAS & offers" },
  { id: "sales", label: "Sales", description: "Tickets, oil mix, products & revenue" },
  { id: "customers", label: "Customers", description: "Retention, data quality & value" },
  { id: "vendors", label: "Vendors", description: "Vendor & distributor performance" },
  { id: "internal", label: "Internal", description: "Billing, data health & configuration" },
];

const REPORTS: Report[] = [
  // --- Marketing ---
  {
    id: "customer-journey",
    name: "Customer Journey",
    primaryCategory: "marketing",
    type: "mixed",
    purpose: "Step-by-step performance of the lifecycle journey (thank-you, SS, reminders, reactivation).",
    previewMetric: "Journey ROAS 12.4x · 64% of car count",
  },
  {
    id: "one-off-campaign-tracker",
    name: "One-Off Campaign Tracker",
    primaryCategory: "marketing",
    type: "mixed",
    purpose: "Compare one-off campaigns on ROAS, vehicles, coupons & clicks.",
    previewMetric: "8 campaigns · Avg ROAS 9.7x",
  },
  {
    id: "suggested-services",
    name: "Suggested Services",
    primaryCategory: "marketing",
    secondaryCategories: ["sales"],
    type: "mixed",
    purpose: "Track how educational Suggested Services convert into upsell revenue.",
    previewMetric: "SS acceptance 23% · $18.4k SS rev",
  },
  {
    id: "roas",
    name: "ROAS (Return on Ad Spend)",
    primaryCategory: "marketing",
    type: "mixed",
    purpose: "Evaluate campaigns and channels on spend, response, revenue and ROAS.",
    previewMetric: "Overall ROAS 14.8x",
  },

  // --- Sales / Vendors ---
  {
    id: "coupon-discount-analysis",
    name: "Coupon / Discount Analysis",
    primaryCategory: "sales",
    type: "mixed",
    purpose: "See which offers drive profitable visits and where discounting erodes margin.",
    previewMetric: "Discount rate 12.3% of revenue",
  },
  {
    id: "oil-type-sales",
    name: "Oil Type Sales",
    primaryCategory: "sales",
    secondaryCategories: ["vendors"],
    type: "chart",
    purpose: "Volume and revenue mix across conventional, synthetic and high mileage oils.",
    previewMetric: "Synthetic share 69% units · 83% revenue",
  },
  {
    id: "product-sales",
    name: "Product Sales",
    primaryCategory: "vendors",
    secondaryCategories: ["sales"],
    type: "chart",
    purpose: "Monthly revenue and invoices by vendor/product group (e.g., Royal Purple, house brand).",
    previewMetric: "Royal Purple 32% of oil revenue",
  },
  {
    id: "oil-type-invoices",
    name: "Oil Type – Invoices",
    primaryCategory: "vendors",
    secondaryCategories: ["sales"],
    type: "table",
    purpose: "Invoice-level detail for oil and vendor products, including coupons and operations.",
    previewMetric: "View 248 invoices with vendor oils",
  },

  // --- Customers ---
  {
    id: "service-intervals",
    name: "Service Intervals",
    primaryCategory: "customers",
    type: "chart",
    purpose: "Retention snapshot: current, at-risk and lost customers by time since last visit.",
    previewMetric: "71% current · 14% at-risk · 15% lost",
  },
  {
    id: "customer-data",
    name: "Customer Data",
    primaryCategory: "customers",
    type: "table",
    purpose: "Customer/vehicle roster with visits, lifetime value and contactability.",
    previewMetric: "4,582 active customers",
  },
  {
    id: "data-capture-ltv",
    name: "Data Capture + Life Time Value",
    primaryCategory: "customers",
    secondaryCategories: ["internal"],
    type: "chart",
    purpose: "Show how mail/email capture impacts revenue and ticket averages.",
    previewMetric: "Multi-channel +$56 per visit vs blank",
  },
  {
    id: "valid-address",
    name: "Valid Address Report",
    primaryCategory: "customers",
    secondaryCategories: ["internal"],
    type: "kpi",
    purpose: "Mail & email reachability by store: valid, bad & blank records.",
    previewMetric: "Mail reach 86% · Email reach 74%",
  },

  // --- Internal / Data health ---
  {
    id: "valid-email-capture",
    name: "Valid Email Capture",
    primaryCategory: "internal",
    secondaryCategories: ["customers"],
    type: "chart",
    purpose: "New valid emails captured by store, tech and week.",
    previewMetric: "228 new valid emails last 7 days",
  },
  {
    id: "call-back-report",
    name: "Call Back Report",
    primaryCategory: "customers",
    type: "table",
    purpose: "Operational queue of customers needing follow-up calls.",
    previewMetric: "34 callbacks queued",
  },
  {
    id: "billing-campaign-tracking",
    name: "Billing – Campaign Tracking",
    primaryCategory: "internal",
    secondaryCategories: ["marketing"],
    type: "table",
    purpose: "Tie billing lines to campaigns, spend and ROAS.",
    previewMetric: "Last month: $42k billed · ROAS 11.3x",
  },
  {
    id: "active-locations",
    name: "Active Locations",
    primaryCategory: "internal",
    type: "kpi",
    purpose: "Directory of live, paused and launching stores with contact details.",
    previewMetric: "28 active · 2 launching",
  },
  {
    id: "cost-projections",
    name: "Cost Projections (Journey)",
    primaryCategory: "internal",
    secondaryCategories: ["marketing"],
    type: "chart",
    purpose: "Forecast journey step costs and expected response/ROAS.",
    previewMetric: "Projected monthly cost $12.8k",
  },
  {
    id: "comprehensive-account-audit",
    name: "Comprehensive Account Audit",
    primaryCategory: "internal",
    type: "table",
    purpose: "Config snapshot: intervals, rules, branding and data flags per account.",
    previewMetric: "Audit score 92/100",
  },
  {
    id: "pos-data-lapse",
    name: "POS Data Lapse",
    primaryCategory: "internal",
    type: "kpi",
    purpose: "Monitor POS feed gaps by store, with days without data and vendor contacts.",
    previewMetric: "3 stores with >3 days lapse",
  },
];

const typeLabel: Record<ReportType, string> = {
  chart: "Chart",
  table: "Table",
  kpi: "KPI",
  mixed: "Charts & table",
};

const categoryColors: Record<Exclude<CategoryId, "all">, string> = {
  marketing: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  sales: "bg-sky-50 text-sky-700 ring-sky-100",
  customers: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  vendors: "bg-amber-50 text-amber-700 ring-amber-100",
  internal: "bg-rose-50 text-rose-700 ring-rose-100",
};

const DEEP_LINK_MAP: Record<string, { to: string; label: string }> = {
  "service-intervals": { to: "/reports/service-intervals", label: "Open Service Intervals" },
  "customer-journey": { to: "/reports/customer-journey", label: "Open Customer Journey" },
  "oil-type-sales": { to: "/reports/oil-type-sales", label: "Open Oil Type Sales" },
  "data-capture-ltv": { to: "/reports/data-capture-ltv", label: "Open Data Capture + LTV" },
  "customer-data": { to: "/reports/customer-data", label: "Open Customer Data" },
  "valid-address": { to: "/reports/valid-address", label: "Open Valid Address" },
  "product-sales": { to: "/reports/product-sales", label: "Open Product Sales" },
  "pos-data-lapse": { to: "/reports/pos-data-lapse", label: "Open POS Data Lapse" },
};

const Index: React.FC = () => {
  const [categoryFilter, setCategoryFilter] = useState<CategoryId>("all");
  const [search, setSearch] = useState("");
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  const selectedReport = useMemo(
    () => REPORTS.find((r) => r.id === selectedReportId) ?? null,
    [selectedReportId]
  );

  const filteredReports = useMemo(() => {
    return REPORTS.filter((report) => {
      if (categoryFilter !== "all") {
        const cats = [report.primaryCategory, ...(report.secondaryCategories ?? [])];
        if (!cats.includes(categoryFilter)) return false;
      }
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        report.name.toLowerCase().includes(q) ||
        report.purpose.toLowerCase().includes(q)
      );
    });
  }, [categoryFilter, search]);

  const totalsByCategory = useMemo(() => {
    const counts: Record<Exclude<CategoryId, "all">, number> = {
      marketing: 0,
      sales: 0,
      customers: 0,
      vendors: 0,
      internal: 0,
    };
    REPORTS.forEach((r) => {
      counts[r.primaryCategory] += 1;
    });
    return counts;
  }, []);

  const totalReports = REPORTS.length;

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights" },
      ]}
      rightInfo={
        <>
          <button className="hidden md:inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
            Export
          </button>
          <button className="inline-flex items-center gap-1 rounded-full bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-700">
            + New Report (future)
          </button>
        </>
      }
    >
      {/* Title + description */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Reports & Analytics
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Insights, segments and performance analytics for the entire Throttle Pro stack.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <SummaryTile label="Total reports" value={totalReports.toString()} />
          <SummaryTile
            label="Customer-focused"
            value={totalsByCategory.customers.toString()}
          />
          <SummaryTile
            label="Marketing & Sales"
            value={(totalsByCategory.marketing + totalsByCategory.sales).toString()}
          />
        </div>
      </div>

      {/* Category filter + search */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mt-2">
        <div className="flex flex-wrap gap-2 text-xs">
          {[
            { id: "all" as CategoryId, label: "All" },
            ...CATEGORIES.map((c) => ({ id: c.id as CategoryId, label: c.label })),
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 rounded-full border text-xs transition ${
                categoryFilter === cat.id
                  ? "border-sky-500 bg-sky-50 text-sky-700"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-64">
          <input
            type="text"
            placeholder="Search reports…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-slate-200 bg-white px-3 py-2 pl-8 text-xs text-slate-700 shadow-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          />
          <span className="absolute inset-y-0 left-2 flex items-center text-slate-400 text-xs">
            🔍
          </span>
        </div>
      </div>

      {/* Main area: cards + preview */}
      <div className="flex flex-col md:flex-row mt-3 gap-4">
        {/* Cards */}
        <section className="flex-1 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredReports.map((report) => {
            const primaryCat = report.primaryCategory;
            const catStyle = categoryColors[primaryCat];
            const catLabel =
              CATEGORIES.find((c) => c.id === primaryCat)?.label ?? primaryCat;
            const deepLink = DEEP_LINK_MAP[report.id];

            return (
              <div
                key={report.id}
                className="text-left rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col p-4 gap-3"
                onClick={() => setSelectedReportId(report.id)}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${catStyle}`}
                  >
                    {catLabel}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {typeLabel[report.type]}
                  </span>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    {report.name}
                  </h2>
                  <p className="mt-1 text-xs text-slate-500 line-clamp-3">
                    {report.purpose}
                  </p>
                </div>
                {report.previewMetric && (
                  <div className="mt-auto pt-2 text-[11px] text-slate-500 border-t border-dashed border-slate-100">
                    {report.previewMetric}
                  </div>
                )}

                {/* Deep-dive links */}
                {deepLink && (
                  <DeepLink to={deepLink.to} label={deepLink.label} />
                )}
              </div>
            );
          })}

          {filteredReports.length === 0 && (
            <p className="text-xs text-slate-400">No reports match your filters yet.</p>
          )}
        </section>

        {/* Preview pane */}
        <aside className="hidden lg:block w-80 border-l border-slate-200 bg-white/70 backdrop-blur-sm rounded-l-3xl">
          <div className="h-full flex flex-col">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
                Report Preview
              </h3>
              {selectedReport && (
                <span className="text-[11px] text-slate-400">
                  {typeLabel[selectedReport.type]}
                </span>
              )}
            </div>
            <div className="flex-1 px-4 py-4 text-xs text-slate-600 space-y-3">
              {!selectedReport && (
                <p className="text-slate-400 text-xs">
                  Select a report card to see its description and where it fits
                  in the Throttle Pro reporting stack.
                </p>
              )}
              {selectedReport && (
                <>
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      Name
                    </p>
                    <p className="text-sm font-semibold text-slate-900">
                      {selectedReport.name}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      Primary category
                    </p>
                    <p className="text-xs">
                      {
                        CATEGORIES.find(
                          (c) => c.id === selectedReport.primaryCategory
                        )?.label
                      }
                    </p>
                  </div>
                  {selectedReport.secondaryCategories &&
                    selectedReport.secondaryCategories.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-[11px] uppercase tracking-wide text-slate-400">
                          Also appears under
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {selectedReport.secondaryCategories.map((c) => (
                            <span
                              key={c}
                              className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600"
                            >
                              {CATEGORIES.find((cat) => cat.id === c)?.label ?? c}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  <div className="space-y-1">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      Purpose
                    </p>
                    <p className="text-xs leading-relaxed">
                      {selectedReport.purpose}
                    </p>
                  </div>
                  {selectedReport.previewMetric && (
                    <div className="space-y-1">
                      <p className="text-[11px] uppercase tracking-wide text-slate-400">
                        Example metrics (dummy)
                      </p>
                      <p className="text-xs text-slate-700">
                        {selectedReport.previewMetric}
                      </p>
                    </div>
                  )}
                  <div className="pt-2 mt-2 border-t border-dashed border-slate-200 space-y-1">
                    <p className="text-[11px] uppercase tracking-wide text-slate-400">
                      Next step
                    </p>
                    <p className="text-xs text-slate-600">
                      In the full Throttle Pro app, this report opens into a
                      dedicated screen with hero tiles, charts, tables and AI
                      insights. For the prototype, this panel helps leadership
                      see how reports are organized by category.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </aside>
      </div>
    </ShellLayout>
  );
};

export default Index;
