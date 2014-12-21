'use strict';

var path = require('path')
  , Hapi = require('hapi')
  , server = new Hapi.Server({
        debug: {
            log     : [ 'error' ]
          , request : [ 'received', 'handler', 'response', 'error' ]}
    });

server.connection({ port : 8005 });
server.views({
    engines        : { jade : require('jade') }
  , path           : path.join(__dirname, '/components')
  , compileOptions : { pretty: true }
});

function userHandler (request, reply) {
    return reply.view('auth/templates/index.jade', {
        title    : 'user'
      , pageData : { context: 'context data goes here' }
    });
}

function homeHandler (request, reply) {
    return reply.view('home/templates/index.jade', { title: 'home' });
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

server.route({
    method : 'GET'
  , path   : '/public/{filename*}'
  , handler    : {
        file: function (request) {
            return path.join(__dirname, 'components', request.params.filename);
        }
    }
});

server.route({
    method : 'GET'
  , path   : '/vendor/{filename*}'
  , handler    : {
        file: function (request) {
            return path.join(__dirname, 'bower_components', request.params.filename);
        }
    }
});

server.start(function () {
    console.log('server started with connection:');
    console.log(server.connections[0].info);
});
