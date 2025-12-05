import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type OilMixSummary = {
  storeName: string;
  periodLabel: string;
  invCount: number;
  conventionalPct: number;
  syntheticBlendPct: number;
  fullSynPct: number;
  highMileagePct: number;
  unclassifiedPct: number;
  conventionalRev: number;
  syntheticBlendRev: number;
  fullSynRev: number;
  highMileageRev: number;
  unclassifiedRev: number;
  vendorSharePct: number;
};

type StoreRow = {
  storeName: string;
  invCount: number;
  conventionalPct: number;
  syntheticBlendPct: number;
  fullSynPct: number;
  highMileagePct: number;
  unclassifiedPct: number;
  syntheticUnitsPct: number;
  syntheticRevPct: number;
};

const summary: OilMixSummary = {
  storeName: "All Stores",
  periodLabel: "Last 90 days",
  invCount: 18420,
  conventionalPct: 31,
  syntheticBlendPct: 22,
  fullSynPct: 37,
  highMileagePct: 8,
  unclassifiedPct: 2,
  conventionalRev: 82000,
  syntheticBlendRev: 106000,
  fullSynRev: 184000,
  highMileageRev: 72000,
  unclassifiedRev: 6000,
  vendorSharePct: 32,
};

const storeRows: StoreRow[] = [
  {
    storeName: "Vallejo, CA",
    invCount: 1842,
    conventionalPct: 28,
    syntheticBlendPct: 24,
    fullSynPct: 38,
    highMileagePct: 8,
    unclassifiedPct: 2,
    syntheticUnitsPct: 70,
    syntheticRevPct: 84,
  },
  {
    storeName: "Napa, CA",
    invCount: 1360,
    conventionalPct: 35,
    syntheticBlendPct: 23,
    fullSynPct: 30,
    highMileagePct: 10,
    unclassifiedPct: 2,
    syntheticUnitsPct: 63,
    syntheticRevPct: 79,
  },
  {
    storeName: "Fairfield, CA",
    invCount: 1210,
    conventionalPct: 24,
    syntheticBlendPct: 18,
    fullSynPct: 46,
    highMileagePct: 9,
    unclassifiedPct: 3,
    syntheticUnitsPct: 73,
    syntheticRevPct: 87,
  },
];

const OilTypeSales: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Synthetic oils represent about 69% of units and 83% of oil revenue across all stores.",
    "Vallejo leads synthetic adoption with ~70% of invoices on synthetic or high mileage.",
    "Conventional is still >30% of units; moving 10 pts of that to synthetic could significantly grow revenue.",
  ]);

  const syntheticUnitsPct = useMemo(
    () =>
      summary.syntheticBlendPct + summary.fullSynPct + summary.highMileagePct,
    []
  );

  const totalRev = useMemo(
    () =>
      summary.conventionalRev +
      summary.syntheticBlendRev +
      summary.fullSynRev +
      summary.highMileageRev +
      summary.unclassifiedRev,
    []
  );

  const syntheticRevPct = useMemo(
    () =>
      Math.round(
        ((summary.syntheticBlendRev +
          summary.fullSynRev +
          summary.highMileageRev) /
          totalRev) *
          100
      ),
    [totalRev]
  );

  const regenerateInsights = () => {
    setInsights([
      `Synthetic units are ~${syntheticUnitsPct}% but contribute ~${syntheticRevPct}% of oil revenue.`,
      "Focus upgrade conversations on high conventional stores; even a 5–10 pt shift yields meaningful revenue.",
      `Current vendor share is about ${summary.vendorSharePct}% of oil revenue; consider co-op campaigns to grow further.`,
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-slate-900 text-slate-100">
        <div className="flex items-center gap-2 px-5 h-14 border-b border-slate-800">
          <div className="h-8 w-8 rounded-xl bg-emerald-400 flex items-center justify-center font-bold text-slate-900">
            TP
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold">Throttle Pro</span>
            <span className="text-[11px] text-slate-400">Reporting Prototype</span>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 text-sm space-y-1">
          {["Dashboard", "Customers", "Campaigns", "Reports & Insights", "Organizations", "Settings"].map(
            (item) => (
              <Link
                key={item}
                to={item === "Reports & Insights" ? "/" : "#"}
                className={`w-full text-left px-3 py-2 rounded-xl flex items-center gap-2 hover:bg-slate-800 ${
                  item === "Reports & Insights" ? "bg-slate-800 font-medium" : "text-slate-300"
                }`}
              >
                <span className="h-1.5 w-1.5 rounded-full bg-slate-500" />
                <span>{item}</span>
              </Link>
            )
          )}
        </nav>
        <div className="px-4 py-4 border-t border-slate-800 text-xs text-slate-400">
          Signed in as<br />
          <span className="text-slate-200">demo@throttlepro.com</span>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-2 text-sm">
            <Link to="/" className="text-slate-400 hover:text-slate-600">
              Home
            </Link>
            <span className="text-slate-400">/</span>
            <Link to="/" className="text-slate-400 hover:text-slate-600">
              Reports & Insights
            </Link>
            <span className="text-slate-400">/</span>
            <span className="font-medium text-slate-700">Oil Type Sales</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>
              Store: <span className="font-medium">{summary.storeName}</span>
            </span>
            <span>
              Period: <span className="font-medium">{summary.periodLabel}</span>
            </span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
          {/* Title + hero tiles */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                Oil Type Sales
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Volume and revenue mix across conventional, synthetic blend, full synthetic and high mileage oils.
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Oil invoices</div>
                <div className="mt-0.5 text-base font-semibold">
                  {summary.invCount.toLocaleString()}
                </div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Vendor share</div>
                <div className="mt-0.5 text-base font-semibold">
                  {summary.vendorSharePct}%
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <OilTile
              label="Synthetic units"
              value={`${syntheticUnitsPct}%`}
              helper="Blend + full syn + high mileage"
            />
            <OilTile
              label="Synthetic revenue share"
              value={`${syntheticRevPct}%`}
              helper="Of total oil revenue"
            />
            <OilTile
              label="Conventional units"
              value={`${summary.conventionalPct}%`}
              helper="Share of oil invoices"
            />
            <OilTile
              label="Total oil revenue"
              value={`$${totalRev.toLocaleString()}`}
              helper="All oil types"
            />
            <OilTile
              label="Unclassified"
              value={`${summary.unclassifiedPct}%`}
              helper="Invoices without mapped type"
            />
          </div>

          {/* Charts + insights */}
          <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Volume mix */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-slate-800">
                  Mix by volume
                </h2>
                <span className="text-[11px] text-slate-400">
                  % of oil invoices by type
                </span>
              </div>
              <BarStack
                segments={[
                  { label: "Conventional", value: summary.conventionalPct, color: "bg-slate-400" },
                  { label: "Syn blend", value: summary.syntheticBlendPct, color: "bg-sky-400" },
                  { label: "Full syn", value: summary.fullSynPct, color: "bg-indigo-500" },
                  { label: "High mileage", value: summary.highMileagePct, color: "bg-emerald-400" },
                  { label: "Unclassified", value: summary.unclassifiedPct, color: "bg-amber-400" },
                ]}
              />
            </div>

            {/* Revenue mix */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-semibold text-slate-800">
                  Mix by revenue
                </h2>
                <span className="text-[11px] text-slate-400">
                  Share of oil revenue by type (dummy)
                </span>
              </div>
              <BarStack
                segments={[
                  {
                    label: "Conventional",
                    value: Math.round((summary.conventionalRev / totalRev) * 100),
                    color: "bg-slate-400",
                  },
                  {
                    label: "Syn blend",
                    value: Math.round((summary.syntheticBlendRev / totalRev) * 100),
                    color: "bg-sky-400",
                  },
                  {
                    label: "Full syn",
                    value: Math.round((summary.fullSynRev / totalRev) * 100),
                    color: "bg-indigo-500",
                  },
                  {
                    label: "High mileage",
                    value: Math.round((summary.highMileageRev / totalRev) * 100),
                    color: "bg-emerald-400",
                  },
                  {
                    label: "Unclassified",
                    value: Math.round((summary.unclassifiedRev / totalRev) * 100),
                    color: "bg-amber-400",
                  },
                ]}
              />
            </div>

            {/* Insights */}
            <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4 flex flex-col">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-sm font-semibold text-slate-800">
                  AI insights (mock)
                </h2>
                <button
                  onClick={regenerateInsights}
                  className="text-[11px] px-2 py-1 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600"
                >
                  Refresh
                </button>
              </div>
              <ul className="space-y-1 text-xs text-slate-600">
                {insights.map((line, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-indigo-500" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-slate-400">
                In the full app, this panel will call Lovable/OpenAI with live oil mix
                metrics to generate store- or brand-specific guidance.
              </p>
            </div>
          </section>

          {/* Store table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-sm font-semibold text-slate-800">
                Stores overview
              </h2>
              <span className="text-[11px] text-slate-400">
                Synthetic vs conventional mix by store
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Store</th>
                    <th className="py-2 pr-3 text-right">Invoices</th>
                    <th className="py-2 pr-3 text-right">Conv %</th>
                    <th className="py-2 pr-3 text-right">Syn blend %</th>
                    <th className="py-2 pr-3 text-right">Full syn %</th>
                    <th className="py-2 pr-3 text-right">High mileage %</th>
                    <th className="py-2 pr-3 text-right">Synthetic units %</th>
                    <th className="py-2 pr-3 text-right">Synthetic rev %</th>
                  </tr>
                </thead>
                <tbody>
                  {storeRows.map((row) => (
                    <tr key={row.storeName} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-700">{row.storeName}</td>
                      <td className="py-2 pr-3 text-right">
                        {row.invCount.toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-right text-slate-600">
                        {row.conventionalPct}%
                      </td>
                      <td className="py-2 pr-3 text-right text-slate-600">
                        {row.syntheticBlendPct}%
                      </td>
                      <td className="py-2 pr-3 text-right text-slate-600">
                        {row.fullSynPct}%
                      </td>
                      <td className="py-2 pr-3 text-right text-slate-600">
                        {row.highMileagePct}%
                      </td>
                      <td className="py-2 pr-3 text-right text-indigo-600">
                        {row.syntheticUnitsPct}%
                      </td>
                      <td className="py-2 pr-3 text-right text-indigo-600">
                        {row.syntheticRevPct}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

interface OilTileProps {
  label: string;
  value: string;
  helper?: string;
}

const OilTile: React.FC<OilTileProps> = ({ label, value, helper }) => (
  <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 shadow-sm flex flex-col justify-between">
    <span className="text-[11px] text-slate-500">{label}</span>
    <span className="mt-1 text-base font-semibold text-slate-900">
      {value}
    </span>
    {helper && (
      <span className="mt-0.5 text-[11px] text-slate-500">{helper}</span>
    )}
  </div>
);

interface BarSegment {
  label: string;
  value: number;
  color: string;
}

const BarStack: React.FC<{ segments: BarSegment[] }> = ({ segments }) => {
  const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
  return (
    <div className="space-y-3">
      <div className="flex w-full h-4 rounded-full overflow-hidden bg-slate-100">
        {segments.map((seg) => (
          <div
            key={seg.label}
            className={`h-full ${seg.color}`}
            style={{ width: `${(seg.value / total) * 100}%` }}
            title={`${seg.label} · ${seg.value}%`}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-3 text-[11px] text-slate-600">
        {segments.map((seg) => (
          <span key={seg.label} className="inline-flex items-center gap-1">
            <span className={`h-2 w-2 rounded-full ${seg.color}`} />
            <span>
              {seg.label} · {seg.value}%
            </span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default OilTypeSales;
