<script lang="ts">
  import {onMount} from "svelte";

  export let redirect: URL;
  onMount(() => {
    window.history.pushState({}, "", "/login");
  });
</script>

<div class="box flex flex-col place-items-center items-start p-2">
  <h1 class="self-center hover:cursor-default">
    Spookiefy <span class="text-rose-500"> ☻ </span>
  </h1>
  <p>A spooky way to see your Spotify data</p>
  <p>Click <i>login</i> to get started</p>
  <div class="flex-row self-center p-2">
    <em class="self-start italic hover:brightness-110">by</em>
    <a
      class="self-end hover:cursor-pointer hover:brightness-110"
      href="https://github.com/kaiuri">Uriel Caiado</a
    >
  </div>
</div>
<div class="flex flex-row justify-evenly">
  <a class="btn self-end" href={redirect.toString()}>login</a>
</div>
