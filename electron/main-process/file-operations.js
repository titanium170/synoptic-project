const {
  ipcMain,
  dialog
} = require('electron');
const fs = require('fs');
const path = require('path');
const recursive = require('recursive-readdir');
const {
  inspect
} = require('util');

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


ipcMain.on('open-image-dialog', (event, fileTypes) => {
  dialog.showOpenDialog({
    filters: [{
      name: 'Images',
      extensions: fileTypes
    }],
    properties: ['openFile']
  }, (files) => {
    if (files) {
      console.log('files: ', files);
      event.sender.send('selected-files', files[0])
    }
  })
})

ipcMain.on('save-file-dialog', (event, fileTypes, saveFile) => {

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
    const fileContent = JSON.stringify(saveFile);
    console.log('fileContent: ', fileContent);
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
        console.log('saveFile: ', saveFile);
        event.sender.send('selected-save-file', saveFile);
      });
    }
  })
})
