// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";

// 部署自定义域名后请改成正式站点地址（须以 http:// 或 https:// 开头）
const site = "https://astro-yx.workers.dev";

// https://astro.build/config
export default defineConfig({
  site,
  // Astro Actions / 表单提交需要服务端输出
  output: "server",
  adapter: cloudflare({
    // 当前站点图片多为 public 静态资源，无需 Cloudflare Images binding
    imageService: "passthrough",
  }),
  // SSR 模式下 sitemap 扫不到按需渲染页面，用 customPages 显式列出公开页
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes("/admin") && !page.includes("/contact-us/success"),
      customPages: [
        `${site}/`,
        `${site}/about-us/`,
        `${site}/contact-us/`,
      ],
    }),
  ],
  // 本项目未使用 Sessions，关闭后可避免 Cloudflare 自动配置 KV
  session: false,
  server: {
    port: 4422,
  },
  // Astro 默认在端口被占用时会自动尝试下一个端口。
  // 通过 Vite 的 strictPort 在占用时直接失败，避免静默切换。
  // 参见：https://vite.dev/config/server-options.html#server-strictport
  vite: {
    server: {
      strictPort: true,
    },
    preview: {
      strictPort: true,
    },
    plugins: [tailwindcss()],
  },
});
