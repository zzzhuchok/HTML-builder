const fsPromises = require('fs/promises');
const path = require('path');

const dist = path.join(__dirname, 'project-dist');
const styles = path.join(__dirname, 'styles');

async function mergeStyles() {
  let strDataFiles = '';
  const files = await fsPromises.readdir(styles, { withFileTypes: true });
  for (const file of files) {
    if (file.isFile() && path.extname(file.name) === '.css') {
      const readFile = await fsPromises.readFile(
        path.join(styles, file.name),
        'utf-8',
      );
      strDataFiles += readFile;
    }
  }
  await fsPromises.writeFile(path.join(dist, 'bundle.css'), strDataFiles);
}

mergeStyles();
