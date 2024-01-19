const fsPromises = require('fs/promises');
const path = require('path');

async function Read() {
  try {
    const files = await fsPromises.readdir(
      path.join(__dirname, 'secret-folder'),
      { withFileTypes: true },
    );
    for (const file of files) {
      if (file.isFile()) {
        const fileName = path.parse(file.name);
        const fileStat = await fsPromises.stat(
          path.join(__dirname, 'secret-folder', file.name),
        );
        const fileSize = fileStat.size / 1024;
        console.log(
          `${fileName.name} - ${fileName.ext.slice(1)} - ${fileSize.toFixed(
            3,
          )} kb`,
        );
      }
    }
  } catch (err) {
    console.log(err.message);
  }
}

Read();
