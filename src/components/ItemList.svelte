<script lang="ts" context="module">
  import {writable} from "svelte/store";
  export const hovered = writable(0);
  export const active = writable(0);
</script>

<script lang="ts">
  import {pause} from "./Playlist.svelte";
  function toggle() {
    $pause = !$pause;
  }

  export let items: ReadonlyArray<{
    name: string;
    context: string;
    image: {url: string; spotify: string};
    track: {url: string; spotify: string};
  }>;
</script>

<div
  class="grid grid-cols-1 justify-center justify-items-center self-center p-2"
>
  {#each items as { context, name }, i}
    <button
      class:hover={i === $hovered}
      class:animate-pulse={$active === i}
      on:focus={() => {}}
      on:click={() => {
        if (i !== $active) $active = i;
        toggle();
      }}
      on:mouseover={() => {
        $hovered = i;
      }}
      on:mouseleave={() => {
        if ($hovered === $active) return;
        $hovered = $active;
      }}
    >
      <t class:active={i === $active} style:color={"var(--green)"}>{name}</t>
      <t class:active={i === $active} style:color="var(--red)">{context}</t>
    </button>
  {/each}
</div>

<style lang="css">
  t {
    font-weight: bold;
    justify-content: space-around;
    padding: 0.5rem;
    text-transform: capitalize;
  }
  button:hover {
    cursor: pointer;
    filter: brightness(1.2);
  }
  button {
    display: flex;
    justify-content: space-around;
    list-style: none;
    object-fit: fill;
  }
</style>
