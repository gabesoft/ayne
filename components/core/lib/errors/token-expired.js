'use strict';

var util = require('util');

util.inherits(TokenExpiredError, Error);

function TokenExpiredError () {
    if (!(this instanceof TokenExpiredError)) {
        return new TokenExpiredError();
    }
    this.statusCode = 401;
    this.name = 'TokenExpired';
    this.message = 'The specified token is expired';
}

module.exports = TokenExpiredError;
