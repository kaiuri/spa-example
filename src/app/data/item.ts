export function itemTrack(value: {
  preview_url: string;
  external_urls: {spotify: string};
}) {
  return {
    url: value.preview_url,
    spotify: value.external_urls.spotify,
  };
}
export function itemImage(value: {
  images: {url: string}[];
  external_urls: {spotify: string};
}) {
  return {
    url: value.images[0].url,
    spotify: value.external_urls.spotify,
  };
}
