var api = require('../../../core/lib/api');

function get (request, reply) {
    var userId = request.auth.credentials.id;
    api.get([ '/users', userId, 'tags' ], function (err, response, data) {
        return err ? reply.boom(err) : reply(data);
    });
}

function remove (request, reply) {
    var userId = request.auth.credentials.id
      , tag    = request.params.tag;
    api.del(['/users', userId, 'tags', encodeURIComponent(tag) ], function (err, response, data) {
        return err ? reply.boom(err) : reply(data);
    });
}

module.exports = {
    get    : get
  , remove : remove
};
