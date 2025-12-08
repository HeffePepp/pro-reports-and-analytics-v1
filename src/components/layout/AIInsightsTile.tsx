import React from "react";

type AIInsightsTileProps = {
  title?: string;
  subtitle?: string;
  bullets: string[];
  onRefresh?: () => void;
};

const AIInsightsTile: React.FC<AIInsightsTileProps> = ({
  title = "AI Insights",
  subtitle = "Based on last 12 months data",
  bullets,
  onRefresh,
}) => {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-primary/5 via-primary/5 to-accent/10 border border-primary/20 shadow-sm flex flex-col h-full">
      <div className="flex items-start justify-between px-4 pt-4 pb-2 gap-3">
        <div className="flex items-start gap-2">
          <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-background shadow-sm text-primary text-lg">
            ✨
          </span>
          <div>
            <div className="text-xs font-semibold text-primary">
              {title}
            </div>
            <p className="mt-1 text-[11px] text-primary/80">{subtitle}</p>
          </div>
        </div>
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="text-[11px] px-2 py-1 rounded-full border border-primary/20 bg-background/60 hover:bg-background text-primary"
          >
            Refresh
          </button>
        )}
      </div>

      <div className="flex-1 px-4 pb-4">
        {bullets.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[11px] text-primary/70 italic">
            Loading KPI data…
          </div>
        ) : (
          <ul className="mt-2 space-y-1.5 text-xs text-foreground">
            {bullets.map((line, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-primary/20 px-4 py-2">
        <p className="text-[10px] text-primary/70">
          Powered by AI · Insights refresh when data changes.
        </p>
      </div>
    </div>
  );
};

export default AIInsightsTile;
