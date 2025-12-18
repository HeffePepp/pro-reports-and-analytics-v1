import React from "react";
import { cn } from "@/lib/utils";

type ReportPageLayoutProps = {
  /** Optional KPI row (full width). Pass null/undefined when no KPIs are selected. */
  kpis?: React.ReactNode;

  /** AI Insights tile (or any right-rail tile). */
  ai?: React.ReactNode;

  /** Left-column tiles/content (the "real" report tiles). */
  children: React.ReactNode;

  /** Optional wrapper classes */
  className?: string;

  /** Optional left column spacing override */
  contentClassName?: string;

  /** Optional right column spacing override */
  aiClassName?: string;

  /**
   * Mobile placement for AI tile.
   * - "top" = AI shows below KPIs and above the first left tile (recommended)
   * - "bottom" = AI shows below all left content on mobile
   */
  mobileAiPlacement?: "top" | "bottom";
};

/**
 * IMPORTANT (alignment rule):
 * - KPI row MUST be passed via `kpis` (full-width sibling above the grid)
 * - DO NOT render KPI tiles inside the left column next to the AI column
 *   or the AI tile will drift when KPIs are toggled off.
 */
const ReportPageLayout: React.FC<ReportPageLayoutProps> = ({
  kpis,
  ai,
  children,
  className,
  contentClassName,
  aiClassName,
  mobileAiPlacement = "top",
}) => {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* 1) KPI row — always full width and ABOVE the two-column grid */}
      {kpis ? <div className="w-full">{kpis}</div> : null}

      {/* 2) Mobile AI placement (below KPIs, above content by default) */}
      {ai && mobileAiPlacement === "top" ? (
        <div className="block lg:hidden">{ai}</div>
      ) : null}

      {/* 3) Main grid — always starts at the same vertical baseline */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-start">
        <div className={cn("lg:col-span-3 space-y-4 self-start", contentClassName)}>
          {children}
        </div>

        {ai ? (
          <div className={cn("hidden lg:block lg:col-span-1 self-start", aiClassName)}>
            {ai}
          </div>
        ) : null}
      </div>

      {/* Optional: Mobile AI at bottom */}
      {ai && mobileAiPlacement === "bottom" ? (
        <div className="block lg:hidden">{ai}</div>
      ) : null}
    </div>
  );
};

export default ReportPageLayout;
