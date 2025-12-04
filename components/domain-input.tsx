"use client";

import type { FormEvent } from "react";

type DomainInputProps = {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

export function DomainInput({
  value,
  isLoading,
  onChange,
  onSubmit,
}: DomainInputProps) {
  return (
    <section className="mb-8 rounded-lg border border-slate-800 bg-slate-900/60 p-4 shadow">
      <form onSubmit={onSubmit} className="space-y-4">
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
            value={value}
            onChange={(event) => onChange(event.target.value)}
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
  );
}