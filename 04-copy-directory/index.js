const fsPromises = require('fs/promises');
const path = require('path');

const srcDir = path.join(__dirname, 'files');
const newDir = path.join(__dirname, 'files-copy');

async function copyDir() {
  try {
    const cpDir = await fsPromises.mkdir(newDir, { recursive: true });
    if (!cpDir) await delAllFiles(newDir);
    await copyAllFiles(srcDir, newDir);
  } catch (error) {
    console.log(error.name);
  }
}

async function copyAllFiles(folder, newPath) {
  const files = await fsPromises.readdir(folder, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      await fsPromises.mkdir(path.join(newPath, file.name), {
        recursive: true,
      });
      await copyAllFiles(
        path.join(folder, file.name),
        path.join(newPath, file.name),
      );
    } else {
      await fsPromises.copyFile(
        path.join(folder, file.name),
        path.join(newPath, file.name),
      );
    }
  }
}

async function delAllFiles(folder) {
  const files = await fsPromises.readdir(folder, { withFileTypes: true });
  for (const file of files) {
    if (file.isDirectory()) {
      await delAllFiles(path.join(folder, file.name));
      await fsPromises.rmdir(path.join(folder, file.name));
    } else {
      await fsPromises.unlink(path.join(folder, file.name));
    }
  }
}

copyDir();
