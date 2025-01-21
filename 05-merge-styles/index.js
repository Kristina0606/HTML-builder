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
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      stylesArray.push(fileContent);
    });

    const bundleContent = stylesArray.join('\n');
    fs.writeFileSync(outputFile, bundleContent, 'utf-8');
    console.log('Стили успешно скомпилированы в bundle.css');
  });
}

compileStyles();
