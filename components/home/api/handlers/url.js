'use strict';

var api = require('../../../core/lib/api');

function create (data, cb) {
    api.post(['/users', data.userId, 'urls' ], data, function (err, response, body) {
        cb(err, body);
    });
}

function update (data, cb) {
    api.patch(['/users', data.userId, 'urls', data.id ], data, function (err, response, body) {
        cb(err, body);
    });
}

function save (request, reply) {
    var userId = request.auth.credentials.id
      , data   = request.payload
      , method = data.id ? update : create;

    data.userId = userId;
    data.title  = data.title || data.href;

    method(data, function (err, url) {
        if (err) {
            reply.boom(err);
        } else {
            reply(url);
        }
    });
}

module.exports = {
    save: save
};
