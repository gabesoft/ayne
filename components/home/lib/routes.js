'use strict';

var paths = [
        '/'
      , '/enter-url'
    ];

function homeHandler (request, reply) {
    return reply.view('core/templates/index.jade', { title: 'home', page: 'home' });
}

module.exports = paths.map(function (path) {
    return {
        method  : 'GET'
      , path    : path
      , handler : homeHandler
    };
});
