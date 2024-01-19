/*
    ATTENTION!!!!!!!!! (ПРОЧТИ МЕНЯ, если используешь Git Bash для Windows)

В Git Bash для Windows версий 2.35.1-2.35.4 присутствует баг,
при котором некорректно обрабатывается событие при нажатии сочетания клавиш Ctrl+C.
В связи с этим во второй задаче может не показываться прощальное сообщение при нажатии
данного сочетания клавиш (Ctrl+C).

Варианты решения:
    1. Обновите Git Bash (ввести в консоль: git update-git-for-windows)
    2. Запускайте в другом терминале (например: powershell)

*/

const fs = require('fs');
const path = require('path');
const { stdin, stdout, exit } = process;

const output = fs.createWriteStream(path.join(__dirname, 'write.txt'));
stdout.write('Введите текст:\n');
stdin.on('data', (data) => {
  if (data.toString().trim() === 'exit') exit();
  output.write(data);
});

process.on('exit', () => stdout.write('Удачи в изучении Node.js!'));
process.on('SIGINT', () => exit());
