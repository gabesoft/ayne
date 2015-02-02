'use strict';

var api = require('../../../core/lib/api');

function create (request, reply) {
    var userId = request.auth.credentials.id
      , data   = request.payload;

    data.userId = userId;
    api.post(['/users', userId, '/urls' ], data, function (err, response, body) {
        if (err) {
            reply.boom(err);
        } else {
            reply(body);
        }
    });
}

module.exports = {
    create: create
};
