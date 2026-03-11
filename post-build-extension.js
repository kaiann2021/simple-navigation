const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'out');
const assetsDir = path.join(outDir, 'assets');
const distDir = path.join(__dirname, 'dist');
const SUPPORTED_TARGETS = new Set(['chrome', 'edge']);

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  const output = arrayOfFiles || [];

  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, output);
    } else {
      output.push(fullPath);
    }
  });

  return output;
}

function parseTargetsFromArgs() {
  const arg = process.argv.find((item) => item.startsWith('--targets='));
  if (!arg) return ['chrome', 'edge'];

  const targets = arg
    .split('=')[1]
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);

  if (targets.length === 0) return ['chrome', 'edge'];

  const invalid = targets.filter((target) => !SUPPORTED_TARGETS.has(target));
  if (invalid.length > 0) {
    throw new Error(`Unsupported targets: ${invalid.join(', ')}. Supported values: chrome, edge`);
  }

  return [...new Set(targets)];
}

function patchOutDirectory() {
  console.log('Processing output directory...');
  const rootFiles = fs.readdirSync(outDir);

  rootFiles.forEach((file) => {
    const fullPath = path.join(outDir, file);

    if (file.endsWith('.txt')) {
      console.log(`Removing ${file}...`);
      fs.rmSync(fullPath, { recursive: true, force: true });
      return;
    }

    if (file.startsWith('_')) {
      if (file === '_next') {
        console.log('Renaming _next to assets...');
        if (fs.existsSync(assetsDir)) {
          fs.rmSync(assetsDir, { recursive: true, force: true });
        }
        fs.renameSync(fullPath, assetsDir);
      } else {
        const newName = file.substring(1);
        console.log(`Renaming ${file} to ${newName}...`);
        fs.renameSync(fullPath, path.join(outDir, newName));
      }
    }
  });

  console.log('Updating file references...');
  const allFiles = getAllFiles(outDir);

  allFiles.forEach((file) => {
    if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js') || file.endsWith('.json')) {
      let content = fs.readFileSync(file, 'utf8');
      let changed = false;

      if (content.includes('/_next/')) {
        content = content.replace(/\/_next\//g, '/assets/');
        changed = true;
      }

      if (content.includes('/_not-found')) {
        content = content.replace(/\/_not-found/g, '/not-found');
        changed = true;
      }

      if (changed) {
        console.log(`Patched ${path.basename(file)}`);
        fs.writeFileSync(file, content, 'utf8');
      }
    }
  });
}

function extractInlineScripts() {
  console.log('Extracting inline scripts to external files...');
  const indexHtmlPath = path.join(outDir, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) return;

  let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
  let scriptCount = 0;

  htmlContent = htmlContent.replace(/<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/gi, (match, attrs, content) => {
    if (!content.trim()) return match;

    scriptCount += 1;
    const filename = `script-${scriptCount}.js`;
    const filePath = path.join(assetsDir, filename);

    if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Extracted inline script to assets/${filename}`);

    return `<script src="/assets/${filename}"${attrs}></script>`;
  });

  fs.writeFileSync(indexHtmlPath, htmlContent, 'utf8');
  console.log(`Extracted ${scriptCount} inline scripts from index.html`);

  const manifestPath = path.join(outDir, 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  if (manifest.content_security_policy) {
    console.log('Resetting CSP to default strict mode in manifest...');
    delete manifest.content_security_policy;
  }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');
}

function getBrowserDisplayName(target) {
  return target === 'edge' ? 'Edge' : 'Chrome';
}

function createTargetPackages(targets) {
  console.log(`Generating target packages: ${targets.join(', ')}...`);
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }
  fs.mkdirSync(distDir, { recursive: true });

  targets.forEach((target) => {
    const targetDir = path.join(distDir, target);
    fs.cpSync(outDir, targetDir, { recursive: true, force: true });

    const manifestPath = path.join(targetDir, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    manifest.description = `静态导航新标签页，兼容 Chrome 和 Edge（${getBrowserDisplayName(target)} 构建）`;
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8');

    console.log(`Generated dist/${target}`);
  });
}

try {
  if (!fs.existsSync(outDir)) {
    throw new Error('Missing out directory. Run "npm run build" first.');
  }

  const targets = parseTargetsFromArgs();

  patchOutDirectory();
  extractInlineScripts();
  createTargetPackages(targets);

  console.log('Done! Extension packages are ready.');
} catch (err) {
  console.error('Error post-processing:', err);
  process.exit(1);
}
