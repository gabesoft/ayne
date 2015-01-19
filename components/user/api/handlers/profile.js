'use strict';

var api = require('../../../core/lib/api')
  , UsernameExistsError = require('../../../core/lib/errors/username-exists-error');

function saveProfile (userId, data, cb) {
    api.post(['/users',  userId, 'profile'], data, function (err, response, body) {
        if (err && err.statusCode === 409) {
            cb(new UsernameExistsError(data.displayName));
        } else {
            cb(err, body);
        }
    });
}

function readProfile (userId, cb) {
    api.get(['/users', userId, 'profile'], null, function (err, response, body) {
        cb(err, body);
    });
}

function save (request, reply) {
    var userId = request.auth.credentials.id
      , input  = request.payload;
    saveProfile(userId, input, function (err, data) {
        return err ? reply.fail(err) : reply(data);
    });
}

function read (request, reply) {
    readProfile(request.auth.credentials.id, function (err, data) {
        return err ? reply.fail(err) : reply(data);
    });
}

function checkDisplayName (request, reply) {
    var displayName = request.params.username || '';

    if (!displayName) {
        return reply.failBadRequest('No username specified');
    }

    api.get('/profiles', { displayName: displayName }, function (err, response, body) {
        if (err) {
            reply.fail(err);
        } else {
            reply({ exists: body.length > 0 });
        }
    });
}

module.exports = {
    save             : save
  , read             : read
  , checkDisplayName : checkDisplayName
};
