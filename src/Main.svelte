<script lang="ts">
  import Progress from "./components/Progress.svelte";
  import "./global.css";
  export let data: Promise<{
    component: ConstructorOfATypedSvelteComponent;
    props: ConstructorParameters<ConstructorOfATypedSvelteComponent>[0]["props"];
  }>;
</script>

<svelte:head><title>App</title></svelte:head>
<main>
  {#await data}
    <Progress />
  {:then { component, props }}
    <svelte:component this={component} {...props} />
  {:catch e}
    <p>something went <em>VERY</em> wrong</p>
  {/await}
</main>
