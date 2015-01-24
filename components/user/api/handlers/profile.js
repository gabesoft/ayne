'use strict';

var api = require('../../../core/lib/api')
  , UsernameExistsError = require('../../../core/lib/errors/username-exists-error');

function save (request, reply) {
    var userId = request.auth.credentials.id
      , data   = request.payload;

    api.post(['/users',  userId, 'profile'], data, function (err, response, body) {
        if (err && err.statusCode === 409) {
            reply.boom(new UsernameExistsError(data.displayName));
        } else if (err) {
            reply.boom(err);
        } else {
            reply(body);
        }
    });
}

function read (request, reply) {
    var userId = request.auth.credentials.id;

    api.get(['/users', userId, 'profile'], null, function (err, response, body) {
        return err ? reply.boom(err) : reply(body);
    });
}

function checkDisplayName (request, reply) {
    var displayName = request.params.username || '';

    if (!displayName) {
        return reply.badRequest('No username specified');
    }

    api.get('/profiles', { displayName: displayName }, function (err, response, body) {
        if (err) {
            reply.boom(err);
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
