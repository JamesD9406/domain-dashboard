export type DomainResult = {
  domain: string;
  status: "ok" | "expiring-soon" | "error";
  expiryDate: string;
  message?: string;
};