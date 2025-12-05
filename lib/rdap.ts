// All RDAP specific functions
// Also contains types, these should maybe get moved

import type { DomainResult } from "@/types/domain";

// RDAP Response modelling
type RdapEvent = {
  eventAction?: string;
  eventDate?: string;
};

type VCardEntry = [string, Record<string, unknown>, string, string];

type RdapEntity = {
  roles?: string[];
  vcardArray?: [string, VCardEntry[]];
};

type RdapResponse = {
  events?: RdapEvent[];
  entities?: RdapEntity[];
  ldhName?: string;
};

// Helpers to get values from RDAP response
function getExpiryFromRdap(rdap: RdapResponse): string | null {
  const events = rdap.events ?? [];

  const expiryEvent = events.find((event) => {
    const action = event.eventAction?.toLowerCase();
    return (
      action === "expiration" ||
      action === "expiry" ||
      action === "expires" ||
      action === "registration expiration"
    );
  });

  return expiryEvent?.eventDate ?? null;
}

function getCreatedFromRdap(rdap: RdapResponse): string | undefined {
  const events = rdap.events ?? [];

  const createdEvent = events.find((event) => {
    const action = event.eventAction?.toLowerCase();
    return action === "registration" || action === "creation";
  });

  return createdEvent?.eventDate;
}

function getUpdatedFromRdap(rdap: RdapResponse): string | undefined {
  const events = rdap.events ?? [];

  const updatedEvent = events.find((event) => {
    const action = event.eventAction?.toLowerCase();
    return action === "last changed" || action === "last update";
  });

  return updatedEvent?.eventDate;
}

function getRegistrarNameFromRdap(rdap: RdapResponse): string | undefined {
  const entities = rdap.entities ?? [];

  const registrarEntity = entities.find((entity) =>
    (entity.roles ?? []).some((role) => role.toLowerCase() === "registrar"),
  );

  if (!registrarEntity?.vcardArray) {
    return undefined;
  }

  const [, vcardEntries] = registrarEntity.vcardArray;

  const nameEntry = vcardEntries.find((entry) => entry[0] === "fn");

  if (!nameEntry) {
    return undefined;
  }

  const [, , , value] = nameEntry;

  return value;
}

function computeStatus(expiryIso: string | null): {
  status: DomainResult["status"];
  message?: string;
} {
  if (!expiryIso) {
    return {
      status: "error",
      message: "Could not determine expiry from RDAP data.",
    };
  }

  const now = new Date();
  const expiry = new Date(expiryIso);

  if (Number.isNaN(expiry.getTime())) {
    return {
      status: "error",
      message: "Expiry date from RDAP was invalid.",
    };
  }

  const diffMs = expiry.getTime() - now.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays <= 0) {
    return {
      status: "error",
      message: "Domain appears to be expired based on RDAP data.",
    };
  }

  if (diffDays <= 90) {
    return {
      status: "expiring-soon",
      message: `Domain expires in about ${Math.round(diffDays)} days.`,
    };
  }

  return {
    status: "ok",
    message: `Domain expires in about ${Math.round(diffDays)} days.`,
  };
}

function getTldFromDomain(domain: string): string | undefined {
  const parts = domain.toLowerCase().split(".");
  if (parts.length < 2) {
    return undefined;
  }

  const lastPart = parts[parts.length - 1];
  return `.${lastPart}`;
}

// Best effort caching - this is in-memory cache per serverless instance, Vercel may drop it at any time
// If this were a production app, more robust caching such as Redis would be used
const RDAP_CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const RDAP_FAILURE_CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

type CachedEntry = {
  result: DomainResult;
  expiresAt: number;
  cachedAt: number;
};

const rdapCache = new Map<string, CachedEntry>();

type LookupOptions = {
  forceRefresh?: boolean;
}

// Main function lookupSingleDomain - this asctually gets RDAP response, and is called by fetchRdapForDomains() below
async function lookupSingleDomain(domain: string, options?: LookupOptions): Promise<DomainResult> {
  const normalized = domain.toLowerCase().trim();
  const nowMs = Date.now();
  const forceRefresh = options?.forceRefresh === true;

  if (!normalized) {
    return {
      domain,
      status: "error",
      expiryDate: undefined,
      message: "Empty domain value.",
      fromCache: false,
    };
  }

  const cached = rdapCache.get(normalized);

  // If we are forcing a refresh do not use cache
  if (!forceRefresh && cached && cached.expiresAt > nowMs) {
    console.log(`[RDAP] Cache HIT for ${normalized}`);

    return {
      ...cached.result,
      fromCache: true,
      cachedAt: cached.cachedAt,
    };
  }

  console.log(
    `[RDAP] Cache MISS for ${normalized}${forceRefresh ? " (force refresh)" : ""}`,
  );

  try {
    const response = await fetch(
      `https://rdap.net/domain/${encodeURIComponent(normalized)}`,
      { cache: "no-store" },
    );

    const tld = getTldFromDomain(normalized);

    if (!response.ok) {
      const result: DomainResult = {
        domain: normalized,
        status: "error",
        expiryDate: undefined,
        message: `RDAP returned HTTP ${response.status}.`,
        tld,
        fromCache: false,
      };

      rdapCache.set(normalized, {
        result,
        expiresAt: nowMs + RDAP_FAILURE_CACHE_TTL_MS,
        cachedAt: nowMs,
      });

      return result;
    }

    const data = (await response.json()) as RdapResponse;

    const expiryFromRdap = getExpiryFromRdap(data);
    const createdDate = getCreatedFromRdap(data);
    const updatedDate = getUpdatedFromRdap(data);
    const registrarName = getRegistrarNameFromRdap(data);

    const { status, message } = computeStatus(expiryFromRdap);

    const result: DomainResult = {
      domain: normalized,
      status,
      expiryDate: expiryFromRdap ?? undefined, // only set if present
      message,
      registrarName,
      createdDate,
      updatedDate,
      tld,
      fromCache: false,
    };

    rdapCache.set(normalized, {
      result,
      expiresAt: nowMs + RDAP_CACHE_TTL_MS,
      cachedAt: nowMs,
    });

    return result;
  } catch (error) {
    console.error(`Error fetching RDAP for ${normalized}:`, error);

    const result: DomainResult = {
      domain: normalized,
      status: "error",
      expiryDate: undefined,
      message: "Network error calling RDAP service.",
      tld: getTldFromDomain(normalized),
      fromCache: false,
    };

    rdapCache.set(normalized, {
      result,
      expiresAt: nowMs + RDAP_FAILURE_CACHE_TTL_MS,
      cachedAt: nowMs,
    });

    return result;
  }
}

export async function fetchRdapForDomains(
  domains: string[],
  options?: { skipCacheFor?: string[] }
): Promise<DomainResult[]> {
  const skipSet = new Set(
    (options?.skipCacheFor ?? []).map((v) => v.toLowerCase().trim())
  );

  const tasks = domains.map((rawDomain) => {
    const normalized = rawDomain.trim().toLowerCase();
    const forceRefresh = skipSet.has(normalized);

    return lookupSingleDomain(normalized, { forceRefresh });
  });

  return Promise.all(tasks);
}
