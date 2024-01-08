<script lang="ts">
  import "./global.css";
  export let title: string;
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>
<main>
  <slot />
</main>
