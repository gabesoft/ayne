var api = require('../../core/lib/api');

function search (request, reply) {
    api.get('/vplugs', request.query, function (err, response, body) {
        return err ? reply.boom(err) : reply(body);
    });
}

function get (request, reply) {
    api.get('/vplugs/' + request.params.id, function (err, response, body) {
        if (err) { return reply.boom(err); }
        if (!body) { return reply(); }

        if (body.readme) {
            body.readme = new Buffer(body.readme.content, body.readme.encoding);
            body.readme = body.readme.toString('utf8');
            // TODO: replace relative urls with absolute
            // prepend body.githubUrl + '/raw/master/' + relUrl
        }

        if (body.doc) {
            body.doc = new Buffer(body.doc.content, body.doc.encoding);
            body.doc = body.doc.toString('utf8');
        }

        return reply(body);
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
  , path    : '/api/vplugs/{id}'
  , handler : get
}, {
    method  : 'GET'
  , path    : '/api/vplugkeywords'
  , handler : keywords
}];
