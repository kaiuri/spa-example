<script context="module" lang="ts">
  export const pause = writable(true);
</script>

<script lang="ts">
  import type {EventHandler} from "svelte/elements";
  import {writable} from "svelte/store";
  import logo from "../assets/spotify.svg";
  export let onEnded: EventHandler<Event, HTMLAudioElement>;

  export let url: string;
  export let spotify: string;

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
    src={url}
    controls={true}
    on:ended={onEnded}
  >
  </audio>
</a>
