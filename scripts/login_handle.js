var config = require('../config/config.js');
window.$ = window.jQuery = require('jquery');
const axios = require('axios');
const Store = require('electron-store');
const store = new Store();
const { ipcRenderer } = require('electron');

$("#login_form").submit(function(e) {
     e.preventDefault();
     let email_id = $('#email_id').val();
     let password = $('#password').val();

     axios.post(config.login_url, {
          email_id : email_id,
          password : password
     })
     .then(function (response) {
          console.log(response.data);
          if(response.status==200 && response.data=="{status:login_success}"){
               store.set('email_id', email_id);
               store.set('isAuthenticated', "true");
               ipcRenderer.send('connect');
               window.location.href="../web/homepage.html";
          }
          if(response.status==200 && response.data=="{status:invalid_credentials}"){
               alert("Invalid Credentials.");
          }
     })
     .catch( function(error){
          console.log(Object.keys(error));
          if(error["errno"] == "ECONNREFUSED"){
               alert("Network connection issue. Sorry for the inconvenience.");
          }
     })
});
