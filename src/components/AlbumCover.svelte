<script lang="ts">
  import {fade} from "svelte/transition";

  export let spotify: string;
  export let url: string;
</script>

<a
  href={spotify}
  target="_blank"
  class="flex flex-col items-center justify-center"
>
  <img
    in:fade
    width="400px"
    height="400px"
    class="scale-90 object-fill hover:cursor-pointer"
    alt={url}
    src={url}
  />
</a>
