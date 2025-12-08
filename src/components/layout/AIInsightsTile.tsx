import React from "react";

type AIInsightsTileProps = {
  title?: string;
  subtitle?: string;
  bullets: string[];
};

const AIInsightsTile: React.FC<AIInsightsTileProps> = ({
  title = "AI Insights",
  subtitle = "Based on last 12 months data",
  bullets,
}) => {
  return (
    <div className="rounded-2xl bg-gradient-to-b from-sky-50 via-sky-50 to-sky-100 border border-sky-100 shadow-sm flex flex-col h-full">
      {/* Header */}
      <div className="flex items-start gap-3 px-4 pt-4 pb-2">
        <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-white shadow-sm text-sky-500 text-lg">
          ✨
        </span>
        <div>
          <div className="text-xs font-semibold text-sky-800">
            {title}
          </div>
          <p className="mt-1 text-[11px] text-sky-600">{subtitle}</p>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 px-4 pb-4">
        {bullets.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[11px] text-sky-500 italic">
            Loading KPI data…
          </div>
        ) : (
          <ul className="mt-2 space-y-1.5 text-xs text-sky-900">
            {bullets.map((line, idx) => (
              <li key={idx} className="flex gap-2">
                <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                <span>{line}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-sky-100 px-4 py-2">
        <p className="text-[10px] text-sky-500">
          Powered by AI · Insights refresh when data changes.
        </p>
      </div>
    </div>
  );
};

export default AIInsightsTile;
