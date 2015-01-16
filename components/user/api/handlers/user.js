'use strict';

var api               = require('../../../core/lib/api')
  , UnauthorizedError = require('../../api-errors/unauthorized')
  , EmailExistsError  = require('../../api-errors/email-exists')
  , UserNotFoundError = require('../../api-errors/user-not-found')
  , token             = require('../../../core/lib/token')
  , bcrypt            = require('bcrypt');

function hashPassword (password, cb) {
    bcrypt.genSalt(11, function (err, salt) {
        if (err) { return cb(err); }

        bcrypt.hash(password || '', salt, function (err, hash) {
            cb(err, hash);
        });
    });
}

function createUser (data, cb) {
    hashPassword(data.password, function (err, hash) {
        if (err) { return cb(err); }

        data.password = hash;

        api.post('/users', data, function (err, response, body) {
            if (err && err.statusCode === 409) {
                return cb(new EmailExistsError(data.email));
            } else if (err) {
                return cb(err);
            }

            delete body.password;
            cb(null, body);
        });
    });
}

function loginUser (data, cb) {
    api.get('/users', { email: data.email }, function (err, response, body) {
        if (err && err.statusCode === 404) { return cb(new UnauthorizedError()); }
        if (err) { return cb(err); }
        if (body.length !== 1) { return cb(new UserNotFoundError(data.email, 'email')); }

        body = body[0];
        bcrypt.compare(data.password || '', body.password, function (err, match) {
            if (err) { return cb(err); }
            if (!match) { return cb(new UnauthorizedError()); }

            delete body.password;
            cb(null, body);
        });
    });
}

function readUser (id, cb) {
    api.get('/users/' + id, function (err, response, body) {
        if (err && err.statusCode === 404) { return cb(new UserNotFoundError(id, 'id')); }
        if (err) { return cb(err); }

        delete body.password;
        cb(null, body);
    });
}

function login (request, reply) {
    loginUser(request.payload, function (err, data) {
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
    createUser(request.payload, function (err, data) {
        return err ? reply.fail(err) : reply(data);
    });
}

function password (request, reply) {
    var data   = request.payload
      , userId = request.auth.credentials.id;

    hashPassword(data.password, function (err, hash) {
        if (err) { return reply.fail(err); }

        api.patch('/users/' + userId, { password: hash, userId: userId }, function (err, response, body) {
            delete body.password;
            reply(body);
        });
    });
}

function emailResetPassword (request, reply) {
    var data = request.payload;

    api.get('/users', { email: data.email }, function (err, response, body) {
        if (err) {
            reply.fail(err);
        } else if (!body || body.length === 0) {
            reply.fail(new UserNotFoundError(data.email, 'email'));
        } else {
            reply('ok');
        }
    });
}

module.exports = {
    logout             : logout
  , signup             : signup
  , login              : login
  , password           : password
  , emailResetPassword : emailResetPassword
};
