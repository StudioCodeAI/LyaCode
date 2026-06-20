import { readdirSync, statSync, readFileSync, writeFileSync, renameSync } from 'fs';
import { join } from 'path';

const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'coverage', '.github', 'reports']);

function walkDir(dir, callback) {
  const files = readdirSync(dir);
  for (const f of files) {
    if (IGNORE_DIRS.has(f)) continue;
    const path = join(dir, f);
    if (statSync(path).isDirectory()) {
      walkDir(path, callback);
    } else {
      callback(path);
    }
  }
}

function processFile(path) {
  // Skip binary/large files safely by extension
  if (path.match(/\.(png|jpg|jpeg|gif|ico|webp|svg|woff|woff2|ttf|eot|tgz|zip|exe|pdf|wav|mp3|sqlite)$/i)) return;

  try {
    let content = readFileSync(path, 'utf8');
    let newContent = content
      .split('lyacode').join('lyacode')
      .split('Lya Code').join('Lya Code')
      .split('LYA_CODE').join('LYA_CODE')
      .split('LYACODE').join('LYACODE')
      .split('LyaCode').join('LyaCode');

    if (content !== newContent) {
      writeFileSync(path, newContent, 'utf8');
      console.log(`Updated content: ${path}`);
    }
  } catch(e) {
    // Ignore files that can't be read as utf8
  }
}

// 1. Process contents
walkDir('.', processFile);

// 2. Rename files
const filesToRename = [];
walkDir('.', (path) => {
  if (path.includes('lyacode') || path.includes('LyaCode') || path.includes('Lya Code')) {
    filesToRename.push(path);
  }
});

for (const path of filesToRename) {
  const newPath = path
    .split('lyacode').join('lyacode')
    .split('Lya Code').join('Lya Code')
    .split('LyaCode').join('LyaCode');
  renameSync(path, newPath);
  console.log(`Renamed: ${path} -> ${newPath}`);
}
