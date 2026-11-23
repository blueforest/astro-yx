/**
 * Resolve Cloudflare bindings in both workerd (preview/deploy) and
 * `astro dev` (Node + Wrangler platform proxy).
 *
 * Top-level `import { env } from "cloudflare:workers"` breaks `astro dev`
 * because that virtual module is not available in Vite's Node SSR runner.
 */
let platformProxyPromise: Promise<Env> | undefined;

async function getDevEnv(): Promise<Env> {
  if (!platformProxyPromise) {
    platformProxyPromise = (async () => {
      const { getPlatformProxy } = await import("wrangler");
      const proxy = await getPlatformProxy<Env>({ persist: true });
      return proxy.env;
    })();
  }

  return platformProxyPromise;
}

export async function getCloudflareEnv(): Promise<Env> {
  try {
    const { env } = await import("cloudflare:workers");
    if (env?.DB) {
      return env as Env;
    }
  } catch {
    // Running outside workerd (typical for `astro dev`).
  }

  if (import.meta.env.PROD) {
    throw new Error("Cloudflare bindings are unavailable in this runtime.");
  }

  return getDevEnv();
}
