const fs = require('fs');
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const outputFolder = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputFolder, 'bundle.css');

if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder);
}

function compileStyles() {
  fs.readdir(stylesFolder, (err, files) => {
    if (err) {
      return console.error('Ошибка чтения папки:', err);
    }

    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    const stylesArray = [];

    cssFiles.forEach((file) => {
      const filePath = path.join(stylesFolder, file);
      fs.readFile(filePath, 'utf-8', (err, fileContent) => {
        if (err) {
          return console.error('Ошибка чтения файла:', err);
        }
        stylesArray.push(fileContent);

        if (stylesArray.length === cssFiles.length) {
          const bundleContent = stylesArray.join('\n');
          fs.writeFile(outputFile, bundleContent, 'utf-8', (err) => {
            if (err) {
              return console.error('Ошибка записи файла:', err);
            }
            console.log('Стили успешно скомпилированы в bundle.css');
          });
        }
      });
    });
  });
}

compileStyles();
