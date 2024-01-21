import App from "./App.svelte";
import ErrorPage from "./components/ErrorPage.svelte";
import Login from "./Login.svelte";
import Main from "./Main.svelte";
import {authenticate} from "./auth";

export default new Main({
  target: document.getElementById("app")!,
  props: {
    data: authenticate({
      client_id: import.meta.env.VITE_CLIENT_ID,
      redirect_uri: import.meta.env.VITE_REDIRECT_URI,
      scope: import.meta.env.VITE_SCOPE,
    })
      .catch((error) => ({
        component: ErrorPage,
        props: {
          message: error instanceof Error ? error.message : "unknown error",
        },
      }))
      .then((result) => {
        if (result instanceof URL)
          return {component: Login, props: {redirect: result}};
        return {component: App, props: {credentials: result}};
      }),
  },
});
