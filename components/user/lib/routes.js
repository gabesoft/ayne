'use strict';

var auth   = require('../../core/lib/auth')
  , routes = []
  , paths  = [
        '/user'
      , '/user/login'
      , '/user/signup'
      , '/user/profile'
      , '/user/forgot'
      , '/user/profile/view'
      , '/user/profile/edit'
      , '/user/profile/edit/details'
      , '/user/profile/edit/password'
    ];

function userHandler (request, reply) {
    return reply.view('user/templates/index.jade', {
        title   : 'User'
      , $locals : { data: 'page data goes here' }
    });
}

function resetPassword (request, reply) {
    auth.loginUserWithGuid(request.params.guid, function (err, data) {
        if (err) { return reply.fail(err); }

        data.noVerify = true;
        return reply.view('user/templates/index.jade', {
            title   : 'User - Password Reset'
          , $locals : data
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
