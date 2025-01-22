const fs = require('fs').promises;
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const stylesFolder = path.join(__dirname, 'styles');
const componentsFolder = path.join(__dirname, 'components');
const assetsFolder = path.join(__dirname, 'assets');
const templateFile = path.join(__dirname, 'template.html');
const outputFile = path.join(projectDist, 'index.html');
const outputStylesFile = path.join(projectDist, 'style.css');
const outputAssetsFolder = path.join(projectDist, 'assets');

async function compileStyles() {
  try {
    if (
      !(await fs
        .access(projectDist)
        .then(() => true)
        .catch(() => false))
    ) {
      await fs.mkdir(projectDist);
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
    await fs.writeFile(outputStylesFile, bundleContent, 'utf-8');
    console.log('стили скомпилированы в style.css');
  } catch (err) {
    console.error('ошибка:', err);
  }
}

async function copyAssets(srcFolder, destFolder) {
  try {
    await fs.mkdir(destFolder, { recursive: true });

    const files = await fs.readdir(srcFolder);
    await Promise.all(
      files.map(async (file) => {
        const srcPath = path.join(srcFolder, file);
        const destPath = path.join(destFolder, file);
        const stats = await fs.stat(srcPath);

        if (stats.isDirectory()) {
          await copyAssets(srcPath, destPath);
        } else {
          await fs.copyFile(srcPath, destPath);
        }
      }),
    );
  } catch (err) {
    console.error('ошибка:', err);
  }
}

async function buildHTML() {
  try {
    const templateContent = await fs.readFile(templateFile, 'utf-8');
    const files = await fs.readdir(componentsFolder);
    let htmlContent = templateContent;

    for (const file of files) {
      const componentName = path.basename(file, '.html');
      const componentPath = path.join(componentsFolder, file);
      const componentContent = await fs.readFile(componentPath, 'utf-8');
      const tag = `{{${componentName}}}`;
      htmlContent = htmlContent.replace(new RegExp(tag, 'g'), componentContent);
    }

    await fs.writeFile(outputFile, htmlContent, 'utf-8');
    console.log('HTML-страница создана в index.html');
  } catch (err) {
    console.error('ошибка:', err);
  }
}

compileStyles();
copyAssets(assetsFolder, outputAssetsFolder);
buildHTML();
