import { useEffect, useState } from "react";

export interface KpiOption {
  id: string;
  label: string;
}

const STORAGE_PREFIX = "kpiPrefs:";

export function useKpiPreferences(reportId: string, options: KpiOption[]) {
  const [selectedIds, setSelectedIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return options.map((o) => o.id);

    try {
      const raw = window.localStorage.getItem(STORAGE_PREFIX + reportId);
      if (!raw) return options.map((o) => o.id);
      const parsed = JSON.parse(raw) as string[];
      const validSet = new Set(options.map((o) => o.id));
      const filtered = parsed.filter((id) => validSet.has(id));
      return filtered.length ? filtered : options.map((o) => o.id);
    } catch {
      return options.map((o) => o.id);
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_PREFIX + reportId,
        JSON.stringify(selectedIds)
      );
    } catch {
      // ignore storage errors
    }
  }, [reportId, selectedIds]);

  return { selectedIds, setSelectedIds };
}
