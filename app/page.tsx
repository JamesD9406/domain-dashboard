"use client";

import { FormEvent, useState } from "react"

import { DomainInput } from "@/components/domain-input";
import { DomainResults } from "@/components/domain-results"
import { DomainResult } from "@/types/domain"


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

    const mockResults: DomainResult[] = domains.map((domain, index) => {
      const expiry = new Date(now);
      expiry.setMonth(expiry.getMonth() + 1 + index);

      const isExpiringSoon = index % 3 === 0;
      const hasWarning = index % 5 === 0;

      return {
        domain,
        status: isExpiringSoon ? "expiring-soon" : "ok",
        expiryDate: expiry.toISOString(),
        message: hasWarning ? "Example warning message" : undefined,
      };
    });

    // Simulate calling an API with a delay
    setTimeout(() => {
      setResults(mockResults);
      setIsLoading(false);
    }, 400);
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
        <DomainInput
          value={input}
          isLoading={isLoading}
          onChange={setInput}
          onSubmit={handleSubmit}
        />
        <DomainResults
          results={results}
        />
      </div>
    </main>
  );
}
