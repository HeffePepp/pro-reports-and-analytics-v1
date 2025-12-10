import React, { useEffect, useRef, useState } from "react";
import { KpiOption } from "@/hooks/useKpiPreferences";

interface KpiCustomizeButtonProps {
  reportId: string;
  options: KpiOption[];
  selectedIds: string[];
  onChangeSelected: (next: string[]) => void;
  title?: string;
}

const KpiCustomizeButton: React.FC<KpiCustomizeButtonProps> = ({
  reportId,
  options,
  selectedIds,
  onChangeSelected,
  title = "KPI tiles",
}) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  const allIds = options.map((o) => o.id);
  const allSelected = selectedIds.length === allIds.length;

  const toggleId = (id: string) => {
    if (selectedIds.includes(id)) {
      onChangeSelected(selectedIds.filter((x) => x !== id));
    } else {
      onChangeSelected([...selectedIds, id]);
    }
  };

  const handleToggleAll = () => {
    if (allSelected) {
      onChangeSelected([]);
    } else {
      onChangeSelected(allIds);
    }
  };

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div className="relative inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      >
        <span className="text-slate-500">⚙</span>
        <span>Customize</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white shadow-lg z-50"
        >
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
            <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
              {title}
            </div>
            <button
              type="button"
              onClick={handleToggleAll}
              className="text-[11px] font-medium text-sky-600 hover:text-sky-700"
            >
              {allSelected ? "Deselect all" : "Select all"}
            </button>
          </div>

          <div className="max-h-64 overflow-y-auto py-2">
            {options.map((opt) => {
              const checked = selectedIds.includes(opt.id);
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleId(opt.id)}
                  className="flex w-full items-center justify-between px-4 py-1.5 text-sm hover:bg-slate-50"
                >
                  <span className="text-slate-700">{opt.label}</span>
                  <span
                    className={`h-4 w-4 rounded border ${
                      checked
                        ? "border-sky-500 bg-sky-500"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {checked && (
                      <span className="block h-full w-full text-[10px] text-white leading-4 text-center">
                        ✓
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-slate-100 px-4 py-2 text-right">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-[11px] text-slate-500 hover:text-slate-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KpiCustomizeButton;
