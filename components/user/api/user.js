'use strict';

var api    = require('../../core/lib/api')
  , bcrypt = require('bcrypt');

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

InvalidCredentialsError.prototype = Object.create(Error.prototype);
InvalidCredentialsError.prototype.constructor = InvalidCredentialsError;
function InvalidCredentialsError () {
    if (!(this instanceof InvalidCredentialsError)) {
        return new InvalidCredentialsError();
    }
    this.name = 'InvalidCredentials';
    this.message = 'Invalid credentials';
}

function login (data, cb) {
    api.get('/user/byemail/' + encodeURIComponent(data.email), function (err, response, body) {
        if (err) { return cb(err); }

        bcrypt.compare(data.password, body.password, function (err, match) {
            if (err) { return cb(err); }
            if (!match) {
                return cb(new InvalidCredentialsError());
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
