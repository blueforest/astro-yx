import { env } from "cloudflare:workers";

/** Production / workerd only — do not import from `astro dev` code paths. */
export function getWorkersEnv(): Env {
  return env as Env;
}
