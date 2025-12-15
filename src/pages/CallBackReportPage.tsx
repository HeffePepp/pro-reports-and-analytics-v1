import React from "react";
import { Download, Search, Phone, Mail, ClipboardCopy, ChevronDown, ChevronUp } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShellLayout from "@/components/layout/ShellLayout";
import AIInsightsTile from "@/components/layout/AIInsightsTile";

type SegmentKey = "active" | "retained" | "lapsed" | "inactive" | "lost";

type InvoiceLine = { description: string; qty: number; price: number };
type CustomerRecord = {
  id: string;
  name: string;
  segment: SegmentKey;
  lastServiceDate: string;
  lastInvoiceNumber?: string;
  lastLocationVisited: string;
  phone?: string;
  email?: string;
  licensePlate?: string;
  totalVisits?: number;
  servicesLastVisit?: string[];
  invoiceLines?: InvoiceLine[];
  couponsApplied?: string[];
  notes?: string;
  preferredContact?: "Phone" | "Email";
  doNotCall?: boolean;
  emailOptIn?: boolean;
};

const SEGMENTS: Record<
  SegmentKey,
  {
    label: string;
    sub: string;
    monthsMin: number;
    monthsMax?: number;
    pillClass: string;
    tileClass: string;
  }
> = {
  active: {
    label: "Active Customers",
    sub: "0–8 months since last service",
    monthsMin: 0,
    monthsMax: 8,
    pillClass: "bg-emerald-50 text-emerald-700",
    tileClass: "bg-emerald-50/60 border-emerald-100",
  },
  retained: {
    label: "Retained Customers",
    sub: "9–12 months since last service",
    monthsMin: 9,
    monthsMax: 12,
    pillClass: "bg-sky-50 text-sky-700",
    tileClass: "bg-sky-50/60 border-sky-100",
  },
  lapsed: {
    label: "Lapsed Customers",
    sub: "13–18 months since last service",
    monthsMin: 13,
    monthsMax: 18,
    pillClass: "bg-amber-50 text-amber-700",
    tileClass: "bg-amber-50/60 border-amber-100",
  },
  inactive: {
    label: "Inactive Customers",
    sub: "19–24 months since last service",
    monthsMin: 19,
    monthsMax: 24,
    pillClass: "bg-orange-50 text-orange-700",
    tileClass: "bg-orange-50/60 border-orange-100",
  },
  lost: {
    label: "Lost Customers",
    sub: "25+ months since last service",
    monthsMin: 25,
    monthsMax: undefined,
    pillClass: "bg-rose-50 text-rose-700",
    tileClass: "bg-rose-50/60 border-rose-100",
  },
};

function fmtDate(d: Date) {
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function toISODateOnly(d: Date) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function parseISODateOnly(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
}

function subMonths(date: Date, months: number) {
  const d = new Date(date);
  d.setMonth(d.getMonth() - months);
  return d;
}

function subDays(date: Date, days: number) {
  const d = new Date(date);
  d.setDate(d.getDate() - days);
  return d;
}

function downloadCSV(filename: string, rows: Record<string, string>[]) {
  if (!rows.length) return;
  const headers = Object.keys(rows[0]);
  const escape = (val: string) => `"${(val ?? "").replace(/"/g, '""')}"`;
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => escape(r[h] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const Pill: React.FC<{ className: string; children: React.ReactNode }> = ({ className, children }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${className}`}>
    {children}
  </span>
);

const SegmentTile: React.FC<{
  active?: boolean;
  title: string;
  subtitle: string;
  value: number;
  className?: string;
  onClick?: () => void;
}> = ({ active, title, subtitle, value, className, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`text-left rounded-2xl border p-4 shadow-sm transition w-full
      ${className ?? "bg-white border-slate-200"}
      ${active ? "ring-2 ring-slate-400" : "hover:border-slate-300"}
    `}
  >
    <div className="text-[11px] font-medium text-slate-600">{title}</div>
    <div className="mt-1 text-2xl font-semibold text-slate-900 tracking-tight">{value.toLocaleString()}</div>
    <div className="mt-1 text-[11px] text-slate-500">{subtitle}</div>
  </button>
);

const CustomerDetailDialog: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  customer: CustomerRecord | null;
}> = ({ open, onOpenChange, customer }) => {
  if (!customer) return null;
  const seg = SEGMENTS[customer.segment];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold text-slate-900">{customer.name}</span>
            <Pill className={seg.pillClass}>{seg.label}</Pill>
            {customer.doNotCall && <Pill className="bg-slate-100 text-slate-700">Do not call</Pill>}
            {customer.preferredContact && (
              <Pill className="bg-slate-100 text-slate-700">Prefers {customer.preferredContact}</Pill>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => customer.phone && navigator.clipboard.writeText(customer.phone)}
            disabled={!customer.phone}
          >
            <Phone className="mr-2 h-4 w-4" />
            Copy phone
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => customer.email && navigator.clipboard.writeText(customer.email)}
            disabled={!customer.email}
          >
            <Mail className="mr-2 h-4 w-4" />
            Copy email
          </Button>
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => {
              const summary = [
                `Customer: ${customer.name}`,
                `Phone: ${customer.phone ?? "—"}`,
                `Email: ${customer.email ?? "—"}`,
                `Last visit: ${customer.lastServiceDate}${customer.lastInvoiceNumber ? ` (Inv ${customer.lastInvoiceNumber})` : ""}`,
                `Location: ${customer.lastLocationVisited}`,
              ].join("\n");
              navigator.clipboard.writeText(summary);
            }}
          >
            <ClipboardCopy className="mr-2 h-4 w-4" />
            Copy summary
          </Button>
        </div>

        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <div className="text-[11px] text-slate-500">Contact</div>
            <div className="mt-1 text-sm text-slate-900">
              <div>
                <span className="font-medium">Phone:</span> {customer.phone ?? "—"}
              </div>
              <div>
                <span className="font-medium">Email:</span> {customer.email ?? "—"}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">
                Email opt-in: {customer.emailOptIn ? "Yes" : "Unknown"}
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <div className="text-[11px] text-slate-500">Last visit</div>
            <div className="mt-1 text-sm text-slate-900">
              <div>
                <span className="font-medium">Date:</span> {fmtDate(parseISODateOnly(customer.lastServiceDate))}
              </div>
              <div>
                <span className="font-medium">Invoice:</span> {customer.lastInvoiceNumber ?? "—"}
              </div>
              <div className="mt-1 text-[11px] text-slate-500">Location: {customer.lastLocationVisited}</div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <div className="text-[11px] text-slate-500">Vehicle & history</div>
            <div className="mt-1 text-sm text-slate-900">
              <div>
                <span className="font-medium">Plate:</span> {customer.licensePlate ?? "—"}
              </div>
              <div>
                <span className="font-medium">Total visits:</span> {customer.totalVisits ?? "—"}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <div className="text-[11px] text-slate-500">Services performed (last visit)</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {(customer.servicesLastVisit?.length ? customer.servicesLastVisit : ["—"]).map((s, idx) => (
                <Pill key={`${s}-${idx}`} className="bg-slate-100 text-slate-700">
                  {s}
                </Pill>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-3">
            <div className="text-[11px] text-slate-500">Coupons applied</div>
            <div className="mt-2 flex flex-wrap gap-1">
              {(customer.couponsApplied?.length ? customer.couponsApplied : ["—"]).map((c, idx) => (
                <Pill key={`${c}-${idx}`} className="bg-sky-50 text-sky-700">
                  {c}
                </Pill>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <div className="text-[11px] text-slate-500">Invoice details</div>
          <table className="mt-2 w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] text-slate-500">
                <th className="py-2 text-left font-medium">Item</th>
                <th className="py-2 text-right font-medium">Qty</th>
                <th className="py-2 text-right font-medium">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(customer.invoiceLines?.length ? customer.invoiceLines : [{ description: "—", qty: 0, price: 0 }]).map(
                (line, idx) => (
                  <tr key={idx}>
                    <td className="py-2 text-slate-900">{line.description}</td>
                    <td className="py-2 text-right text-slate-900">{line.qty}</td>
                    <td className="py-2 text-right text-slate-900">
                      {line.price ? line.price.toLocaleString("en-US", { style: "currency", currency: "USD" }) : "—"}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-3">
          <div className="text-[11px] text-slate-500">Customer notes</div>
          <div className="mt-1 text-sm text-slate-900">{customer.notes ?? "—"}</div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Helper to generate mock customers
const FIRST_NAMES = ["Bob", "Jane", "Sarah", "Michael", "Emily", "David", "Lisa", "James", "Maria", "John", "Ashley", "Robert", "Jennifer", "William", "Linda", "Christopher", "Barbara", "Daniel", "Elizabeth", "Matthew", "Susan", "Anthony", "Jessica", "Mark", "Karen"];
const LAST_NAMES = ["GoodFellow", "Driver", "Mitchell", "Torres", "Chen", "Williams", "Johnson", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson"];
const LOCATIONS = ["Vallejo, CA", "Napa, CA", "Fairfield, CA", "Benicia, CA", "American Canyon, CA", "Vacaville, CA"];
const SERVICES = ["Oil Change", "Wiper Blades", "Tire Rotation", "Air Filter", "Cabin Air Filter", "Brake Inspection", "Fluid Top-off", "Battery Check"];
const COUPONS = ["WELCOME5", "OIL10", "LOYALTY15", "SAVE20", "SPRING25"];

function generateMockCustomers(): CustomerRecord[] {
  const customers: CustomerRecord[] = [];
  const segmentCounts: Record<SegmentKey, number> = {
    active: Math.floor(Math.random() * 8) + 12, // 12-19
    retained: Math.floor(Math.random() * 6) + 8, // 8-13
    lapsed: Math.floor(Math.random() * 5) + 6,  // 6-10
    inactive: Math.floor(Math.random() * 4) + 4, // 4-7
    lost: Math.floor(Math.random() * 5) + 5,    // 5-9
  };

  let id = 1;
  const now = new Date();

  (Object.keys(segmentCounts) as SegmentKey[]).forEach((segment) => {
    const count = segmentCounts[segment];
    const seg = SEGMENTS[segment];

    for (let i = 0; i < count; i++) {
      const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
      const name = `${firstName} ${lastName}`;
      
      // Calculate a date within the segment's range
      const minMonths = seg.monthsMin;
      const maxMonths = seg.monthsMax ?? 36;
      const monthsAgo = minMonths + Math.floor(Math.random() * (maxMonths - minMonths + 1));
      const lastDate = new Date(now);
      lastDate.setMonth(lastDate.getMonth() - monthsAgo);
      lastDate.setDate(Math.floor(Math.random() * 28) + 1);

      const hasPhone = Math.random() > 0.15;
      const hasEmail = Math.random() > 0.1;
      const numServices = Math.floor(Math.random() * 3) + 1;
      const services = SERVICES.slice(0, numServices);
      const hasCoupon = Math.random() > 0.6;

      customers.push({
        id: `c${id++}`,
        name,
        segment,
        lastServiceDate: toISODateOnly(lastDate),
        lastInvoiceNumber: String(730000 + Math.floor(Math.random() * 5000)).padStart(6, "0"),
        lastLocationVisited: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
        phone: hasPhone ? `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}` : undefined,
        email: hasEmail ? `${firstName.toLowerCase()}${lastName.toLowerCase().charAt(0)}@${["gmail.com", "yahoo.com", "example.com", "company.com"][Math.floor(Math.random() * 4)]}` : undefined,
        licensePlate: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}-${Math.floor(Math.random() * 900) + 100}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(Math.random() * 10)}`,
        totalVisits: Math.floor(Math.random() * 15) + 1,
        servicesLastVisit: services,
        invoiceLines: services.map((s) => ({ description: s, qty: 1, price: Math.floor(Math.random() * 100) + 25 })),
        couponsApplied: hasCoupon ? [COUPONS[Math.floor(Math.random() * COUPONS.length)]] : [],
        notes: Math.random() > 0.5 ? "Customer prefers morning appointments." : undefined,
        preferredContact: Math.random() > 0.5 ? "Phone" : "Email",
        emailOptIn: Math.random() > 0.2,
        doNotCall: Math.random() > 0.95,
      });
    }
  });

  return customers;
}

const mockCustomers = generateMockCustomers();

type SortKey = "name" | "lastServiceDate" | "location" | "phone" | "email";
type SortDir = "asc" | "desc";

export default function CallbackReportPage() {
  const [selectedSegment, setSelectedSegment] = React.useState<SegmentKey>("active");
  const [startDate, setStartDate] = React.useState<string>("");
  const [endDate, setEndDate] = React.useState<string>("");
  const [search, setSearch] = React.useState("");
  const [onlyReachable, setOnlyReachable] = React.useState(true);
  const [sortKey, setSortKey] = React.useState<SortKey>("lastServiceDate");
  const [sortDir, setSortDir] = React.useState<SortDir>("asc");
  const [selectedCustomer, setSelectedCustomer] = React.useState<CustomerRecord | null>(null);
  const [detailOpen, setDetailOpen] = React.useState(false);
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    const now = new Date();
    const seg = SEGMENTS[selectedSegment];
    const end = subMonths(now, seg.monthsMin);
    const start = seg.monthsMax === undefined ? undefined : subMonths(now, seg.monthsMax);
    setEndDate(toISODateOnly(end));
    setStartDate(start ? toISODateOnly(start) : "");
    setShowAll(false); // Reset to collapsed when segment changes
  }, [selectedSegment]);

  const counts = React.useMemo(() => {
    const base = { active: 0, retained: 0, lapsed: 0, inactive: 0, lost: 0 } as Record<SegmentKey, number>;
    mockCustomers.forEach((c) => (base[c.segment] += 1));
    return base;
  }, []);

  const filtered = React.useMemo(() => {
    const s = startDate ? parseISODateOnly(startDate) : null;
    const e = endDate ? parseISODateOnly(endDate) : null;

    const inRange = (last: Date) => {
      if (!e) return true;
      if (!s) return last.getTime() <= e.getTime();
      return last.getTime() >= s.getTime() && last.getTime() <= e.getTime();
    };

    return mockCustomers
      .filter((c) => c.segment === selectedSegment)
      .filter((c) => {
        if (!onlyReachable) return true;
        return Boolean(c.phone || c.email);
      })
      .filter((c) => {
        const last = parseISODateOnly(c.lastServiceDate);
        return inRange(last);
      })
      .filter((c) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          c.name.toLowerCase().includes(q) ||
          (c.email ?? "").toLowerCase().includes(q) ||
          (c.phone ?? "").toLowerCase().includes(q) ||
          c.lastLocationVisited.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const dir = sortDir === "asc" ? 1 : -1;
        const get = (c: CustomerRecord) => {
          switch (sortKey) {
            case "name":
              return c.name.toLowerCase();
            case "lastServiceDate":
              return c.lastServiceDate;
            case "location":
              return c.lastLocationVisited.toLowerCase();
            case "phone":
              return (c.phone ?? "").toLowerCase();
            case "email":
              return (c.email ?? "").toLowerCase();
          }
        };
        const va = get(a);
        const vb = get(b);
        return va < vb ? -1 * dir : va > vb ? 1 * dir : 0;
      });
  }, [selectedSegment, startDate, endDate, search, onlyReachable, sortKey, sortDir]);

  const onSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "lastServiceDate" ? "asc" : "asc");
    }
  };

  const sortArrow = (key: SortKey) => {
    if (sortKey !== key) return null;
    return <span className="ml-1">{sortDir === "asc" ? "▲" : "▼"}</span>;
  };

  const exportRows = React.useMemo(() => {
    return filtered.map((c) => ({
      "Customer Name": c.name,
      "Last Service Date": fmtDate(parseISODateOnly(c.lastServiceDate)),
      "Last Invoice #": c.lastInvoiceNumber ?? "",
      "Last Location Visited": c.lastLocationVisited,
      "Cust Ph": c.phone ?? "",
      "Cust Eml": c.email ?? "",
    }));
  }, [filtered]);

  const selectedSeg = SEGMENTS[selectedSegment];

  return (
    <ShellLayout breadcrumb={[{ label: "Reports", to: "/" }, { label: "Callback Report" }]}>
      {/* Header - outside the grid */}
      <div className="mb-4">
        <h1 className="text-2xl font-semibold text-slate-900">Callback Report</h1>
        <p className="mt-1 text-sm text-slate-600">
          Click a colored database segment below to pull customer information or choose a custom date range.
        </p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        {/* LEFT */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPI tiles = preset timeframe buckets */}
          <div className="grid gap-3 grid-cols-2 md:grid-cols-5">
            {(Object.keys(SEGMENTS) as SegmentKey[]).map((k) => (
              <SegmentTile
                key={k}
                active={selectedSegment === k}
                title={SEGMENTS[k].label}
                subtitle={SEGMENTS[k].sub}
                value={counts[k]}
                className={`border ${SEGMENTS[k].tileClass}`}
                onClick={() => setSelectedSegment(k)}
              />
            ))}
          </div>

          {/* Controls row */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="text-[13px] font-semibold text-slate-900">Custom date range</div>
            
            {/* First row: Start date, End date, Checkbox */}
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <div className="text-[11px] font-medium text-slate-500 mb-1">Start date</div>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-[150px] rounded-xl"
                  placeholder="(optional)"
                  disabled={selectedSegment === "lost"}
                />
              </div>

              <div>
                <div className="text-[11px] font-medium text-slate-500 mb-1">End date</div>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-[150px] rounded-xl"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="reachable"
                  type="checkbox"
                  checked={onlyReachable}
                  onChange={(e) => setOnlyReachable(e.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-teal-600"
                />
                <label htmlFor="reachable" className="text-[11px] text-teal-600">
                  Only show customers with phone or email
                </label>
              </div>
            </div>

            {/* Second row: Search and Download */}
            <div className="flex flex-wrap items-end gap-4 justify-between">
              <div className="flex-1 min-w-[260px] max-w-lg">
                <div className="relative">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 rounded-xl"
                    placeholder="Name, email, phone, location..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Pill className={selectedSeg.pillClass}>{selectedSeg.label}</Pill>
                <Button
                  className="rounded-full"
                  variant="outline"
                  onClick={() => downloadCSV(`callback-report-${selectedSegment}-${endDate}.csv`, exportRows)}
                  disabled={!exportRows.length}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download CSV
                </Button>
              </div>
            </div>
          </div>

          {/* Customers table */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-[13px] font-semibold text-slate-900">Customers to call back</div>
                <div className="text-[11px] text-slate-500">
                  Click any row for last-visit details, notes, invoice items and coupons.
                </div>
              </div>
              {filtered.length > 5 && (
                <button
                  type="button"
                  onClick={() => setShowAll(!showAll)}
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  {showAll ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  {showAll ? "Show less" : `Show all ${filtered.length}`}
                </button>
              )}
            </div>

            <div className="mt-3 overflow-hidden rounded-2xl border border-slate-200">
              <table className="w-full text-xs table-fixed">
                <colgroup>
                  <col className="w-[30%]" />
                  <col className="w-[18%]" />
                  <col className="w-[17%]" />
                  <col className="w-[17%]" />
                  <col className="w-[18%]" />
                </colgroup>
                <thead>
                  <tr className="border-b border-slate-200 bg-white text-[11px] text-slate-500">
                    <th className="px-4 py-3 text-left font-medium">
                      <button type="button" onClick={() => onSort("name")} className="hover:text-slate-700">
                        Customer name{sortArrow("name")}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-right font-medium whitespace-nowrap">
                      <button type="button" onClick={() => onSort("lastServiceDate")} className="hover:text-slate-700">
                        Last service{sortArrow("lastServiceDate")}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      <button type="button" onClick={() => onSort("location")} className="hover:text-slate-700">
                        Last loc visited{sortArrow("location")}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      <button type="button" onClick={() => onSort("phone")} className="hover:text-slate-700">
                        Cust ph{sortArrow("phone")}
                      </button>
                    </th>
                    <th className="px-4 py-3 text-right font-medium">
                      <button type="button" onClick={() => onSort("email")} className="hover:text-slate-700">
                        Cust eml{sortArrow("email")}
                      </button>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {(showAll ? filtered : filtered.slice(0, 5)).map((c) => {
                    const seg = SEGMENTS[c.segment];
                    const last = fmtDate(parseISODateOnly(c.lastServiceDate));
                    const missingPhone = !c.phone;
                    const missingEmail = !c.email;

                    return (
                      <tr
                        key={c.id}
                        className="cursor-pointer bg-white hover:bg-slate-50"
                        onClick={() => {
                          setSelectedCustomer(c);
                          setDetailOpen(true);
                        }}
                      >
                        <td className="px-4 py-3">
                          <div className="text-[13px] font-semibold text-slate-900">{c.name}</div>
                          <div className="mt-1 flex flex-wrap items-center gap-1">
                            <Pill className={seg.pillClass}>{seg.label.replace(" Customers", "")}</Pill>
                            {missingPhone && <Pill className="bg-slate-100 text-slate-700">Phone missing</Pill>}
                            {missingEmail && <Pill className="bg-slate-100 text-slate-700">Email missing</Pill>}
                            {c.doNotCall && <Pill className="bg-slate-100 text-slate-700">Do not call</Pill>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-900 whitespace-nowrap">
                          <div className="font-medium">{last}</div>
                          <div className="text-[11px] text-slate-500">
                            {c.lastInvoiceNumber ? `Inv ${c.lastInvoiceNumber}` : "—"}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-slate-900 truncate">{c.lastLocationVisited}</td>
                        <td className="px-4 py-3 text-right text-slate-900 truncate">{c.phone ?? "—"}</td>
                        <td className="px-4 py-3 text-right text-slate-900 truncate">{c.email ?? "—"}</td>
                      </tr>
                    );
                  })}

                  {!filtered.length && (
                    <tr>
                      <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                        No customers match this timeframe and filter selection.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* AI stacked on small screens - after main content */}
          <div className="block lg:hidden">
            <AIInsightsTile
              bullets={[
                "Lost customers represent 20% of your database—prioritize callback campaigns.",
                "Customers with email have 3× higher reactivation rate than phone-only.",
                "Lapsed segment shows highest callback conversion potential.",
              ]}
            />
          </div>

          <CustomerDetailDialog open={detailOpen} onOpenChange={setDetailOpen} customer={selectedCustomer} />
        </div>

        {/* RIGHT: AI insights - top aligned */}
        <div className="hidden lg:block lg:col-span-1 self-start">
          <AIInsightsTile
            bullets={[
              "Lost customers represent 20% of your database—prioritize callback campaigns.",
              "Customers with email have 3× higher reactivation rate than phone-only.",
              "Lapsed segment shows highest callback conversion potential.",
            ]}
          />
        </div>
      </div>
    </ShellLayout>
  );
}
