import type {Artist, GET, User} from "../spotify";
import {itemImage, itemTrack} from "./item";

// type NonNullableProps<O, K> = { [P in keyof O]: P extends K ? NonNullable<O[P]> : O[P]; };
// prettier-ignore
// const validTrack = < T extends { is_playable: boolean; preview_url: string | null }>(v: T): v is NonNullableProps<T, "preview_url"> => v.is_playable && v.preview_url !== null;

function artistTrack(client: GET, me: User) {
  return async function (artist: Artist) {
    const {tracks} = await client(`/artists/${artist.id}/top-tracks`, {
      id: artist.id,
      market: me.country,
    });
    if (tracks.length === 0) throw {status: 404, message: "Artist has no tracks", };
    const track = tracks[0];
    if (!track) throw {status: 404, message: "Artist has no playable tracks", };
    return {
      name: artist.name,
      context: track.name,
      track: itemTrack(track),
      image: itemImage(artist),
    };
  };
}

export async function generator(client: GET) {
  const me = await client("/me", {});
  const {items} = await client("/me/top/artists", {limit: "5"});
  const createArtist = artistTrack(client, me);
  return Promise.all(items.map(createArtist));
}
