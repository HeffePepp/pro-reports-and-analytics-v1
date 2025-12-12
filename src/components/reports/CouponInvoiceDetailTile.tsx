import React, { useState, useMemo } from "react";
import {
  ReportTable,
  ReportTableHead,
  ReportTableBody,
  ReportTableRow,
  ReportTableHeaderCell,
  ReportTableCell,
} from "@/components/ui/report-table";

export type CouponInvoiceRow = {
  date: string;
  invoice: string;
  store: string;
  customer: string;
  vehicle: string;
  couponCode: string;
  offer: string;
  discount: number;
  sales: number;
  channel: string;
};

type Props = {
  rows: CouponInvoiceRow[];
};

type SortKey =
  | "date"
  | "invoice"
  | "store"
  | "customer"
  | "vehicle"
  | "couponCode"
  | "discount"
  | "sales"
  | "channel";
type SortDir = "asc" | "desc";
type SortState = { key: SortKey; dir: SortDir };

const COUPON_PILL_COLORS: Record<string, string> = {
  OIL10: "bg-emerald-50 text-emerald-700 border-emerald-100",
  SYN20: "bg-sky-50 text-sky-700 border-sky-100",
  WEB15: "bg-indigo-50 text-indigo-700 border-indigo-100",
  VIP25: "bg-amber-50 text-amber-700 border-amber-100",
  WELCOME5: "bg-rose-50 text-rose-700 border-rose-100",
};

const getPillColor = (code: string) =>
  COUPON_PILL_COLORS[code] || "bg-slate-100 text-slate-700 border-slate-200";

const currency = (v: number) =>
  v.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

export const CouponInvoiceDetailTile: React.FC<Props> = ({ rows }) => {
  const [sort, setSort] = useState<SortState>({ key: "sales", dir: "desc" });
  const [expanded, setExpanded] = useState(false);

  const sortedRows = useMemo(() => {
    const factor = sort.dir === "asc" ? 1 : -1;
    return [...rows].sort((a, b) => {
      if (
        sort.key === "date" ||
        sort.key === "invoice" ||
        sort.key === "store" ||
        sort.key === "customer" ||
        sort.key === "vehicle" ||
        sort.key === "couponCode" ||
        sort.key === "channel"
      ) {
        return factor * (a[sort.key] as string).localeCompare(b[sort.key] as string);
      }
      return factor * ((a[sort.key] as number) - (b[sort.key] as number));
    });
  }, [rows, sort]);

  const visibleRows = expanded ? sortedRows : sortedRows.slice(0, 3);

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "desc" }
    );
  };

  const renderHeader = (label: string, key: SortKey, align: "left" | "right" = "left") => (
    <ReportTableHeaderCell
      label={label}
      sortKey={key}
      sortState={{ key: sort.key, direction: sort.dir }}
      onSortChange={() => toggleSort(key)}
      align={align}
    />
  );

  return (
    <section className="rounded-2xl border border-tp-border bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-semibold text-tp-grey-dark">
            Invoice Detail
          </h2>
          <p className="text-[11px] text-slate-500">
            Invoice-level view of discounted visits.
          </p>
        </div>
        {rows.length > 3 && (
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="text-[11px] font-medium text-sky-600 hover:text-sky-700"
          >
            {expanded ? "Show less" : `Show all ${rows.length}`}
          </button>
        )}
      </header>

      <ReportTable>
        <ReportTableHead>
          <ReportTableRow>
            {renderHeader("Date", "date")}
            {renderHeader("Invoice", "invoice")}
            <ReportTableHeaderCell label="License / Store / Customer" />
            {renderHeader("Vehicle", "vehicle")}
            {renderHeader("Coupon", "couponCode")}
            <ReportTableHeaderCell label="Offer" />
            {renderHeader("Discount", "discount", "right")}
            {renderHeader("Sales", "sales", "right")}
            {renderHeader("Channel", "channel")}
          </ReportTableRow>
        </ReportTableHead>
        <ReportTableBody>
          {visibleRows.map((row, idx) => (
            <ReportTableRow key={`${row.invoice}-${idx}`}>
              <ReportTableCell>{row.date}</ReportTableCell>
              <ReportTableCell className="font-semibold text-sky-700">
                {row.invoice}
              </ReportTableCell>
              <ReportTableCell>
                <div className="space-y-0.5">
                  <div className="text-[11px] text-slate-900">{row.store}</div>
                  <div className="text-[10px] text-slate-500">{row.customer}</div>
                </div>
              </ReportTableCell>
              <ReportTableCell>{row.vehicle}</ReportTableCell>
              <ReportTableCell>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${getPillColor(
                    row.couponCode
                  )}`}
                >
                  {row.couponCode}
                </span>
              </ReportTableCell>
              <ReportTableCell>{row.offer}</ReportTableCell>
              <ReportTableCell align="right">{currency(row.discount)}</ReportTableCell>
              <ReportTableCell align="right">{currency(row.sales)}</ReportTableCell>
              <ReportTableCell>{row.channel}</ReportTableCell>
            </ReportTableRow>
          ))}
        </ReportTableBody>
      </ReportTable>
    </section>
  );
};

export default CouponInvoiceDetailTile;
