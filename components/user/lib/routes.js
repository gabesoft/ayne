'use strict';

var paths = [
        '/user'
      , '/user/login'
      , '/user/signup'
      , '/user/account'
      , '/user/profile'
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
