'use strict';

function homeHandler (request, reply) {
    return reply.view('core/templates/index.jade', { title: 'home', page: 'home' });
}

module.exports = {
    method  : 'GET'
  , path    : '/'
  , handler : homeHandler
};
