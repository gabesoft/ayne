'use strict';

var routes = null
  , paths  = [
        '/'
      , '/enter-url'
      , '/urllist'
    ];

function homeHandler (request, reply) {
    return reply.view('core/templates/index.jade', { title: 'Ayne Home', page: 'home' });
}

routes = paths.map(function (path) {
    return {
        method  : 'GET'
      , path    : path
      , handler : homeHandler
    };
});

module.exports = routes;
