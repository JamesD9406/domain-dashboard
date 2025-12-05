import { NextRequest, NextResponse } from "next/server";

import type { DomainResult } from "@/types/domain";
import type { LookupRequest } from "@/types/requests/lookup";
import { fetchRdapForDomains } from "@/lib/rdap";

export async function POST(request: NextRequest) {
  let body: LookupRequest;

  try {
    body = (await request.json()) as LookupRequest;
  } catch {
    return NextResponse.json(
    { error: "Request body appears invalid."},
    { status: 400 }
    );
  }

  const domains = Array.isArray(body.domains) ? body.domains : [];
  if (domains.length === 0) {
    return NextResponse.json(
      { error: "Request must include a non-empty 'domains' array." },
      { status: 400 }
    );
  }

  const skipCacheFor = Array.isArray(body.skipCacheFor)
    ? body.skipCacheFor
    : [];
  
  const results: DomainResult[] = await fetchRdapForDomains(domains, {
    skipCacheFor
  });
  return NextResponse.json({ results })
}