import type {Endpoint, GET, Params, Result} from "./api";
export type * from "./api";

function requestInfo(endpoint: string, params?: Record<string, string>) {
  if (!params) return `https://api.spotify.com/v1${endpoint}`;
  return `https://api.spotify.com/v1${endpoint}?` + new URLSearchParams(params);
}

async function createCache(name: string) {
  if (await caches.has(name)) await caches.delete(name);
  return caches.open(name);
}

async function cachedFetch(cache: Cache | undefined, req: Request) {
  if (!cache) return fetch(req);
  let res = await cache.match(req.url);
  if (res) return res;
  res = await fetch(req);
  if (!res.ok) return res;
  await cache.put(req, res.clone());
  return res;
}

export const CACHE_NAME = "spookiefy";
export function createClient(access_token: string): GET {
  if (!access_token) throw "spotify: missing access_token";
  const CACHE = createCache(CACHE_NAME);
  const requestInit: RequestInit = {
    method: "GET",
    headers: {Authorization: `Bearer ${access_token}`},
  };
  return async function <E extends Endpoint>(
    endpoint: E,
    params: Params<E>
  ): Promise<Result<E>> {
    const req = new Request(requestInfo(endpoint, params), requestInit);
    const res = await cachedFetch(await CACHE, req);
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  };
}
