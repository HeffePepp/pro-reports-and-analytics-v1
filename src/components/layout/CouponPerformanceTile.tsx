import React, { useMemo, useState } from "react";
import {
  ReportTable,
  ReportTableHead,
  ReportTableBody,
  ReportTableRow,
  ReportTableHeaderCell,
  ReportTableCell,
  SortState,
} from "@/components/ui/report-table";

type CouponKind = "coupon" | "discount";

type CouponRow = {
  code: string;
  description: string;
  kind: CouponKind;
  redemptions: number;
  avgTicket: number;
  revenue: number;
};

type SortKey = "code" | "redemptions" | "avgTicket" | "revenue" | "usagePct";

const COUPON_ROWS: CouponRow[] = [
  {
    code: "OIL10",
    description: "$10 off any oil change",
    kind: "coupon",
    redemptions: 980,
    avgTicket: 94,
    revenue: 92200,
  },
  {
    code: "SYN20",
    description: "$20 off synthetic oil",
    kind: "coupon",
    redemptions: 640,
    avgTicket: 138,
    revenue: 88320,
  },
  {
    code: "VIP25",
    description: "$25 off ticket over $150",
    kind: "coupon",
    redemptions: 420,
    avgTicket: 186,
    revenue: 78120,
  },
  {
    code: "WEB15",
    description: "15% off web-only offer",
    kind: "discount",
    redemptions: 760,
    avgTicket: 112,
    revenue: 85120,
  },
  {
    code: "WELCOME5",
    description: "$5 off new customer",
    kind: "coupon",
    redemptions: 1020,
    avgTicket: 76,
    revenue: 77520,
  },
];

const basePillClasses =
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide uppercase";
const couponColorClasses = "bg-sky-50 border-sky-100 text-sky-700";
const discountColorClasses = "bg-emerald-50 border-emerald-100 text-emerald-700";

const getPillClassesForKind = (kind: CouponKind) =>
  `${basePillClasses} ${kind === "coupon" ? couponColorClasses : discountColorClasses}`;

export const CouponPerformanceTile: React.FC = () => {
  const [sort, setSort] = useState<SortState>({
    key: "revenue",
    direction: "desc",
  });

  const totalRedemptions = useMemo(
    () => COUPON_ROWS.reduce((sum, row) => sum + row.redemptions, 0),
    []
  );

  const rowsWithUsage = useMemo(
    () =>
      COUPON_ROWS.map((row) => ({
        ...row,
        usagePct:
          totalRedemptions > 0
            ? (row.redemptions / totalRedemptions) * 100
            : 0,
      })),
    [totalRedemptions]
  );

  const sortedRows = useMemo(() => {
    if (!sort) return rowsWithUsage;
    const { key, direction } = sort;

    const copy = [...rowsWithUsage];

    copy.sort((a, b) => {
      const aValue = a[key as keyof typeof a];
      const bValue = b[key as keyof typeof b];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      const aNum = Number(aValue);
      const bNum = Number(bValue);
      return direction === "asc" ? aNum - bNum : bNum - aNum;
    });

    return copy;
  }, [rowsWithUsage, sort]);

  const handleSortChange = (key: string) => {
    setSort((current) => {
      if (!current || current.key !== key) {
        const isCode = key === "code";
        return {
          key,
          direction: isCode ? "asc" : "desc",
        };
      }

      return {
        key,
        direction: current.direction === "asc" ? "desc" : "asc",
      };
    });
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* Header: Pills as the title */}
      <header>
        <div className="flex flex-wrap items-center gap-2">
          <span className={`${basePillClasses} ${couponColorClasses}`}>
            COUPONS
          </span>
          <span className={`${basePillClasses} ${discountColorClasses}`}>
            DISCOUNTS
          </span>
        </div>

        <p className="mt-2 text-[11px] text-slate-500">
          Performance by coupon or discount code. Color indicates offer type.
        </p>
      </header>

      {/* Standardized table */}
      <div className="mt-4 overflow-x-auto">
        <ReportTable>
          <ReportTableHead>
            <ReportTableRow>
              <ReportTableHeaderCell
                label="Code"
                sortKey="code"
                sortState={sort}
                onSortChange={handleSortChange}
              />
              <ReportTableHeaderCell label="Description" />
              <ReportTableHeaderCell
                label="Redemptions"
                align="right"
                sortKey="redemptions"
                sortState={sort}
                onSortChange={handleSortChange}
              />
              <ReportTableHeaderCell
                label="Avg ticket"
                align="right"
                sortKey="avgTicket"
                sortState={sort}
                onSortChange={handleSortChange}
              />
              <ReportTableHeaderCell
                label="Revenue"
                align="right"
                sortKey="revenue"
                sortState={sort}
                onSortChange={handleSortChange}
              />
              <ReportTableHeaderCell
                label="% of redemptions"
                align="right"
                sortKey="usagePct"
                sortState={sort}
                onSortChange={handleSortChange}
              />
            </ReportTableRow>
          </ReportTableHead>

          <ReportTableBody>
            {sortedRows.map((row) => (
              <ReportTableRow key={row.code}>
                <ReportTableCell>
                  <span className={getPillClassesForKind(row.kind)}>
                    {row.code}
                  </span>
                </ReportTableCell>

                <ReportTableCell className="text-slate-700">
                  {row.description}
                </ReportTableCell>

                <ReportTableCell align="right" className="font-semibold">
                  {row.redemptions.toLocaleString()}
                </ReportTableCell>

                <ReportTableCell align="right" className="font-semibold">
                  ${row.avgTicket.toLocaleString()}
                </ReportTableCell>

                <ReportTableCell align="right" className="font-semibold">
                  {row.revenue.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                    maximumFractionDigits: 0,
                  })}
                </ReportTableCell>

                <ReportTableCell align="right" className="font-semibold text-emerald-600">
                  {row.usagePct.toFixed(1)}%
                </ReportTableCell>
              </ReportTableRow>
            ))}
          </ReportTableBody>
        </ReportTable>
      </div>
    </section>
  );
};

export default CouponPerformanceTile;
