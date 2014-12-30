'use strict';

var util = require('util');

util.inherits(UserNotFoundError, Error);

function UserNotFoundError (id) {
    if (!(this instanceof UserNotFoundError)) {
        return new UserNotFoundError(id);
    }

    this.id = id;
    this.name = 'UserNotFound';
    this.message = 'A user with id ' + id + ' was not found';
    this.statusCode = 404;
}

module.exports = UserNotFoundError;
