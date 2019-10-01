const { ipcRenderer } = require('electron');

navigator.clipboard.readText()
  .then(text => {
    // `text` contains the text read from the clipboard
    $('#clip_content').val(text);
  })
  .catch(err => {
    // maybe user didn't grant access to read from clipboard
    console.log('Something went wrong', err);
  });

ipcRenderer.on('clip-changed', (event, arg) => {
     $('#clip_content').val(arg);
     console.log(arg);
});
