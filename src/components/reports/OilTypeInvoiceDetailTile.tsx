import React, { useMemo, useState } from "react";

type OilTypeInvoiceRow = {
  date: string;
  invoice: string;
  store: string;
  license: string;
  customer: string;
  vehicle: string;
  oilType: string;
  brand: string;
  sales: number;
  coupon: string;
  discount: number;
};

type SortKey =
  | "date"
  | "invoice"
  | "store"
  | "license"
  | "oilType"
  | "brand"
  | "sales"
  | "coupon"
  | "discount";

type SortDir = "asc" | "desc";

type Props = {
  rows?: OilTypeInvoiceRow[];
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

const SAMPLE_INVOICES: OilTypeInvoiceRow[] = [
  { date: "2024-11-28", invoice: "A178-12001", store: "Vallejo, CA", license: "8ABC123", customer: "Jane Smith", vehicle: "2018 Toyota Camry", oilType: "Full Synthetic", brand: "Royal Purple", sales: 128, coupon: "$20 SYN20", discount: 0 },
  { date: "2024-11-28", invoice: "A178-12002", store: "Vallejo, CA", license: "7XYZ789", customer: "Michael Johnson", vehicle: "2016 Ford F-150", oilType: "Synthetic Blend", brand: "House Brand", sales: 96, coupon: "—", discount: 0 },
  { date: "2024-11-29", invoice: "N101-12018", store: "Napa, CA", license: "6DEF456", customer: "Laura Chen", vehicle: "2021 Subaru Outback", oilType: "Full Synthetic", brand: "Royal Purple", sales: 132, coupon: "$15 OIL10", discount: 5 },
  { date: "2024-11-30", invoice: "F220-12044", store: "Fairfield, CA", license: "5GHI321", customer: "Carlos Garcia", vehicle: "2012 Honda Civic", oilType: "Conventional", brand: "House Brand", sales: 79, coupon: "$10 WINTERS", discount: 0 },
  { date: "2024-12-01", invoice: "V330-12055", store: "Vacaville, CA", license: "4JKL654", customer: "Emily Davis", vehicle: "2019 Honda CR-V", oilType: "High Mileage", brand: "House Brand", sales: 110, coupon: "$15 HM15", discount: 0 },
  { date: "2024-12-02", invoice: "A178-12003", store: "Vallejo, CA", license: "3MNO987", customer: "Brian Lee", vehicle: "2017 Chevy Silverado", oilType: "Full Synthetic", brand: "Royal Purple", sales: 145, coupon: "$25 SYN25", discount: 0 },
  { date: "2024-12-02", invoice: "N101-12019", store: "Napa, CA", license: "2PQR147", customer: "Sarah Wilson", vehicle: "2020 Subaru Forester", oilType: "Synthetic Blend", brand: "House Brand", sales: 102, coupon: "—", discount: 5 },
  { date: "2024-12-03", invoice: "F220-12045", store: "Fairfield, CA", license: "1STU258", customer: "David Martinez", vehicle: "2015 Toyota Corolla", oilType: "Conventional", brand: "House Brand", sales: 72, coupon: "$5 OIL5", discount: 0 },
  { date: "2024-12-03", invoice: "V330-12056", store: "Vacaville, CA", license: "9VWX369", customer: "Olivia Brown", vehicle: "2018 Ford Escape", oilType: "High Mileage", brand: "House Brand", sales: 118, coupon: "$10 HM10", discount: 0 },
  { date: "2024-12-04", invoice: "A178-12004", store: "Vallejo, CA", license: "8YZA741", customer: "Kevin Nguyen", vehicle: "2014 Jeep Wrangler", oilType: "Full Synthetic", brand: "Royal Purple", sales: 150, coupon: "$20 SYN20", discount: 0 },
  { date: "2024-12-04", invoice: "N101-12020", store: "Napa, CA", license: "7BCD852", customer: "Rachel Green", vehicle: "2019 Toyota RAV4", oilType: "Synthetic Blend", brand: "House Brand", sales: 99, coupon: "—", discount: 10 },
  { date: "2024-12-05", invoice: "F220-12046", store: "Fairfield, CA", license: "6EFG963", customer: "Anthony Perez", vehicle: "2013 Honda Accord", oilType: "Conventional", brand: "House Brand", sales: 84, coupon: "$8 CONV8", discount: 0 },
  { date: "2024-12-05", invoice: "V330-12057", store: "Vacaville, CA", license: "5HIJ074", customer: "Sophia Turner", vehicle: "2022 Hyundai Tucson", oilType: "Full Synthetic", brand: "Royal Purple", sales: 160, coupon: "$25 SYN25", discount: 0 },
  { date: "2024-12-06", invoice: "A178-12005", store: "Vallejo, CA", license: "4KLM185", customer: "Jason Clark", vehicle: "2011 Ford Focus", oilType: "High Mileage", brand: "House Brand", sales: 105, coupon: "$10 HM10", discount: 0 },
  { date: "2024-12-06", invoice: "N101-12021", store: "Napa, CA", license: "3NOP296", customer: "Megan Scott", vehicle: "2016 Subaru Crosstrek", oilType: "Synthetic Blend", brand: "House Brand", sales: 108, coupon: "—", discount: 0 },
  { date: "2024-12-07", invoice: "F220-12047", store: "Fairfield, CA", license: "2QRS307", customer: "Logan Ramirez", vehicle: "2018 Chevy Equinox", oilType: "Full Synthetic", brand: "Royal Purple", sales: 142, coupon: "$15 OIL15", discount: 0 },
  { date: "2024-12-07", invoice: "V330-12058", store: "Vacaville, CA", license: "1TUV418", customer: "Chloe Adams", vehicle: "2019 Kia Sorento", oilType: "Conventional", brand: "House Brand", sales: 83, coupon: "$5 OIL5", discount: 0 },
  { date: "2024-12-08", invoice: "A178-12006", store: "Vallejo, CA", license: "9WXY529", customer: "Ethan Hall", vehicle: "2015 Nissan Altima", oilType: "High Mileage", brand: "House Brand", sales: 112, coupon: "$10 HM10", discount: 5 },
  { date: "2024-12-08", invoice: "N101-12022", store: "Napa, CA", license: "8ZAB630", customer: "Hannah Lewis", vehicle: "2020 Subaru Legacy", oilType: "Full Synthetic", brand: "Royal Purple", sales: 155, coupon: "$20 SYN20", discount: 0 },
  { date: "2024-12-09", invoice: "F220-12048", store: "Fairfield, CA", license: "7CDE741", customer: "Noah Rivera", vehicle: "2017 Toyota Highlander", oilType: "Unclassified", brand: "House Brand", sales: 90, coupon: "—", discount: 0 },
];

const OilTypeInvoiceDetailTile: React.FC<Props> = ({ rows }) => {
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const data = rows ?? SAMPLE_INVOICES;

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const sortedRows = useMemo(() => {
    const sorted = [...data];
    sorted.sort((a, b) => {
      let aVal: string | number = a[sortKey];
      let bVal: string | number = b[sortKey];
      
      if (typeof aVal === "string" && typeof bVal === "string") {
        const cmp = aVal.localeCompare(bVal);
        return sortDir === "asc" ? cmp : -cmp;
      }
      
      if (aVal < bVal) return sortDir === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [data, sortKey, sortDir]);

  const renderHeader = (label: string, key: SortKey) => {
    const isActive = sortKey === key;

    return (
      <th
        key={key}
        className="py-2 px-2 text-[11px] font-medium uppercase tracking-wide text-slate-500 text-left"
      >
        <button
          type="button"
          onClick={() => handleSort(key)}
          className="inline-flex items-center gap-1"
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

      <div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-200">
              {renderHeader("Date", "date")}
              {renderHeader("Invoice", "invoice")}
              {renderHeader("License / Store / Cust", "license")}
              {renderHeader("Oil type", "oilType")}
              {renderHeader("Oil brand", "brand")}
              {renderHeader("Sales", "sales")}
              {renderHeader("Coupon", "coupon")}
              {renderHeader("Discount", "discount")}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {sortedRows.map((row, idx) => (
              <tr key={row.invoice + row.date + idx}>
                <td className="py-3 px-2 text-xs text-slate-900">{row.date}</td>
                <td className="py-3 px-2 text-xs font-semibold text-sky-700">{row.invoice}</td>
                <td className="py-3 px-2 text-xs">
                  <div className="font-semibold text-slate-900">{row.license}</div>
                  <div className="text-[10px] text-slate-500">{row.store}</div>
                  <div className="text-[10px] text-slate-500">{row.customer} · {row.vehicle}</div>
                </td>
                <td className="py-3 px-2 text-xs">
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${oilTypePillClass(row.oilType)}`}>
                    {row.oilType}
                  </span>
                </td>
                <td className="py-3 px-2 text-xs text-slate-900">{row.brand}</td>
                <td className="py-3 px-2 text-xs text-slate-900">
                  {row.sales.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
                </td>
                <td className="py-3 px-2 text-xs text-slate-900">{row.coupon}</td>
                <td className="py-3 px-2 text-xs text-slate-900">
                  {row.discount.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 })}
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
