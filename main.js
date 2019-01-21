const {
  app,
  BrowserWindow,
  ipcRenderer,
  ipcMain
} = require('electron');

const path = require("path");
const url = require("url");
const glob = require('glob')
let win;



function initialize() {
  makeSingleInstance()

  loadMainProcesses()

  function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({
      width: 800,
      height: 600
    });
    // and load the index.html of the app.
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, `/dist/synoptic-project/index.html`),
        protocol: "file:",
        slashes: true
      })
    );

    // Emitted when the window is closed.
    win.on('closed', () => {
      win = null
    })
  };
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', createWindow);

  // Quit when all windows are closed.
  app.on('window-all-closed', () => {

    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit()
    }
  });
  app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow()
    }
  });
}

// Make this app a single instance app.
//
// The main window will be restored and focused instead of a second window
// opened when a person attempts to launch a second instance.
//
// Returns true if the current version of the app should quit instead of
// launching.
function makeSingleInstance() {
  if (process.mas) return

  app.requestSingleInstanceLock()

  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore()
      win.focus()
    }
  })
}

// Require each JS file in the main-process dir
function loadMainProcesses() {
  const files = glob.sync(path.join(__dirname, 'electron/main-process/*.js'))
  files.forEach((file) => {
    require(file)
  })
}

initialize()