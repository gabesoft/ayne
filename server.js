'use strict';

var path = require('path')
  , Hapi = require('hapi')
  , server = new Hapi.Server();

server.connection({ port : 8005 });
server.views({
    engines : { html : require('handlebars') }
  , path    : path.join(__dirname, '/components')
});

function userHandler (request, reply) {
    return reply.view('auth/index.html', { title: 'user' });
}

function homeHandler (request, reply) {
    return reply.view('home/index.html', { title: 'home' });
}

server.route({
    method  : 'GET'
  , path    : '/user'
  , handler : userHandler
});

server.route({
    method  : 'GET'
  , path    : '/'
  , handler : homeHandler
});

server.start(function () {
    console.log('server started with connection:');
    console.log(server.connections[0].info);
});
