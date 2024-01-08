<script lang="ts">
  export let message: string | undefined = undefined;
  let hidden = true;
  export let withLogout = true;
  const logout = () => {
    sessionStorage.clear();
    window.location.href = "/login";
  };
</script>

<div class="flex flex-col">
  <div class="box flex flex-col">
    <h1>Something went wrong</h1>
    <button
      class="font-bold text-emerald-500 hover:text-emerald-400"
      on:click={() => (hidden = !hidden)}
    >
      <details {hidden}>
        {message}
      </details>
    </button>
  </div>
  {#if withLogout}
    <button class="btn" on:click={logout}>return</button>
  {/if}
</div>
