import React from "react";

type MetricTileProps = {
  label: string;
  value: string;
  helper?: string;
  highlight?: boolean;
};

const MetricTile: React.FC<MetricTileProps> = ({
  label,
  value,
  helper,
  highlight = false,
}) => {
  const valueClass = highlight
    ? // pill-style highlight, but still larger, bold numerals
      "inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-base md:text-lg font-semibold"
    : "text-base md:text-lg font-semibold text-slate-900";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full">
      <div className="flex flex-col items-start justify-start h-full px-3 py-3 md:px-4 md:py-4 min-h-[96px]">
        {/* Label area – fixed height so numbers line up across tiles */}
        <div className="w-full h-[32px]">
          <div className="text-[11px] font-medium text-slate-500 leading-snug">
            {label}
          </div>
        </div>

        {/* Main value */}
        <div className={`${valueClass} mt-1 leading-tight`}>
          {value}
        </div>

        {/* Optional helper text */}
        {helper && (
          <div className="mt-1 text-[11px] text-slate-500 leading-snug">
            {helper}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricTile;
