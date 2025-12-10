import React, { useMemo, useState, useEffect } from "react";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";

/* ------------------------------------------------------------------ */
/* Types & data                                                       */
/* ------------------------------------------------------------------ */

type Channel = "postcard" | "email" | "text";

type JourneyTouchPoint = {
  id: string;
  name: string;
  interval: string;
  channels: Channel[];
  sent: number;
  responses: number;
  responseRate: number; // %
  roas: number; // x
  revenue: number; // $
};

const TOUCH_POINTS: JourneyTouchPoint[] = [
  {
    id: "thank-you-text",
    name: "Thank You Text",
    interval: "1 day after Service",
    channels: ["text"],
    sent: 1850,
    responses: 420,
    responseRate: 22.7,
    roas: 9.5,
    revenue: 22400,
  },
  {
    id: "thank-you-email",
    name: "Thank You",
    interval: "1 day after Service",
    channels: ["email"],
    sent: 1850,
    responses: 420,
    responseRate: 22.7,
    roas: 9.5,
    revenue: 22400,
  },
  {
    id: "ss-1w",
    name: "Suggested Services",
    interval: "1 week after Service",
    channels: ["email"],
    sent: 1760,
    responses: 310,
    responseRate: 17.6,
    roas: 12.1,
    revenue: 18600,
  },
  {
    id: "second-vehicle",
    name: "2nd Vehicle Invitation",
    interval: "10 days after Service",
    channels: ["email"],
    sent: 900,
    responses: 150,
    responseRate: 16.7,
    roas: 10.3,
    revenue: 12800,
  },
  {
    id: "ss-1m",
    name: "Suggested Services",
    interval: "1 month after Service",
    channels: ["email"],
    sent: 1640,
    responses: 240,
    responseRate: 14.6,
    roas: 11.2,
    revenue: 17400,
  },
  {
    id: "ss-3m",
    name: "Suggested Services",
    interval: "3 months after Service",
    channels: ["email"],
    sent: 1520,
    responses: 230,
    responseRate: 15.1,
    roas: 10.9,
    revenue: 16800,
  },
  {
    id: "ss-6m",
    name: "Suggested Services",
    interval: "6 months after Service",
    channels: ["email"],
    sent: 1380,
    responses: 210,
    responseRate: 15.2,
    roas: 10.8,
    revenue: 16000,
  },
  {
    id: "newsletter",
    name: "Monthly Newsletter",
    interval: "Once a month",
    channels: ["email"],
    sent: 4200,
    responses: 520,
    responseRate: 12.4,
    roas: 7.8,
    revenue: 32000,
  },
  {
    id: "reminder-1",
    name: "Reminder 1",
    interval: "5k after last Service",
    channels: ["postcard", "email", "text"],
    sent: 1380,
    responses: 280,
    responseRate: 20.3,
    roas: 16.4,
    revenue: 26500,
  },
  {
    id: "reminder-2",
    name: "Reminder 2",
    interval: "30 days after Reminder 1",
    channels: ["postcard", "email", "text"],
    sent: 980,
    responses: 142,
    responseRate: 14.5,
    roas: 10.7,
    revenue: 18200,
  },
  {
    id: "reminder-3",
    name: "Reminder 3",
    interval: "10k after last Service",
    channels: ["postcard", "email", "text"],
    sent: 860,
    responses: 120,
    responseRate: 14.0,
    roas: 9.8,
    revenue: 17000,
  },
  {
    id: "reminder-4",
    name: "Reminder 4",
    interval: "15k after last Service",
    channels: ["postcard", "email", "text"],
    sent: 740,
    responses: 105,
    responseRate: 14.2,
    roas: 9.4,
    revenue: 16100,
  },
  {
    id: "reactivation-12",
    name: "Reactivation",
    interval: "12 months after Service",
    channels: ["email"],
    sent: 620,
    responses: 86,
    responseRate: 13.9,
    roas: 8.2,
    revenue: 13200,
  },
  {
    id: "reactivation-18",
    name: "Reactivation",
    interval: "18 months after Service",
    channels: ["email"],
    sent: 480,
    responses: 64,
    responseRate: 13.3,
    roas: 7.5,
    revenue: 11800,
  },
  {
    id: "reactivation-24",
    name: "Reactivation",
    interval: "24 months after Service",
    channels: ["email"],
    sent: 360,
    responses: 46,
    responseRate: 12.8,
    roas: 7.1,
    revenue: 10400,
  },
];

/* ------------------------------------------------------------------ */
/* KPI preferences (Customize)                                        */
/* ------------------------------------------------------------------ */

const ALL_KPI_KEYS = ["vehicles", "avgRoas", "avgResp", "totalComms"] as const;
type KpiKey = (typeof ALL_KPI_KEYS)[number];

interface KpiDefinition {
  key: KpiKey;
  label: string;
  format: (stats: ComputedStats) => string;
  helper?: (stats: ComputedStats) => string | undefined;
}

type ComputedStats = {
  vehicles: number;
  avgRoas: number;
  avgResp: number;
  totalComms: number;
};

const KPI_DEFS: KpiDefinition[] = [
  {
    key: "vehicles",
    label: "Vehicles",
    format: (s) => s.vehicles.toLocaleString(),
  },
  {
    key: "avgRoas",
    label: "Avg ROAS",
    format: (s) => `${s.avgRoas.toFixed(1)}x`,
  },
  {
    key: "avgResp",
    label: "Avg resp %",
    format: (s) => `${s.avgResp.toFixed(1)}%`,
  },
  {
    key: "totalComms",
    label: "Total comms sent",
    format: (s) => s.totalComms.toLocaleString(),
  },
];

function useKpiPreferences(reportId: string) {
  const storageKey = `tp.kpiPrefs.${reportId}`;
  const [selected, setSelected] = useState<KpiKey[]>(() => {
    if (typeof window === "undefined") return [...ALL_KPI_KEYS];
    try {
      const raw = window.localStorage.getItem(storageKey);
      if (!raw) return [...ALL_KPI_KEYS];
      const parsed = JSON.parse(raw) as KpiKey[];
      return parsed.length ? parsed : [...ALL_KPI_KEYS];
    } catch {
      return [...ALL_KPI_KEYS];
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(storageKey, JSON.stringify(selected));
  }, [selected, storageKey]);

  const toggle = (key: KpiKey) => {
    setSelected((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const selectAll = () => setSelected([...ALL_KPI_KEYS]);

  return { selected, toggle, selectAll };
}

const CustomizeKpisButton: React.FC<{
  selected: KpiKey[];
  toggle: (key: KpiKey) => void;
  selectAll: () => void;
}> = ({ selected, toggle, selectAll }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white hover:bg-slate-50"
      >
        <span className="h-3 w-3 rounded-full border border-slate-400 flex items-center justify-center text-[9px]">
          ⚙
        </span>
        Customize
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-60 rounded-2xl border border-slate-200 bg-white shadow-lg z-20">
          <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-800">KPI tiles</span>
            <button type="button" onClick={selectAll} className="text-[11px] text-sky-600 hover:text-sky-700">
              Select all
            </button>
          </div>
          <div className="px-3 py-2 space-y-1">
            {KPI_DEFS.map((kpi) => {
              const isChecked = selected.includes(kpi.key);
              return (
                <label
                  key={kpi.key}
                  className="flex items-center justify-between gap-2 text-xs text-slate-700 cursor-pointer py-1"
                >
                  <span>{kpi.label}</span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggle(kpi.key)}
                    className="h-3 w-3 rounded border-slate-300 text-sky-600"
                  />
                </label>
              );
            })}
          </div>
          <div className="px-3 py-2 border-t border-slate-100 text-[11px] text-slate-400 flex justify-end">
            <button type="button" onClick={() => setOpen(false)} className="hover:text-slate-600">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Helpers                                                            */
/* ------------------------------------------------------------------ */

function channelLabel(channels: Channel[]): string {
  const names: Record<Channel, string> = {
    postcard: "Postcard",
    email: "Email",
    text: "Text Message",
  };
  return channels.map((c) => names[c]).join(" + ");
}

function channelColor(channel: Channel): string {
  switch (channel) {
    case "postcard":
      return "bg-sky-200";
    case "email":
      return "bg-emerald-200";
    case "text":
      return "bg-indigo-200";
    default:
      return "bg-slate-200";
  }
}

function responseColor(rate: number): string {
  if (rate >= 15) return "text-emerald-600";
  if (rate >= 10) return "text-amber-600";
  if (rate >= 5) return "text-yellow-500";
  return "text-rose-600";
}

/* ------------------------------------------------------------------ */
/* Main page                                                          */
/* ------------------------------------------------------------------ */

const CustomerJourneyPage: React.FC = () => {
  const [tab, setTab] = useState<"visualization" | "details">("visualization");

  const stats: ComputedStats = useMemo(() => {
    const vehicles = TOUCH_POINTS.reduce((sum, t) => sum + t.responses, 0);
    const totalComms = TOUCH_POINTS.reduce((sum, t) => sum + t.sent, 0);
    const avgRoas = TOUCH_POINTS.reduce((sum, t) => sum + t.roas, 0) / TOUCH_POINTS.length;
    const avgResp = TOUCH_POINTS.reduce((sum, t) => sum + t.responseRate, 0) / TOUCH_POINTS.length;

    return { vehicles, totalComms, avgRoas, avgResp };
  }, []);

  const { selected, toggle, selectAll } = useKpiPreferences("customer-journey");

  const visibleKpis = KPI_DEFS.filter((k) => selected.includes(k.key));

  const maxRespRate = useMemo(() => Math.max(...TOUCH_POINTS.map((t) => t.responseRate), 1), []);

  return (
    <ShellLayout
      breadcrumb={[{ label: "Home", to: "/" }, { label: "Reports & Insights", to: "/" }, { label: "Customer Journey" }]}
      rightInfo={
        <>
          <span>
            Store group: <span className="font-medium">North Bay Group</span>
          </span>
          <span>
            Period: <span className="font-medium">Last 12 months</span>
          </span>
        </>
      }
    >
      {/* Header + KPI customize button */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">Customer Journey</h1>
          <p className="mt-1 text-sm text-slate-500">
            Performance of the standard Throttle journey touch points for this store: thank-you, suggested services,
            reminders and reactivation.
          </p>
        </div>
        <CustomizeKpisButton selected={selected} toggle={toggle} selectAll={selectAll} />
      </div>

      {/* KPI row + AI Insights (same pattern as One-Off) */}
      <div className="mt-4 grid grid-cols-1 xl:grid-cols-5 gap-4 items-stretch">
        {/* Left: KPI tiles */}
        <div className="xl:col-span-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {visibleKpis.map((kpi) => (
              <MetricTile
                key={kpi.key}
                label={kpi.label}
                value={kpi.format(stats)}
                helper={kpi.helper ? kpi.helper(stats) : undefined}
              />
            ))}
          </div>
        </div>

        {/* Right: AI Insights – moved up next to the KPIs */}
        <div className="xl:col-span-1 self-start">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on 12 months data"
            bullets={[
              "Thank-you touch points drive the highest RESP % – protect these.",
              "Suggested Services after 1–3 months show strong ROAS; consider additional education.",
              "Reminder 1 delivers the best balance of RESP % and revenue per send.",
            ]}
          />
        </div>
      </div>

      {/* Journey visualization + Details card, full-width under the KPI + AI row */}
      <div className="mt-4">
        <section className="rounded-2xl bg-white border border-slate-200 shadow-sm">
          {/* Tile header */}
          <div className="flex items-start justify-between px-4 pt-4 pb-3 gap-4">
            <div>
              <h2 className="text-base md:text-lg font-semibold text-slate-900">Customer Journey</h2>
              <p className="mt-1 text-xs text-slate-600">Touch point + Response Rate + ROAS</p>
              <p className="mt-1 text-[11px] text-slate-500">
                {stats.vehicles.toLocaleString()} journey vehicles · {stats.totalComms.toLocaleString()} comms sent
              </p>
            </div>
            <div className="flex items-center">
              <div className="inline-flex items-center rounded-full bg-slate-100 p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setTab("visualization")}
                  className={`px-3 py-1 rounded-full ${
                    tab === "visualization"
                      ? "bg-white shadow-sm text-slate-900"
                      : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  Visualization
                </button>
                <button
                  type="button"
                  onClick={() => setTab("details")}
                  className={`px-3 py-1 rounded-full ${
                    tab === "details" ? "bg-white shadow-sm text-slate-900" : "text-slate-600 hover:text-slate-800"
                  }`}
                >
                  Details
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100" />

          {tab === "visualization" ? (
            <div className="px-4 pb-4 pt-3 space-y-4 text-xs text-slate-700">
              {TOUCH_POINTS.map((tp, idx) => (
                <div key={tp.id} className="space-y-2">
                  {/* Top row: name + stats */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        {idx + 1}. {tp.name}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500">{tp.interval}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">{channelLabel(tp.channels)}</div>
                    </div>
                    <div className="text-right min-w-[120px]">
                      <div className={`text-sm font-semibold ${responseColor(tp.responseRate)}`}>
                        {tp.responseRate.toFixed(1)}% RESP
                      </div>
                      <div className="text-xs text-slate-700">{tp.roas.toFixed(1)}x ROAS</div>
                      <div className="mt-1 text-[11px] text-slate-500">
                        {tp.sent.toLocaleString()} sent · ${tp.revenue.toLocaleString()} rev
                      </div>
                    </div>
                  </div>

                  {/* Channel bar */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-sky-400"
                        style={{
                          width: `${(tp.responseRate / maxRespRate) * 100}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Channel legend */}
                  <div className="flex flex-wrap gap-3 text-[11px] text-slate-500">
                    {tp.channels.map((ch) => (
                      <span key={ch} className="inline-flex items-center gap-1">
                        <span className={`h-2 w-2 rounded-full ${channelColor(ch)}`} />
                        <span>{channelLabel([ch])}</span>
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* Details tab – drops-style layout */
            <div className="px-4 pb-4 pt-3 text-xs">
              <div className="mb-2 flex items-center justify-between text-[11px] uppercase tracking-wide text-slate-500">
                <span>Touch point &amp; timing</span>
                <div className="flex items-center gap-8">
                  <span className="w-16 text-right">Sent</span>
                  <span className="w-16 text-right">Responses</span>
                  <span className="w-16 text-right">Resp %</span>
                  <span className="w-16 text-right">ROAS</span>
                  <span className="w-20 text-right">Revenue</span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {TOUCH_POINTS.map((tp, idx) => (
                  <div key={tp.id} className="flex items-center justify-between gap-4 py-3">
                    <div className="min-w-[220px]">
                      <div className="text-sm font-semibold text-slate-900">
                        {idx + 1}. {tp.name}
                      </div>
                      <div className="mt-0.5 text-[11px] text-slate-500">{tp.interval}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">Channels: {channelLabel(tp.channels)}</div>
                    </div>
                    <div className="flex items-baseline gap-8 text-xs text-slate-700">
                      <div className="w-16 text-right">{tp.sent.toLocaleString()}</div>
                      <div className="w-16 text-right">{tp.responses.toLocaleString()}</div>
                      <div className={`w-16 text-right font-semibold ${responseColor(tp.responseRate)}`}>
                        {tp.responseRate.toFixed(1)}%
                      </div>
                      <div className="w-16 text-right">{tp.roas.toFixed(1)}x</div>
                      <div className="w-20 text-right">${tp.revenue.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </ShellLayout>
  );
};

export default CustomerJourneyPage;
