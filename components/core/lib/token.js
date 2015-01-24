'use strict';

var moment            = require('moment')
  , TokenInvalidError = require('./errors/token-invalid')
  , conf              = require('../../../config/store')
  , jwt               = require('jsonwebtoken')
  , secret            = conf.get('token:secret')
  , ttl               = moment.duration(conf.get('token:ttl:value'), conf.get('token:ttl:unit'))
  , ttlTemp           = moment.duration(conf.get('token:ttlTemp:value'), conf.get('token:ttlTemp:unit'))
  , HEADER            = 'browser-fingerprint'
  , invalid           = {};

function _make (user, options, cb) {
    options.algorithm = 'HS512';
    options.issuer = 'ayne';
    cb(null, jwt.sign({ user : user }, secret, options));
}

/**
 * Creates a temporary token
 * @param {object} user - The user for which the token is created
 * @param {function} cb - The callback to supply the results to
 */
function temp (user, cb) {
    if (!user || !user.id) {
        return cb(new Error('No user specified'));
    }

    _make({
        id    : user.id
      , email : user.email
      , temp  : true
    }, {
        expiresInMinutes : ttlTemp.asMinutes()
    }, cb);
}

/**
 * Creates a longer lived token
 * @param {object} user - The user for which the token will be created
 * @param {function} cb - The callback to supply the results to
 */
function make (user, headers, cb) {
    if (!user || !user.id) {
        return cb(new Error('No user specified'));
    }
    if (!headers || !headers[HEADER]) {
        return cb(new Error('No fingerprint specified'));
    }

    _make({
        id    : user.id
      , email : user.email
    }, {
        expiresInMinutes : ttl.asMinutes()
      , audience         : headers[HEADER]
    }, cb);
}

/**
 * Invalidates the given token
 * @param {string} token - the token to invalidate
 * @param {function} cb  - the callback to call when the operation is complete
 */
function remove (token, headers, cb) {
    invalid[token] = true;
    cb();
}

/**
 * Verifies the specified token
 * @param {string} token    - The token to be verified
 * @param {object} headers  - The http headers
 * @param {function} cb     - The callback to supply the result
 * @return {object} payload - The token payload
 */
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
  , temp   : temp
  , remove : remove
  , verify : verify
};
