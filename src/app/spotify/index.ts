import type {Endpoint, GET, Params, Result} from "./api";
export type * from "./api";

async function GET(
  info: URL | RequestInfo,
  init: RequestInit,
  cache_name = 'spotify-api-cache'
) {
  const cache = await caches.open(cache_name)
  let res = await cache.match(info)
  if (res) return res
  res = await fetch(info, init)
  if (res.ok) {
    await cache.put(info, res.clone())
  }
  return res
}
export function createClient(access_token: string): GET {
  if (!access_token) {
    throw "spotify: missing access_token";
  }
  const init: RequestInit = {method: "GET", headers: {Authorization: `Bearer ${access_token}`}};
  return async function <E extends Endpoint>(
    endpoint: E,
    params: Params<E>
  ): Promise<Result<E>> {
    const info = new URL(`https://api.spotify.com/v1${endpoint}`);
    info.search = new URLSearchParams(params).toString();
    const res = await GET(info, init)
    if (!res.ok) throw res.statusText;
    return res.json();
  };
}
