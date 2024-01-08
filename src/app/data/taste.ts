import type {Select} from "ts-toolbelt/out/Object/Select";
import type {AudioFeature, GET} from "../spotify";
import {aggregate} from "./audio_features";
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

const LABELS: Array<Feature> = [
  "valence",
  "energy",
  "loudness",
  "key",
  "tempo",
];
export async function generator(client: GET) {
  const {items: tracks} = await client("/me/top/tracks", {limit: "50"});
  if (tracks.length === 0) throw new Error("No tracks found");

  const {audio_features} = await client("/audio-features", {
    ids: tracks.map((x) => x.id).join(","),
  });

  const aggregated = aggregate(audio_features);
  const LEN = audio_features.length;
  const MID = Math.floor(LEN / 2);
  return Promise.all(
    LABELS.map(async (label) => {
      const values = aggregated[label];
      const mean = values.reduce((b, a) => b + a, 0) / LEN;
      const id = aggregated.id.at(values.indexOf(values.toSorted().at(MID)!));
      const track = tracks.find((x) => x.id === id)!;
      return {
        name: label,
        context: humanValue(mean, label),
        track: itemTrack(track),
        image: itemImage(track.album),
      };
    })
  );
}
