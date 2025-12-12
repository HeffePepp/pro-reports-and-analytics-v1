import React from "react";
import clsx from "clsx";

type Suggestion = {
  id: string;
  name: string;
  videoWatched: boolean;
  couponOpened: boolean;
  offerText?: string;
};

type OriginalVisit = {
  invoiceNumber: string;
  date: string;
  amount: number;
  mileage: number;
  touchpointLabel: string;
  channelLabel: string;
  sentDate: string;
  openedDate?: string;
};

type ResponseVisit = {
  invoiceNumber?: string;
  date?: string;
  amount?: number;
  daysLater?: number;
  milesLater?: number;
  servicesPurchased?: string[];
  discountText?: string;
  // Either coupon OR discount, not both
  offerType?: "coupon" | "discount";
  offerCode?: string;
  offerDescription?: string;
};

export type SuggestedServiceResponse = {
  id: string;
  customerName: string;
  customerEmail?: string;
  storeLabel: string;
  vehicleLabel: string;
  original: OriginalVisit;
  suggestions: Suggestion[];
  response: ResponseVisit;
};

type BadgeProps = {
  label: string;
  tone: "yes" | "no" | "neutral";
};

const Badge: React.FC<BadgeProps> = ({ label, tone }) => {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold";
  const color =
    tone === "yes"
      ? "bg-emerald-50 text-emerald-700"
      : tone === "no"
      ? "bg-slate-100 text-slate-500"
      : "bg-sky-50 text-sky-700";

  return <span className={clsx(base, color)}>{label}</span>;
};

// Offer type pill matching Coupons/Discounts page
const OfferPill: React.FC<{ type: "coupon" | "discount"; code: string }> = ({ type, code }) => {
  const pillClass =
    type === "coupon"
      ? "bg-sky-50 border-sky-100 text-sky-700"
      : "bg-emerald-50 border-emerald-100 text-emerald-700";

  return (
    <span className={clsx("inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold", pillClass)}>
      {code}
    </span>
  );
};

type Props = {
  row: SuggestedServiceResponse;
};

export const SuggestedServiceResponseCard: React.FC<Props> = ({ row }) => {
  const hasResponse = !!row.response.invoiceNumber;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      {/* HEADER */}
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-0.5">
          <div className="text-[13px] font-semibold text-slate-900">
            {row.customerName}
            {row.customerEmail && (
              <span className="text-[11px] font-normal text-sky-700">
                {" "}
                · {row.customerEmail}
              </span>
            )}
          </div>
          <div className="text-[11px] text-slate-500">{row.storeLabel}</div>
          <div className="text-[11px] text-slate-500">{row.vehicleLabel}</div>
        </div>

        <div className="flex flex-col items-end gap-1 text-right">
          <span
            className={clsx(
              "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
              hasResponse
                ? "bg-emerald-50 text-emerald-700"
                : "bg-amber-50 text-amber-700"
            )}
          >
            {hasResponse ? "Converted" : "Email Opened – No Response Yet"}
          </span>
          {/* Coupon/Discount code and description in header */}
          {hasResponse && row.response.offerType && row.response.offerCode && (
            <div className="space-y-0.5 text-[11px] text-slate-600">
              <div className="flex items-center justify-end gap-1.5">
                <span className="font-semibold">
                  {row.response.offerType === "coupon" ? "Coupon:" : "Discount:"}
                </span>
                <OfferPill type={row.response.offerType} code={row.response.offerCode} />
              </div>
              {row.response.offerDescription && (
                <div className="text-right">
                  <span className="font-semibold">
                    {row.response.offerType === "coupon" ? "Coupon Description: " : "Discount Description: "}
                  </span>
                  {row.response.offerDescription}
                </div>
              )}
            </div>
          )}
          <span className="text-[11px] text-slate-500">
            {row.original.touchpointLabel}
          </span>
        </div>
      </header>

      {/* BODY: original vs response */}
      <div className="mt-4 flex flex-col gap-4 border-t border-slate-100 pt-4 md:flex-row md:gap-6">
        {/* Original visit */}
        <div className="flex-1 flex flex-col">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Original visit
          </div>

          <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-600">
            <div>Invoice #</div>
            <div className="font-medium text-slate-900">
              {row.original.invoiceNumber}
            </div>
            <div>Date</div>
            <div className="font-medium text-slate-900">
              {row.original.date}
            </div>
            <div>Amount</div>
            <div className="font-medium text-slate-900">
              {row.original.amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </div>
            <div>Mileage</div>
            <div className="font-medium text-slate-900">
              {row.original.mileage.toLocaleString()} mi
            </div>
          </div>

          <div className="mt-3 text-[11px] text-slate-600">
            <span className="font-medium">{row.original.channelLabel}</span>{" "}
            sent {row.original.sentDate}
            {row.original.openedDate ? (
              <> · Opened {row.original.openedDate}</>
            ) : (
              <> · Not yet opened</>
            )}
          </div>

          {/* Suggested services - with mt-auto equivalent via flex-grow for alignment */}
          <div className="mt-4 space-y-2">
            <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
              Suggested services
            </div>
            {row.suggestions.map((s, idx) => (
              <div
                key={s.id}
                className="rounded-xl border border-slate-100 bg-slate-50 px-3 py-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="text-[12px] font-semibold text-slate-900">
                    {idx + 1}. {s.name}
                  </div>
                  {s.offerText && (
                    <span className="text-[11px] font-medium text-slate-500">
                      {s.offerText}
                    </span>
                  )}
                </div>
                <div className="mt-1 flex flex-wrap gap-2">
                  <Badge
                    label={s.videoWatched ? "Video watched" : "Video not watched"}
                    tone={s.videoWatched ? "yes" : "no"}
                  />
                  <Badge
                    label={
                      s.couponOpened ? "Coupon opened" : "Coupon not opened"
                    }
                    tone={s.couponOpened ? "yes" : "no"}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Response visit */}
        <div className="flex-1 flex flex-col border-t border-slate-100 pt-4 md:border-l md:border-t-0 md:pl-6 md:pt-0">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
            Response invoice
          </div>

          {hasResponse ? (
            <>
              <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] text-slate-600">
                <div>Invoice #</div>
                <div className="font-medium text-slate-900">
                  {row.response.invoiceNumber}
                </div>
                <div>Date</div>
                <div className="font-medium text-slate-900">
                  {row.response.date}
                </div>
                <div>Amount</div>
                <div className="font-medium text-slate-900">
                  {row.response.amount?.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </div>
                {row.response.daysLater != null && (
                  <>
                    <div>Timing</div>
                    <div className="font-medium text-slate-900">
                      {row.response.daysLater} days later
                    </div>
                  </>
                )}
                {row.response.milesLater != null && (
                  <>
                    <div>Mileage</div>
                    <div className="font-medium text-slate-900">
                      {row.response.milesLater.toLocaleString()} mi later
                    </div>
                  </>
                )}
              </div>

              {/* Services purchased - aligned with Suggested services header on left */}
              <div className="mt-4 space-y-2">
                <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                  Services purchased
                </div>
                {row.response.servicesPurchased &&
                  row.response.servicesPurchased.length > 0 ? (
                    <ul className="list-disc pl-4 text-[11px] text-slate-600">
                      {row.response.servicesPurchased.map((svc) => (
                        <li key={svc}>{svc}</li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-[11px] text-slate-500">—</div>
                  )}

              </div>
            </>
          ) : (
            <div className="mt-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 px-3 py-4 text-[11px] text-slate-500">
              No response invoice yet. This record will update automatically if
              the customer returns from this Suggested Services touch point.
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SuggestedServiceResponseCard;
