import {collectBy, map, pipe, prop} from "ramda";
import type {AudioFeature, GET, Track} from "../spotify";
import type {Merge} from "ts-toolbelt/out/Object/Merge";
import type {Select} from "ts-toolbelt/out/Object/Select";
import {itemImage, itemTrack} from "./item";
type Feature = keyof Select<AudioFeature, number>;

function round(v: number) {
  return Math.round(v * 100) + "%";
}

function humanValue(v: number, key: Feature) {
  // prettier-ignore
  switch (key) {
    case "key":
      switch (true) {
        case v < 1: return "C";
        case v < 2: return "C♯";
        case v < 3: return "D";
        case v < 4: return "D♯/E♭";
        case v < 5: return "E/E♭";
        case v < 6: return "F";
        case v < 7: return "F♯/G♭";
        case v < 8: return "G";
        case v < 9: return "G♯/A♭";
        case v < 10: return "A";
        case v < 11: return "A♯/B♭";
        case v < 12: return "B/C♭";
        default: return "C";
      }
    case "loudness": return Math.round(v) + " dB";
    case "mode": return v <= 0.5 ? "minor" : "major";
    case "tempo": return Math.round(v) + " bpm";
    case "duration_ms": return Math.round(v / 1000) + " s";
    case "time_signature": return Math.round(v) + "/4";
    default: return round(v);
  }
}

async function createItem(
  merged: Array<Merge<AudioFeature, Track>>,
  key: Feature
) {
  const arr = merged.toSorted((a, b) => a[key] - b[key]);
  const mean = arr.reduce((a, b) => a + b[key], 0) / arr.length;
  return {
    name: key,
    context: humanValue(mean, key),
    track: itemTrack(arr[10]),
    image: itemImage(arr[10].album),
  };
}

export async function generator(client: GET) {
  const {items: tracks} = await client("/me/top/tracks", {limit: "20"});
  if (tracks.length === 0) throw new Error("No tracks found");

  const {audio_features} = await client("/audio-features", {
    ids: tracks.map((x) => x.id).join(","),
  });

  const labels: Array<Feature> = [
    "valence",
    "energy",
    "loudness",
    "key",
    "tempo",
  ];
  const merge = pipe(
    (audio_features: AudioFeature[], tracks: Track[]) => {
      return [...audio_features, ...tracks];
    },
    collectBy(prop("id")),
    map((a): Merge<AudioFeature, Track> => {
      return Object.assign({}, ...a);
    })
  );
  const merged = merge(audio_features, tracks);
  const gen = createItem.bind(null, merged);
  return Promise.all(labels.map(gen));
}
