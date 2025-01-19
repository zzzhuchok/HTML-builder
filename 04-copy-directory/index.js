const fsPromises = require('fs/promises');
const path = require('path');

const srcDir = path.join(__dirname, 'files');
const newDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    const cpDir = await fsPromises.mkdir(newDir, { recursive: true });
    if (!cpDir) {
      await delAllFiles(newDir);
    }
    await copyAllFiles(srcDir, newDir);
    console.log('copy successfully completed');
  } catch (error) {
    console.log(`*** Error ***\n ${error.message}`);
  }
}

async function copyAllFiles(folder, newPath) {
  const files = await fsPromises.readdir(folder, { withFileTypes: true });
  for (const file of files) {
    const srcPath = path.join(folder, file.name);
    const destPath = path.join(newPath, file.name);
    if (file.isDirectory()) {
      await fsPromises.mkdir(destPath, {
        recursive: true,
      });
      await copyAllFiles(srcPath, destPath);
    } else {
      await fsPromises.copyFile(srcPath, destPath);
    }
  }
}

async function delAllFiles(folder) {
  const files = await fsPromises.readdir(folder, { withFileTypes: true });
  for (const file of files) {
    const filePath = path.join(folder, file.name);
    if (file.isDirectory()) {
      await delAllFiles(filePath);
      await fsPromises.rmdir(filePath);
    } else {
      await fsPromises.unlink(filePath);
    }
  }
}

copyDir();
