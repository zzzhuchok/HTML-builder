const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const output = fs.createWriteStream(path.join(__dirname, 'write.txt'));
stdout.write('Введите текст:\n');
stdin.on('data', (data) => {
  const input = data.toString().trim();
  if (input === 'exit') {
    handleExit();
  }
  output.write(data);
});

process.on('exit', () => stdout.write('Удачи в изучении Node.js!\n'));
process.on('SIGINT', () => handleExit());

function handleExit() {
  output.end(() => {
    exit();
  });
}
