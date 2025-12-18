const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const outDir = path.join(__dirname, 'out');
const assetsDir = path.join(outDir, 'assets');

function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);
  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function (file) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });

  return arrayOfFiles;
}

try {
  console.log('Processing output directory...');
  const rootFiles = fs.readdirSync(outDir);

  // Phase 1: Rename/Remove files in root
  rootFiles.forEach(file => {
    const fullPath = path.join(outDir, file);

    // Remove .txt files (Next.js build artifacts)
    if (file.endsWith('.txt')) {
      console.log(`Removing ${file}...`);
      fs.rmSync(fullPath, { recursive: true, force: true });
      return;
    }

    // Handle underscore files
    if (file.startsWith('_')) {
      if (file === '_next') {
        console.log('Renaming _next to assets...');
        if (fs.existsSync(assetsDir)) {
          fs.rmSync(assetsDir, { recursive: true, force: true });
        }
        fs.renameSync(fullPath, assetsDir);
      } else {
        // Rename _not-found -> not-found
        const newName = file.substring(1); // remove first char
        console.log(`Renaming ${file} to ${newName}...`);
        fs.renameSync(fullPath, path.join(outDir, newName));
      }
    }
  });

  // Phase 2: Update Content References
  console.log('Updating file references...');
  const allFiles = getAllFiles(outDir);

  allFiles.forEach(file => {
    if (file.endsWith('.html') || file.endsWith('.css') || file.endsWith('.js') || file.endsWith('.json')) {
      let content = fs.readFileSync(file, 'utf8');
      let changed = false;

      // Replace /_next/ -> /assets/
      if (content.includes('/_next/')) {
        content = content.replace(/\/_next\//g, '/assets/');
        changed = true;
      }

      // Replace /_not-found -> /not-found
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

  console.log('Done! Extension ready.');

  // Phase 3: Extract Inline Scripts (Manifest V3 Strictness)
  console.log('Extracting inline scripts to external files...');
  const indexHtmlPath = path.join(outDir, 'index.html');
  if (fs.existsSync(indexHtmlPath)) {
    let htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
    let scriptCount = 0;

    // Regex to find inline scripts: <script>...</script> (without src attribute)
    // We use a replacer function to modify the HTML content directly
    htmlContent = htmlContent.replace(/<script(?![^>]*src=)([^>]*)>([\s\S]*?)<\/script>/gi, (match, attrs, content) => {
      if (!content.trim()) return match; // Keep empty scripts or whitespace only as is (or remove them? keeping is safer)

      scriptCount++;
      const filename = `script-${scriptCount}.js`;
      const filePath = path.join(assetsDir, filename);

      // Write content to new file
      // Ensure assets dir exists (it should, but just in case)
      if (!fs.existsSync(assetsDir)) fs.mkdirSync(assetsDir, { recursive: true });

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Extracted inline script to assets/${filename}`);

      // Return new script tag with src
      return `<script src="/assets/${filename}"${attrs}></script>`;
    });

    fs.writeFileSync(indexHtmlPath, htmlContent, 'utf8');
    console.log(`Extracted ${scriptCount} inline scripts from index.html`);

    // Also remove any CSP hashes from manifest if we added them previously
    const manifestPath = path.join(outDir, 'manifest.json');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    if (manifest.content_security_policy) {
      console.log('Resetting CSP to default strict mode in manifest...');
      delete manifest.content_security_policy; // Default is strict enough
      // Or explicitly set it if needed:
      // manifest.content_security_policy = { extension_pages: "script-src 'self'; object-src 'self'" };
    }
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  }

} catch (err) {
  console.error('Error post-processing:', err);
  process.exit(1);
}

