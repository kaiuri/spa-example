export type Item = {
  readonly name: string;
  readonly context: string;
  readonly image: {readonly url: string; readonly spotify: string};
  readonly track: {readonly url: string; readonly spotify: string};
};
export type Story = {
  readonly title: string;
  readonly items: Promise<ReadonlyArray<Item>>;
};

import {generator as recommendations} from "./data/recommendations";
import {generator as taste} from "./data/taste";
import {generator as tracks} from "./data/tracks";
import {generator as artists} from "./data/artists";
import {createClient} from "./spotify";

// TODO: CACHE results of tracks, recommendations, artists and taste
export function load({access_token}: {access_token: string}): readonly Story[] {
  const client = createClient(access_token);
  const stories: ReadonlyArray<Story> = [
    {title: "taste", items: taste(client)},
    {title: "artists", items: artists(client)},
    {title: "tracks", items: tracks(client)},
    {title: "suggestions", items: recommendations(client)},
  ];
  return stories;
}
