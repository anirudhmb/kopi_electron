var config = require('../config/config.js');
window.$ = window.jQuery = require('jquery');
const axios = require('axios');
const Store = require('electron-store');

$("#register_form").submit(function(e) {
     e.preventDefault();
     var email_id = $('#email_id').val();
     var password = $('#password').val();
     console.log(email_id+password);
     //make ajax call to kopi server to create user and if valid, reload to homepage.html updating the clip_content & local storage

     axios.post(config.registration_url, {
          email_id : email_id,
          password : password
     })
     .then(function (response) {
          console.log(response.data);
          if(response.status==200 && response.data=="{status:success}"){
               window.location.href="../web/homepage.html";
          }
     })
     .catch( function(error){
          console.log(Object.keys(error));
          if(error["errno"] == "ECONNREFUSED"){
               alert("Network connection issue. Sorry for the inconvenience.");
          }
     })
});
