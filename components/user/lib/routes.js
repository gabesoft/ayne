'use strict';

var auth   = require('../../core/lib/security/auth')
  , routes = []
  , paths  = [
        '/user'
      , '/user/login'
      , '/user/signup'
      , '/user/profile'
      , '/user/forgot-password'
      , '/user/profile/view'
      , '/user/profile/edit'
      , '/user/profile/edit/details'
      , '/user/profile/edit/password'
      , '/user/reset-password-success'
      , '/user/reset-password-failure'
    ];

function userHandler (request, reply) {
    return reply.view('core/templates/index.jade', {
        title : 'User'
      , page  : 'user'
    });
}

function resetPassword (request, reply) {
    auth.loginUserWithGuid(request.params.guid, function (err, data) {
        if (err && err.statusCode !== 401) { return reply.boom(err); }

        return reply.view('core/templates/index.jade', {
            title   : 'User - Password Reset'
          , page    : 'user'
          , $locals : {
                resetPasswordError       : err
              , resetPasswordCredentials : data
            }
        });
    });
}

routes = paths.map(function (path) {
    return {
        method  : 'GET'
      , path    : path
      , handler : userHandler
    };
});


routes.push({
    method  : 'GET'
  , path    : '/user/reset-password/{guid}'
  , handler : resetPassword
});


module.exports = routes;
