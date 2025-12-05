import { DomainResult } from "@/types/domain";
import { DomainCard } from "./domain-card"

export type DomainResultsProps = {
  results: DomainResult[];
  isLoading: boolean;
  onRefreshDomain: (domain: string) => void;
  refreshingDomain: string | null
};

export function DomainResults({
  results,
  isLoading,
  onRefreshDomain,
  refreshingDomain,
}: DomainResultsProps) {
  const hasResults = results && results.length > 0;

  return (
    <section className="mt-6 space-y-4">
      <div className="flex items-center justify-between gap-2 text-sm text-neutral-400">
        <span>
          {hasResults
            ? `Showing ${results.length} domain${results.length === 1 ? "" : "s"}`
            : "No domains looked up yet."}
        </span>

        {isLoading && <span className="text-xs italic">Loading…</span>}
      </div>

      {/* Cards */}
      {hasResults && (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {results.map((result) => (
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
