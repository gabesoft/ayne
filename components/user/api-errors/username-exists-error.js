'use strict';

var util = require('util');

util.inherits(UsernameExistsError, Error);

function UsernameExistsError (name) {
    if (!(this instanceof UsernameExistsError)) {
        return new UsernameExistsError(name);
    }

    this.name = name;
    this.statusCode = 409;
    this.name = 'UsernameExists';
    this.message = 'A user profile with display name ' + name + ' already exists';
}

module.exports = UsernameExistsError;
