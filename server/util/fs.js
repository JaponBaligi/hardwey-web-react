import fs from 'fs';
import path from 'path';

export function ensureUploadsDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  try {
    if (process.platform !== 'win32') {
      fs.chmodSync(dir, 0o755);
    }
  } catch {
    // ignore on restricted hosts
  }
}

export function resolvePathSafe(base, target) {
  const targetPath = path.resolve(base, target);
  if (!targetPath.startsWith(path.resolve(base))) {
    throw new Error('Path traversal detected');
  }
  return targetPath;
}


