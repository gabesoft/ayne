'use strict';

var api = require('../../core/lib/api');

function save (userId, data, cb) {
    api.post('/user/' + userId + '/profile', data, function (err, response, body) {
        cb(err, body);
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
}
