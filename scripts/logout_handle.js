var config = require('../config/config.js');
window.$ = window.jQuery = require('jquery');
const Store = require('electron-store');
const store = new Store();

$(document).ready(function(){
    $("a").click(function(){
          ipcRenderer.send('disconnect');
          store.delete('email_id');
          store.delete('isAuthenticated');
    });
 });
