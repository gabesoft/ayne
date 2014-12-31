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
    token.remove(request.auth.artifacts, request.headers, function (err) {
        if (err) {
            reply.fail(err);
        } else {
            reply({ status: 'token-invalidated' });
        }
    });
}

function accountHandler (request, reply) {
    reply({
        user      : request.auth.credentials
      , artifacts : request.auth.artifacts
      , account   : 'TO BE IMPLEMENTED'
    });
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
  , config  : {
        auth : 'token'
    }
}, {
    method  : 'POST'
  , path    : '/api/signup'
  , handler : signupHandler
}, {
    method  : 'GET'
  , path    : '/api/account'
  , handler : accountHandler
  , config  : {
        auth: 'token'
    }
}];
