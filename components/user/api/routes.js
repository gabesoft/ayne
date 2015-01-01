'use strict';

var user    = require('./user')
  , profile = require('./profile')
  , token   = require('../../core/lib/token');

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

function signupHandler (request, reply) {
    user.create(request.payload, function (err, data) {
        return err ? reply.fail(err) : reply(data);
    });
}

function profileSaveHandler (request, reply) {
    reply({
        user      : request.auth.credentials
      , artifacts : request.auth.artifacts
      , profile   : 'TO BE IMPLEMENTED'
    });
}

function profileReadHandler (request, reply) {
    reply('NOT IMPLEMENTED');
}

module.exports = [{
    method  : 'POST'
  , path    : '/api/login'
  , handler : loginHandler
}, {
    method  : 'POST'
  , path    : '/api/logout'
  , handler : logoutHandler
  , config  : { auth : 'token' }
}, {
    method  : 'POST'
  , path    : '/api/signup'
  , handler : signupHandler
}, , {
    method  : 'POST'
  , path    : '/api/profile'
  , handler : profileSaveHandler
  , config  : { auth: 'token' }
}, {
    method  : 'GET'
  , path    : '/api/profile'
  , handler : profileReadHandler
}];
