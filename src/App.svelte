<script lang="ts">
  import Button from "./components/Button.svelte";
  import Progress from "./components/Progress.svelte";
  import View from "./components/View.svelte";
  import {type authenticate} from "./auth";
  import {load} from "./app";
  export let credentials: Exclude<
    Awaited<ReturnType<typeof authenticate>>,
    URL
  >;
  let stories = load(credentials);
  const MAX = stories.length - 1;
  let index = 0;
  function rotate(s: 1 | -1) {
    return function () {
      let value = index + s;
      if (value < 0) value = MAX;
      else if (value > MAX) value = 0;
      index = value;
    };
  }
  /** clear storage and redirects to `/` which will be `/login` since storage
   * will be empty */
  function logout() {
    sessionStorage.clear();
    window.location.href = "/";
  }
</script>

{#await stories[index].items}
  <Progress />
{:then items}
  <View title={stories[index].title} {items} />
{:catch error}
  <p>{error.message ?? "unknown error"}</p>
{/await}
<div class="flex flex-row justify-evenly">
  <Button onClick={logout}>logout</Button>
  <Button onClick={rotate(-1)}>{"<"}</Button>
  <Button onClick={rotate(1)}>{"<"}</Button>
</div>
