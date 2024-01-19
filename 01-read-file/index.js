const fs = require('fs');
const path = require('path');
const { stdout } = require('process');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), {
  encoding: 'utf-8',
});
stream.pipe(stdout);
stream.on('error', (err) => console.log(err.message));
