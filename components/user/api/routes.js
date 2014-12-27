'use strict';

function loginHandler (request, reply) {
    // TODO: implement
}

function signupHandler (request, reply) {
    // TODO: implement
}

module.exports = [{
    method  : 'POST'
  , path    : '/api/login'
  , handler : loginHandler
}, {
    method  : 'POST'
  , path    : '/api/signup'
  , handler : signupHandler
}];
