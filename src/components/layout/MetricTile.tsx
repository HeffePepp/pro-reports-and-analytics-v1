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
    ? "inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-sm md:text-base font-semibold"
    : "text-sm md:text-base font-semibold text-slate-900";

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm h-full">
      <div className="flex flex-col items-center justify-start h-full px-3 py-3 md:px-4 md:py-4">
        {/* Label area – fixed height so labels align, values line up */}
        <div className="w-full flex items-start justify-center min-h-[36px]">
          <div className="text-[11px] font-medium text-slate-500 leading-snug text-center">
            {label}
          </div>
        </div>

        {/* Value */}
        <div className={`${valueClass} mt-1 leading-tight text-center`}>
          {value}
        </div>

        {/* Optional helper text */}
        {helper && (
          <div className="mt-1 text-[11px] text-slate-500 leading-snug text-center">
            {helper}
          </div>
        )}
      </div>
    </div>
  );
};

export default MetricTile;
