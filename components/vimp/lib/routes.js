'use strict';

var routes = null
  , paths  = [
        { path : '/vim', handler : indexHandler }
      , { path : '/vim/plugins', handler : vlistHandler }
      , { path : '/vim/plugins/{id}', handler : vitemHandler }
    ];

function indexHandler (request, reply) {
    return reply.view('vimp/templates/index.jade', { title: 'Vim Plugins Index', page: 'vimp' });
}

function vlistHandler (request, reply) {
    return reply.view('vimp/templates/vlist.jade', { title : 'Vim Plugin List', page : 'vimp' });
}

function vitemHandler (request, reply) {
    return reply.view('vimp/templates/vitem.jade', { title : 'Vim Plugin Item', page : 'vimp' });
}

routes = paths.map(function (item) {
    return {
        method  : 'GET'
      , path    : item.path
      , handler : item.handler
    };
});

module.exports = routes;
