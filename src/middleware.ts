import { defineMiddleware } from "astro:middleware";
import { getCloudflareEnv } from "./lib/cloudflare-env";

const ADMIN_USER = "admin";

function unauthorized(): Response {
  return new Response("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="YX Inquiries Admin"',
      "Cache-Control": "no-store",
    },
  });
}

export const onRequest = defineMiddleware(async (context, next) => {
  if (!context.url.pathname.startsWith("/admin")) {
    return next();
  }

  const env = await getCloudflareEnv();
  const password = env.ADMIN_PASSWORD;
  if (!password) {
    return new Response(
      "Admin is not configured. Set ADMIN_PASSWORD (wrangler secret / .dev.vars).",
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }

  const header = context.request.headers.get("Authorization");
  if (!header?.startsWith("Basic ")) {
    return unauthorized();
  }

  try {
    const decoded = atob(header.slice("Basic ".length));
    const separator = decoded.indexOf(":");
    if (separator === -1) {
      return unauthorized();
    }

    const username = decoded.slice(0, separator);
    const provided = decoded.slice(separator + 1);

    if (username !== ADMIN_USER || provided !== password) {
      return unauthorized();
    }
  } catch {
    return unauthorized();
  }

  return next();
});
