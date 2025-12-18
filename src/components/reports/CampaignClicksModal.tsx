import React from "react";
import { X } from "lucide-react";

export type CampaignClickTypeRow = {
  id: string;
  label: string;
  clicks: number;
  clickRate: number; // 0–1
};

export type CampaignClickBreakdown = {
  campaignId: string;
  campaignName: string;
  totalClicks: number;
  uniqueClickers: number;
  clickRate: number;
  unsubscribeRate: number;
  clickTypes: CampaignClickTypeRow[];
};

type CampaignClicksModalProps = {
  open: boolean;
  data: CampaignClickBreakdown | null;
  onClose: () => void;
};

const formatPercent1 = (value: number) => `${(value * 100).toFixed(1)}%`;

const CampaignClicksModal: React.FC<CampaignClicksModalProps> = ({
  open,
  data,
  onClose,
}) => {
  if (!open || !data) return null;

  const { campaignName, totalClicks, clickTypes } = data;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4"
      onClick={onClose}
    >
      <div
        className="mt-6 w-full max-w-3xl rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 px-5 py-4">
          <div>
            <div className="text-[13px] font-semibold text-slate-900">
              {campaignName}
            </div>
            <div className="text-[11px] text-slate-500">
              Click activity for this campaign's email drops.
            </div>
          </div>
          <button
            type="button"
            className="rounded-full border border-slate-200 px-3 py-1 text-[11px] text-slate-600 hover:bg-slate-50"
            onClick={onClose}
          >
            Close
          </button>
        </div>

        {/* Click types table only */}
        <div className="px-5 py-4">
          <div className="text-[11px] font-semibold text-slate-700">
            Clicks by type
          </div>

          <div className="mt-3">
            {/* Grid header */}
            <div className="grid grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))] gap-4 border-b border-slate-100 pb-2 text-[11px] text-slate-500">
              <div className="font-medium">Click type</div>
              <div className="text-right font-medium">Clicks</div>
              <div className="text-right font-medium">% of total clicks</div>
            </div>

            {/* Grid rows */}
            <div className="divide-y divide-slate-50">
              {clickTypes.map((row) => (
                <div
                  key={row.id}
                  className="grid grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))] gap-4 py-2 text-[11px]"
                >
                  <div className="text-slate-800">{row.label}</div>
                  <div className="text-right text-slate-900">
                    {row.clicks.toLocaleString("en-US")}
                  </div>
                  <div className="text-right text-slate-900">
                    {formatPercent1(row.clickRate)}
                  </div>
                </div>
              ))}
            </div>

            {/* Total clicks footer */}
            <div className="grid grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))] gap-4 border-t border-slate-100 py-2 text-[11px]">
              <div className="text-right font-semibold text-slate-700">
                Total clicks
              </div>
              <div className="text-right font-semibold text-slate-900">
                {totalClicks.toLocaleString("en-US")}
              </div>
              <div className="text-right text-slate-500">100.0%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignClicksModal;
