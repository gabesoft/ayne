var api = require('../../core/lib/api');

function search (request, reply) {
    api.get('/vplugs', request.query, function (err, response, body) {
        return err ? reply.boom(err) : reply(body);
    });
}

function keywords (request, reply) {
    api.get('/vplugkeywords', request.query, function (err, response, body) {
        return err ? reply.boom(err) : reply(body);
    });
}

module.exports = [{
    method  : 'GET'
  , path    : '/api/vplugs'
  , handler : search
}, {
    method  : 'GET'
  , path    : '/api/vplugkeywords'
  , handler : keywords
}];
