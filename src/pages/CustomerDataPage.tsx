import React, { useMemo, useState } from "react";
import { ShellLayout, MetricTile } from "@/components/layout";

type CustomerSummary = {
  storeName: string;
  periodLabel: string;
  totalCustomers: number;
  avgVisits: number;
  avgLtv: number;
  emailReachPct: number;
  smsReachPct: number;
  mailReachPct: number;
};

type CustomerRow = {
  name: string;
  vehicle: string;
  visits: number;
  ltv: number;
  ticketAvg: number;
  lastVisit: string;
  emailStatus: "valid" | "unsub" | "none";
  smsStatus: "valid" | "none";
  mailStatus: "valid" | "none";
};

const customerSummary: CustomerSummary = {
  storeName: "All Stores",
  periodLabel: "All time (demo)",
  totalCustomers: 4582,
  avgVisits: 3.2,
  avgLtv: 342.5,
  emailReachPct: 74,
  smsReachPct: 63,
  mailReachPct: 86,
};

const customerRows: CustomerRow[] = [
  { name: "Jane Smith", vehicle: "2018 Toyota Camry · 7XYZ123", visits: 5, ltv: 642, ticketAvg: 128, lastVisit: "2024-10-12", emailStatus: "valid", smsStatus: "valid", mailStatus: "valid" },
  { name: "Michael Johnson", vehicle: "2016 Ford F-150 · 3ABC456", visits: 3, ltv: 297, ticketAvg: 99, lastVisit: "2024-09-22", emailStatus: "unsub", smsStatus: "valid", mailStatus: "valid" },
  { name: "Laura Chen", vehicle: "2021 Subaru Outback · 9LMN789", visits: 2, ltv: 210, ticketAvg: 105, lastVisit: "2024-08-18", emailStatus: "valid", smsStatus: "none", mailStatus: "valid" },
  { name: "Carlos Garcia", vehicle: "2012 Honda Civic · 4DEF321", visits: 1, ltv: 79, ticketAvg: 79, lastVisit: "2023-12-01", emailStatus: "none", smsStatus: "none", mailStatus: "none" },
];

const CustomerDataPage: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Most active customers have valid email and SMS; blank records tend to be low LTV and low visit counts.",
    "Multi-channel customers visit more often and generate higher lifetime value than single-channel or unreachable customers.",
    "Focus data capture on customers with only mail or no email/SMS to grow future campaign reach.",
  ]);

  const highValueCount = useMemo(() => customerRows.filter((c) => c.ltv >= 300).length, []);

  const regenerateInsights = () => {
    setInsights([
      `${customerSummary.emailReachPct}% of customers are reachable by email and ${customerSummary.smsReachPct}% by SMS.`,
      `${highValueCount} high-value customers (LTV > $300) are present in this sample; keeping them on-schedule is critical.`,
      "In the full dataset, segmenting by contactability and LTV will help prioritize who to target with journeys and one-off campaigns.",
    ]);
  };

  const breadcrumb = [
    { label: "Home", to: "/" },
    { label: "Reports & Insights", to: "/" },
    { label: "Customer Data" },
  ];

  const rightInfo = (
    <>
      <span>Store: <span className="font-medium">{customerSummary.storeName}</span></span>
      <span>Period: <span className="font-medium">{customerSummary.periodLabel}</span></span>
    </>
  );

  return (
    <ShellLayout breadcrumb={breadcrumb} rightInfo={rightInfo}>
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Customer Data</h1>
          <p className="mt-1 text-sm text-slate-500">
            Customer and vehicle roster with visit history, lifetime value and contactability across channels.
          </p>
        </div>
        <div className="flex gap-3 text-xs">
          <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
            <div className="text-slate-400">Total customers</div>
            <div className="mt-0.5 text-base font-semibold">{customerSummary.totalCustomers.toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
        <MetricTile label="Avg visits per customer" value={customerSummary.avgVisits.toFixed(1)} />
        <MetricTile label="Avg lifetime value" value={`$${customerSummary.avgLtv.toFixed(0)}`} />
        <MetricTile label="Reachable by email" value={`${customerSummary.emailReachPct}%`} />
        <MetricTile label="Reachable by SMS" value={`${customerSummary.smsReachPct}%`} />
        <MetricTile label="Reachable by mail" value={`${customerSummary.mailReachPct}%`} />
      </div>

      {/* Insights + table */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Insights */}
        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-800">AI insights (mock)</h2>
            <button onClick={regenerateInsights} className="text-[11px] px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600">Refresh</button>
          </div>
          <ul className="space-y-1 text-xs text-slate-600">
            {insights.map((line, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-slate-400">
            In the full app, this panel will call Lovable/OpenAI with live customer metrics to generate store-specific recommendations and segments.
          </p>
        </div>

        {/* Table */}
        <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-800">Sample customers</h2>
            <span className="text-[11px] text-slate-400">Contactability and value (dummy data)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full text-xs">
              <thead>
                <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                  <th className="py-2 pr-3">Customer</th>
                  <th className="py-2 pr-3">Vehicle</th>
                  <th className="py-2 pr-3 text-right">Visits</th>
                  <th className="py-2 pr-3 text-right">LTV</th>
                  <th className="py-2 pr-3 text-right">Ticket avg</th>
                  <th className="py-2 pr-3">Last visit</th>
                  <th className="py-2 pr-3">Email</th>
                  <th className="py-2 pr-3">SMS</th>
                  <th className="py-2 pr-3">Mail</th>
                </tr>
              </thead>
              <tbody>
                {customerRows.map((row) => (
                  <tr key={row.name + row.vehicle} className="border-t border-slate-100">
                    <td className="py-2 pr-3 text-slate-700">{row.name}</td>
                    <td className="py-2 pr-3 text-slate-600">{row.vehicle}</td>
                    <td className="py-2 pr-3 text-right">{row.visits}</td>
                    <td className="py-2 pr-3 text-right">${row.ltv.toFixed(0)}</td>
                    <td className="py-2 pr-3 text-right">${row.ticketAvg.toFixed(0)}</td>
                    <td className="py-2 pr-3 text-slate-600">{row.lastVisit}</td>
                    <td className="py-2 pr-3"><ContactBadge type="email" status={row.emailStatus} /></td>
                    <td className="py-2 pr-3"><ContactBadge type="sms" status={row.smsStatus} /></td>
                    <td className="py-2 pr-3"><ContactBadge type="mail" status={row.mailStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </ShellLayout>
  );
};

const ContactBadge: React.FC<{
  type: "email" | "sms" | "mail";
  status: CustomerRow["emailStatus"] | CustomerRow["smsStatus"] | CustomerRow["mailStatus"];
}> = ({ type, status }) => {
  if (type === "email") {
    if (status === "valid") return <Badge color="bg-emerald-50 text-emerald-700" label="Valid" />;
    if (status === "unsub") return <Badge color="bg-amber-50 text-amber-700" label="Unsub" />;
    return <Badge color="bg-slate-50 text-slate-500" label="None" />;
  }
  if (type === "sms") {
    if (status === "valid") return <Badge color="bg-emerald-50 text-emerald-700" label="Valid" />;
    return <Badge color="bg-slate-50 text-slate-500" label="None" />;
  }
  if (type === "mail") {
    if (status === "valid") return <Badge color="bg-emerald-50 text-emerald-700" label="Valid" />;
    return <Badge color="bg-slate-50 text-slate-500" label="None" />;
  }
  return null;
};

const Badge: React.FC<{ color: string; label: string }> = ({ color, label }) => (
  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] border border-slate-100 ${color}`}>
    {label}
  </span>
);

export default CustomerDataPage;
