import React, { useEffect, useRef, useState, useMemo } from "react";
import { KpiOption } from "@/hooks/useKpiPreferences";
import { ChevronUp, ChevronDown } from "lucide-react";

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

  // Order: selected items first (in selectedIds order), then unselected
  const orderedOptions = useMemo(() => {
    const selectedSet = new Set(selectedIds);
    const selectedOrdered = selectedIds
      .map((id) => options.find((o) => o.id === id))
      .filter((o): o is KpiOption => o !== undefined);
    const unselected = options.filter((o) => !selectedSet.has(o.id));
    return [...selectedOrdered, ...unselected];
  }, [options, selectedIds]);

  const toggleId = (id: string) => {
    if (selectedIds.includes(id)) {
      onChangeSelected(selectedIds.filter((x) => x !== id));
    } else {
      onChangeSelected([...selectedIds, id]);
    }
  };

  const moveId = (id: string, direction: "up" | "down") => {
    const idx = selectedIds.indexOf(id);
    if (idx === -1) return;
    if (direction === "up" && idx === 0) return;
    if (direction === "down" && idx === selectedIds.length - 1) return;

    const next = [...selectedIds];
    const swapWith = direction === "up" ? idx - 1 : idx + 1;
    [next[idx], next[swapWith]] = [next[swapWith], next[idx]];
    onChangeSelected(next);
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
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-[11px] font-medium text-slate-600 shadow-sm hover:bg-slate-50"
      >
        <span className="text-sky-500">✨</span>
        <span>Customize KPIs</span>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white shadow-lg z-20"
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
            {orderedOptions.map((opt) => {
              const isSelected = selectedIds.includes(opt.id);
              const selIndex = selectedIds.indexOf(opt.id);
              const canMoveUp = isSelected && selIndex > 0;
              const canMoveDown = isSelected && selIndex < selectedIds.length - 1;

              return (
                <div
                  key={opt.id}
                  className="flex items-center justify-between px-4 py-1.5 hover:bg-slate-50"
                >
                  <button
                    type="button"
                    onClick={() => toggleId(opt.id)}
                    className="flex flex-1 items-center gap-2 text-xs text-left"
                  >
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded border ${
                        isSelected
                          ? "border-sky-500 bg-sky-500"
                          : "border-slate-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <span className="text-[10px] leading-none text-white">
                          ✓
                        </span>
                      )}
                    </span>
                    <span className="text-slate-700">{opt.label}</span>
                  </button>

                  {/* Up / Down reorder buttons */}
                  <div className="flex items-center gap-0.5 ml-2">
                    <button
                      type="button"
                      onClick={() => moveId(opt.id, "up")}
                      disabled={!canMoveUp}
                      className={`rounded p-0.5 ${
                        canMoveUp
                          ? "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                          : "text-slate-200 cursor-default"
                      }`}
                      aria-label="Move up"
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveId(opt.id, "down")}
                      disabled={!canMoveDown}
                      className={`rounded p-0.5 ${
                        canMoveDown
                          ? "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                          : "text-slate-200 cursor-default"
                      }`}
                      aria-label="Move down"
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
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
