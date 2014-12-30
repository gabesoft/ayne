'use strict';

var util = require('util');

util.inherits(UnauthorizedError, Error);

function UnauthorizedError () {
    if (!(this instanceof UnauthorizedError)) {
        return new UnauthorizedError();
    }
    this.statusCode = 401;
    this.name = 'Unauthorized';
    this.message = 'Invalid credentials';
}

module.exports = UnauthorizedError;
