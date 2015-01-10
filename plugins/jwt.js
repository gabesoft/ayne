'use strict';

var Boom  = require('boom')
  , token = require('../components/core/lib/token');

module.exports.register = function (server, options, next) {
    server.auth.scheme('jwt', function (server, options) {
        return { authenticate : authenticate };
    });
    next();
};

module.exports.register.attributes = {
    name    : 'jwt'
  , version : '0.0.1'
};

function extractUser (request, cb) {
    var authHeader = request.headers.authorization
      , parts      = (authHeader || '').split(/\s+/);

    if (!authHeader) {
        return cb(Boom.unauthorized(null, 'Bearer'));
    }
    if (parts.length !== 2) {
        return cb(Boom.badRequest('Bad HTTP authentication header format', 'Bearer'));
    }
    if (parts[0].toLowerCase() !== 'bearer') {
        return cb(Boom.unauthorized(null, 'Bearer'));
    }
    if (parts[1].split('.').length !== 3) {
        return cb(Boom.badRequest('Bad HTTP authentication header format', 'Bearer'));
    }

    token.verify(parts[1], request.headers, function (err, payload) {
        if (err && err.name === 'TokenExpiredError') {
            cb(Boom.unauthorized('Expired token received from JSON Web Token validation', 'Bearer'));
        } else if (err) {
            cb(Boom.unauthorized('Invalid signature received for JSON Web Token validation', 'Bearer'));
        } else {
            cb(null, { credentials: payload.user, artifacts: parts[1] });
        }
    });
}

function authenticate (request, reply) {
    extractUser(request, function (err, credentials) {
        return err ? reply(err) : reply.continue(credentials)
    });
}
