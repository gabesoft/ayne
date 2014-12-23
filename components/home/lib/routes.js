'use strict';

function homeHandler (request, reply) {
    return reply.view('home/templates/index.jade', { title: 'home' });
}

module.exports = {
    method  : 'GET'
  , path    : '/'
  , handler : homeHandler
};
