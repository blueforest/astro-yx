import type { APIRoute } from "astro";

const robotsTemplate = (sitemapURL: URL) => `User-agent: *
Allow: /

# Admin / form result pages — no indexing
Disallow: /admin/
Disallow: /contact-us/success/

Sitemap: ${sitemapURL.href}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL("sitemap-index.xml", site);
  return new Response(robotsTemplate(sitemapURL), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
