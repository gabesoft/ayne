'use strict';

var paths = [
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
        title   : 'user'
      , $locals : { data: 'page data goes here' }
    });
}

module.exports = paths.map(function (path) {
    return {
        method  : 'GET'
      , path    : path
      , handler : userHandler
    };
});
