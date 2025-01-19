const fsPromises = require('fs/promises');
const path = require('path');

async function readFolder() {
  try {
    const folderPath = path.join(__dirname, 'secret-folder');
    const files = await fsPromises.readdir(folderPath, { withFileTypes: true });

    for (const file of files) {
      if (file.isFile()) {
        const filePath = path.join(folderPath, file.name);
        const fileName = path.parse(file.name);
        const fileStat = await fsPromises.stat(filePath);
        const fileSizeKb = (fileStat.size / 1024).toFixed(3);
        console.log(
          `${fileName.name} - ${fileName.ext.slice(1)} - ${fileSizeKb} kb`,
        );
      }
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
  }
}

readFolder();
