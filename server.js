'use strict';

var path = require('path'),
    Hapi = require('hapi'),
    Vision = require('vision'),
    Inert = require('inert'),
    async = require('async'),
    glob = require('glob'),
    conf = require('./config/store.js'),
    server = new Hapi.Server({});

function loadRoutes(cb) {
    var root = conf.get('path:root'),
        components = path.join(root, 'components'),
        opts = {
            nomount: false,
            cwd: components,
            root: components
        };

    glob('/**/routes.js', opts, function (err, files) {
        if (err) {
            return cb(err);
        }

        files.forEach(function (file) {
            var routes = require(file);

            if (!Array.isArray(routes)) {
                routes = [routes];
            }

            routes.forEach(function (route) {
                try {
                    server.route(route);
                } catch (e) {
                    console.error('failed to add routes', file, e);
                }
            });
        });

        cb(null);
    });
}

function setupServer(cb) {
    server.connection({
        port: conf.get('app:port') || 8005
    });

    server.register(Inert, function() {});
    server.register(Vision, function (err) {
        server.views({
            engines: {
                jade: require('jade')
            },
            compileOptions: {
                pretty: true
            },
            path: path.join(conf.get('path:root'), '/components')
        });
    });

    server.path(__dirname);

    server.decorate('reply', 'conf', function (key) {
        return conf.get(key);
    });

    server.ext('onRequest', function (request, reply) {
        return reply.continue();
    });

    server.ext('onPreResponse', function (request, reply) {
        if (request.response.isBoom) {
            return reply.continue();
        }

        var response = request.response,
            context = (response.source || {}).context || {};

        context.ayne = context.ayne || {};
        context.ayne.assets = conf.get('assets');
        context.ayne.locals = context.$locals || {};
        context.ayne.env = conf.get('env');
        delete context.$locals;

        return reply.continue();
    });

    cb(null);
}

function registerPlugins(cb) {
    server.register([
        require('http-status-decorator'),
        require('./plugins/jwt'),
        {
            register: require('good'),
            options: {
                reporters: [{
                    reporter: require('good-console'),
                    events: [
                        { log: '*', response: '*', error: '*' },
                        { format: 'hh:mm:ss.SSS' }
                    ]
                }],
            }
        }], cb);
}

function setupAuth(cb) {
    server.auth.strategy('token', 'jwt');
    cb();
}

function startServer(cb) {
    server.start(function (err) {
        console.log('server started: ', server.info.uri);
        cb(err);
    });
}

async.series([
    setupServer,
    registerPlugins,
    setupAuth,
    loadRoutes,
    startServer
], function (err) {
    if (err) {
        console.log(err);
        throw err;
    }
});
