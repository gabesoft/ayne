'use strict';

var api = require('../../core/lib/api')
  , UsernameExistsError = require('../api-errors/username-exists-error');

function save (userId, data, cb) {
    api.post('/user/' + userId + '/profile', data, function (err, response, body) {
        if (err && err.statusCode === 409) {
            cb(new UsernameExistsError(data.displayName));
        } else {
            cb(err, body);
        }
    });
}

function read (userId, cb) {
    api.get('/user/' + userId + '/profile', null, function (err, response, body) {
        cb(err, body);
    });
}

module.exports = {
    save : save
  , read : read
};
