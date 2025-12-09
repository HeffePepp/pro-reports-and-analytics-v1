// src/pages/CustomerJourneyTouchPointDetailPage.tsx

import React from "react";
import { useParams, Link } from "react-router-dom";
import { ShellLayout, MetricTile, AIInsightsTile } from "@/components/layout";
import {
  getJourneyTouchPointById,
  JourneyTouchPoint,
} from "@/data/customerJourney";

const CustomerJourneyTouchPointDetailPage: React.FC = () => {
  const { touchPointId } = useParams<{ touchPointId: string }>();

  const touchPoint: JourneyTouchPoint | undefined =
    touchPointId ? getJourneyTouchPointById(touchPointId) : undefined;

  if (!touchPoint) {
    return (
      <ShellLayout
        breadcrumb={[
          { label: "Home", to: "/" },
          { label: "Reports & Insights", to: "/" },
          { label: "Customer Journey", to: "/reports/customer-journey" },
          { label: "Touch point not found" },
        ]}
      >
        <div className="mt-6 text-sm text-slate-600">
          This touch point could not be found.{" "}
          <Link
            to="/reports/customer-journey"
            className="text-sky-600 hover:text-sky-700"
          >
            Back to Customer Journey
          </Link>
        </div>
      </ShellLayout>
    );
  }

  const { name, interval, channel, sent, vehicles, responseRate, roas } =
    touchPoint;

  const aiBullets = [
    `${name} currently runs at ${interval} with ${responseRate.toFixed(
      1
    )}% RESP.`,
    `This touch point generated ${vehicles.toLocaleString()} responses from ${sent.toLocaleString()} messages sent.`,
    "Use the map and audience views to see which ZIPs and segments respond best.",
  ];

  return (
    <ShellLayout
      breadcrumb={[
        { label: "Home", to: "/" },
        { label: "Reports & Insights", to: "/" },
        { label: "Customer Journey", to: "/reports/customer-journey" },
        { label: name },
      ]}
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
      {/* Header uses touch point name */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold text-slate-900">
            {name}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Touch point detail: performance, audience and geography.
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">
            {interval} · {channel}
          </p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* LEFT COLUMN */}
        <div className="lg:col-span-3 space-y-4">
          {/* KPIs: same metrics as CJ row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <MetricTile label="Msgs sent" value={sent.toLocaleString()} />
            <MetricTile label="Responses" value={vehicles.toLocaleString()} />
            <MetricTile
              label="Resp %"
              value={`${responseRate.toFixed(1)}%`}
            />
            <MetricTile label="ROAS" value={`${roas.toFixed(1)}x`} />
          </div>

          {/* AI Insights stacked on small screens */}
          <div className="block lg:hidden">
            <AIInsightsTile
              title="AI Insights"
              subtitle="Based on this touch point"
              bullets={aiBullets}
            />
          </div>

          {/* Placeholder for tabs / map / audience etc.
             You can drop the more advanced tabbed layout we built earlier into here.
          */}
          <section className="rounded-2xl bg-white border border-slate-200 shadow-sm p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  {name} detail
                </h2>
                <p className="text-[11px] text-slate-600">
                  Use this view to explore ZIPs, audience and follow-up
                  journeys for this touch point.
                </p>
              </div>
            </div>

            <p className="mt-3 text-xs text-slate-600">
              This section is wired to the same touch point data as the Customer
              Journey overview. Any changes to the journey stats will be
              reflected here automatically.
            </p>
          </section>
        </div>

        {/* RIGHT: AI Insights on wide screens */}
        <div className="hidden lg:block lg:col-span-1">
          <AIInsightsTile
            title="AI Insights"
            subtitle="Based on this touch point"
            bullets={aiBullets}
          />
        </div>
      </div>
    </ShellLayout>
  );
};

export default CustomerJourneyTouchPointDetailPage;
