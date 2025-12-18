# Simple Navigation (Chrome Extension Edition)

A static navigation page project built with Next.js, supporting export as pure static resources, and specifically adapted for Chrome extensions (New Tab Page).

[中文说明](./README_zh-CN.md)

## 🌟 Features

*   **Clean & Simple**: No card design, just a clean list of navigation links.
*   **Static Deployment**: Based on Next.js static export (`output: 'export'`), no Node.js backend required.
*   **Chrome Extension Support**:
    *   Can be used as a Chrome New Tab Page.
    *   Automatically handles Manifest V3 CSP (Content Security Policy) restrictions.
    *   Automatically handles Next.js route file naming (`_next` -> `assets`) to comply with Chrome extension specifications.
*   **Theme Switching**: Built-in Light and Dark modes, supports following system settings.
*   **Integrated Search**: Top integrated search bar, supports quick switching between Baidu, Google, and Bing search engines.
*   **Responsive Design**: Adapts to various screen sizes, based on Tailwind CSS.

## 🛠️ Tech Stack

*   **Framework**: [Next.js 14+](https://nextjs.org/) (App Directory)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS
*   **Icons**: Lucide React
*   **Components**: Shadcn UI (Radix UI)

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

### Build for Chrome Extension (Recommended)

This project includes a dedicated post-processing script `post-build-extension.js` to resolve various compatibility issues when loading Next.js pages as Chrome extensions (due to Chrome prohibiting filenames starting with `_` and strict restrictions on inline scripts).

**Complete Build Command:**

```bash
# 1. Build static files
npm run build

# 2. Run extension adaptation script (This step is crucial!)
node post-build-extension.js
```

After building, the **`out`** directory is the final extension package.

### Install to Chrome

1.  Open Chrome browser and visit `chrome://extensions/`
2.  Enable **"Developer mode"** in the top right corner.
3.  Click on **"Load unpacked"** in the top left corner.
4.  Select the **`out`** folder in the project root directory.

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

*   **After Updating Code**: If you modify the code, you must re-run `npm run build` and `node post-build-extension.js`, then click the refresh button on the Chrome extensions page to take effect.
*   **Search Function**: Search results open in a new tab by default.
