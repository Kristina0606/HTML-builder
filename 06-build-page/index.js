const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const stylesFolder = path.join(__dirname, 'styles');
const componentsFolder = path.join(__dirname, 'components');
const assetsFolder = path.join(__dirname, 'assets');
const templateFile = path.join(__dirname, 'template.html');
const outputFile = path.join(projectDist, 'index.html');
const outputStylesFile = path.join(projectDist, 'style.css');
const outputAssetsFolder = path.join(projectDist, 'assets');

if (!fs.existsSync(projectDist)) {
  fs.mkdirSync(projectDist);
}

function compileStyles() {
  fs.readdir(stylesFolder, (err, files) => {
    if (err) {
      return console.error('ошибка чтения:', err);
    }

    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    const stylesArray = [];

    cssFiles.forEach((file) => {
      const filePath = path.join(stylesFolder, file);
      fs.readFile(filePath, 'utf-8', (err, fileContent) => {
        if (err) {
          return console.error('ошибка чтения файла:', err);
        }
        stylesArray.push(fileContent);

        if (stylesArray.length === cssFiles.length) {
          const bundleContent = stylesArray.join('\n');
          fs.writeFile(outputStylesFile, bundleContent, 'utf-8', (err) => {
            if (err) {
              return console.error('ошибка записи файла:', err);
            }
            console.log('стили скомпилированы в style.css');
          });
        }
      });
    });
  });
}

function copyAssets(srcFolder, destFolder) {
  fs.mkdir(destFolder, { recursive: true }, (err) => {
    if (err) {
      return console.error('ошибка создания папки assets:', err);
    }

    fs.readdir(srcFolder, (err, files) => {
      if (err) {
        return console.error('ошибка чтения папки assets:', err);
      }

      files.forEach((file) => {
        const srcPath = path.join(srcFolder, file);
        const destPath = path.join(destFolder, file);

        fs.stat(srcPath, (err, stats) => {
          if (err) {
            return console.error('ошибка получения информации о файле:', err);
          }

          if (stats.isDirectory()) {
            copyAssets(srcPath, destPath);
          } else {
            fs.copyFile(srcPath, destPath, (err) => {
              if (err) {
                return console.error('ошибка копирования файла:', err);
              }
            });
          }
        });
      });
    });
  });
}

function buildHTML() {
  fs.readFile(templateFile, 'utf-8', (err, templateContent) => {
    if (err) {
      return console.error('ошибка чтения файла template.html:', err);
    }

    fs.readdir(componentsFolder, (err, files) => {
      if (err) {
        return console.error('ошибка чтения папки components:', err);
      }

      let htmlContent = templateContent;

      files.forEach((file) => {
        const componentName = path.basename(file, '.html');
        const componentPath = path.join(componentsFolder, file);

        fs.readFile(componentPath, 'utf-8', (err, componentContent) => {
          if (err) {
            return console.error('ошибка чтения файла компонента:', err);
          }

          const tag = `{{${componentName}}}`;
          htmlContent = htmlContent.replace(
            new RegExp(tag, 'g'),
            componentContent,
          );

          fs.writeFile(outputFile, htmlContent, 'utf-8', (err) => {
            if (err) {
              return console.error('ошибка записи файла index.html:', err);
            }
            console.log('HTML-страница создана в index.html');
          });
        });
      });
    });
  });
}

compileStyles();
copyAssets(assetsFolder, outputAssetsFolder);
buildHTML();
