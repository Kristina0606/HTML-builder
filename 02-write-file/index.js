const fs = require('fs');
const path = require('path');
const readLine = require('readline');

const rl = readLine.createInterface({
  input: process.stdin,
  output: process.stdout,
});

fs.writeFile(path.join(__dirname, 'text.txt'), '', (err) => {
  if (err) throw err;
  console.log(
    'Введите текст, который нужно записать в файл, для выхода - введите exit',
  );
});

rl.on('line', (input) => {
  if (input.trim().toLocaleLowerCase() === 'exit') {
    console.log('вы завершили программу');
    rl.close();
  } else {
    fs.appendFile(path.join(__dirname, 'text.txt'), input + '\n', (err) => {
      if (err) throw err;
      console.log('данные записаны в файл, можете ввести еще');
    });
  }
});

rl.on('close', () => {
  console.log('Код выполнен');
});
