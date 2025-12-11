import React from "react";
import { CircleHelp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";

type MetricVariant = "default" | "coupon" | "discount";

type MetricTileProps = {
  label: string;
  value: string;
  helper?: string;
  highlight?: boolean;
  helpText?: string;
  variant?: MetricVariant;
  className?: string;
};

const variantClasses: Record<MetricVariant, string> = {
  default: "bg-white border-slate-200",
  coupon: "bg-sky-50 border-sky-100",
  discount: "bg-emerald-50 border-emerald-100",
};

const MetricTile: React.FC<MetricTileProps> = ({
  label,
  value,
  helper,
  highlight = false,
  helpText,
  variant = "default",
  className,
}) => {
  const valueClass = highlight
    ? "inline-flex items-center px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-xl md:text-2xl font-semibold tracking-tight"
    : "text-xl md:text-2xl font-semibold text-slate-900 tracking-tight";

  return (
    <div className={`rounded-2xl border shadow-sm h-full ${variantClasses[variant]} ${className ?? ""}`}>
      <div className="flex flex-col justify-center h-full px-3 py-3 md:px-4 md:py-4 min-h-[96px]">
        {/* Description */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-medium text-slate-500 leading-snug">
            {label}
          </span>
          {helpText && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    className="text-slate-400 hover:text-slate-600"
                    aria-label={`${label} definition`}
                  >
                    <CircleHelp className="h-3 w-3" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-xs text-[11px] leading-snug">
                  {helpText}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        {/* Metric value – closer and ~2x larger */}
        <div className={`${valueClass} mt-0.5 leading-tight`}>{value}</div>

        {/* Optional helper line */}
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
