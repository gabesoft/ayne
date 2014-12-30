'use strict';

var api               = require('../../core/lib/api')
  , UnauthorizedError = require('../api-errors/unauthorized')
  , EmailExistsError  = require('../api-errors/email-exists')
  , UserNotFoundError = require('../api-errors/user-not-found')
  , bcrypt            = require('bcrypt');

function create (data, cb) {
    bcrypt.genSalt(11, function (err, salt) {
        if (err) { return cb(err); }

        bcrypt.hash(data.password || '', salt, function (err, hash) {
            if (err) { return cb(err); }

            data.password = hash;

            api.post('/user', data, function (err, response, body) {
                if (err && err.statusCode === 409) {
                    return cb(new EmailExistsError(data.email));
                } else if (err) {
                    return cb(err);
                }

                delete body.password;
                cb(null, body);
            });
        });
    })
}

function login (data, cb) {
    api.get('/user/byemail/' + encodeURIComponent(data.email), function (err, response, body) {
        if (err && err.statusCode === 404) { return cb(new UnauthorizedError()); }
        if (err) { return cb(err); }

        bcrypt.compare(data.password || '', body.password, function (err, match) {
            if (err) { return cb(err); }
            if (!match) { return cb(new UnauthorizedError()); }

            delete body.password;
            cb(null, body);
        });
    });
}

function update (data, cb) {
    throw new Error('Not implemented');
}

function read (id, cb) {
    api.get('/user/' + encodeURIComponent(id), function (err, response, body) {
        if (err && err.statusCode === 404) { return cb(new UserNotFoundError(id)); }
        if (err) { return cb(err); }

        delete body.password;
        cb(null, body);
    });
}

module.exports = {
    create : create
  , login  : login
  , get    : read
  , update : update
}
