import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

type JourneyStep = {
  order: number;
  name: string;
  interval: string;
  channel: string;
  sent: number;
  vehicles: number;
  responseRate: number; // %
  roas: number;         // x
};

const journeySteps: JourneyStep[] = [
  {
    order: 1,
    name: "Thank You Email",
    interval: "1 day after service",
    channel: "Email",
    sent: 1850,
    vehicles: 420,
    responseRate: 22.7,
    roas: 9.5,
  },
  {
    order: 2,
    name: "Suggested Services – 1 week",
    interval: "7 days after service",
    channel: "Email",
    sent: 1760,
    vehicles: 310,
    responseRate: 17.6,
    roas: 12.1,
  },
  {
    order: 3,
    name: "Suggested Services – 1 month",
    interval: "30 days after service",
    channel: "Email",
    sent: 1640,
    vehicles: 240,
    responseRate: 14.6,
    roas: 11.2,
  },
  {
    order: 4,
    name: "Reminder 1",
    interval: "5k after last service",
    channel: "Postcard + Email + SMS",
    sent: 1380,
    vehicles: 280,
    responseRate: 20.3,
    roas: 16.4,
  },
  {
    order: 5,
    name: "Reminder 2",
    interval: "30 days after Reminder 1",
    channel: "Postcard + Email + SMS",
    sent: 980,
    vehicles: 142,
    responseRate: 14.5,
    roas: 10.7,
  },
  {
    order: 6,
    name: "Reactivation – 12 months",
    interval: "12 months after service",
    channel: "Email",
    sent: 620,
    vehicles: 86,
    responseRate: 13.9,
    roas: 8.2,
  },
];

const CustomerJourney: React.FC = () => {
  const [insights, setInsights] = useState<string[]>([
    "Reminder 1 is the strongest step, with the highest ROAS and vehicles per 1,000 sent.",
    "Suggested Services at 1 week and 1 month are solid performers and should be kept in the journey.",
    "Reactivation at 12 months is weaker but still profitable – consider testing stronger offer or SMS for this step.",
  ]);

  const totalSent = useMemo(
    () => journeySteps.reduce((sum, s) => sum + s.sent, 0),
    []
  );
  const totalVehicles = useMemo(
    () => journeySteps.reduce((sum, s) => sum + s.vehicles, 0),
    []
  );
  const avgRoas = useMemo(() => {
    if (!journeySteps.length) return 0;
    return (
      journeySteps.reduce((sum, s) => sum + s.roas, 0) / journeySteps.length
    );
  }, []);

  const stepWithMaxVehicles = useMemo(
    () =>
      journeySteps.reduce((max, s) =>
        !max || s.vehicles > max.vehicles ? s : max
      ),
    []
  );

  const regenerateInsights = () => {
    // Later: replace with real AI call
    setInsights([
      `Journey ROAS averages about ${avgRoas.toFixed(
        1
      )}x across all steps, with strongest performance at "${stepWithMaxVehicles.name}".`,
      "Consider shifting budget from low-response steps to Reminder 1 and the first Suggested Services email.",
      "Next experiment: A/B test SMS vs email-only for the 12-month reactivation step.",
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex">
      {/* Sidebar (same style as other pages) */}
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
            <span className="font-medium text-slate-700">Customer Journey</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-slate-500">
            <span>Store: <span className="font-medium">Vallejo, CA</span></span>
            <span>Period: <span className="font-medium">Last 90 days</span></span>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-4 md:py-6 space-y-6">
          {/* Title + hero tiles */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
                Customer Journey
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                Performance of the standard Throttle journey steps for this store:
                thank-you, suggested services, reminders and reactivation.
              </p>
            </div>
            <div className="flex gap-3 text-xs">
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Total comms sent</div>
                <div className="mt-0.5 text-base font-semibold">
                  {totalSent.toLocaleString()}
                </div>
              </div>
              <div className="px-3 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <div className="text-slate-400">Vehicles from journey</div>
                <div className="mt-0.5 text-base font-semibold">
                  {totalVehicles.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            <JourneyTile
              label="Journey vehicles"
              value={totalVehicles.toLocaleString()}
              helper="Visits attributed to journey steps"
            />
            <JourneyTile
              label="Avg step ROAS"
              value={`${avgRoas.toFixed(1)}x`}
              helper="Across all journey steps"
            />
            <JourneyTile
              label="Best-performing step"
              value={stepWithMaxVehicles.name}
              helper={`${stepWithMaxVehicles.vehicles} vehicles`}
            />
            <JourneyTile
              label="Emails per customer"
              value="~6"
              helper="Typical journey coverage"
            />
            <JourneyTile
              label="Postcards / SMS per customer"
              value="2–3"
              helper="Reminder & reactivation touches"
            />
          </div>

          {/* Step chart + insights */}
          <section className="mt-2 grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Chart */}
            <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <h2 className="text-sm font-semibold text-slate-800">
                  Journey steps by response and ROAS
                </h2>
                <span className="text-[11px] text-slate-400">
                  Relative performance (dummy data)
                </span>
              </div>
              <div className="space-y-3">
                {journeySteps.map((step) => (
                  <div key={step.order} className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>
                        {step.order}. {step.name}
                      </span>
                      <span>
                        {step.responseRate.toFixed(1)}% resp · {step.roas.toFixed(1)}x ROAS
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className="h-full bg-sky-400"
                          style={{ width: `${Math.min(step.responseRate * 2, 100)}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400 w-28 truncate">
                        {step.interval}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
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
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-[11px] text-slate-400">
                In the full app, this panel will call Lovable/OpenAI with live journey
                metrics for this store and period, then generate tailored guidance.
              </p>
            </div>
          </section>

          {/* Table */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between gap-2 mb-2">
              <h2 className="text-sm font-semibold text-slate-800">
                Step details
              </h2>
              <span className="text-[11px] text-slate-400">
                Sent, vehicles, response and ROAS by journey step
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs">
                <thead>
                  <tr className="text-left text-[11px] uppercase tracking-wide text-slate-400">
                    <th className="py-2 pr-3">Step</th>
                    <th className="py-2 pr-3">Interval</th>
                    <th className="py-2 pr-3">Channel</th>
                    <th className="py-2 pr-3 text-right">Sent</th>
                    <th className="py-2 pr-3 text-right">Vehicles</th>
                    <th className="py-2 pr-3 text-right">Response %</th>
                    <th className="py-2 pr-3 text-right">ROAS</th>
                  </tr>
                </thead>
                <tbody>
                  {journeySteps.map((step) => (
                    <tr key={step.order} className="border-t border-slate-100">
                      <td className="py-2 pr-3 text-slate-700">
                        {step.order}. {step.name}
                      </td>
                      <td className="py-2 pr-3 text-slate-600">{step.interval}</td>
                      <td className="py-2 pr-3 text-slate-600">{step.channel}</td>
                      <td className="py-2 pr-3 text-right">
                        {step.sent.toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {step.vehicles.toLocaleString()}
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {step.responseRate.toFixed(1)}%
                      </td>
                      <td className="py-2 pr-3 text-right">
                        {step.roas.toFixed(1)}x
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

interface JourneyTileProps {
  label: string;
  value: string;
  helper?: string;
}

const JourneyTile: React.FC<JourneyTileProps> = ({ label, value, helper }) => (
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

export default CustomerJourney;
