const { app, BrowserWindow } = require('electron');
const clipboardWatcher = require('electron-clipboard-watcher');
const Store = require('electron-store');
const { ipcMain } = require('electron');

const store = new Store();

let win = null;

const watcher = clipboardWatcher({
  // (optional) delay in ms between polls
  watchDelay: 200,

  // handler for when text data is copied into the clipboard
  onTextChange: function (text) {
       console.log('text changed');
       console.log(text);

       win.webContents.send('clip-changed', text);
  }
})

function createWindow () {
     console.log(process.platform)
  // Create the browser window.
  win = new BrowserWindow({
    width: 500,
    height: 800,
    webPreferences: {
      nodeIntegration: true
    },
    skipTaskbar: true,
    resizable: false
  })
  //console.log(app.getPath('userData'));

  //if user is logged in
  if(store.get('isAuthenticated') == 'true'){
      console.log('already logged in');
 } else {
      console.log('not logged in');
 }

  // and load the index.html of the app.
  win.loadFile('web/login.html')

  win.webContents.openDevTools()

  //win.hide()

  win.on('closed', () => {
       win = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
    watcher.stop()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

if(process.platform == "darwin"){
          app.dock.hide()
}
