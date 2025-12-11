import React, { useState } from "react";
import { ShellLayout, SummaryTile, MetricTile, AIInsightsTile, KpiCustomizeButton } from "@/components/layout";
import { useKpiPreferences, KpiOption } from "@/hooks/useKpiPreferences";

type AuditSummary = {
  accountName: string;
  score: number;
  totalChecks: number;
  passedChecks: number;
  warningChecks: number;
  failedChecks: number;
};

type AuditRow = {
  area: string;
  check: string;
  status: "Pass" | "Warning" | "Fail";
  notes: string;
};

const auditSummary: AuditSummary = {
  accountName: "North Bay Group",
  score: 92,
  totalChecks: 24,
  passedChecks: 19,
  warningChecks: 4,
  failedChecks: 1,
};

const auditRows: AuditRow[] = [
  {
    area: "Intervals",
    check: "Oil interval aligned to store policy",
    status: "Pass",
    notes: "5,000 miles or 6 months for conventional, 7,500 for synthetic.",
  },
  {
    area: "Data",
    check: "POS data ingested in last 48 hours",
    status: "Pass",
    notes: "All stores current.",
  },
  {
    area: "Branding",
    check: "Logo and color scheme configured",
    status: "Pass",
    notes: "Custom template live.",
  },
  {
    area: "Journeys",
    check: "Reactivation step configured for 12+ months",
    status: "Warning",
    notes: "Enabled, but targeting rules are broad.",
  },
  {
    area: "Journeys",
    check: "Multi-channel reminders (postcard + email + SMS)",
    status: "Pass",
    notes: "Standard Throttle configuration.",
  },
  {
    area: "Compliance",
    check: "SMS consent settings configured",
    status: "Warning",
    notes: "Consent texts present; recommend periodic review.",
  },
  {
    area: "Billing",
    check: "Account has current billing info",
    status: "Pass",
    notes: "Card on file valid.",
  },
  {
    area: "Data",
    check: "Bad address rate < 10%",
    status: "Fail",
    notes: "Currently ~13%; recommend address cleanup.",
  },
];

const KPI_OPTIONS: KpiOption[] = [
  { id: "checksPassed", label: "Checks passed" },
  { id: "warnings", label: "Warnings" },
  { id: "failures", label: "Failures" },
  { id: "totalChecks", label: "Total checks" },
  { id: "priorityArea", label: "Priority area" },
];

const ComprehensiveAccountAuditPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Overall audit score is strong at 92/100.",
    "The main area of risk is data quality (bad addresses above 10%).",
    "Journeys and compliance are mostly solid but have a few improvement opportunities.",
  ]);

  const { selectedIds, setSelectedIds } = useKpiPreferences("comprehensive-account-audit", KPI_OPTIONS);

  const renderKpiTile = (id: string) => {
    switch (id) {
      case "checksPassed": return <MetricTile key={id} label="Checks passed" value={auditSummary.passedChecks.toString()} helpText="Number of audit checks that passed without issues." />;
      case "warnings": return <MetricTile key={id} label="Warnings" value={auditSummary.warningChecks.toString()} helpText="Number of audit checks that need attention but aren't critical." />;
      case "failures": return <MetricTile key={id} label="Failures" value={auditSummary.failedChecks.toString()} helpText="Number of audit checks that failed and require immediate action." />;
      case "totalChecks": return <MetricTile key={id} label="Total checks" value={auditSummary.totalChecks.toString()} helpText="Total number of audit checks performed on the account." />;
      case "priorityArea": return <MetricTile key={id} label="Priority area" value="Data quality" helper="Bad address rate high" helpText="The area requiring the most attention based on audit findings." />;
      default: return null;
    }
  };

  const regenerateInsights = () => {
    setInsights([
      `This account passed ${auditSummary.passedChecks} of ${auditSummary.totalChecks} checks, with ${auditSummary.warningChecks} warning(s) and ${auditSummary.failedChecks} failure(s).`,
      "Prioritize data quality and compliance warnings first, since those affect deliverability and risk.",
      "Use this report in quarterly business reviews with owners and larger groups.",
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Comprehensive Account Audit" },
      ]}
      rightInfo={
        <>
          <span>
            Account:{" "}
            <span className="font-medium">{auditSummary.accountName}</span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Comprehensive Account Audit
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Configuration, data health and compliance checks for this account.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <SummaryTile
            label="Audit score"
            value={`${auditSummary.score}/100`}
          />
          <KpiCustomizeButton
            reportId="comprehensive-account-audit"
            options={KPI_OPTIONS}
            selectedIds={selectedIds}
            onChangeSelected={setSelectedIds}
          />
        </div>
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
                Audit checks
              </h2>
              <span className="text-[11px] text-slate-500">
                Detailed pass/warn/fail by area
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Area</th>
                    <th className="py-2 pr-3">Check</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {auditRows.map((row, idx) => (
                    <tr key={idx} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-800">{row.area}</td>
                      <td className="py-2 pr-3 text-slate-600">{row.check}</td>
                      <td className="py-2 pr-3 text-slate-600">{row.status}</td>
                      <td className="py-2 pr-3 text-slate-600">{row.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* AI Insights – stacked here on small/medium screens - after main content */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on audit results"
              bullets={insights}
              onRefresh={regenerateInsights}
            />
          </div>
        </div>

        {/* RIGHT: AI Insights – only on large screens */}
        <div className="hidden lg:block lg:col-span-1 self-start">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on audit results"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default ComprehensiveAccountAuditPage;
