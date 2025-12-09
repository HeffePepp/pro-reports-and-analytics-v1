import React, { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, Check } from "lucide-react";

export type KpiDefinition = {
  id: string;
  label: string;
  helper?: string;
};

const storageKeyFor = (reportKey: string) => `tp-kpi-prefs-${reportKey}`;

/**
 * Per-report KPI visibility preferences, persisted to localStorage.
 */
export function useKpiPreferences(reportKey: string, kpis: KpiDefinition[]) {
  const allIds = useMemo(() => kpis.map((k) => k.id), [kpis]);

  const [visibleIds, setVisibleIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return allIds;
    try {
      const stored = window.localStorage.getItem(storageKeyFor(reportKey));
      if (!stored) return allIds;
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        // Only keep ids that still exist
        return parsed.filter((id) => allIds.includes(id));
      }
    } catch {
      // ignore parse errors
    }
    return allIds;
  });

  // Persist whenever visibleIds change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(
        storageKeyFor(reportKey),
        JSON.stringify(visibleIds)
      );
    } catch {
      // ignore quota errors etc.
    }
  }, [reportKey, visibleIds]);

  const toggleKpi = (id: string) => {
    setVisibleIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const resetKpis = () => setVisibleIds(allIds);

  const visibleKpis = kpis.filter((k) => visibleIds.includes(k.id));

  return { visibleIds, visibleKpis, toggleKpi, resetKpis };
}

/**
 * Small pill button that matches the Dashboard "Customize" control.
 */
export const KpiCustomizeButton: React.FC<{ onClick: () => void }> = ({
  onClick,
}) => (
  <button
    type="button"
    onClick={onClick}
    className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
  >
    <SlidersHorizontal className="h-3 w-3" />
    Customize
  </button>
);

interface KpiPreferencesModalProps {
  open: boolean;
  reportName: string;
  kpis: KpiDefinition[];
  visibleIds: string[];
  onToggle: (id: string) => void;
  onReset: () => void;
  onClose: () => void;
}

/**
 * Centered modal listing KPIs with toggles.
 * Changes apply immediately; closing the modal just hides it.
 */
export const KpiPreferencesModal: React.FC<KpiPreferencesModalProps> = ({
  open,
  reportName,
  kpis,
  visibleIds,
  onToggle,
  onReset,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-lg border border-slate-200">
        {/* Header */}
        <div className="px-4 pt-4 pb-3 border-b border-slate-100 flex items-start justify-between gap-3">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Customize KPIs
            </div>
            <div className="text-sm font-semibold text-slate-900">
              {reportName}
            </div>
            <p className="mt-1 text-[11px] text-slate-500">
              Choose which tiles appear at the top of this report. Your
              choices are saved for this browser.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] text-slate-400 hover:text-slate-600"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-4 py-3 space-y-2 max-h-[60vh] overflow-y-auto">
          {kpis.map((kpi) => {
            const checked = visibleIds.includes(kpi.id);
            return (
              <button
                key={kpi.id}
                type="button"
                onClick={() => onToggle(kpi.id)}
                className={`w-full flex items-center justify-between gap-3 rounded-xl border px-3 py-2 text-left text-sm transition hover:bg-slate-50 ${
                  checked
                    ? "border-sky-200 bg-sky-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <div>
                  <div className="font-medium text-slate-900">
                    {kpi.label}
                  </div>
                  {kpi.helper && (
                    <div className="mt-0.5 text-[11px] text-slate-500">
                      {kpi.helper}
                    </div>
                  )}
                </div>
                <span
                  className={`inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] ${
                    checked
                      ? "border-sky-500 bg-sky-500 text-white"
                      : "border-slate-300 text-slate-300"
                  }`}
                >
                  {checked && <Check className="h-3 w-3" />}
                </span>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-4 pb-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onReset}
            className="text-[11px] text-slate-500 hover:text-slate-700"
          >
            Select all tiles
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1.5 text-[11px] font-medium text-white shadow-sm hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
