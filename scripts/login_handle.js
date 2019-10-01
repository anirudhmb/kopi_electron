var config = require('../config/config.js');
window.$ = window.jQuery = require('jquery');
const axios = require('axios');
const Store = require('electron-store');

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
