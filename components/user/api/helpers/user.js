var api               = require('../../../core/lib/api')
  , UnauthorizedError = require('../../api-errors/unauthorized')
  , EmailExistsError  = require('../../api-errors/email-exists')
  , UserNotFoundError = require('../../api-errors/user-not-found')
  , token             = require('../../../core/lib/token')
  , bcrypt            = require('bcrypt');

function hashPassword (password, cb) {
    bcrypt.genSalt(11, function (err, salt) {
        if (err) { return cb(err); }

        bcrypt.hash(password || '', salt, function (err, hash) {
            cb(err, hash);
        });
    });
}

function createUser (data, cb) {
    hashPassword(data.password, function (err, hash) {
        if (err) { return cb(err); }

        data.password = hash;

        api.post('/users', data, function (err, response, body) {
            if (err && err.statusCode === 409) {
                return cb(new EmailExistsError(data.email));
            } else if (err) {
                return cb(err);
            }

            delete body.password;
            cb(null, body);
        });
    });
}

function loginUser (data, cb) {
    api.get('/users', { email: data.email }, function (err, response, body) {
        if (err && err.statusCode === 404) { return cb(new UnauthorizedError()); }
        if (err) { return cb(err); }
        if (body.length !== 1) { return cb(new UserNotFoundError(data.email, 'email')); }

        body = body[0];
        bcrypt.compare(data.password || '', body.password, function (err, match) {
            if (err) { return cb(err); }
            if (!match) { return cb(new UnauthorizedError()); }

            delete body.password;
            cb(null, body);
        });
    });
}


module.exports = {
    hashPassword : hashPassword
  , loginUser    : loginUser
  , createUser   : createUser
};
