import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";

type PosLapseRow = {
  storeName: string;
  lastPosDate: string;
  daysSince: number;
};

const posLapseRows: PosLapseRow[] = [
  { storeName: "Vallejo, CA", lastPosDate: "2024-12-05", daysSince: 1 },
  { storeName: "Napa, CA", lastPosDate: "2024-12-05", daysSince: 1 },
  { storeName: "Fairfield, CA", lastPosDate: "2024-12-02", daysSince: 4 },
  { storeName: "Vacaville, CA", lastPosDate: "2024-11-27", daysSince: 9 },
];

const PosDataLapsePage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Most stores are sending POS data within the last 1–2 days.",
    "A small number of locations are approaching or exceeding the 7-day lapse threshold.",
    "Data lapses can cause under-reporting in all other reports, so they should be handled quickly.",
  ]);

  const maxDays = useMemo(
    () => Math.max(...posLapseRows.map((r) => r.daysSince), 1),
    []
  );

  const regenerateInsights = () => {
    const worst = posLapseRows.reduce((worst, r) =>
      !worst || r.daysSince > worst.daysSince ? r : worst
    );
    setInsights([
      `"${worst.storeName}" has the oldest POS file (${worst.daysSince} days since last data).`,
      "Investigate POS export / SFTP connectivity for any stores over 3 days.",
      "Use this report in weekly ops huddles to confirm the data foundation before reviewing marketing results.",
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "POS Data Lapses" },
      ]}
      rightInfo={
        <>
          <span>
            Stores:{" "}
            <span className="font-medium">
              {posLapseRows.length.toString()}
            </span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            POS Data Lapses
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Monitor the freshness of POS files by store so reporting and
            journeys stay accurate.
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* Summary tiles */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <MetricTile label="Total stores" value="4" />
            <MetricTile label="0–2 days" value="2" />
            <MetricTile label="3–7 days" value="1" />
            <MetricTile label="> 7 days" value="1" />
          </div>

          {/* AI Insights – stacked here on small/medium screens */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on POS file freshness"
              bullets={insights}
              onRefresh={regenerateInsights}
            />
          </div>

          {/* Bars by store */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-900">
                Days since last POS file
              </h2>
              <span className="text-[11px] text-slate-500">
                Threshold: 3 days (warning), 7 days (critical)
              </span>
            </div>
            <div className="space-y-2 text-xs text-slate-700">
              {posLapseRows.map((r) => (
                <div key={r.storeName}>
                  <div className="flex justify-between text-[11px]">
                    <span>{r.storeName}</span>
                    <span>{r.daysSince} days</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500"
                        style={{
                          width: `${(r.daysSince / maxDays) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-[10px] text-slate-500 w-32 text-right">
                      Last file {r.lastPosDate}
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
                Last POS date by store
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Store</th>
                    <th className="py-2 pr-3">Last POS date</th>
                    <th className="py-2 pr-3 text-right">Days since</th>
                  </tr>
                </thead>
                <tbody>
                  {posLapseRows.map((r) => (
                    <tr key={r.storeName} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-800">
                        {r.storeName}
                      </td>
                      <td className="py-2 pr-3 text-slate-700">
                        {r.lastPosDate}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {r.daysSince}
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
            subtitle="Based on POS file freshness"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default PosDataLapsePage;
