import React, { useState } from "react";
import { ShellLayout, SummaryTile, MetricTile, AIInsightsTile } from "@/components/layout";

type ActiveLocationSummary = {
  groupName: string;
  activeCount: number;
  launchingCount: number;
  pausedCount: number;
  suspendedCount: number;
};

type ActiveLocationRow = {
  storeName: string;
  throttleId: string;
  city: string;
  state: string;
  status: "Active" | "Launching" | "Paused" | "Suspended";
  openDate: string;
  lastPosDate: string;
};

const activeLocationSummary: ActiveLocationSummary = {
  groupName: "North Bay Group",
  activeCount: 28,
  launchingCount: 2,
  pausedCount: 1,
  suspendedCount: 0,
};

const activeLocationRows: ActiveLocationRow[] = [
  {
    storeName: "Vallejo, CA",
    throttleId: "S17040",
    city: "Vallejo",
    state: "CA",
    status: "Active",
    openDate: "2019-03-14",
    lastPosDate: "2024-12-04",
  },
  {
    storeName: "Napa, CA",
    throttleId: "S18021",
    city: "Napa",
    state: "CA",
    status: "Active",
    openDate: "2020-06-01",
    lastPosDate: "2024-12-04",
  },
  {
    storeName: "Fairfield, CA",
    throttleId: "S19012",
    city: "Fairfield",
    state: "CA",
    status: "Launching",
    openDate: "2024-12-20",
    lastPosDate: "-",
  },
];

const ActiveLocationsPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Most locations are active with current POS data; only one site is still in launch status.",
    "Use this view as an at-a-glance source of truth for which locations are live in Throttle Pro.",
    "Launching locations should be watched closely for POS connectivity before campaigns go live.",
  ]);

  const totalLocations =
    activeLocationSummary.activeCount +
    activeLocationSummary.launchingCount +
    activeLocationSummary.pausedCount +
    activeLocationSummary.suspendedCount;

  const regenerateInsights = () => {
    setInsights([
      `${activeLocationSummary.activeCount} of ${totalLocations} locations are fully active in Throttle Pro.`,
      `${activeLocationSummary.launchingCount} location(s) are currently in launch; ensure POS data is flowing before enabling all journeys.`,
      "Paused or suspended locations should be excluded from campaigns and billing automatically.",
    ]);
  };

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Active Locations" },
      ]}
      rightInfo={
        <>
          <span>
            Group:{" "}
            <span className="font-medium">
              {activeLocationSummary.groupName}
            </span>
          </span>
        </>
      }
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            Active Locations
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            A source-of-truth roster of which stores are live, launching, paused
            or suspended in Throttle Pro.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <SummaryTile
            label="Total locations"
            value={totalLocations.toString()}
          />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-3">
            <MetricTile
              label="Active"
              value={activeLocationSummary.activeCount.toString()}
            />
            <MetricTile
              label="Launching"
              value={activeLocationSummary.launchingCount.toString()}
            />
            <MetricTile
              label="Paused"
              value={activeLocationSummary.pausedCount.toString()}
            />
            <MetricTile
              label="Suspended"
              value={activeLocationSummary.suspendedCount.toString()}
            />
            <MetricTile
              label="Data freshness"
              value="Good"
              helper="Most stores sending POS data"
            />
          </div>

          {/* AI Insights – stacked here on small/medium screens */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on location status data"
              bullets={insights}
              onRefresh={regenerateInsights}
            />
          </div>

          {/* Table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-sm font-semibold text-slate-900">
                Locations roster
              </h2>
              <span className="text-[11px] text-slate-500">
                Status and POS freshness by store (dummy data)
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Store</th>
                    <th className="py-2 pr-3">Throttle ID</th>
                    <th className="py-2 pr-3">City</th>
                    <th className="py-2 pr-3">State</th>
                    <th className="py-2 pr-3">Status</th>
                    <th className="py-2 pr-3">Open date</th>
                    <th className="py-2 pr-3">Last POS date</th>
                  </tr>
                </thead>
                <tbody>
                  {activeLocationRows.map((row) => (
                    <tr key={row.throttleId} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-800">{row.storeName}</td>
                      <td className="py-2 pr-3 text-slate-600">
                        {row.throttleId}
                      </td>
                      <td className="py-2 pr-3 text-slate-600">{row.city}</td>
                      <td className="py-2 pr-3 text-slate-600">{row.state}</td>
                      <td className="py-2 pr-3 text-slate-600">{row.status}</td>
                      <td className="py-2 pr-3 text-slate-600">{row.openDate}</td>
                      <td className="py-2 pr-3 text-slate-600">
                        {row.lastPosDate}
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
            subtitle="Based on location status data"
            bullets={insights}
            onRefresh={regenerateInsights}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default ActiveLocationsPage;
