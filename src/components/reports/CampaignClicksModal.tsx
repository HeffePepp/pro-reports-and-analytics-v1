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

        {/* Table only */}
        <div className="px-5 py-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-[11px]">
              <thead className="border-b border-slate-100 text-slate-500">
                <tr>
                  <th className="py-2 pr-3 text-left font-medium">Click type</th>
                  <th className="py-2 pr-3 text-right font-medium">Clicks</th>
                  <th className="py-2 text-right font-medium">% of total clicks</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {clickTypes.map((row) => (
                  <tr key={row.id}>
                    <td className="py-2 pr-3 text-slate-800">{row.label}</td>
                    <td className="py-2 pr-3 text-right text-slate-900">
                      {row.clicks.toLocaleString("en-US")}
                    </td>
                    <td className="py-2 text-right text-slate-900">
                      {formatPercent1(row.clickRate)}
                    </td>
                  </tr>
                ))}
              </tbody>

              <tfoot>
                <tr className="border-t border-slate-100">
                  <td className="py-2 pr-3 text-left font-semibold text-slate-700">
                    Total clicks
                  </td>
                  <td className="py-2 pr-3 text-right font-semibold text-slate-900">
                    {totalClicks.toLocaleString("en-US")}
                  </td>
                  <td className="py-2 text-right text-slate-500">100.0%</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignClicksModal;
