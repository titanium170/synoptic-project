const {
  ipcMain,
  dialog
} = require('electron');
const fs = require('fs');
const path = require('path');
const recursive = require('recursive-readdir');

ipcMain.on('open-file-dialog', (event, fileTypes) => {
  dialog.showOpenDialog({
    filters: [{
        name: 'Media',
        extensions: fileTypes
      },
      {
        name: 'All Files',
        extensions: ['*']
      }
    ],
    properties: ['openFile', 'multiSelections']
  }, (files) => {
    if (files) {
      console.log('files: ', files);
      event.sender.send('selected-files', files)
    }
  })
})

ipcMain.on('open-folder-dialog', (event, fileTypes) => {
  dialog.showOpenDialog({
    properties: ['openDirectory']
  }, (folders) => {
    if ((!folders) || (!folders.length)) {
      console.log('No folder selected');
      return;
    }
    const ignoreFunc = (file, stats) => {
      // `file` is the path to the file, and `stats` is an `fs.Stats`
      // object returned from `fs.lstat()`.
      if (fileTypes) {
        return !fileTypes.includes(path.extname(file).substr(1, 4)) && !stats.isDirectory();
      } else {
        return false;
      }
    }
    // Gets all files from folder and subfolders that match the selected types
    recursive(folders[0], [ignoreFunc], (err, files) => {
      console.log(files);
      event.sender.send('selected-files', files);
    });
  })
})

ipcMain.on('save-file-dialog', (event, fileTypes, fileContent) => {

  const content = 'Test content';

  dialog.showSaveDialog({
    defaultPath: 'saveFile.json',
    filters: [{
      name: 'Save File',
      extensions: fileTypes
    }]
  }, (filename) => {
    if (!filename) {
      console.log('File creation cancelled');
      return;
    }

    fs.writeFile(filename, fileContent, (err) => {
      if (err) {
        console.log('Error during file creation: ', err.message);
        return;
      }

      event.sender.send('save-file-created')
    })
  })
})

ipcMain.on('open-save-file-dialog', (event, fileTypes) => {
  dialog.showOpenDialog({
    filters: [{
      name: 'Save File',
      extensions: fileTypes
    }],
    properties: ['openFile']
  }, (files) => {
    if (files) {
      console.log('files: ', files);

      fs.readFile(files[0], (err, data) => {
        if (err) {
          console.log('An error occurred: ', err.message);
          return;
        }
        const saveFile = JSON.parse(data);
        event.sender.send('selected-save-file', saveFile);
        console.log('saveFile: ', saveFile);
      });
    }
  })
})