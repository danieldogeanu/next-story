const fs = require('node:fs');
const path = require('node:path');

/**
 * The script below was added here from this Strapi tutorial:
 * https://strapi.io/blog/improve-your-frontend-experience-with-strapi-types-and-type-script
 *
 * The code for this script can be found in this gist:
 * https://gist.github.com/PaulBratslavsky/a95c4ec5aa3e2a3055ed11c81f94c1d3
 */

const destinationFolder = 'frontend/src/types/strapi';

const files = [
  {
    src: path.join(__dirname, '../backend/types/generated/contentTypes.d.ts'),
    dest: path.join(__dirname, `../${destinationFolder}/contentTypes.d.ts`),
  },
  {
    src: path.join(__dirname, '../backend/types/generated/components.d.ts'),
    dest: path.join(__dirname, `../${destinationFolder}/components.d.ts`),
  },
];

function copyFile({ src, dest }) {
  const destinationDir = path.dirname(dest);

  // Check if source file exists.
  if (!fs.existsSync(src)) {
    console.error(`Source file does not exist: ${src}`);
    process.exit(1);
  }

  // Ensure destination directory exists or create it.
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir, { recursive: true });
  }

  // Read the source file, modify its content and write to the destination file.
  const content = fs.readFileSync(src, 'utf8');

  fs.writeFile(dest, content, (err) => {
    if (err) {
      console.error(`Error writing to destination file: ${err}`);
      process.exit(1);
    } else {
      console.log(`File ${path.basename(src)} copied and modified successfully!`);
    }
  });
}

files.forEach((file) => copyFile(file));
