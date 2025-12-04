"use client";

import { FormEvent, useState } from "react";

type DomainResult = {
  domain: string;
  status: "ok" | "expiring-soon" | "error";
  expiryDate: string; // ISO string
  message?: string;
};

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<DomainResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  function parseDomains(raw: string): string[] {
    return raw
      .split(/[\n,]+/) // split on new lines or commas
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean); // remove empty strings
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const domains = parseDomains(input);

    if (domains.length === 0) {
      setResults([]);
      return;
    }

    setIsLoading(true);

    const now = new Date();

    // Phase 1: mocked results (we'll replace this with real RDAP data later)
    const mockResults: DomainResult[] = domains.map((domain, index) => {
      const expiry = new Date(now);
      expiry.setMonth(expiry.getMonth() + 1 + index); // stagger expiries

      const isExpiringSoon = index % 3 === 0;
      const hasWarning = index % 5 === 0;

      return {
        domain,
        status: isExpiringSoon ? "expiring-soon" : "ok",
        expiryDate: expiry.toISOString(),
        message: hasWarning ? "Example warning message" : undefined,
      };
    });

    // Simulate a short network delay
    setTimeout(() => {
      setResults(mockResults);
      setIsLoading(false);
    }, 400);
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Domain Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Paste a list of domains to see their (mocked) status and expiry
            dates. We&apos;ll connect this to real RDAP data in a later step.
          </p>
        </header>

        <section className="mb-8 rounded-lg border border-slate-800 bg-slate-900/60 p-4 shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="domains"
                className="mb-1 block text-sm font-medium text-slate-200"
              >
                Domains
              </label>
              <textarea
                id="domains"
                className="block h-32 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-slate-100 shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/60"
                placeholder="example.com&#10;anotherdomain.net, third.org"
                value={input}
                onChange={(event) => setInput(event.target.value)}
              />
              <p className="mt-1 text-xs text-slate-400">
                Separate domains with new lines or commas.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="inline-flex items-center rounded-md border border-indigo-500 bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800"
            >
              {isLoading ? "Looking up…" : "Lookup Domains"}
            </button>
          </form>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold tracking-tight">
            Results
          </h2>

          {results.length === 0 ? (
            <p className="text-sm text-slate-400">
              No results yet. Enter one or more domains above and click
              &quot;Lookup Domains&quot;.
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
                        {formatDate(result.expiryDate)}
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
      </div>
    </main>
  );
}
