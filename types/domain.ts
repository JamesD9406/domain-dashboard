export type DomainResult = {
  domain: string;
  status: "ok" | "expiring-soon" | "error";
  expiryDate?: string;
  message?: string;
  registrarName? : string;
  createdDate?: string;
  updatedDate?: string;
  tld?: string;
  fromCache?: boolean;
  cachedAt?: number;
};