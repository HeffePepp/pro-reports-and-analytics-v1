import React from "react";

type JourneyTouchpointMixItem = {
  id: string;
  label: string;
  responses: number;
};

type Props = {
  items: JourneyTouchpointMixItem[];
};

const segmentColors = [
  "bg-emerald-100",
  "bg-sky-100",
  "bg-purple-100",
  "bg-amber-100",
  "bg-rose-100",
  "bg-teal-100",
  "bg-indigo-100",
  "bg-lime-100",
];

export const RoasJourneyTouchpointMixTile: React.FC<Props> = ({ items }) => {
  const totalResponses =
    items.reduce((sum, item) => sum + (item.responses || 0), 0) || 1;

  return (
    <section className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <header>
        <h2 className="text-[13px] font-semibold text-foreground">
          Touchpoint mix by contribution
        </h2>
        <p className="text-[11px] text-muted-foreground">
          Share of total responses by Customer Journey touch point.
        </p>
      </header>

      {/* stacked mix bar */}
      <div className="mt-3 flex h-3 w-full overflow-hidden rounded-full bg-muted">
        {items.map((item, index) => {
          const share = item.responses / totalResponses;
          return (
            <div
              key={item.id}
              style={{ width: `${share * 100}%` }}
              className={segmentColors[index % segmentColors.length]}
            />
          );
        })}
      </div>

      {/* legend */}
      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
        {items.map((item, index) => {
          const share = item.responses / totalResponses;
          return (
            <div
              key={item.id}
              className="inline-flex items-center gap-1 whitespace-nowrap"
            >
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  segmentColors[index % segmentColors.length]
                }`}
              />
              <span className="font-medium text-foreground">{item.label}</span>
              <span>· {(share * 100).toFixed(1)}% of responses</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};
