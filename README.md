# astro-yx

一个简洁的 Astro + TypeScript 起步项目，适合学习官方目录约定，并在此基础上继续扩展。

样式基于 **Tailwind CSS v4**（`@tailwindcss/vite`）。表单使用 **Astro Actions**，部署目标为 **Cloudflare Workers**（`@astrojs/cloudflare`，`output: 'server'`）。

## 快速开始

```bash
npm install
npm run dev
```

本地开发地址：**http://localhost:4422/**

> **端口说明：** `astro.config.mjs` 将开发/预览端口固定为 `4422`，并通过 Vite 的 `strictPort: true` 禁止在端口被占用时自动切换。若启动失败并提示端口占用，请先释放 `4422` 后再重试，不要依赖静默换端口。

### 常用命令

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 启动开发服务器（端口 4422） |
| `npm run build` | 构建生产产物到 `dist/` |
| `npm run preview` | 构建后用 Wrangler 本地预览 |
| `npm run deploy` | 应用远端 D1 migrations 并部署到 Cloudflare Workers |
| `npm run db:migrate:local` | 对本机 D1 应用 migrations |
| `npm run db:migrate:remote` | 对远端 D1 应用 migrations |
| `npm run check` | 运行 `astro check` 做类型与诊断检查 |

## 询盘存储（Cloudflare D1）

询盘表单写入 Cloudflare **D1**；可在 **`/admin/inquiries/`** 查看（HTTP Basic Auth，用户名固定为 `admin`）。

### 本地开发

```bash
cp .dev.vars.example .dev.vars   # 设置 ADMIN_PASSWORD
npm run db:migrate:local
npm run dev
```

打开 http://localhost:4422/admin/inquiries/ ，用 `admin` + `.dev.vars` 中的密码登录。

### 首次生产配置

```bash
npx wrangler login
npx wrangler d1 create astro-yx-inquiries
```

把命令输出的 `database_id` 填进 `wrangler.jsonc` 的 `d1_databases[0].database_id`，然后：

```bash
npx wrangler secret put ADMIN_PASSWORD   # 设置后台密码
npm run deploy
```

查看地址：`https://<你的-worker>.workers.dev/admin/inquiries/`

## 部署到 Cloudflare Workers

按 [Astro 官方 Cloudflare 部署文档](https://docs.astro.build/en/guides/deploy/cloudflare/)。

**环境要求：** Node.js `>=22.23.4`（与当前 Astro 版本一致）。

```bash
# 首次需要在本机浏览器登录 Cloudflare 账号
npx wrangler login

# 构建并部署到 Cloudflare Workers
npm run deploy
```

部署成功后，Wrangler 会输出 `*.workers.dev` 地址。也可在 Cloudflare Dashboard → **Workers & Pages** 中绑定自定义域名。

配置文件：

- `astro.config.mjs`：`@astrojs/cloudflare` 适配器 + `output: "server"`
- `wrangler.jsonc`：Worker 名称、D1 绑定、兼容性标志与静态资源目录
- `migrations/`：D1 表结构（`inquiries`）
## 目录用途

```text
astro-yx/
├── public/                 # 不做处理的静态资源，原样复制到构建结果
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/
│       ├── yx-semiconductor-logo.svg
│       ├── semi-conductor-bg-1.webp
│       ├── dongguan.webp
│       ├── jiangsu.webp
│       ├── YXPDBMC49.webp
│       ├── YXPDBMC42.webp
│       ├── YXPDBMC47.webp
│       ├── waxless-alternative.webp
│       ├── chemically-resistant-waxless.webp
│       ├── h1.webp
│       ├── h2.webp
│       ├── h3.webp
│       ├── h4.webp
│       ├── report-1.webp
│       ├── report-2.webp
│       ├── report-3.webp
│       ├── report-4.webp
│       ├── certi3.webp
│       ├── cert2.webp
│       ├── cert1.webp
│       ├── yx-company.png
│       ├── yx-equipment-1.webp
│       └── yx-company98.webp
├── src/
│   ├── components/         # 可复用 Astro 组件
│   │   ├── Header.astro    # 全站页眉（Tailwind）
│   │   ├── HomeBanner.astro # 首页 Hero Banner
│   │   ├── AboutUs.astro   # About Us 双基地模块
│   │   ├── AboutUsStack.astro # About Us Stack rack 介绍
│   │   ├── AboutUsCleanroom.astro # About Us Cleanroom 介绍
│   │   ├── AboutUsCustomized.astro # About Us Customized 介绍
│   │   ├── HomeProducts.astro # CMP Polishing Pad 产品模块
│   │   ├── ProductFeature1.astro # Waxless 方案特性介绍
│   │   ├── ProductFeature2.astro # CXT 耐化学模板特性
│   │   ├── ProductFeature3.astro # Waxless Template 规格表
│   │   ├── MaterialImgs.astro # Template 材料成分报告图
│   │   ├── Certificate.astro # 企业证书展示
│   │   ├── ContactUs.astro # 联系团队 + Inquiry 表单
│   │   ├── Footer.astro    # 全站页脚
│   │   └── WelcomeCard.astro
│   ├── actions/
│   │   └── index.ts        # Astro Actions（submitInquiry）
│   ├── layouts/            # 共享页面布局（HTML 外壳 + <slot />）
│   │   └── BaseLayout.astro
│   ├── pages/              # 基于文件的路由；index.astro => /
│   │   └── index.astro
│   └── styles/
│       └── global.css      # Tailwind 入口 + 品牌主题 token
├── astro.config.mjs        # Astro / Vite 配置
├── package.json            # 依赖与 npm scripts
└── tsconfig.json           # TypeScript（extends astro/tsconfigs/strict）
```

## 主要文件之间的关系

1. **`src/pages/index.astro`**  
   站点首页路由。它导入 `BaseLayout`，并把页面内容放进布局的 `<slot />`；同时导入并使用 `WelcomeCard` 组件。

2. **`src/layouts/BaseLayout.astro`**  
   共享布局。负责页面外壳，挂载 `Header`，并导入 `src/styles/global.css`（含 `@import "tailwindcss"`）。

3. **`src/components/Header.astro`**  
   全站页眉：品牌渐变、本地 logo、桌面/移动导航与 CTA。

4. **`src/components/HomeBanner.astro`**  
   首页全宽 Hero：文案、统计、产品图与浮动徽章。

5. **`src/components/WelcomeCard.astro`**  
   带 TypeScript `Props` 的可复用内容卡片（Tailwind 样式）。

6. **`src/styles/global.css`**  
   Tailwind 入口，并在 `@theme` 中定义 `teal` / `silver` / `navy` 等品牌色。

7. **`public/images/`**  
   本地静态图片（logo、首页 hero 图等），页面通过 `/images/...` 引用。

8. **`astro.config.mjs`**  
   配置本地端口为 `4422`、`strictPort`，以及 `@tailwindcss/vite` 插件。

## 建议的学习路径

1. 改 `src/pages/index.astro` 的文案，观察热更新。
2. 复制一个页面到 `src/pages/about.astro`，复用 `BaseLayout`。
3. 在 `src/components/` 新增组件，并在页面中传入 typed props。
4. 需要框架组件或适配器时，再按 [Astro 官方文档](https://docs.astro.build/) 用 `astro add` 引入。

## 参考文档

- [Install Astro](https://docs.astro.build/en/install-and-setup/)
- [Project structure](https://docs.astro.build/en/basics/project-structure/)
- [Layouts](https://docs.astro.build/en/basics/layouts/)
- [TypeScript](https://docs.astro.build/en/guides/typescript/)
- [Configuration reference](https://docs.astro.build/en/reference/configuration-reference/)
