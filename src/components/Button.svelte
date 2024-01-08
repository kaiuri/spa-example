<script lang="ts">
  import type {EventHandler} from "svelte/elements";

  export let onClick: EventHandler<MouseEvent>;
</script>

<button on:click={onClick}>
  <slot />
</button>

<style lang="css">
  button {
    background-color: var(--bg-far);
    color: var(--red);
    border-radius: 0.375rem;
    cursor: pointer;
    font-weight: bold;
    height: auto;
    margin: 0.5rem;
    padding: 0.5rem;
    transition-duration: 150ms;
    transition-property: color, background-color, border-color,
      text-decoration-color, fill, stroke, opacity, box-shadow, transform,
      filter, backdrop-filter;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    width: auto;
  }
  button:hover {
    background-color: var(--red);
    color: var(--bg-far);
    font-weight: bolder;
    border-color: var(--red);
  }
</style>
