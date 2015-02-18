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

function remove (request, reply) {
    var userId = request.auth.credentials.id
      , urlId  = request.params.id;
    api.del(['/users', userId, 'urls', urlId ], function (err, response, body) {
        return err ? reply.boom(err) : reply(body);
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

function read (request, reply) {
    var userId = request.auth.credentials.id;

    api.get([ '/users', userId, 'urls' ], request.query, function (err, response, body) {
        return err ? reply.boom(err) : reply(body.sort(function (a, b) {
            return new Date(b.updatedAt) - new Date(a.updatedAt);
        }));
    });
}

module.exports = {
    save   : save
  , remove : remove
  , read   : read
};
