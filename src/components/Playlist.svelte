<script context="module" lang="ts">
  export const pause = writable(true);
</script>

<script lang="ts">
  import {writable} from "svelte/store";
  import logo from "../assets/spotify.svg";

  export let items: ReadonlyArray<{
    name: string;
    context: string;
    image: {url: string; spotify: string};
    track: {url: string; spotify: string};
  }>;

  export let index: number = 0;
  $: item = items[index];
  $: spotify = item.track.spotify;
  $: src = item.track.url;

  let audio: HTMLAudioElement;
  $: if (audio) {
    if ($pause) audio.pause();
    else audio.play();
  }
</script>

<a
  class="z-10 self-end object-contain p-1 delay-500 hover:cursor-pointer"
  href={spotify}
  target="_blank"
>
  <img class="h-12 w-12" src={logo} alt={spotify} />
  <audio
    class="hidden w-full appearance-none rounded-lg bg-gray-900 text-black opacity-50"
    autoplay={true}
    bind:this={audio}
    {src}
    controls={true}
    on:ended={() => {
      if (index >= items.length) index = 0;
      else if (index < 0) index = items.length - 1;
      index++;
    }}
  >
  </audio>
</a>
