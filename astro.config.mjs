// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  // Astro Actions / 表单提交需要服务端输出
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
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