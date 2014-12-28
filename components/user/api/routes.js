'use strict';

function loginHandler (request, reply) {
    reply({ token: 'login:abcd' });
}

function logoutHandler (request, reply) {
    reply({ status: 'logout-complete' });
}

function signupHandler (request, reply) {
    reply({ token: 'signup:abcd', user: request.payload });
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
