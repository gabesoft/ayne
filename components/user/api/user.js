'use strict';

var api               = require('../../core/lib/api')
  , UnauthorizedError = require('./unauthorized-error')
  , bcrypt            = require('bcrypt');

function create (data, cb) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err) { return cb(err); }

        bcrypt.hash(data.password || '', salt, function (err, hash) {
            if (err) { return cb(err); }

            data.password = hash;

            api.post('/user', data, function (err, response, body) {
                if (err || body.error) { return cb(err || body); }

                delete body.password;
                cb(null, body);
            });
        });
    })
}

function login (data, cb) {
    api.get('/user/byemail/' + encodeURIComponent(data.email), function (err, response, body) {
        if (!body) { return cb(new UnauthorizedError()); }
        if (err) { return cb(err); }

        bcrypt.compare(data.password, body.password, function (err, match) {
            if (err) { return cb(err); }
            if (!match) {
                return cb(new UnauthorizedError());
            }

            delete body.password;
            cb(null, body);
        });
    });
}

function update (data, cb) {
    throw new Error('Not implemented');
}

function read (id, cb) {
    throw new Error('Not implemented');
}

module.exports = {
    create : create
  , login  : login
  , read   : read
  , update : update
}
