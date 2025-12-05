import { DomainResult } from "@/types/domain";

type DomainResultsProps = {
  results: DomainResult[];
  onRefreshDomain?: (domain: string) => void;
  refreshingDomain?: string | null;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatCachedAt(cachedAt: number) {
  return new Date(cachedAt).toLocaleString();
}

export function DomainResults({
  results,
  onRefreshDomain,
  refreshingDomain,
}: DomainResultsProps) {
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold tracking-tight">Results</h2>

      {results.length === 0 ? (
        <p className="text-sm text-slate-400">
          No results yet. Enter one or more domains above and click &quot;Lookup
          Domains&quot;.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900/60 shadow">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-slate-800 bg-slate-900/80 text-xs uppercase text-slate-400">
              <tr>
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Expiry</th>
                <th className="px-4 py-3">Notes</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {results.map((result) => (
                <tr key={result.domain} className="hover:bg-slate-900">
                  <td className="px-4 py-3 font-mono text-xs sm:text-sm">
                    {result.domain}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1">
                      <span
                        className={
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium " +
                          (result.status === "expiring-soon"
                            ? "bg-amber-500/15 text-amber-300 ring-1 ring-amber-500/40"
                            : result.status === "ok"
                            ? "bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/40"
                            : "bg-rose-500/15 text-rose-300 ring-1 ring-rose-500/40")
                        }
                      >
                        {result.status === "expiring-soon"
                          ? "Expiring Soon"
                          : result.status === "ok"
                          ? "OK"
                          : "Error"}
                      </span>

                      {result.fromCache && (
                        <span className="inline-flex items-center rounded-full border border-dashed border-slate-600 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                          Cached
                        </span>
                      )}

                      {result.fromCache && result.cachedAt != null && (
                        <span className="text-[10px] text-slate-500">
                          Cached at: {formatCachedAt(result.cachedAt)}
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="px-4 py-3 text-xs text-slate-200 sm:text-sm">
                    {result.expiryDate ? formatDate(result.expiryDate) : "Unknown"}
                  </td>

                  <td className="px-4 py-3 text-xs text-slate-400 sm:text-sm">
                    {result.message ?? "\u2014"}
                  </td>

                  <td className="px-4 py-3 text-xs">
                    {result.fromCache && onRefreshDomain ? (
                      <button
                        type="button"
                        onClick={() => onRefreshDomain(result.domain)}
                        disabled={refreshingDomain === result.domain}
                        className="rounded border border-slate-600 px-2 py-1 text-[11px] text-slate-100 hover:bg-slate-800 disabled:opacity-50"
                      >
                        {refreshingDomain === result.domain
                          ? "Refreshing…"
                          : "Refresh"}
                      </button>
                    ) : (
                      <span className="text-slate-600">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
