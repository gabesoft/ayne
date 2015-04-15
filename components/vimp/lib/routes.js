'use strict';

var routes = null
  , paths  = [
        '/vim'
      , '/vim/plugins'
      , '/vim/plugins/{id}'
    ];

function vimpHandler (request, reply) {
    return reply.view('vimp/templates/index.jade', { title: 'Vim Plugins Index', page: 'vimp' });
}

routes = paths.map(function (path) {
    return {
        method  : 'GET'
      , path    : path
      , handler : vimpHandler
    };
});

module.exports = routes;
