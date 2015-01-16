'use strict';

var user    = require('./handlers/user')
  , profile = require('./handlers/profile')
  , token   = require('../../core/lib/token');

module.exports = [{
    method  : 'POST'
  , path    : '/api/login'
  , handler : user.login
}, {
    method  : 'POST'
  , path    : '/api/logout'
  , handler : user.logout
  , config  : { auth : 'token' }
}, {
    method  : 'POST'
  , path    : '/api/signup'
  , handler : user.signup
}, ,{
    method  : 'POST'
  , path    : '/api/password'
  , handler : user.password
  , config  : { auth: 'token' }
}, {
    method  : 'POST'
  , path    : '/api/profile'
  , handler : profile.save
  , config  : { auth: 'token' }
}, {
    method  : 'GET'
  , path    : '/api/profile'
  , handler : profile.read
  , config  : { auth: 'token' }
}, {
    method  : 'GET'
  , path    : '/api/username/check/{username}'
  , handler : profile.checkDisplayName
}, {
    method  : 'POST'
  , path    : '/api/email/reset-password'
  , handler : user.emailResetPassword
}];
