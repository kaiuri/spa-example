/// <reference lib="dom" />

// #region: Helpers

// because the browser can't just keep rerunning things every time the page changes

const once = <A extends ReadonlyArray<unknown>, R>(fn: (...args: A) => R) => {
  let value: R;
  return (...args: A) => {
    if (!value) value = fn(...args);
    return value;
  };
};

// #endregion

// #region: PKCE

//#region: types

type Configuration = {
  client_id: string;
  redirect_uri: string;
  scope: string;
};

type Credentials = {
  /** An access token that can be provided in subsequent calls, for example to
   * Spotify Web API services. */
  readonly access_token: string;
  /** How the access token may be used: always "Bearer". */
  readonly token_type: "Bearer";
  /** A space-separated list of scopes which have been granted for this access_token */
  readonly scope: Configuration["scope"];
  /**  The time period (in seconds) for which the access token is valid.*/
  readonly expires_in: number;
  /** A refresh token is a security credential that allows client applications
   * to obtain new access tokens without requiring users to reauthorize the
   * application. Access tokens are intentionally configured to have a limited
   * lifespan (1 hour), at the end of which, new tokens can be obtained by
   * providing the original refresh token acquired during the authorization
   * token request response */
  readonly refresh_token: string;
};

//#endregion

function hash(length: number) {
  const ALPHANUMERIC =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let ret = "";
  for (let i = 0; i < length; i++) {
    ret += ALPHANUMERIC[Math.floor(Math.random() * ALPHANUMERIC.length)];
  }
  return ret;
}
// A cryptographically random string between 43 and 128. Spotify asks for 128
const code_verifier = once(() => {
  let str = sessionStorage.getItem("code_verifier");
  if (!str) {
    str = hash(128);
    sessionStorage.setItem("code_verifier", str);
  }
  return str;
});

const state = once(() => {
  let str = sessionStorage.getItem("state");
  if (!str) {
    str = hash(16);
    sessionStorage.setItem("state", str);
  }
  return str;
});

/** code_challenge_method: "S256", else we'd use "plain" */
const code_challenge = once(() =>
  window.crypto.subtle
    .digest("SHA-256", new TextEncoder().encode(code_verifier()))
    .then((digest) => {
      return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/=/g, "")
        .replace(/\+/g, "-")
        .replace(/\//g, "_");
    })
);

/** URL for user confirmation */
const authorization = once((config: Configuration) =>
  code_challenge().then(
    (code_challenge) =>
      new URL(
        "https://accounts.spotify.com/authorize?" +
          new URLSearchParams({
            code_challenge,
            code_challenge_method: "S256",
            state: state(),
            response_type: "code",
            ...config,
          })
      )
  )
);

/** request access_token */
const credentials = once(async (config: Configuration) => {
  let value = JSON.parse(sessionStorage.getItem("credentials") ?? "null");
  // means we're already authenticated
  if (value) return value as Credentials;
  const search = new URLSearchParams(window.location.search);
  const recv_state = search.get("state");
  if (recv_state !== state()) throw "state mismatch";
  const code = search.get("code");
  if (!code) throw "no code";
  const res = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {"Content-Type": "application/x-www-form-urlencoded"},
    body: new URLSearchParams({
      client_id: config["client_id"],
      redirect_uri: config["redirect_uri"],
      code: code,
      code_verifier: code_verifier(),
      grant_type: "authorization_code",
    }),
  });
  if (!res.ok) {
    sessionStorage.clear()
    throw res.statusText;
  }
  value = await res.json();
  sessionStorage.setItem("credentials", JSON.stringify(value));
  return value as Credentials;
});

export const authenticate = async (config: Configuration) =>
  // if we got everything needed, or we've already did this we'll get the credentials
  credentials(config)
    .then((v) => v)
    // else it means we're missing something, so we'll redirect the user to the login page
    .catch(() => authorization(config).then((v) => v));

// #endregion
