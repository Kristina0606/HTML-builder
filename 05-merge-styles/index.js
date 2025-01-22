const fs = require('fs').promises;
const path = require('path');

const stylesFolder = path.join(__dirname, 'styles');
const outputFolder = path.join(__dirname, 'project-dist');
const outputFile = path.join(outputFolder, 'bundle.css');

async function compileStyles() {
  try {
    if (
      !(await fs
        .access(outputFolder)
        .then(() => true)
        .catch(() => false))
    ) {
      await fs.mkdir(outputFolder);
    }

    const files = await fs.readdir(stylesFolder);
    const cssFiles = files.filter((file) => path.extname(file) === '.css');
    const stylesArray = await Promise.all(
      cssFiles.map(async (file) => {
        const filePath = path.join(stylesFolder, file);
        return await fs.readFile(filePath, 'utf-8');
      }),
    );

    const bundleContent = stylesArray.join('\n');
    await fs.writeFile(outputFile, bundleContent, 'utf-8');
    console.log('стили скомпилированы в bundle.css');
  } catch (err) {
    console.error('ошибка:', err);
  }
}

compileStyles();
