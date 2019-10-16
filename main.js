const { app, BrowserWindow } = require('electron');
const clipboardWatcher = require('electron-clipboard-watcher');
const Store = require('electron-store');
const io = require("socket.io-client");
var config = require('./config/config.js');
const { clipboard } = require('electron');
const {ipcMain} = require('electron');

const store = new Store();
const ioClient = io.connect(config.socket_url);

let win = null;

const watcher = clipboardWatcher({
  // (optional) delay in ms between polls
  watchDelay: 200,

  // handler for when text data is copied into the clipboard
  onTextChange: function (text) {
       console.log('text changed');
       console.log(text);

       ioClient.emit('new_private_message',{email:store.get('email_id'), clip_content:text});
       win.webContents.send('clip-changed', text);
  }
})

function connect_socket(){
     console.log('socket initialization '+ store.get('email_id'));
     ioClient.emit('privatechatroom', {email:store.get('email_id')});
}

function disconnect_socket(){
     console.log('disconnect socket '+store.get('email_id'));
     ioClient.emit('leavechatroom', {email:store.get('email_id')});
}

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

  //if user is logged in
  if(store.get('isAuthenticated') == 'true'){
      console.log('already logged in');
      connect_socket();
      win.loadFile('web/homepage.html');
 } else {
      console.log('not logged in');
      win.loadFile('web/login.html');
 }

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

ioClient.on('updated_clip_content', function (msg) {
           console.log("chat room msg "+msg.clip_content);
           clipboard.writeText(msg.clip_content);
});

ipcMain.on('connect', (event, arg) => {
     connect_socket();
})

ipcMain.on('disconnect', (event, arg) => {
     disconnect_socket();
})
