import { DomainResult } from "@/types/domain"

type DomainResultsProps = {
  results: DomainResult[];
};

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function DomainResults({ results }: DomainResultsProps) {
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
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {results.map((result) => (
                <tr key={result.domain} className="hover:bg-slate-900">
                  <td className="px-4 py-3 font-mono text-xs sm:text-sm">
                    {result.domain}
                  </td>
                  <td className="px-4 py-3">
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
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-200 sm:text-sm">
                    {result.expiryDate ? formatDate(result.expiryDate) : "Unknown"}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-400 sm:text-sm">
                    {result.message ?? "\u2014"}
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