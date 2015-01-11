'use strict';

var util = require('util');

util.inherits(UserNotFoundError, Error);

function UserNotFoundError (value, field) {
    if (!(this instanceof UserNotFoundError)) {
        return new UserNotFoundError(id);
    }

    value = value || '';
    field = field || '';

    this.id = id;
    this.name = 'UserNotFound';
    this.message = 'A user with ' + field + ' ' + value + ' was not found';
    this.statusCode = 404;
}

module.exports = UserNotFoundError;
