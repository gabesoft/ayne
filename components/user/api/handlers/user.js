'use strict';

var auth = require('../../../core/lib/auth');

function login (request, reply) {
    auth.loginUser({
        user    : request.payload
      , headers : request.headers
    }, function (err, data) {
        return err ? reply.boom(err) : reply(data);
    });
}

function logout (request, reply) {
    auth.logoutUser({
        user    : request.auth.artifacts
      , headers : request.headers
    }, function (err) {
        return err ? reply.boom(err) : reply({ status: 'token-invalidated' });
    });
}

function signup (request, reply) {
    auth.createUser(request.payload, function (err, data) {
        return err ? reply.boom(err) : reply(data);
    });
}

module.exports = {
    logout : logout
  , signup : signup
  , login  : login
};
