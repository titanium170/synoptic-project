const {
  ipcMain,
  dialog
} = require('electron');
const fs = require('fs');

ipcMain.on('open-file-dialog', (event) => {
  dialog.showOpenDialog({
    filters: [{
      name: 'All Files',
      extensions: ['*']
    }],
    properties: ['openFile']
  }, (files) => {
    if (files) {
      event.sender.send('selected-files', files)
    }
  })
})

ipcMain.on('open-folder-dialog', (event) => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, (folders) => {
    if (folders) {
      event.sender.send('selected-directory', files)
    }
  })
})

ipcMain.on('save-file-dialog', (event) => {

  const content = 'Test content';

  dialog.showSaveDialog({
    defaultPath: 'test.txt'
  }, (filename) => {
    if (!filename) {
      console.log('File creation cancelled');
      return;
    }

    fs.writeFile(filename, content, (err) => {
      if (err) {
        console.log('Error during file creation: ', err.message);
        return;
      }

      event.sender.send('file-created')
    })
  })
})