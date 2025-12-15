import React from "react";
import { Download, Search, Phone, Mail, ClipboardCopy, ChevronDown, ChevronUp, Check, Car, User, MapPin, Wrench, FileText } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ShellLayout from "@/components/layout/ShellLayout";
import AIInsightsTile from "@/components/layout/AIInsightsTile";

type SegmentKey = "active" | "retained" | "lapsed" | "inactive" | "lost";

type LaborLine = { description: string; code: string; qty: number; price: number };
type PartLine = { description: string; code: string; qty: number; price: number };
type CustomerRecord = {
  id: string;
  customerId: string;
  name: string;
  segment: SegmentKey;
  address?: { street: string; city: string; state: string; zip: string };
  lastServiceDate: string;
  lastInvoiceNumber?: string;
  lastLocationVisited: string;
  storeCode?: string;
  phone?: string;
  email?: string;
  emailVerified?: boolean;
  licensePlate?: string;
  vehicleId?: string;
  vin?: string;
  vehicleYear?: number;
  vehicleMake?: string;
  vehicleModel?: string;
  vehicleMileage?: number;
  totalVisits?: number;
  reminderInterval?: number;
  lastOilType?: string;
  invoiceSubtotal?: number;
  laborLines?: LaborLine[];
  partLines?: PartLine[];
  activityTimeline?: { date: string; invoiceNum: string; amount: number; mileage: number; location: string }[];
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

const CopyButton: React.FC<{
  label: string;
  disabledLabel?: string;
  icon: React.ReactNode;
  onCopy: () => void;
  disabled?: boolean;
}> = ({ label, disabledLabel, icon, onCopy, disabled }) => {
  const [copied, setCopied] = React.useState(false);

  const handleClick = () => {
    onCopy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      variant="outline"
      className={`rounded-full transition-all ${
        disabled 
          ? "opacity-50 cursor-not-allowed bg-slate-100 text-slate-400 border-slate-200" 
          : copied 
            ? "bg-emerald-50 border-emerald-200 text-emerald-700" 
            : ""
      }`}
      onClick={handleClick}
      disabled={disabled}
    >
      {copied ? <Check className="mr-2 h-4 w-4" /> : icon}
      {disabled ? (disabledLabel ?? label) : copied ? "Copied" : label}
    </Button>
  );
};

const CustomerDetailDialog: React.FC<{
  open: boolean;
  onOpenChange: (v: boolean) => void;
  customer: CustomerRecord | null;
}> = ({ open, onOpenChange, customer }) => {
  const [expandedInvoices, setExpandedInvoices] = React.useState<Set<number>>(new Set());

  // Generate invoice history with at least 3 invoices - must be before any early return
  const invoiceHistory = React.useMemo(() => {
    if (!customer) return [];
    const baseInvoice = parseInt(customer.lastInvoiceNumber ?? "318000");
    const baseMileage = customer.vehicleMileage ?? 45000;
    const invoices = [];
    
    for (let i = 0; i < Math.max(3, customer.totalVisits ?? 3); i++) {
      const date = new Date(parseISODateOnly(customer.lastServiceDate));
      date.setMonth(date.getMonth() - (i * 3));
      const mileage = Math.max(5000, baseMileage - (i * 3500));
      
      const laborLines: LaborLine[] = [
        { description: OIL_TYPES[i % OIL_TYPES.length], code: LABOR_CODES[i % LABOR_CODES.length], qty: 1.00, price: 49.99 + (i * 5) }
      ];
      
      const numParts = 1 + (i % 3);
      const partLines: PartLine[] = [];
      for (let p = 0; p < numParts; p++) {
        partLines.push({
          description: PART_DESCRIPTIONS[p % PART_DESCRIPTIONS.length],
          code: PART_CODES[p % PART_CODES.length],
          qty: 1 + (p % 3),
          price: 8 + (p * 4)
        });
      }

      const laborTotal = laborLines.reduce((sum, l) => sum + (l.qty * l.price), 0);
      const partsTotal = partLines.reduce((sum, p) => sum + (p.qty * p.price), 0);
      const total = laborTotal + partsTotal;

      invoices.push({
        invoiceNum: String(baseInvoice - i),
        date: toISODateOnly(date),
        mileage,
        location: customer.lastLocationVisited,
        total,
        laborLines,
        partLines,
        oilType: OIL_TYPES[i % OIL_TYPES.length]
      });
    }
    return invoices;
  }, [customer]);

  if (!customer) return null;
  const seg = SEGMENTS[customer.segment];

  const fullAddress = customer.address
    ? `${customer.address.street}, ${customer.address.city}, ${customer.address.state} ${customer.address.zip}`
    : null;

  const vehicleDesc = [customer.vehicleYear, customer.vehicleMake, customer.vehicleModel].filter(Boolean).join(" ");

  const toggleInvoice = (idx: number) => {
    setExpandedInvoices(prev => {
      const next = new Set(prev);
      if (next.has(idx)) {
        next.delete(idx);
      } else {
        next.add(idx);
      }
      return next;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2">
            <span className="text-lg font-semibold text-slate-900">
              {customer.name} – {customer.phone ?? "No Phone"} – {customer.licensePlate ?? "—"}
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Copy buttons */}
        <div className="flex flex-wrap gap-2">
          <CopyButton
            label="Copy phone"
            disabledLabel="No Phone"
            icon={<Phone className="mr-2 h-4 w-4" />}
            onCopy={() => customer.phone && navigator.clipboard.writeText(customer.phone)}
            disabled={!customer.phone}
          />
          <CopyButton
            label="Copy email"
            disabledLabel="No Email"
            icon={<Mail className="mr-2 h-4 w-4" />}
            onCopy={() => customer.email && navigator.clipboard.writeText(customer.email)}
            disabled={!customer.email}
          />
          <CopyButton
            label="Copy summary"
            icon={<ClipboardCopy className="mr-2 h-4 w-4" />}
            onCopy={() => {
              const summary = [
                `Customer: ${customer.name}`,
                `License Plate: ${customer.licensePlate ?? "—"}`,
                `Phone: ${customer.phone ?? "—"}`,
                `Email: ${customer.email ?? "—"}`,
                `Address: ${fullAddress ?? "—"}`,
                `Vehicle: ${vehicleDesc || "—"}`,
                `Last visit: ${customer.lastServiceDate}${customer.lastInvoiceNumber ? ` (Inv ${customer.lastInvoiceNumber})` : ""}`,
                `Location: ${customer.lastLocationVisited}`,
              ].join("\n");
              navigator.clipboard.writeText(summary);
            }}
          />
        </div>

        {/* Two-column layout matching reference image */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Left column - Customer Information */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 mb-3">
              <User className="h-4 w-4 text-sky-600" />
              Customer Information
            </div>
            <div className="space-y-1 text-sm">
              <div><span className="font-medium text-slate-500">Customer ID:</span> <span className="text-sky-600">{customer.licensePlate ?? "—"}</span></div>
              <div className="text-slate-900">{customer.name}</div>
              {customer.address && (
                <>
                  <div className="text-slate-900">{customer.address.street}</div>
                  <div className="text-slate-900">{customer.address.city}, {customer.address.state} {customer.address.zip}</div>
                </>
              )}
              <div className="pt-1">
                <span className="text-slate-900">{customer.phone ?? "—"}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-sky-600">{customer.email ?? "—"}</span>
                {customer.emailVerified && <Check className="h-4 w-4 text-emerald-500" />}
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-1 mt-3">
              <Pill className={seg.pillClass}>{seg.label}</Pill>
              {customer.doNotCall && <Pill className="bg-slate-100 text-slate-700">Do not call</Pill>}
              {customer.preferredContact && (
                <Pill className="bg-slate-100 text-slate-700">Prefers {customer.preferredContact}</Pill>
              )}
            </div>
          </div>

          {/* Right column - Vehicle Info + Last Service Summary */}
          <div className="space-y-4">
            {/* Vehicle Information */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 mb-3">
                <Car className="h-4 w-4 text-sky-600" />
                Vehicle Information
              </div>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium text-slate-500">Vehicle ID:</span> <span className="text-sky-600">{customer.licensePlate ?? "—"}</span></div>
                <div><span className="font-medium text-slate-500">VIN:</span> <span className="text-slate-900">{customer.vin ?? "(none)"}</span></div>
                <div><span className="font-medium text-slate-500">License Plate:</span> <span className="text-sky-600">{customer.licensePlate ?? "—"}</span></div>
                <div className="text-slate-900">{vehicleDesc || "—"}</div>
              </div>
            </div>

            {/* Last Service Summary */}
            <div className="rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 mb-3">
                <Wrench className="h-4 w-4 text-sky-600" />
                Last Service Summary
              </div>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-medium text-slate-500">Last LOF:</span>{" "}
                  <span className="text-amber-600">{fmtDate(parseISODateOnly(customer.lastServiceDate))}</span>
                </div>
                <div className="text-slate-900">
                  {customer.lastOilType ?? "Oil Change"} @ {customer.vehicleMileage?.toLocaleString() ?? "—"} miles
                </div>
                <div>
                  <span className="font-medium text-slate-500">Invoice Total:</span>{" "}
                  <span className="text-slate-900">${invoiceHistory[0]?.total.toFixed(2) ?? "0.00"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Activity Timeline */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center gap-2 text-[13px] font-semibold text-slate-900 mb-2">
            <MapPin className="h-4 w-4 text-sky-600" />
            Activity Timeline
          </div>
          <div className="text-[11px] text-slate-500 mb-3">Click on an invoice to see more details.</div>
          
          <div className="space-y-2">
            {invoiceHistory.map((invoice, idx) => {
              const isExpanded = expandedInvoices.has(idx);
              return (
                <div key={idx} className="rounded-lg border border-slate-200 bg-white overflow-hidden">
                  <button
                    type="button"
                    onClick={() => toggleInvoice(idx)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-sky-600" />
                      <span className="text-sm font-semibold text-slate-900">
                        Invoice {invoice.invoiceNum} – {fmtDate(parseISODateOnly(invoice.date))}
                      </span>
                      <span className="text-sm text-slate-500">
                        ${invoice.total.toFixed(2)}
                      </span>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    )}
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-slate-100">
                      <div className="grid grid-cols-3 gap-4 py-3 text-sm">
                        <div>
                          <span className="text-slate-500">Invoice #:</span>{" "}
                          <span className="text-sky-600 font-medium">{invoice.invoiceNum}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Mileage:</span>{" "}
                          <span className="text-slate-900">{invoice.mileage.toLocaleString()}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Invoice Total:</span>{" "}
                          <span className="text-slate-900 font-medium">${invoice.total.toFixed(2)}</span>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <div className="text-[11px] font-semibold text-slate-500 uppercase mb-1">Labor</div>
                          {invoice.labor.map((l, li) => (
                            <div key={li} className="flex justify-between text-sm py-0.5">
                              <span className="text-slate-700">{l.description}</span>
                              <span className="text-slate-900">${l.price.toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold text-slate-500 uppercase mb-1">Parts</div>
                          {invoice.parts.map((p, pi) => (
                            <div key={pi} className="flex justify-between text-sm py-0.5">
                              <span className="text-slate-700">{p.description} (x{p.qty})</span>
                              <span className="text-slate-900">${(p.price * p.qty).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Reminder Factors */}
        <div className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="text-[13px] font-semibold text-slate-900 mb-2">Reminder Factors</div>
          <div className="text-sm text-slate-900">
            Throttle Pro's reminder algorithm - based on this customer's unique driving habits.
          </div>
        </div>


        {/* Customer notes */}
        {customer.notes && (
          <div className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="text-[11px] text-slate-500 mb-1">Customer notes</div>
            <div className="text-sm text-slate-900">{customer.notes}</div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

// Helper to generate mock customers
const FIRST_NAMES = ["Bob", "Jane", "Sarah", "Michael", "Emily", "David", "Lisa", "James", "Maria", "John", "Ashley", "Robert", "Jennifer", "William", "Linda", "Christopher", "Barbara", "Daniel", "Elizabeth", "Matthew", "Susan", "Anthony", "Jessica", "Mark", "Karen"];
const LAST_NAMES = ["GoodFellow", "Driver", "Mitchell", "Torres", "Chen", "Williams", "Johnson", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson"];
const LOCATIONS = ["Vallejo, CA", "Napa, CA", "Fairfield, CA", "Benicia, CA", "American Canyon, CA", "Vacaville, CA"];
const STORE_CODES = ["7040", "7041", "7042", "7043", "7044", "7045"];
const STREETS = ["106 Maher Ct", "234 Main St", "567 Oak Ave", "890 Pine Rd", "123 Elm Blvd", "456 Cedar Ln"];
const OIL_TYPES = ["Chevron High Mileage", "Pennzoil Synthetic", "Valvoline Conventional", "Mobil 1 Full Synthetic", "Castrol GTX"];
const VEHICLE_MAKES = ["ACURA", "HONDA", "TOYOTA", "FORD", "CHEVROLET", "BMW", "NISSAN", "SUBARU"];
const VEHICLE_MODELS = ["ACCORD", "CIVIC", "CAMRY", "F-150", "MALIBU", "3-SERIES", "ALTIMA", "OUTBACK"];
const LABOR_CODES = ["Chevron High Mileage", "Pennzoil Platinum", "Valvoline MaxLife", "Mobil 1 Extended"];
const PART_DESCRIPTIONS = ["Oil Filter", "Air Filter", "Cabin Filter", "Wiper Blades", "Drain Plug Gasket"];
const PART_CODES = ["OF4459", "AF2341", "CF8899", "WB1234", "DPG567"];

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
      const customerId = `CA-${firstName.toUpperCase()}${lastName.toUpperCase()}`;
      
      // Calculate a date within the segment's range
      const minMonths = seg.monthsMin;
      const maxMonths = seg.monthsMax ?? 36;
      const monthsAgo = minMonths + Math.floor(Math.random() * (maxMonths - minMonths + 1));
      const lastDate = new Date(now);
      lastDate.setMonth(lastDate.getMonth() - monthsAgo);
      lastDate.setDate(Math.floor(Math.random() * 28) + 1);

      const hasPhone = Math.random() > 0.15;
      const hasEmail = Math.random() > 0.1;
      const location = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
      const storeCode = STORE_CODES[Math.floor(Math.random() * STORE_CODES.length)];
      const vehicleYear = 2000 + Math.floor(Math.random() * 24);
      const vehicleMake = VEHICLE_MAKES[Math.floor(Math.random() * VEHICLE_MAKES.length)];
      const vehicleModel = VEHICLE_MODELS[Math.floor(Math.random() * VEHICLE_MODELS.length)];
      const vehicleMileage = 15000 + Math.floor(Math.random() * 135000); // Cap at 150K
      
      // Generate realistic CA license plate format: 7ABC123 or 8XYZ456
      const plateNum = Math.floor(Math.random() * 10);
      const plateLetters = String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                          String.fromCharCode(65 + Math.floor(Math.random() * 26)) +
                          String.fromCharCode(65 + Math.floor(Math.random() * 26));
      const plateDigits = String(Math.floor(Math.random() * 1000)).padStart(3, "0");
      const licensePlate = `${plateNum}${plateLetters}${plateDigits}`;
      const invoiceSubtotal = 50 + Math.floor(Math.random() * 150);
      const oilType = OIL_TYPES[Math.floor(Math.random() * OIL_TYPES.length)];

      // Generate labor and parts
      const laborLines: LaborLine[] = [
        { description: oilType, code: LABOR_CODES[Math.floor(Math.random() * LABOR_CODES.length)], qty: 1.00, price: 49.99 + Math.floor(Math.random() * 30) }
      ];
      
      const numParts = 1 + Math.floor(Math.random() * 3);
      const partLines: PartLine[] = [];
      for (let p = 0; p < numParts; p++) {
        partLines.push({
          description: PART_DESCRIPTIONS[p % PART_DESCRIPTIONS.length],
          code: PART_CODES[p % PART_CODES.length],
          qty: 1 + Math.floor(Math.random() * 5),
          price: 4 + Math.floor(Math.random() * 15)
        });
      }

      customers.push({
        id: `c${id++}`,
        customerId,
        name,
        segment,
        address: {
          street: STREETS[Math.floor(Math.random() * STREETS.length)],
          city: location.split(", ")[0],
          state: "CA",
          zip: String(94500 + Math.floor(Math.random() * 100))
        },
        lastServiceDate: toISODateOnly(lastDate),
        lastInvoiceNumber: String(318000 + Math.floor(Math.random() * 1000)),
        lastLocationVisited: location,
        storeCode,
        phone: hasPhone ? `(${String(Math.floor(Math.random() * 900) + 100)}) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}` : undefined,
        email: hasEmail ? `${firstName.toLowerCase()}${lastName.toLowerCase().charAt(0)}${Math.floor(Math.random() * 100)}@${["gmail.com", "yahoo.com", "hotmail.com"][Math.floor(Math.random() * 3)]}` : undefined,
        emailVerified: hasEmail && Math.random() > 0.3,
        licensePlate,
        vehicleId: licensePlate,
        vin: Math.random() > 0.5 ? undefined : `1HGBH41JXMN${String(Math.floor(Math.random() * 100000)).padStart(6, "0")}`,
        vehicleYear,
        vehicleMake,
        vehicleModel: `${vehicleModel} ${["LX", "EX", "SE", "Limited"][Math.floor(Math.random() * 4)]}`,
        vehicleMileage,
        totalVisits: Math.floor(Math.random() * 15) + 1,
        reminderInterval: [60, 90, 120][Math.floor(Math.random() * 3)],
        lastOilType: oilType,
        invoiceSubtotal,
        laborLines,
        partLines,
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
  const [customDateMode, setCustomDateMode] = React.useState(false);

  React.useEffect(() => {
    if (customDateMode) return; // Don't auto-update dates when in custom mode
    const now = new Date();
    const seg = SEGMENTS[selectedSegment];
    const end = subMonths(now, seg.monthsMin);
    const start = seg.monthsMax === undefined ? undefined : subMonths(now, seg.monthsMax);
    setEndDate(toISODateOnly(end));
    setStartDate(start ? toISODateOnly(start) : "");
    setShowAll(false); // Reset to collapsed when segment changes
  }, [selectedSegment, customDateMode]);

  const handleSegmentClick = (k: SegmentKey) => {
    setCustomDateMode(false);
    setSelectedSegment(k);
  };

  const handleProcessCustomDates = () => {
    setCustomDateMode(true);
    setShowAll(false);
  };

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
      .filter((c) => customDateMode ? true : c.segment === selectedSegment)
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
  }, [customDateMode, selectedSegment, startDate, endDate, search, onlyReachable, sortKey, sortDir]);

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
      "Cust Ph": c.phone ?? "",
      "Cust Email": c.email ?? "",
      "Last Service Date": fmtDate(parseISODateOnly(c.lastServiceDate)),
      "Last Invoice #": c.lastInvoiceNumber ?? "",
      "# of Previous Visits": String(c.totalVisits ?? 0),
      "License Plate": c.licensePlate ?? "",
      "Last Location Visited": c.lastLocationVisited,
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
                active={!customDateMode && selectedSegment === k}
                title={SEGMENTS[k].label}
                subtitle={SEGMENTS[k].sub}
                value={counts[k]}
                className={`border ${SEGMENTS[k].tileClass}`}
                onClick={() => handleSegmentClick(k)}
              />
            ))}
          </div>

          {/* Segment mix visualization */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-[13px] font-semibold text-slate-900">Mix by segment</div>
            <div className="text-[11px] text-slate-500">% of customers by recency</div>
            
            {/* Stacked bar */}
            <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full">
              {(Object.keys(SEGMENTS) as SegmentKey[]).map((k) => {
                const total = Object.values(counts).reduce((sum, v) => sum + v, 0);
                const pct = total > 0 ? (counts[k] / total) * 100 : 0;
                const barColors: Record<SegmentKey, string> = {
                  active: "bg-emerald-200",
                  retained: "bg-sky-200",
                  lapsed: "bg-amber-200",
                  inactive: "bg-orange-200",
                  lost: "bg-rose-200",
                };
                return (
                  <div
                    key={k}
                    className={`${barColors[k]} transition-all`}
                    style={{ width: `${pct}%` }}
                  />
                );
              })}
            </div>

            {/* Legend */}
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1">
              {(Object.keys(SEGMENTS) as SegmentKey[]).map((k) => {
                const total = Object.values(counts).reduce((sum, v) => sum + v, 0);
                const pct = total > 0 ? (counts[k] / total) * 100 : 0;
                const dotColors: Record<SegmentKey, string> = {
                  active: "bg-emerald-200",
                  retained: "bg-sky-200",
                  lapsed: "bg-amber-200",
                  inactive: "bg-orange-200",
                  lost: "bg-rose-200",
                };
                return (
                  <div key={k} className="flex items-center gap-1.5 text-[11px] text-slate-600">
                    <span className={`h-2 w-2 rounded-full ${dotColors[k]}`} />
                    {SEGMENTS[k].label.replace(" Customers", "")} · {pct.toFixed(0)}%
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls row */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm space-y-3">
            <div className="text-[13px] font-semibold text-slate-900">Custom date range</div>
            
            {/* First row: Start date, End date, Process button, Checkbox */}
            <div className="flex flex-wrap items-end gap-4">
              <div>
                <div className="text-[11px] font-medium text-slate-500 mb-1">Start date</div>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-[150px] rounded-xl"
                  placeholder="(optional)"
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

              <Button
                className="rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                variant="ghost"
                onClick={handleProcessCustomDates}
              >
                Process
              </Button>

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
                {customDateMode ? (
                  <Pill className="bg-indigo-50 text-indigo-700">Custom Dates</Pill>
                ) : (
                  <Pill className={selectedSeg.pillClass}>{selectedSeg.label}</Pill>
                )}
                <Button
                  className="rounded-full bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"
                  variant="ghost"
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
                  className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] font-medium text-slate-600 hover:bg-slate-100 transition-colors"
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
