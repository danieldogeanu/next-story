const fs = require('node:fs');
const path = require('node:path');

const srcDir = 'fetcher/data';
const destDir = 'frontend/data';

const paths = {
  src: path.join(process.cwd(), srcDir),
  dest: path.join(process.cwd(), destDir),
};

(() => {
  // Check if source folder exists.
  if (!fs.existsSync(paths.src)) {
    console.error(`Source folder does not exist: ${paths.src}`);
    process.exit(1);
  }

  // Ensure destination directory exists or create it.
  if (!fs.existsSync(paths.dest)) {
    fs.mkdirSync(paths.dest, { recursive: true });
  }

  // Read the contents of the source directory.
  const entries = fs.readdirSync(paths.src, { withFileTypes: true });

  // Copy the contents of the source directory.
  for (let entry of entries) {
    const srcFilePath = path.join(paths.src, entry.name);
    const destFilePath = path.join(paths.dest, entry.name);

    if (entry.isFile()) fs.copyFileSync(srcFilePath, destFilePath);
  }

  console.log('Copied data folder from fetcher successfully!');
})();
