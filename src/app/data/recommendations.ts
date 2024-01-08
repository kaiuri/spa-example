/* eslint-disable @typescript-eslint/no-unused-vars */
import {mean, toPairs} from "ramda";
import type {AudioFeature, GET} from "../spotify";
import {formatName} from "./format";

type Aggregated = {
  [P in keyof AudioFeature]: Array<AudioFeature[P]>;
};

const assign = Object.assign;
const create = Object.create;

function aggregateFeatures(audio_features: AudioFeature[]): Aggregated {
  return audio_features.reduce<Aggregated>((acc, curr) => {
    toPairs(curr).forEach(([feature, value]) => {
      if (feature in acc) {
        assign(acc, {[feature]: [...acc[feature], value]});
      } else {
        assign(acc, {[feature]: [value]});
      }
    });
    return acc;
  }, create(null));
}

const panic = (msg: string) => (e: unknown | Error) => {
  if (e instanceof Error) throw e.message;
  throw msg;
};
export async function generator(client: GET) {
  const {country} = await client("/me", {}); // lets not even do anything else in case this throws
  // we do chaining for maintainability, since this order is too important
  const audio_features = await client("/me/top/tracks", {
    limit: "50",
    time_range: "short_term",
  })
    .catch(panic("Failed to get top tracks"))
    .then(({items}) =>
      client("/audio-features", {
        ids: items.map((t) => t.id).join(","),
      })
        .catch(panic("/audio-features failed"))
        .then(({audio_features}) => audio_features)
    );
  const aggregated = aggregateFeatures(audio_features);
  const {tracks} = await client("/recommendations", {
    limit: "10",
    market: country,
    seed_tracks: aggregated.id.slice(0, 5).join(","),
    // too much and the user feels annoyed
    max_danceability: Math.max(...aggregated.danceability).toString(),
    max_energy: Math.max(...aggregated.energy).toString(),
    max_loudness: Math.max(...aggregated.loudness).toString(),
    max_tempo: Math.max(...aggregated.tempo).toString(),
    max_valence: Math.max(...aggregated.valence).toString(),
    max_acousticness: Math.max(...aggregated.acousticness).toString(),
    max_liveness: Math.max(...aggregated.liveness).toString(),
    max_instrumentalness: Math.max(...aggregated.instrumentalness).toString(),
    // too little and the user feels bored
    min_tempo: Math.min(...aggregated.tempo).toString(),
    // those are all about taste
    target_danceability: mean(aggregated.danceability).toFixed(2), // PERF: We could do all those in one go
    target_energy: mean(aggregated.energy).toFixed(2),
    target_key: mean(aggregated.key).toFixed(0),
    target_loudness: mean(aggregated.loudness).toFixed(2),
    target_mode: mean(aggregated.mode).toFixed(0),
    target_speechiness: mean(aggregated.speechiness).toFixed(2),
    target_tempo: mean(aggregated.tempo).toFixed(2),
    target_time_signature: mean(aggregated.time_signature).toFixed(0),
    target_valence: mean(aggregated.valence).toFixed(2),
  });
  const result = [];
  for (const track of tracks) {
    if (result.length === 5) break;
    if (track.preview_url === null) continue;
    result.push({
      name: formatName(track.name),
      context: formatName(track.artists[0].name),
      image: {
        url: track.album.images[0].url,
        spotify: track.album.external_urls.spotify,
      },
      track: {
        url: track.preview_url,
        spotify: track.external_urls.spotify,
      },
    });
  }

  return result;
}
