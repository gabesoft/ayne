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
    engines : { html : require('handlebars') }
  , path    : path.join(__dirname, '/components')
});

//function userHandler (request, reply) {
    //return reply.view('auth/templ/index.html', { title: 'user' });
//}

function homeHandler (request, reply) {
    return reply.view('home/templ/index.html', { title: 'home' });
}

server.route({
    method  : 'GET'
  , path    : '/user'
  , handler : {
        file: function () {
            return path.join(__dirname, 'components/auth/templ/index.html');
        }
    }
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
