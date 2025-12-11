import React, { useMemo, useState } from "react";

type OilTypeId = "conventional" | "synBlend" | "fullSyn" | "highMileage" | "unclassified";

type OilTypeRow = {
  id: OilTypeId;
  label: string;
  invoices: number;
  invoiceSharePct: number;
  revenue: number;
  revenueSharePct: number;
  avgTicket: number;
  pillBg: string;
  pillText: string;
};

const OIL_TYPE_ROWS: OilTypeRow[] = [
  {
    id: "conventional",
    label: "Conventional",
    invoices: 1320,
    invoiceSharePct: 31,
    revenue: 101_200,
    revenueSharePct: 25.8,
    avgTicket: 76,
    pillBg: "bg-sky-50",
    pillText: "text-sky-800",
  },
  {
    id: "highMileage",
    label: "High Mileage",
    invoices: 620,
    invoiceSharePct: 8,
    revenue: 61_200,
    revenueSharePct: 15.6,
    avgTicket: 99,
    pillBg: "bg-amber-50",
    pillText: "text-amber-800",
  },
  {
    id: "synBlend",
    label: "Synthetic Blend",
    invoices: 980,
    invoiceSharePct: 22,
    revenue: 95_600,
    revenueSharePct: 24.4,
    avgTicket: 98,
    pillBg: "bg-indigo-50",
    pillText: "text-indigo-800",
  },
  {
    id: "fullSyn",
    label: "Full Synthetic",
    invoices: 1360,
    invoiceSharePct: 37,
    revenue: 134_400,
    revenueSharePct: 34.3,
    avgTicket: 99,
    pillBg: "bg-emerald-50",
    pillText: "text-emerald-800",
  },
  {
    id: "unclassified",
    label: "Unclassified",
    invoices: 200,
    invoiceSharePct: 2,
    revenue: 10_000,
    revenueSharePct: 0.9,
    avgTicket: 50,
    pillBg: "bg-rose-50",
    pillText: "text-rose-800",
  },
];

type SortKey = "invoices" | "invoiceSharePct" | "revenue" | "revenueSharePct" | "avgTicket";
type SortDir = "asc" | "desc";

const OilTypeRevenueDetailsTable: React.FC = () => {
  const [sortKey, setSortKey] = useState<SortKey>("revenue");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortedRows = useMemo(() => {
    const rows = [...OIL_TYPE_ROWS];
    rows.sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [sortKey, sortDir]);

  const renderHeader = (
    label: string,
    key: SortKey,
    { alignRight = false }: { alignRight?: boolean } = {}
  ) => {
    const isActive = sortKey === key;

    return (
      <th
        key={key}
        className={[
          "py-2 px-3 text-[11px] font-medium uppercase tracking-wide text-slate-500",
          alignRight ? "text-right" : "text-left",
        ].join(" ")}
      >
        <button
          type="button"
          onClick={() => handleSort(key)}
          className={[
            "inline-flex items-center gap-1",
            alignRight ? "justify-end" : "justify-start",
          ].join(" ")}
        >
          <span className="whitespace-nowrap">{label}</span>
          {isActive && (
            <span className="text-[9px] text-slate-400">
              {sortDir === "desc" ? "▼" : "▲"}
            </span>
          )}
        </button>
      </th>
    );
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="mb-3">
        <h2 className="text-[13px] font-semibold text-slate-900">
          Revenue mix by oil type
        </h2>
        <p className="text-[11px] text-slate-500">
          Relative revenue and invoice mix by oil type.
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="py-2 px-3 text-[11px] font-medium uppercase tracking-wide text-slate-500 text-left">
                Oil type
              </th>
              {renderHeader("Invoices", "invoices")}
              {renderHeader("Share of invoices", "invoiceSharePct", { alignRight: true })}
              {renderHeader("Revenue", "revenue", { alignRight: true })}
              {renderHeader("Share of revenue", "revenueSharePct", { alignRight: true })}
              {renderHeader("Avg ticket", "avgTicket", { alignRight: true })}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {sortedRows.map((row) => (
              <tr key={row.id}>
                <td className="py-3 px-3">
                  <div
                    className={`inline-flex items-center rounded-full px-3 py-1 text-[11px] font-medium ${row.pillBg} ${row.pillText}`}
                  >
                    {row.label}
                  </div>
                </td>

                <td className="py-3 px-3 text-xs text-slate-900">
                  {row.invoices.toLocaleString()}
                </td>

                <td className="py-3 px-3 text-right text-xs text-slate-900">
                  {row.invoiceSharePct.toFixed(1)}%
                </td>

                <td className="py-3 px-3 text-right text-xs text-slate-900">
                  {row.revenue.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </td>

                <td className="py-3 px-3 text-right text-xs text-slate-900">
                  {row.revenueSharePct.toFixed(1)}%
                </td>

                <td className="py-3 px-3 text-right text-xs text-slate-900">
                  {row.avgTicket.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default OilTypeRevenueDetailsTable;
