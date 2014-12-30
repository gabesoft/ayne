'use strict';

var user  = require('./user')
  , token = require('../../core/lib/token');

function loginHandler (request, reply) {
    user.login(request.payload, function (err, data) {
        if (err) { return reply.fail(err); }

        token.make(data, request.headers, function (err, tk) {
            if (err) { return reply.fail(err); }

            reply({
                user  : data
              , token : tk
            });
        });
    });
}

function logoutHandler (request, reply) {
    throw new Error('Not implemented');
}

function signupHandler (request, reply) {
    user.create(request.payload, function (err, data) {
        return err ? reply.fail(err) : reply(data);
    });
}

module.exports = [{
    method  : 'POST'
  , path    : '/api/login'
  , handler : loginHandler
}, {
    method  : 'POST'
  , path    : '/api/logout'
  , handler : logoutHandler
}, {
    method  : 'POST'
  , path    : '/api/signup'
  , handler : signupHandler
}];
