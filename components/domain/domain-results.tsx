import { useMemo, useState } from "react"
import type { DomainResult } from "@/types/domain";
import { daysUntil } from "@/lib/date-utils"
import { DomainCard } from "./domain-card"

export type DomainResultsProps = {
  results: DomainResult[];
  isLoading: boolean;
  onRefreshDomain: (domain: string) => void;
  refreshingDomain: string | null
};

type SortOption = "expiry" | "domain" | "registrar";

export function DomainResults({
  results,
  isLoading,
  onRefreshDomain,
  refreshingDomain,
}: DomainResultsProps) {
  const [sortBy, setSortBy] = useState<SortOption>("expiry")

  const hasResults = results && results.length > 0;

  const sortedResults = useMemo(() => {
    const copy = [...results];
    switch (sortBy) {
      case "domain":
        copy.sort((a, b) =>
            a.domain.localeCompare(b.domain, undefined, { sensitivity: "base" })
          );
          break;
      case "registrar":
        copy.sort((a, b) => {
          const ra = a.registrarName ?? "";
          const rb = b.registrarName ?? "";

          if (!ra && !rb) {
            // fall back to domain if both missing
            return a.domain.localeCompare(b.domain, undefined, {
              sensitivity: "base",
            });
          }
          if (!ra) return 1; // missing registrar goes at the end
          if (!rb) return -1;

          const cmp = ra.localeCompare(rb, undefined, { sensitivity: "base" });
          return cmp !== 0
            ? cmp
            : a.domain.localeCompare(b.domain, undefined, {
                sensitivity: "base",
              });
        });
        break;
      case "expiry":
      default:
        copy.sort((a, b) => {
          const da = daysUntil(a.expiryDate ?? null);
          const db = daysUntil(b.expiryDate ?? null);

          // Missing expiry dates go last
          if (da === null && db === null) {
            return a.domain.localeCompare(b.domain, undefined, {
              sensitivity: "base",
            });
          }
          if (da === null) return 1;
          if (db === null) return -1;

          if (da !== db) return da - db;

          // Tie-break by domain
          return a.domain.localeCompare(b.domain, undefined, {
            sensitivity: "base",
          });
        });
        break;
    }
    return copy;
  }, [results, sortBy]);

  return (
    <section className="mt-6 space-y-4">
      {/* Sort controls */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-sm text-neutral-400">
        <span>
          {hasResults
            ? `Showing ${results.length} domain${
                results.length === 1 ? "" : "s"
              }`
            : "No domains looked up yet."}
        </span>

        <div className="flex items-center gap-2">
          {hasResults && (
            <>
              <span className="text-xs uppercase tracking-wide text-neutral-500">
                Sort by:
              </span>
              <select
                className="rounded-md border border-neutral-700 bg-neutral-900 px-2 py-1 text-xs text-neutral-100 focus:outline-none focus:ring-1 focus:ring-neutral-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
              >
                <option value="expiry">Expiry (soonest first)</option>
                <option value="domain">Domain (A:Z)</option>
                <option value="registrar">Registrar (A:Z)</option>
              </select>
            </>
          )}

          {isLoading && (
            <span className="text-xs italic text-neutral-400">Loading…</span>
          )}
        </div>
      </div>

      {/* Cards */}
      {hasResults && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sortedResults.map((result) => (
            <DomainCard
              key={result.domain}
              result={result}
              onRefreshDomain={onRefreshDomain}
              isRefreshing={refreshingDomain === result.domain}
            />
          ))}
        </div>
      )}

      {/* Wehn empty */}
      {!hasResults && !isLoading && (
        <div className="rounded-lg border border-dashed border-neutral-700 bg-neutral-900/40 px-4 py-8 text-center text-sm text-neutral-400">
          Enter one or more domains above and click{" "}
          <span className="font-semibold text-neutral-200">
            Lookup Domains
          </span>{" "}
          to see results here.
        </div>
      )}
    </section>
  );
}
