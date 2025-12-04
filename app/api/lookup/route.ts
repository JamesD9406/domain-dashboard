import { NextRequest, NextResponse } from "next/server";

import type { DomainResult } from "@/types/domain";
import type { LookupRequest } from "@/types/requests/lookup";

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

  const now = new Date();

  //Results still mocked but now coming from the server
  const results: DomainResult[] = domains.map((domain, index) => {
    const expiry = new Date(now);
    expiry.setMonth(expiry.getMonth() + 1 + index); // stagger expiries

    const isExpiringSoon = index % 3 === 0;
    const hasWarning = index % 5 === 0;

    return {
      domain: domain.toLowerCase(),
      status: isExpiringSoon ? "expiring-soon" : "ok",
      expiryDate: expiry.toISOString(),
      message: hasWarning ? "Example warning message" : undefined,
    };
  });

  return NextResponse.json({ results });

}