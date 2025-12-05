import React from "react";

interface MetricTileProps {
  label: string;
  value: string;
  helper?: string;
  tone?: "positive" | "warn" | "negative";
}

const MetricTile: React.FC<MetricTileProps> = ({
  label,
  value,
  helper,
  tone,
}) => {
  const toneClasses =
    tone === "positive"
      ? "border-emerald-100 bg-emerald-50"
      : tone === "warn"
      ? "border-amber-100 bg-amber-50"
      : tone === "negative"
      ? "border-rose-100 bg-rose-50"
      : "border-slate-200 bg-white";

  return (
    <div
      className={`rounded-2xl border ${toneClasses} px-3 py-2 shadow-sm flex flex-col justify-between`}
    >
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="mt-1 text-base font-semibold text-slate-900">
        {value}
      </span>
      {helper && (
        <span className="mt-0.5 text-[11px] text-slate-500">{helper}</span>
      )}
    </div>
  );
};

export default MetricTile;
