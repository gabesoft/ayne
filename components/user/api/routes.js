'use strict';

var user = require('./user')
  , Boom = require('boom');

function loginHandler (request, reply) {
    user.login(request.payload, function (err, data) {
        if (err && err.name === 'InvalidCredentials') {
            reply(Boom.unauthorized(err));
        } else if (err) {
            reply(Boom.badImplementation(err));
        } else {
            reply(data);
        }
    });
}

function logoutHandler (request, reply) {
    reply({ status: 'logout-complete' });
}

function signupHandler (request, reply) {
    user.create(request.payload, function (err, data) {
        if (err) {
            reply(Boom.badImplementation(err));
        } else {
            reply(data);
        }
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
