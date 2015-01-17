'use strict';

var userHelper = require('../helpers/user')
  , token      = require('../../../core/lib/token');

function login (request, reply) {
    userHelper.loginUser(request.payload, function (err, data) {
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

function logout (request, reply) {
    token.remove(request.auth.artifacts, request.headers, function (err) {
        if (err) {
            reply.fail(err);
        } else {
            reply({ status: 'token-invalidated' });
        }
    });
}

function signup (request, reply) {
    userHelper.createUser(request.payload, function (err, data) {
        return err ? reply.fail(err) : reply(data);
    });
}

module.exports = {
    logout : logout
  , signup : signup
  , login  : login
};
