<script lang="ts">
  import type {MouseEventHandler} from "svelte/elements";
  export let name: string;
  export let context: string;
  export let active: boolean;
  export let hovered: boolean;
  export let onClick: MouseEventHandler<EventTarget>;
  export let onMouseOver: MouseEventHandler<EventTarget>;
  export let onMouseLeave: MouseEventHandler<EventTarget>;
</script>

<button
  class:active
  class:hover={hovered}
  class:animate-pulse={active}
  on:focus={() => {}}
  on:click={onClick}
  on:mouseover={onMouseOver}
  on:mouseleave={onMouseLeave}
>
  <t class:active style:color="var(--green)">{name}</t>
  <t style:color="var(--red)">{context}</t>
</button>

<style lang="css">
  t {
    font-weight: bold;
    justify-content: space-around;
    padding: 0.5rem;
    /** uppercase */
    text-transform: capitalize;
  }
  t:active {
    filter: brightness(1.1);
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
