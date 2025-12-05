import React, { useState, useMemo } from "react";
import { ShellLayout, MetricTile, SummaryTile } from "@/components/layout";

type EmailCaptureSummary = {
  storeGroupName: string;
  periodLabel: string;
  totalNewEmails: number;
  uniqueCustomers: number;
  stores: number;
};

type EmailCaptureWeekRow = {
  weekLabel: string;
  newEmails: number;
  atCounter: number;
  viaWeb: number;
};

const emailSummary: EmailCaptureSummary = {
  storeGroupName: "All Stores",
  periodLabel: "Last 8 weeks",
  totalNewEmails: 228,
  uniqueCustomers: 210,
  stores: 3,
};

const emailWeeks: EmailCaptureWeekRow[] = [
  { weekLabel: "2024-W40", newEmails: 22, atCounter: 16, viaWeb: 6 },
  { weekLabel: "2024-W41", newEmails: 28, atCounter: 20, viaWeb: 8 },
  { weekLabel: "2024-W42", newEmails: 31, atCounter: 21, viaWeb: 10 },
  { weekLabel: "2024-W43", newEmails: 26, atCounter: 18, viaWeb: 8 },
  { weekLabel: "2024-W44", newEmails: 34, atCounter: 24, viaWeb: 10 },
  { weekLabel: "2024-W45", newEmails: 37, atCounter: 26, viaWeb: 11 },
  { weekLabel: "2024-W46", newEmails: 24, atCounter: 18, viaWeb: 6 },
  { weekLabel: "2024-W47", newEmails: 26, atCounter: 19, viaWeb: 7 },
];

const ValidEmailCapturePage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Email capture is trending upward over the last 8 weeks.",
    "Most emails are still captured at the counter; web and QR capture are secondary but growing.",
    "One or two weeks show dips; these might line up with staffing changes or POS prompts being disabled.",
  ]);

  const maxWeekEmails = useMemo(
    () => Math.max(...emailWeeks.map((w) => w.newEmails), 1),
    []
  );

  const avgPerWeek = useMemo(
    () => emailSummary.totalNewEmails / emailWeeks.length,
    []
  );

  const regenerateInsights = () => {
    const bestWeek = emailWeeks.reduce((best, w) =>
      !best || w.newEmails > best.newEmails ? w : best
    );

    setInsights([
      `Average capture is about ${avgPerWeek.toFixed(
        1
      )} new valid emails per week.`,
      `${bestWeek.weekLabel} was the strongest week with ${bestWeek.newEmails} new emails.`,
      "Scaling this across all stores would significantly grow journey + campaign reach over a full year.",
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Valid Email Capture" },
      ]}
      rightInfo={
        <>
          <span>
            Store group:{" "}
            <span className="font-medium">{emailSummary.storeGroupName}</span>
          </span>
          <span>
            Period:{" "}
            <span className="font-medium">{emailSummary.periodLabel}</span>
          </span>
        </>
      }
    >
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Valid Email Capture
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            New valid emails captured over time – at the counter and via web /
            landing pages.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <SummaryTile
            label="New valid emails"
            value={emailSummary.totalNewEmails.toString()}
          />
          <SummaryTile
            label="Unique customers"
            value={emailSummary.uniqueCustomers.toString()}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile
          label="Avg per week"
          value={avgPerWeek.toFixed(1)}
          helper="New emails"
        />
        <MetricTile
          label="Stores (demo)"
          value={emailSummary.stores.toString()}
        />
        <MetricTile
          label="Main capture source"
          value="Counter"
          helper="POS prompts"
        />
        <MetricTile
          label="Secondary source"
          value="Web / QR"
          helper="Landing pages"
        />
        <MetricTile
          label="Potential per year"
          value="~1,200+"
          helper="If trend holds"
        />
      </div>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-2">
        {/* Weekly bar list */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between gap-2 mb-2">
            <h2 className="text-sm font-semibold text-slate-800">
              New emails by week
            </h2>
            <span className="text-[11px] text-slate-400">
              Counter vs web capture
            </span>
          </div>
          <div className="space-y-2">
            {emailWeeks.map((w) => (
              <div key={w.weekLabel} className="space-y-1">
                <div className="flex justify-between text-[11px] text-slate-600">
                  <span>{w.weekLabel}</span>
                  <span>{w.newEmails} new emails</span>
                </div>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{
                          width: `${(w.atCounter / maxWeekEmails) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 w-16 text-right">
                      Counter
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-sky-500"
                        style={{
                          width: `${(w.viaWeb / maxWeekEmails) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-400 w-16 text-right">
                      Web / QR
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
            {insights.map((line, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            In the full app, this panel will call Lovable/OpenAI with live capture
            stats to suggest coaching, contests or prompts for advisors.
          </p>
        </div>
      </section>
    </ShellLayout>
  );
};

export default ValidEmailCapturePage;
