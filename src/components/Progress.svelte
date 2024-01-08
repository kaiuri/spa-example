<script lang="ts">
  import {fade} from "svelte/transition";
  import {onMount} from "svelte";
  let max = 1;
  let value = 0;
  onMount(() => {
    const interval = setInterval(() => {
      max++;
      value++;
    }, 500);

    return () => {
      clearInterval(interval);
    };
  });
</script>

<progress in:fade value={value % max} {max} />
