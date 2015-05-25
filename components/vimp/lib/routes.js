'use strict';

var paths  = [ '/vim', '/vim/' ];

function handler (request, reply) {
    return reply.view('core/templates/index.jade', { title: 'Ayne Vim', page: 'vimp' });
}

module.exports = paths.map(function (path) {
    return {
        method  : 'GET'
      , path    : path
      , handler : handler
    };
});
