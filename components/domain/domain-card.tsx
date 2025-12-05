"use client";

import { useState } from "react"
import type { DomainResult } from "@/types/domain";
import { formatDate, 
         formatDateTime, 
         isExpiringSoon, 
         daysUntil } from "@/lib/date-utils";

export type DomainCardProps = {
  result: DomainResult;
  onRefreshDomain: (domain: string) => void;
  isRefreshing?: boolean;
};

export function DomainCard({ result, onRefreshDomain, isRefreshing }: DomainCardProps) {
   const {
    domain,
    status,
    expiryDate,
    message,
    registrarName,
    createdDate,
    updatedDate,
    tld,
    fromCache,
    cachedAt,
  } = result;


  const [showDetails, setShowDetails] = useState(false);

  const expiringSoon = isExpiringSoon(expiryDate, 90);
  const daysToExpiry = daysUntil(expiryDate)

  const cardBaseClasses =
    "flex h-full flex-col rounded-lg border bg-neutral-900/70 p-4 " +
    "shadow-md shadow-black/30 transition-transform transition-shadow " +
    "hover:-translate-y-[1px] hover:shadow-lg hover:shadow-black/40";

  const cardHighlightClasses = expiringSoon
    ? " border-rose-500/70 shadow-rose-900/50"
    : " border-neutral-700";

  return (
    <article className={cardBaseClasses + cardHighlightClasses}>
      {/* Header: domain + fixed-height cache row */}
      <header className="mb-2">
        <h2 className="break-words text-lg font-semibold text-neutral-50">
          {domain}
        </h2>

        {/* Reserve space so cards stay aligned whether cached or not */}
        <div className="mt-1 flex min-h-[3rem] flex-wrap items-center gap-2">
          {fromCache && (
            <>
              <span className="inline-flex items-center rounded-full border border-amber-500/60 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                Cached result
              </span>

              {typeof cachedAt === "number" && (
                <span className="text-[10px] text-neutral-400">
                  Cached at: {formatDateTime(cachedAt)}
                </span>
              )}
            </>
          )}
        </div>
      </header>

      {/* Registrar */}
      {registrarName && (
        <p className="mb-3 line-clamp-2 text-xs text-neutral-300">
          <span className="text-neutral-500">Registrar:</span>{" "}
          <span className="font-medium">{registrarName}</span>
        </p>
      )}

      {/* Main expiry row */}
      <div className="mb-2 flex flex-wrap gap-4 text-sm">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-neutral-500">
            Expiry
          </span>

          <div className="mt-0.5 flex flex-wrap items-center gap-2">
            <span className="font-medium text-neutral-100">
              {expiryDate ? formatDate(expiryDate) : "Unknown"}
            </span>

            {expiringSoon && (
              <span className="inline-flex items-center rounded-full border border-rose-500/60 bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-rose-300">
                Expiring soon
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Toggle expandable details */}
      <div className="mb-4">
        <button
          type="button"
          onClick={() => setShowDetails((prev) => !prev)}
          className="text-xs font-medium text-neutral-300 underline-offset-2 hover:text-neutral-100 hover:underline"
        >
          {showDetails ? "Hide details" : "Show details"}
        </button>
        {showDetails && (
          <div className="mt-2 space-y-3 rounded-md border border-neutral-800 bg-neutral-950/70 p-3 text-xs text-neutral-200">
            {/* Top grid with the nice summary fields */}
            <div className="grid gap-2 sm:grid-cols-2">
              {createdDate && (
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-neutral-500">
                    Registered
                  </div>
                  <div>{formatDate(createdDate)}</div>
                </div>
              )}

              {updatedDate && (
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-neutral-500">
                    Last Updated
                  </div>
                  <div>{formatDate(updatedDate)}</div>
                </div>
              )}

              {tld && (
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-neutral-500">
                    TLD
                  </div>
                  <div>{tld}</div>
                </div>
              )}

              {typeof daysToExpiry === "number" && (
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-neutral-500">
                    Time to Expiry
                  </div>
                  <div>
                    {daysToExpiry === 0
                      ? "Expires today"
                      : daysToExpiry > 0
                      ? `In ${daysToExpiry} day${daysToExpiry === 1 ? "" : "s"}`
                      : `${Math.abs(daysToExpiry)} day${
                          Math.abs(daysToExpiry) === 1 ? "" : "s"
                        } ago`}
                  </div>
                </div>
              )}

              <div className="sm:col-span-2">
                <div className="text-[11px] uppercase tracking-wide text-neutral-500">
                  Status
                </div>
                <div className="mt-0.5">
                  <span className="font-semibold">
                    {status === "ok"
                      ? "OK"
                      : status === "expiring-soon"
                      ? "Expiring soon"
                      : "Error"}
                  </span>
                  {message && (
                    <span className="ml-1 text-neutral-300">– {message}</span>
                  )}
                </div>
              </div>
            </div>

            {/* JSON viewer */}
            <div className="-mx-3">
              <details className="mt-1">
                <summary className="cursor-pointer text-[11px] text-neutral-400 hover:text-neutral-200">
                  View raw data (DomainResult)
                </summary>
                <pre className="mt-2 max-h-64 w-full max-w-none overflow-auto rounded bg-black/60 p-2 text-[11px] leading-snug text-neutral-100">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}
      </div>

      {/* Spacer to push actions down */}
      <div className="flex-1" />

      {/* Footer: reserve height, only show button when cached */}
      <footer className="mt-2 flex min-h-[2.5rem] items-center justify-end gap-2">
        {fromCache && (
          <button
            type="button"
            onClick={() => onRefreshDomain(domain)}
            className="inline-flex items-center rounded-md border border-neutral-700 bg-neutral-950 px-3 py-1.5
                       text-xs font-medium text-neutral-100 hover:border-neutral-500 hover:bg-neutral-800
                       disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isRefreshing}
          >
            {isRefreshing ? "Refreshing…" : "Refresh"}
          </button>
        )}
      </footer>
    </article>
  );
}