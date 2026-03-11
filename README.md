# Simple Navigation (Chromium Extension Edition)

A static navigation page project built with Next.js, supporting export as pure static resources, and specifically adapted for Chromium extensions (Chrome + Edge New Tab Page).

[中文说明](./README_zh-CN.md)

## 🌟 Features

*   **Clean & Simple**: No card design, just a clean list of navigation links.
*   **Static Deployment**: Based on Next.js static export (`output: 'export'`), no Node.js backend required.
*   **Chrome / Edge Extension Support**:
    *   Can be used as a New Tab Page in Chrome and Edge.
    *   Automatically handles Manifest V3 CSP (Content Security Policy) restrictions.
    *   Automatically handles Next.js route file naming (`_next` -> `assets`) to comply with Chromium extension specifications.
*   **Theme Switching**: Built-in Light and Dark modes, supports following system settings.
*   **Integrated Search**: Top integrated search bar, supports quick switching between Baidu, Google, and Bing search engines.
*   **Responsive Design**: Adapts to various screen sizes, based on Tailwind CSS.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 14+](https://nextjs.org/) (App Directory)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Components**: Shadcn UI (Radix UI)

## Sample Image
![f184cc20d305fad1815526a94b61efe6.png](https://i.mji.rip/2026/03/11/f184cc20d305fad1815526a94b61efe6.png)
![93589d6bf7020f3aece211f4bf26f22e.png](https://i.mji.rip/2026/03/11/93589d6bf7020f3aece211f4bf26f22e.png)
![cd9ffa9db0042068a6bc30cfaa97d530.png](https://i.mji.rip/2026/03/11/cd9ffa9db0042068a6bc30cfaa97d530.png)
![f7b6f6c238bb4520cf77197e295e75ae.png](https://i.mji.rip/2026/03/11/f7b6f6c238bb4520cf77197e295e75ae.png)

## 🚀 Development Guide

### 1. Install Dependencies

```bash
npm install
# or
pnpm install
```

### 2. Local Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to preview.

## 📦 Build & Deploy

### Build for Chrome / Edge Extension (Recommended)

This project includes a dedicated post-processing script `post-build-extension.js` to resolve compatibility issues when loading Next.js pages as Chromium extensions (filenames starting with `_`, strict restrictions on inline scripts, etc).

**Complete Build Command:**

```bash
# Build + post process + generate browser-specific packages
npm run build:extension
```

After building:

* `out/` = universal Chromium package (can be loaded in both Chrome and Edge)
* `dist/chrome/` = Chrome-oriented package
* `dist/edge/` = Edge-oriented package

### Install to Chrome

1.  Open Chrome browser and visit `chrome://extensions/`
2.  Enable **"Developer mode"** in the top right corner.
3.  Click on **"Load unpacked"** in the top left corner.
4.  Select the **`dist/chrome`** folder (or `out`) in the project root directory.

### Install to Edge

1.  Open Edge browser and visit `edge://extensions/`
2.  Enable **"Developer mode"** on the left side.
3.  Click **"Load unpacked"**.
4.  Select the **`dist/edge`** folder (or `out`) in the project root directory.

### Deploy as Static Website (Nginx/Vercel)

If deploying as a regular website, simply run:

```bash
npm run build
```

The generated `out` directory can be deployed directly to any static file server (Nginx, GitHub Pages, Vercel, etc.).

## 📁 Directory Structure

*   `app/`: Next.js pages and layout
    *   `page.tsx`: Home page, containing navigation list and search bar
    *   `layout.tsx`: Global layout, containing theme configuration
    *   `globals.css`: Global styles and theme variable definitions
*   `components/`: React components
    *   `mode-toggle.tsx`: Theme toggle button
    *   `search-bar.tsx`: Search box component
    *   `navigation-section.tsx`: Navigation category section
    *   `theme-provider.tsx`: Theme context provider
    *   `settings-dialog.tsx`: Appearance settings dialog
    *   `webdav-config-dialog.tsx`: WebDAV configuration dialog
*   `public/`: Static resources and manifest.json
*   `post-build-extension.js`: **Core Script**, used for post-build file renaming, path correction, and inline script extraction.
*   `data/`: Configuration data
    *   `example.json`: Default categories example

## ⚠️ Notes

*   **After Updating Code**: If you modify the code, re-run `npm run build:extension`, then click the refresh button on your browser's extensions page to take effect.
*   **Search Function**: Search results open in a new tab by default.
