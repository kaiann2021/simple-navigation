# Simple Navigation (Chromium Extension Edition)

一个基于 Next.js 构建的静态导航页项目，支持导出为纯静态资源，并专门针对 Chromium 扩展程序（Chrome / Edge 新标签页）进行了适配。

## 🌟 功能特性

*   **清晰简单**: 无卡片设计，直接展示导航列表。
*   **静态部署**：基于 Next.js 的静态导出 (`output: 'export'`)，无需 Node.js 后端。
*   **Chrome / Edge 插件支持**：
    *   可作为 Chrome 与 Edge 浏览器的新标签页 (New Tab Page) 使用。
    *   自动处理 Manifest V3 的 CSP (Content Security Policy) 限制。
    *   自动处理 Next.js 路由文件命名 (`_next` -> `assets`) 以兼容 Chromium 插件规范。
*   **多主题切换**：内置亮色 (Light) 和暗色 (Dark) 模式，支持跟随系统。
*   **聚合搜索**：顶部集成搜索框，支持快速切换百度、Google、Bing 搜索引擎。
*   **响应式设计**：适配各种屏幕尺寸，基于 Tailwind CSS。

## 🛠️ 技术栈

*   **框架**: [Next.js 14+](https://nextjs.org/) (App Directory)
*   **语言**: TypeScript
*   **样式**: Tailwind CSS
*   **图标**: Lucide React
*   **组件库**: Shadcn UI (Radix UI)

## 🚀 开发指南

### 1. 安装依赖

```bash
npm install
# 或者
pnpm install
```

### 2. 本地开发

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 即可预览。

## 📦 构建与部署

### 构建 Chrome / Edge 插件 (推荐)

本项目包含一个专门的后处理脚本 `post-build-extension.js`，用于解决 Chromium 插件加载 Next.js 页面的兼容性问题（例如禁止 `_` 开头文件名、内联脚本限制等）。

**完整构建命令：**

```bash
# 构建 + 后处理 + 生成浏览器专用目录
npm run build:extension
```

构建完成后：

* `out/`：通用 Chromium 插件包（Chrome / Edge 都可直接加载）
* `dist/chrome/`：Chrome 专用目录
* `dist/edge/`：Edge 专用目录

### 安装到 Chrome

1.  打开 Chrome 浏览器，访问 `chrome://extensions/`
2.  开启右上角的 **"开发者模式" (Developer mode)**
3.  点击左上角的 **"加载已解压的扩展程序" (Load unpacked)**
4.  选择项目根目录下的 **`dist/chrome`**（或 `out`）文件夹

### 安装到 Edge

1.  打开 Edge 浏览器，访问 `edge://extensions/`
2.  开启左侧的 **开发人员模式**
3.  点击 **加载解压缩的扩展**
4.  选择项目根目录下的 **`dist/edge`**（或 `out`）文件夹

### 仅作为静态网站部署 (Nginx/Vercel)

如果仅作为普通网站部署，只需运行：

```bash
npm run build
```

生成的 `out` 目录可直接部署到任何静态文件服务器 (Nginx, GitHub Pages, Vercel 等)。

## 📁 目录结构

*   `app/`: Next.js 页面与布局
    *   `page.tsx`: 主页，包含导航列表和搜索框
    *   `layout.tsx`: 全局布局，包含主题配置
    *   `globals.css`: 全局样式与主题变量定义
*   `components/`: React 组件
    *   `mode-toggle.tsx`: 主题切换按钮
    *   `search-bar.tsx`: 搜索框组件
    *   `navigation-section.tsx`: 导航分类区块
    *   `theme-provider.tsx`: 主题上下文提供者
*   `public/`: 静态资源与 manifest.json
*   `post-build-extension.js`: **核心脚本**，用于构建后的文件重命名、路径修正和内联脚本提取。
*   `sites.txt`: (已废弃) 原始数据源文件。

## ⚠️ 注意事项

*   **更新代码后**：如果修改了代码，重新运行 `npm run build:extension`，然后在扩展管理页点击刷新按钮才能生效。
*   **搜索功能**：搜索结果会默认在新标签页打开。
