// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  // Astro Actions / 表单提交需要服务端输出
  output: "server",
  adapter: cloudflare({
    // 当前站点图片多为 public 静态资源，无需 Cloudflare Images binding
    imageService: "passthrough",
  }),
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
