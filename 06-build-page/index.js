const path = require('path');
const fsPromises = require('fs/promises');

async function buildHTML() {
  try {
    const componentsPath = path.join(__dirname, 'components');
    let indexHTML = await fsPromises.readFile(
      path.join(__dirname, 'template.html'),
      'utf-8',
    );
    const componentFiles = await fsPromises.readdir(componentsPath, {
      withFileTypes: true,
    });

    for (const file of componentFiles) {
      if (file.isFile() && path.extname(file.name) === '.html') {
        const fileName = path.basename(file.name, '.html');
        const fileInner = await fsPromises.readFile(
          path.join(componentsPath, file.name),
          'utf-8',
        );

        if (indexHTML.includes(fileName)) {
          const regex = new RegExp(`\\{\\{${fileName}\\}\\}`, 'i');
          indexHTML = indexHTML.replace(regex, fileInner);
        }
      }
    }
    return indexHTML;
  } catch (error) {
    console.error(`Error in buildHTML:\n ${error.message}`);
  }
}

async function mergeStyles() {
  try {
    const stylesPath = path.join(__dirname, 'styles');

    let strDataFiles = '';
    let strHeader = '';
    let strFooter = '';
    const styleFiles = await fsPromises.readdir(stylesPath, {
      withFileTypes: true,
    });
    for (const file of styleFiles) {
      if (file.isFile() && path.extname(file.name) === '.css') {
        const fileContent = await fsPromises.readFile(
          path.join(stylesPath, file.name),
          'utf-8',
        );

        if (file.name === 'header.css') {
          strHeader = fileContent;
        } else if (file.name === 'footer.css') {
          strFooter += fileContent;
        } else {
          strDataFiles += fileContent;
        }
      }
    }
    strDataFiles = strHeader + strDataFiles + strFooter;
    return strDataFiles;
  } catch (error) {
    console.error(`Error in mergeStyles:\n ${error.message}`);
  }
}

async function copyAllFiles(folder, newPath) {
  try {
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
  } catch (error) {
    console.error(`Error in copyAllFiles:\n ${error.message}`);
  }
}

async function delAllFiles(folder) {
  try {
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
  } catch (error) {
    console.error(`Error in delAllFiles:\n ${error.message}`);
  }
}

async function createProjDist() {
  const srcDir = path.join(__dirname, 'assets');
  const newDir = path.join(__dirname, 'project-dist');

  try {
    const projDist = await fsPromises.mkdir(newDir, { recursive: true });
    const [htmlContent, styleContent] = await Promise.all([
      buildHTML(),
      mergeStyles(),
    ]);

    if (!projDist) {
      await delAllFiles(newDir);
    }
    await copyAllFiles(srcDir, path.join(newDir, 'assets'));
    await Promise.all([
      fsPromises.writeFile(path.join(newDir, 'index.html'), htmlContent),
      fsPromises.writeFile(path.join(newDir, 'style.css'), styleContent),
    ]);

    console.log('Project folder created successfully!');
  } catch (error) {
    console.error(`Error in createProjDist:\n ${error.message}`);
  }
}

createProjDist();
