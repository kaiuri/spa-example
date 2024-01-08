import type {GET} from "../spotify";
import {formatName} from "./format";
import {itemImage, itemTrack} from "./item";

export async function generator(client: GET) {
  const {items: tracks} = await client("/me/top/tracks", {limit: "20"});
  const view = [];
  for (const track of tracks) {
    if (view.length >= 5) break;
    view.push({
      name: formatName(track.name),
      context: track.artists[0].name,
      image: itemImage(track.album),
      track: itemTrack(track),
    });
  }
  return view;
}
