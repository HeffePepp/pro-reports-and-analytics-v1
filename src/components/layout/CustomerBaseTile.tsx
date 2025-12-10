import React, { useState } from "react";

type StoreRow = {
  store: string;
  customers: number;
  vehicles: number;
  emailCapturePct: number;
};

const STORES: StoreRow[] = [
  { store: "Vallejo, CA", customers: 5200, vehicles: 7000, emailCapturePct: 79.0 },
  { store: "Napa, CA", customers: 4200, vehicles: 5600, emailCapturePct: 81.0 },
  { store: "Fairfield, CA", customers: 3100, vehicles: 4080, emailCapturePct: 74.0 },
  { store: "Vacaville, CA", customers: 4000, vehicles: 5420, emailCapturePct: 80.0 },
];

type Tab = "overview" | "details";

const getEmailCaptureColorClass = (pct: number): string => {
  if (pct >= 80) return "text-emerald-600";
  if (pct >= 75) return "text-sky-600";
  return "text-slate-800";
};

export const CustomerBaseTile: React.FC = () => {
  const [tab, setTab] = useState<Tab>("overview");

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header + pill tabs */}
      <header className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900">
            Customer base by store
          </h2>
          <p className="text-[11px] text-slate-500">
            Customers, vehicles and email capture by store – switch tabs for overview vs. details.
          </p>
        </div>

        <div className="inline-flex items-center gap-1 rounded-full bg-slate-100 p-1 text-[11px]">
          {(["overview", "details"] as Tab[]).map((t) => {
            const isActive = t === tab;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`rounded-full px-3 py-1 transition ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm"
                    : "text-slate-600 hover:text-slate-800"
                }`}
              >
                {t === "overview" ? "Overview" : "Details"}
              </button>
            );
          })}
        </div>
      </header>

      {/* OVERVIEW TAB */}
      {tab === "overview" && (
        <div className="mt-4 divide-y divide-slate-100">
          {STORES.map((row) => (
            <div key={row.store} className="py-3 first:pt-0 last:pb-0">
              <div className="flex items-start justify-between gap-4">
                {/* Left: store + basic stats */}
                <div className="min-w-0 flex-1">
                  <div className="truncate text-xs font-semibold text-slate-900">
                    {row.store}
                  </div>
                  <div className="mt-1 text-[11px] text-slate-500">
                    {row.customers.toLocaleString()} customers ·{" "}
                    {row.vehicles.toLocaleString()} vehicles
                  </div>
                </div>

                {/* Right: email capture emphasis */}
                <div className="text-right">
                  <div className="text-[11px] uppercase tracking-wide text-slate-500">
                    Email capture
                  </div>
                  <div
                    className={`text-sm font-semibold ${getEmailCaptureColorClass(
                      row.emailCapturePct
                    )}`}
                  >
                    {row.emailCapturePct.toFixed(1)}%
                  </div>
                  <div className="mt-0.5 text-[11px] text-slate-500">
                    Share of customers with a valid email address.
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DETAILS TAB */}
      {tab === "details" && (
        <div className="mt-4 overflow-x-auto">
          <table className="min-w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
                <th className="py-2 pr-3 text-left font-medium">Store</th>
                <th className="py-2 pr-3 text-right font-medium">Customers</th>
                <th className="py-2 pr-3 text-right font-medium">Vehicles</th>
                <th className="py-2 pl-3 text-right font-medium">
                  Email capture %
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {STORES.map((row) => (
                <tr key={row.store}>
                  <td className="py-3 pr-3 align-middle text-xs text-slate-900">
                    {row.store}
                  </td>
                  <td className="py-3 pr-3 text-right align-middle text-xs text-slate-900">
                    {row.customers.toLocaleString()}
                  </td>
                  <td className="py-3 pr-3 text-right align-middle text-xs text-slate-900">
                    {row.vehicles.toLocaleString()}
                  </td>
                  <td
                    className={`py-3 pl-3 text-right align-middle text-xs font-semibold ${getEmailCaptureColorClass(
                      row.emailCapturePct
                    )}`}
                  >
                    {row.emailCapturePct.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default CustomerBaseTile;
