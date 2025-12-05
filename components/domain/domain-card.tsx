"use client";

import type { DomainResult } from "@/types/domain";
import { formatDate, formatDateTime } from "@/lib/date-utils";

export type DomainCardProps = {
  result: DomainResult;
  onRefreshDomain: (domain: string) => void;
  isRefreshing?: boolean;
};

export function DomainCard({ result, onRefreshDomain, isRefreshing }: DomainCardProps) {
  const {
    domain,
    expiryDate,
    registrarName,
    fromCache,
    cachedAt,
  } = result 

  return (
    <article
      className="flex h-full flex-col rounded-lg border border-neutral-700 bg-neutral-900/70 p-4
                 shadow-md shadow-black/30 transition-transform transition-shadow
                 hover:-translate-y-[1px] hover:shadow-lg hover:shadow-black/40"
    >
      {/* Header: domain only to preserve full domain name*/}
      <header className="mb-2">
        <h2 className="text-lg font-semibold text-neutral-50 break-words">
          {domain}
        </h2>

        {/* Cached info row - top div keeps cards aligned regardless of cached badge */}
        <div className="mt-1 flex min-h-[3rem] flex-wrap items-center gap-2">
          {fromCache && (
            <>
              <span className="inline-flex items-center rounded-full border border-amber-500/60 bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-300">
                Cached result
              </span>

              {cachedAt && (
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

      {/* Main details */}
      <div className="mb-4 flex flex-wrap gap-4 text-sm">
        <div className="flex flex-col">
          <span className="text-xs uppercase tracking-wide text-neutral-500">
            Expiry
          </span>
          <span className="font-medium text-neutral-100">
            {expiryDate ? formatDate(expiryDate) : "Unknown"}
          </span>
        </div>

        {/* Future: “Expiring soon” badge will go here */}
      </div>

      {/* Spacer to push actions down */}
      <div className="flex-1" />

      {/* Footer: reserve height so no jumping, only show button when cached */}
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
