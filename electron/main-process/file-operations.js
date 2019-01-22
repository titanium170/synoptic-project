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
        console.log('fileTypes: ', fileTypes);
        console.log('file ext: ', path.extname(file));
        return !fileTypes.includes(path.extname(file)) && !stats.isDirectory();
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









// const readDirectoryContentsRecursively = (done, dir) => {
//   const results = [];
//   readDirectory(done, results, dir);
// };
//
// // (err, res) => {
// //   if (err) {
// //     console.log('An error ocurred: ', err.message);
// //     return;
// //   }
// //   if(res.length) {
// //     console.log('Directory read');
// //   }
//
// function readDirectory(callback, results, dir) {
//   fs.readdir(dir, (err, files) => {
//     if (err) {
//       return callback(err);
//     }
//     const pending = files.length;
//     if (!pending) {
//       return callback(null, results);
//     }
//     files.forEach((file) => {
//       file = path.resolve(dir, file);
//       getFilesFromDirectory(callback, file, pending, results);
//     });
//   });
// }
//
// function getFilesFromDirectory(callback, file, pending, results) {
//   fs.stat(file, (err, stat) => {
//     if (stat && stat.isDirectory()) {
//       readDirectoryContentsRecursively((err, res) => {
//         results = results.concat(res);
//         if (!--pending) callback(null, results);
//       }, file);
//     } else {
//       results.push(file);
//       if (!--pending) callback(null, results);
//     }
//   });
// }