const path = require('path');
const fs = require('fs');
const folderPath = path.join(__dirname, 'files');
const newFolderPath = path.join(__dirname, 'files-copy');

fs.mkdir(newFolderPath, { recursive: true }, (err) => {
  if (err) {
    console.error('ошибка', err);
  } else {
    console.log('папка создана');
  }
});

fs.readdir(folderPath, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach((file) => {
    if (file.isFile()) {
      let pathToFile = path.join(folderPath, file.name);
      let newPathToFile = path.join(newFolderPath, file.name);
      fs.copyFile(pathToFile, newPathToFile, (err) => {
        if (err) throw err;
        console.log('Файл успешно скопирован');
      });
    }
  });
});
