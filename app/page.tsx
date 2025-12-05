"use client";

import { FormEvent, useState } from "react";

import { DomainInput } from "@/components/domain/domain-input";
import { DomainResults } from "@/components/domain/domain-results";
import type { DomainResult } from "@/types/domain";
import type { LookupResponse } from "@/types/responses/lookup";

export default function Home() {
  const [input, setInput] = useState("");
  const [results, setResults] = useState<DomainResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshingDomain, setRefreshingDomain] = useState<string | null>(null);

  function parseDomains(raw: string): string[] {
    return raw
      .split(/[\n,]+/) // split on new lines or commas
      .map((d) => d.trim().toLowerCase())
      .filter(Boolean); // remove empty strings caused by any extra new lines
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const domains = parseDomains(input);

    if (domains.length === 0) {
      setResults([]);
      setError("Please enter at least one domain.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domains }),
      });

      if (!response.ok) {
        let message = "Lookup failed. Please try again.";

        try {
          const data = (await response.json()) as { error?: string };
          if (data.error) {
            message = data.error;
          }
        } catch {
          // use the default message in setError()
        }

        setResults([]);
        setError(message);
        return;
      }

      const data = (await response.json()) as LookupResponse;
      setResults(data.results ?? []);
    } catch (err) {
      console.error("Error calling /api/lookup:", err);
      setResults([]);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRefreshDomain(domain: string) {
    try {
      setRefreshingDomain(domain);
      setError(null);

      const response = await fetch("/api/lookup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domains: [domain],
          skipCacheFor: [domain],
        }),
      });

      if (!response.ok) {
        console.error("Failed to refresh domain", domain, response.status);
        return;
      }

      const data = (await response.json()) as LookupResponse;
      const fresh = data.results?.[0];

      if (!fresh) {
        console.warn("No refreshed result returned for domain", domain);
        return;
      }

      setResults((prev) =>
        prev.map((r) =>
          r.domain.toLowerCase() === fresh.domain.toLowerCase() ? fresh : r
        )
      );
    } catch (err) {
      console.error("Error refreshing domain", domain, err);
    } finally {
      setRefreshingDomain(null);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-10">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            Domain Dashboard
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Paste a list of domains to see their status and expiry dates.
          </p>
        </header>

        <DomainInput
          value={input}
          isLoading={isLoading}
          onChange={setInput}
          onSubmit={handleSubmit}
        />

        {error && (
          <div className="mb-4 rounded-md border border-rose-700 bg-rose-900/40 px-3 py-2 text-sm text-rose-100">
            {error}
          </div>
        )}

        <DomainResults
          results={results}
          isLoading={isLoading}
          onRefreshDomain={handleRefreshDomain}
          refreshingDomain={refreshingDomain}
        />
      </div>
    </main>
  );
}
