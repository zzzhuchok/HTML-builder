const path = require('path');
const fsPromises = require('fs/promises');

async function buildHTML() {
  const components = path.join(__dirname, 'components');

  let indexHTML = await fsPromises.readFile(
    path.join(__dirname, 'template.html'),
    'utf-8',
  );
  const filesComp = await fsPromises.readdir(components, {
    withFileTypes: true,
  });

  for (const file of filesComp) {
    if (file.isFile() && path.extname(file.name) === '.html') {
      const fileName = path.basename(file.name, '.html');
      const fileInner = await fsPromises.readFile(
        path.join(components, file.name),
        'utf-8',
      );

      if (indexHTML.includes(fileName)) {
        const re = new RegExp(`\\{\\{${fileName}\\}\\}`, 'i');
        indexHTML = indexHTML.replace(re, fileInner);
      }
    }
  }
  return indexHTML;
}

async function mergeStyles() {
  const styles = path.join(__dirname, 'styles');

  let strDataFiles = '';
  let strHeader = '';
  let strFooter = '';
  const files = await fsPromises.readdir(styles, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const readFile = await fsPromises.readFile(
        path.join(styles, file.name),
        'utf-8',
      );

      if (file.name === 'header.css') {
        strHeader = readFile;
      } else if (file.name === 'footer.css') {
        strFooter += readFile;
      } else {
        strDataFiles += readFile;
      }
    }
  }
  strDataFiles = strHeader + strDataFiles + strFooter;
  return strDataFiles;
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

async function createProjDist() {
  const srcDir = path.join(__dirname, 'assets');
  const newDir = path.join(__dirname, 'project-dist');

  try {
    const projDist = await fsPromises.mkdir(newDir, { recursive: true });
    const html = await buildHTML();
    const style = await mergeStyles();

    if (!projDist) await delAllFiles(newDir);
    await copyAllFiles(srcDir, path.join(newDir, 'assets'));

    await fsPromises.writeFile(path.join(newDir, 'index.html'), html);
    await fsPromises.writeFile(path.join(newDir, 'style.css'), style);
  } catch (error) {
    console.log(error);
  }
}

createProjDist();
