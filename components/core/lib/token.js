'use strict';

var moment   = require('moment')
  , conf     = require('../../../config/store')
  , util     = require('util')
  , jwt      = require('jsonwebtoken')
  , secret   = conf.get('token:secret')
  , duration = conf.get('token:lifetime:value')
  , unit     = conf.get('token:lifetime:unit')
  , HEADER   = 'browser-fingerprint'
  , invalid  = {};

util.inherits(TokenInvalidError, Error);

function TokenInvalidError () {
    if (!(this instanceof TokenInvalidError)) {
        return new TokenInvalidError();
    }

    this.message = 'The specified token is invalid';
    this.name = 'TokenInvalidError';
    this.statusCode = 404;
}

function make (user, headers, cb) {
    if (!user || !user.id) {
        return cb(new Error('No user specified'));
    }
    if (!headers || !headers[HEADER]) {
        return cb(new Error('No fingerprint specified'));
    }

    cb(null, jwt.sign({
        user : { id: user.id, email: user.email }
    }, secret, {
        algorithm        : 'HS512'
      , issuer           : 'ayne'
      , audience         : headers[HEADER]
      , expiresInMinutes : moment.duration(duration, unit).asMinutes()
    }));
}

function remove (token, headers, cb) {
    invalid[token] = true;
    cb();
}

function verify (token, headers, cb) {
    var opts = { audience: headers[HEADER], issuer: 'ayne' };

    jwt.verify(token, secret, opts, function (err, payload) {
        if (err && err.name === 'TokenExpiredError') {
            delete invalid[token];
        }

        if (err) {
            cb(err);
        } else if (invalid[token]) {
            cb(new TokenInvalidError());
        } else {
            cb(null, payload);
        }
    });
}

module.exports = {
    make   : make
  , remove : remove
  , verify : verify
};
