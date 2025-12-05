import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

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
  badge?: string;
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
    purpose: "Step-by-step performance of the full lifecycle journey (thank-you, SS, reminders, reactivation).",
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
    purpose: "Track how educational SS messages convert into upsell services and revenue.",
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

  // --- Sales ---
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
    purpose: "Volume and revenue mix across conventional, synthetic, and high mileage oils.",
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
  {
    id: "valid-email-capture",
    name: "Valid Email Capture",
    primaryCategory: "customers",
    secondaryCategories: ["internal"],
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

  // --- Internal ---
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
    id: "pos-data-lapse",
    name: "POS Data Lapse",
    primaryCategory: "internal",
    type: "kpi",
    purpose: "Monitor POS feed gaps by store, with days without data and vendor contacts.",
    previewMetric: "3 stores with >3 days lapse",
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
];

const typeLabel: Record<ReportType, string> = {
  chart: "Chart",
  table: "Table",
  kpi: "KPI",
  mixed: "Charts & table",
};

const REPORT_SUMMARIES: Record<string, string> = {
  "service-intervals": "71% current · 14% at-risk · 15% lost",
  "oil-type-sales": "Synthetic share 69% units · 83% revenue",
  "data-capture-ltv": "Multi-channel +$56 per visit vs blank",
  "customer-journey": "Journey ROAS 12.4x · 64% of car count",
  "one-off-campaign-tracker": "8 campaigns · Avg ROAS 9.7x",
  "suggested-services": "SS acceptance 23% · $18.4k SS rev",
  "roas": "Overall ROAS 14.8x",
  "coupon-discount-analysis": "Discount rate 12.3% of revenue",
  "product-sales": "Royal Purple 32% of oil revenue",
  "oil-type-invoices": "View 248 invoices with vendor oils",
  "customer-data": "4,582 active customers",
  "valid-address": "Mail reach 86% · Email reach 74%",
  "valid-email-capture": "228 new valid emails last 7 days",
  "call-back-report": "34 callbacks queued",
  "billing-campaign-tracking": "Last month: $42k billed · ROAS 11.3x",
  "active-locations": "28 active · 2 launching",
  "pos-data-lapse": "3 stores with >3 days lapse",
  "cost-projections": "Projected monthly cost $12.8k",
  "comprehensive-account-audit": "Audit score 92/100",
};

const categoryColors: Record<Exclude<CategoryId, "all">, string> = {
  marketing: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  sales: "bg-sky-50 text-sky-700 ring-sky-100",
  customers: "bg-indigo-50 text-indigo-700 ring-indigo-100",
  vendors: "bg-amber-50 text-amber-700 ring-amber-100",
  internal: "bg-rose-50 text-rose-700 ring-rose-100",
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
      (r.secondaryCategories ?? []).forEach((c) => {
        counts[c] += 0; // we only count primary for simplicity
      });
    });
    return counts;
  }, []);

  const totalReports = REPORTS.length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-slate-900 text-slate-100">
        <div className="flex items-center gap-2 px-5 h-14 border-b border-slate-800">
          <div className="h-8 w-8 rounded-xl bg-emerald-400 flex items-center justify-center font-bold text-slate-900">
            TP
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Throttle Pro</span>
            <span className="text-[11px] text-slate-400">Reporting Prototype</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 text-sm space-y-1">
          {["Dashboard", "Customers", "Campaigns", "Reports & Insights", "Organizations", "Settings"].map(
            (item) => (
              <button
                key={item}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 ${
                  item === "Reports & Insights" ? "bg-slate-800 font-medium" : "text-slate-300"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                <span>{item}</span>
              </button>
            )
          )}
        </nav>
        <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-400">
          Signed in as<br />
          <span className="text-slate-200">demo@throttlepro.com</span>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-400">Home /</span>
            <span className="text-sm font-medium text-slate-700">Reports & Insights</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden md:inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-50">
              <span>Export</span>
            </button>
            <button className="inline-flex items-center gap-1 rounded-full bg-sky-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-sky-700">
              <span>+ New Report (future)</span>
            </button>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 flex flex-col md:flex-row">
            {/* Main list */}
            <section className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
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
                  <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                    <div className="text-slate-400">Total reports</div>
                    <div className="mt-0.5 text-base font-semibold">{totalReports}</div>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm hidden sm:block">
                    <div className="text-slate-400">Customer-focused</div>
                    <div className="mt-0.5 text-base font-semibold">
                      {totalsByCategory.customers}
                    </div>
                  </div>
                  <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm hidden sm:block">
                    <div className="text-slate-400">Marketing & Sales</div>
                    <div className="mt-0.5 text-base font-semibold">
                      {totalsByCategory.marketing + totalsByCategory.sales}
                    </div>
                  </div>
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

              {/* Available reports grid */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredReports.map((report) => {
                  const primaryCat = report.primaryCategory;
                  const catStyle = categoryColors[primaryCat];
                  const catLabel =
                    CATEGORIES.find((c) => c.id === primaryCat)?.label ?? primaryCat;
                  const isServiceIntervals = report.id === "service-intervals";
                  const isCustomerJourney = report.id === "customer-journey";
                  const isOilTypeSales = report.id === "oil-type-sales";
                  const isDataCaptureLtv = report.id === "data-capture-ltv";
                  const isCustomerData = report.id === "customer-data";
                  const isValidAddress = report.id === "valid-address";
                  const isProductSales = report.id === "product-sales";
                  const isPosDataLapse = report.id === "pos-data-lapse";
                  const previewMetric = REPORT_SUMMARIES[report.id] ?? report.previewMetric;

                  return (
                    <div
                      key={report.id}
                      className="text-left rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col p-4 gap-3 cursor-pointer"
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
                      {previewMetric && (
                        <div className="mt-auto pt-2 text-[11px] text-slate-500 border-t border-dashed border-slate-100">
                          {previewMetric}
                        </div>
                      )}
                      {isServiceIntervals && (
                        <div className="pt-2 mt-1">
                          <Link
                            to="/reports/service-intervals"
                            className="inline-flex items-center text-[11px] font-medium text-sky-600 hover:text-sky-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open Service Intervals →
                          </Link>
                        </div>
                      )}
                      {isCustomerJourney && (
                        <div className="pt-2 mt-1">
                          <Link
                            to="/reports/customer-journey"
                            className="inline-flex items-center text-[11px] font-medium text-sky-600 hover:text-sky-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open Customer Journey →
                          </Link>
                        </div>
                      )}
                      {isOilTypeSales && (
                        <div className="pt-2 mt-1">
                          <Link
                            to="/reports/oil-type-sales"
                            className="inline-flex items-center text-[11px] font-medium text-sky-600 hover:text-sky-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open Oil Type Sales →
                          </Link>
                        </div>
                      )}
                      {isDataCaptureLtv && (
                        <div className="pt-2 mt-1">
                          <Link
                            to="/reports/data-capture-ltv"
                            className="inline-flex items-center text-[11px] font-medium text-sky-600 hover:text-sky-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open Data Capture LTV →
                          </Link>
                        </div>
                      )}
                      {isCustomerData && (
                        <div className="pt-2 mt-1">
                          <Link
                            to="/reports/customer-data"
                            className="inline-flex items-center text-[11px] font-medium text-sky-600 hover:text-sky-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open Customer Data →
                          </Link>
                        </div>
                      )}
                      {isValidAddress && (
                        <div className="pt-2 mt-1">
                          <Link
                            to="/reports/valid-address"
                            className="inline-flex items-center text-[11px] font-medium text-sky-600 hover:text-sky-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open Valid Address →
                          </Link>
                        </div>
                      )}
                      {isProductSales && (
                        <div className="pt-2 mt-1">
                          <Link
                            to="/reports/product-sales"
                            className="inline-flex items-center text-[11px] font-medium text-sky-600 hover:text-sky-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open Product Sales →
                          </Link>
                        </div>
                      )}
                      {isPosDataLapse && (
                        <div className="pt-2 mt-1">
                          <Link
                            to="/reports/pos-data-lapse"
                            className="inline-flex items-center text-[11px] font-medium text-sky-600 hover:text-sky-700"
                            onClick={(e) => e.stopPropagation()}
                          >
                            Open POS Data Lapse →
                          </Link>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {filteredReports.length === 0 && (
                <p className="text-xs text-slate-400 mt-4">
                  No reports match your filters yet.
                </p>
              )}
            </section>

            {/* Right-hand preview pane */}
            <aside className="hidden lg:block w-80 border-l border-slate-200 bg-white/70 backdrop-blur-sm">
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
                                  {
                                    CATEGORIES.find((cat) => cat.id === c)?.label ??
                                    c
                                  }
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
        </main>
      </div>
    </div>
  );
};

export default Index;
