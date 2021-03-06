'use strict';

var util = require('util');

util.inherits(EmailExistsError, Error);

function EmailExistsError (email) {
    if (!(this instanceof EmailExistsError)) {
        return new EmailExistsError(email);
    }

    this.email = email;
    this.statusCode = 409;
    this.name = 'EmailExists';
    this.message = 'A user with email ' + email + ' already exists';
}

module.exports = EmailExistsError;
