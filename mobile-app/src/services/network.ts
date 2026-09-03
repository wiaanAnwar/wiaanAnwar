// Shared error type for "couldn't reach the backend" — thrown by
// httpClient.ts on a real fetch failure (offline, DNS, backend down) so
// every service's callers (the store) can handle it uniformly regardless
// of which endpoint failed.
export class NetworkError extends Error {
  constructor(message = 'Network request failed') {
    super(message);
    this.name = 'NetworkError';
  }
}
