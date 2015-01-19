'use strict';

var util = require('util');

util.inherits(TokenInvalidError, Error);

function TokenInvalidError () {
    if (!(this instanceof TokenInvalidError)) {
        return new TokenInvalidError();
    }
    this.statusCode = 401;
    this.name = 'TokenInvalid';
    this.message = 'The specified token is invalid';
}

module.exports = TokenInvalidError;
