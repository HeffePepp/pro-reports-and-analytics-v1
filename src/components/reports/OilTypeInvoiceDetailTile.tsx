import React from "react";
import { ChevronDown } from "lucide-react";

type OilTypeInvoiceRow = {
  date: string;
  invoice: string;
  store: string;
  customer: string;
  vehicle: string;
  oilType: string;
  brand: string;
  sales: number;
  coupon: number;
  discount: number;
};

type SortDir = "asc" | "desc";
type SortKey =
  | "date"
  | "invoice"
  | "store"
  | "customer"
  | "vehicle"
  | "oilType"
  | "brand"
  | "sales"
  | "coupon"
  | "discount";

type SortState = {
  key: SortKey;
  dir: SortDir;
};

type Props = {
  rows: OilTypeInvoiceRow[];
};

const oilTypePillClass = (type: string): string => {
  switch (type) {
    case "Full Synthetic":
      return "bg-emerald-50 text-emerald-700";
    case "Conventional":
      return "bg-sky-50 text-sky-700";
    case "Synthetic Blend":
      return "bg-indigo-50 text-indigo-700";
    case "High Mileage":
      return "bg-amber-50 text-amber-700";
    default:
      return "bg-rose-50 text-rose-700";
  }
};

const compareForKey =
  (key: SortKey) =>
  (a: OilTypeInvoiceRow, b: OilTypeInvoiceRow): number => {
    switch (key) {
      case "date":
        return a.date.localeCompare(b.date);
      case "invoice":
      case "store":
      case "customer":
      case "vehicle":
      case "oilType":
      case "brand":
        return (a[key] as string).localeCompare(b[key] as string);
      case "sales":
      case "coupon":
      case "discount":
        return (a[key] as number) - (b[key] as number);
      default:
        return 0;
    }
  };

const SAMPLE_INVOICES: OilTypeInvoiceRow[] = [
  {
    date: "2024-11-28",
    invoice: "A178-12001",
    store: "Vallejo, CA",
    customer: "Jane Smith",
    vehicle: "2018 Toyota Camry",
    oilType: "Full Synthetic",
    brand: "Royal Purple",
    sales: 128,
    coupon: 20,
    discount: 0,
  },
  {
    date: "2024-11-28",
    invoice: "A178-12002",
    store: "Vallejo, CA",
    customer: "Michael Johnson",
    vehicle: "2016 Ford F-150",
    oilType: "Synthetic Blend",
    brand: "House Brand",
    sales: 96,
    coupon: 0,
    discount: 0,
  },
  {
    date: "2024-11-29",
    invoice: "N101-12018",
    store: "Napa, CA",
    customer: "Laura Chen",
    vehicle: "2021 Subaru Outback",
    oilType: "Full Synthetic",
    brand: "Royal Purple",
    sales: 132,
    coupon: 13,
    discount: 0,
  },
  {
    date: "2024-11-30",
    invoice: "F220-12044",
    store: "Fairfield, CA",
    customer: "Carlos Garcia",
    vehicle: "2012 Honda Civic",
    oilType: "Conventional",
    brand: "House Brand",
    sales: 79,
    coupon: 5,
    discount: 0,
  },
];

const OilTypeInvoiceDetailTile: React.FC<Props> = ({ rows = SAMPLE_INVOICES }) => {
  const [sort, setSort] = React.useState<SortState>({
    key: "date",
    dir: "desc",
  });

  const sortedRows = React.useMemo(() => {
    const factor = sort.dir === "asc" ? 1 : -1;
    const cmp = compareForKey(sort.key);
    return [...rows].sort((a, b) => factor * cmp(a, b));
  }, [rows, sort]);

  const toggleSort = (key: SortKey) => {
    setSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "desc" }
    );
  };

  const renderSortableHeader = (label: string, key: SortKey, align: "left" | "right" = "right") => {
    const isActive = sort.key === key;
    const isAsc = isActive && sort.dir === "asc";

    return (
      <th className={`py-2 px-3 text-${align} text-[11px] font-medium uppercase tracking-wide text-slate-500 whitespace-nowrap`}>
        <button
          type="button"
          onClick={() => toggleSort(key)}
          className={`inline-flex w-full items-center ${align === "right" ? "justify-end" : "justify-start"} gap-1`}
        >
          <span>{label}</span>
          <ChevronDown
            className={`h-3 w-3 transition-transform ${
              isActive ? "text-slate-700" : "text-slate-300"
            } ${isAsc ? "rotate-180" : ""}`}
          />
        </button>
      </th>
    );
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <header className="mb-3 flex items-baseline justify-between gap-3">
        <div>
          <h2 className="text-[13px] font-semibold text-slate-900">
            Invoice Detail
          </h2>
          <p className="text-[11px] text-slate-500">
            Invoice-level view of oil type sales.
          </p>
        </div>
      </header>

      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed text-xs">
          <colgroup>
            <col className="w-[10%]" />
            <col className="w-[10%]" />
            <col className="w-[12%]" />
            <col className="w-[14%]" />
            <col className="w-[18%]" />
            <col className="w-[12%]" />
            <col className="w-[10%]" />
            <col className="w-[7%]" />
            <col className="w-[7%]" />
            <col className="w-[7%]" />
          </colgroup>

          <thead>
            <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wide text-slate-500">
              {renderSortableHeader("Date", "date", "left")}
              {renderSortableHeader("Invoice", "invoice", "left")}
              {renderSortableHeader("Store", "store", "left")}
              {renderSortableHeader("Customer", "customer", "left")}
              {renderSortableHeader("Vehicle", "vehicle", "left")}
              {renderSortableHeader("Oil type", "oilType", "left")}
              {renderSortableHeader("Oil brand", "brand", "left")}
              {renderSortableHeader("Sales", "sales")}
              {renderSortableHeader("Coupon", "coupon")}
              {renderSortableHeader("Discount", "discount")}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {sortedRows.map((row) => (
              <tr key={row.invoice + row.date}>
                <td className="py-3 px-3 text-xs text-slate-900">
                  {row.date}
                </td>
                <td className="py-3 px-3 text-xs font-semibold text-sky-700">
                  {row.invoice}
                </td>
                <td className="py-3 px-3 text-xs text-slate-900">
                  {row.store}
                </td>
                <td className="py-3 px-3 text-xs text-slate-900">
                  {row.customer}
                </td>
                <td className="py-3 px-3 text-xs text-slate-900">
                  {row.vehicle}
                </td>
                <td className="py-3 px-3 text-xs">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${oilTypePillClass(
                      row.oilType
                    )}`}
                  >
                    {row.oilType}
                  </span>
                </td>
                <td className="py-3 px-3 text-xs text-slate-900">
                  {row.brand}
                </td>
                <td className="py-3 px-3 text-right text-xs text-slate-900">
                  {row.sales.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </td>
                <td className="py-3 px-3 text-right text-xs text-slate-900">
                  {row.coupon.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </td>
                <td className="py-3 px-3 text-right text-xs text-slate-900">
                  {row.discount.toLocaleString("en-US", {
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

export default OilTypeInvoiceDetailTile;
