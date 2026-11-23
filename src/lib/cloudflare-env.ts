/**
 * Resolve Cloudflare bindings in both workerd (preview/deploy) and
 * `astro dev` (Node + Wrangler platform proxy).
 *
 * Top-level `import { env } from "cloudflare:workers"` breaks `astro dev`,
 * so production uses a separate module and local dev uses getPlatformProxy.
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
  if (import.meta.env.DEV) {
    return getDevEnv();
  }

  const { getWorkersEnv } = await import("./cf-env");
  return getWorkersEnv();
}
