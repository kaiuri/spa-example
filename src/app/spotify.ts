import type {Type} from "ts-toolbelt/out/Any/Type";
import type {Select} from "ts-toolbelt/out/Object/Select";
export type ReleaseDatePrecision = "day" | "year";
export type Market = Type<string, "market">;
type Href = Type<string, "href">;
type Followers = {
  href: Href;
  total: number;
};
type Image = {
  height: number;
  url: string;
  width: number;
};
type ExternalUrls = {
  spotify: string;
};
type Product = "premium" | "free" | "";
type AlbumType = "ALBUM" | "SINGLE";
type Id = Type<string, "id">;
export type Artist = {
  external_urls: ExternalUrls;
  followers: Followers;
  genres: string[];
  href: Href;
  id: Id;
  images: Image[];
  name: string;
  popularity: number;
  type: "artist";
  uri: string;
};
export type AudioFeature = {
  danceability: number;
  energy: number;
  key: number;
  loudness: number;
  mode: number;
  speechiness: number;
  acousticness: number;
  instrumentalness: number;
  liveness: number;
  valence: number;
  tempo: number;
  type: "audio_features";
  id: Id;
  uri: string;
  track_href: Href;
  analysis_url: string;
  duration_ms: number;
  time_signature: number;
};
export type AlbumArtist = {
  external_urls: ExternalUrls;
  href: Href;
  id: Id;
  name: string;
  type: "artist";
  uri: string;
};
export type Album = {
  album_type: AlbumType;
  artists: AlbumArtist[];
  available_markets: string[];
  external_urls: ExternalUrls;
  href: Href;
  id: Id;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: ReleaseDatePrecision;
  total_tracks: number;
  type: "album";
  uri: string;
};
export type ExternalIDS = {
  isrc: string;
};
export type TrackArtist = {
  external_urls: ExternalUrls;
  href: Href;
  id: Id;
  name: string;
  type: "artist";
  uri: string;
};

export type Track = {
  album: Album;
  artists: TrackArtist[];
  available_markets: Market[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_ids: ExternalIDS;
  external_urls: ExternalUrls;
  href: Href;
  id: Id;
  is_local: boolean;
  name: string;
  popularity: number;
  preview_url: string;
  track_number: number;
  type: "track";
  uri: string;
};
export type ArtistTrack = Track & {
  is_playable: boolean;
  preview_url: string | null;
};
export type User = {
  country: Market;
  display_name: string;
  email: string;
  explicit_content: ExplicitContent;
  external_urls: ExternalUrls;
  followers: Pick<Followers, "total">;
  href: Href;
  id: Id;
  images: Image[];
  product: Product;
  type: "user";
  uri: string;
};
export type ExplicitContent = {
  filter_enabled: boolean;
  filter_locked: boolean;
};

export type Recommendations = {
  [P in keyof Track]: P extends "preview_url" ? string | null : Track[P];
};

export type Endpoint =
  | "/me"
  | "/me/top/artists"
  | "/me/top/tracks"
  | "/artists"
  | "/audio-features"
  | `/artists/${Artist["id"]}/top-tracks`
  | "/recommendations";

export type NumericalAudioFeatures = Select<AudioFeature, number>;
export type RecommendationsParams = {
  [P in `${`target` | `min` | `max`}_${keyof NumericalAudioFeatures}`]?: string;
};
export type TimeRange = "short_term" | "medium_term" | "long_term";
// prettier-ignore
export type Params<E extends Endpoint> =
  E extends "/me" ? Record<string, never> :
  E extends "/me/top/artists" ? {limit?: string, time_range?: TimeRange} :
  E extends "/me/top/tracks" ? {limit?: string, time_range?: TimeRange} :
  E extends "/artists" ? {ids: string} :
  E extends "/audio-features" ? {ids: string} :
  E extends `/artists/${Artist['id']}/top-tracks` ? {id: Artist['id']; market: User['country']} :
  E extends "/recommendations" ? {
    limit?: string;
    market?: User['country'];
    seed_artists?: string;
    seed_genres?: string;
    seed_tracks?: string;
  } & RecommendationsParams :
  never;
// prettier-ignore
export type Result<E extends Endpoint> =
  E extends "/me" ? User :
  E extends "/me/top/artists" ? {items: Artist[]} :
  E extends "/me/top/tracks" ? {items: Track[]} :
  E extends "/artists" ? {artists: Artist[]} :
  E extends "/audio-features" ? {audio_features: AudioFeature[]} :
  E extends `/artists/${Artist['id']}/top-tracks` ? {tracks: ArtistTrack[]} :
  E extends "/recommendations" ? {tracks: Array<Recommendations>} :
  never;

export type RegularError = {
  status: number;
  message: string;
};

/** throws on `Response['ok'] === false` */
export type GET = <T extends Endpoint>(
  endpoint: T,
  params: Params<T>
) => Promise<Result<T>>;

async function GET(
  info: URL | RequestInfo,
  init: RequestInit,
  cache_name = "spotify-api-cache"
) {
  const cache = await caches.open(cache_name);
  let res = await cache.match(info);
  if (res) return res;
  res = await fetch(info, init);
  if (res.ok) {
    await cache.put(info, res.clone());
  }
  return res;
}
export function createClient(access_token: string): GET {
  if (!access_token) {
    throw "spotify: missing access_token";
  }
  const init: RequestInit = {
    method: "GET",
    headers: {Authorization: `Bearer ${access_token}`},
  };
  return async function <E extends Endpoint>(
    endpoint: E,
    params: Params<E>
  ): Promise<Result<E>> {
    const info = new URL(`https://api.spotify.com/v1${endpoint}`);
    info.search = new URLSearchParams(params).toString();
    const res = await GET(info, init);
    if (!res.ok) throw res.statusText;
    return res.json();
  };
}
