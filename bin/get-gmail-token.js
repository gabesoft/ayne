#!/usr/bin/env node

var GmailApi = require('../components/core/lib/gmail').GmailApi
  , gapi     = new GmailApi();

//gapi.getTokenUrl(function (err, url) {
    //console.log(url);
//});

gapi.getAccessToken(function (err, token) {
    console.log(err, token);
});
