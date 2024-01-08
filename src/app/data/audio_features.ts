import type {AudioFeature} from "../spotify";

import {toPairs, memoizeWith} from "ramda";

type Aggregated = {
  [P in keyof AudioFeature]: Array<AudioFeature[P]>;
};

const assign = Object.assign;
const create = Object.create;

function _aggregate(audio_features: AudioFeature[]): Aggregated {
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
export const aggregate = memoizeWith((audio_features) => {
  return audio_features.length.toString();
}, _aggregate);
