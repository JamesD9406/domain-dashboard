export type LookupRequest = {
    domains: Array<string>;
    skipCacheFor?: Array<string>;
};