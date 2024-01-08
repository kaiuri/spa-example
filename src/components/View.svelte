<script lang="ts">
  import {onDestroy} from "svelte";
  import {fade} from "svelte/transition";
  import AlbumCover from "./AlbumCover.svelte";
  import ItemList, {active, hovered} from "./ItemList.svelte";
  import Playlist from "./Playlist.svelte";

  export let title: string;
  export let items: ReadonlyArray<{
    name: string;
    context: string;
    image: {url: string; spotify: string};
    track: {url: string; spotify: string};
  }>;
  $: image = items[$hovered].image;
  onDestroy(() => {
    active.set(0);
    hovered.set(0);
  });
</script>

<!-- add fade transition -->
<div in:fade class="flex flex-col rounded-lg bg-slate-800">
  <h1 class="top-3 self-center text-xl capitalize">{title}</h1>
  <AlbumCover {...image} />
  <ItemList {items} />
  <Playlist {items} index={$active} />
</div>
