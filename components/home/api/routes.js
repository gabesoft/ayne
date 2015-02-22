var urlMeta = require('./handlers/url-meta')
  , api     = require('../../core/lib/api')
  , url     = require('./handlers/url');

function tags (request, reply) {
    api.get('/tags', function (err, response, data) {
        return err ? reply.boom(err) : reply(data);
    });
}

module.exports = [{
    method  : 'GET'
  , path    : '/api/urlmeta/{href}'
  , handler : urlMeta
  , config  : { auth : 'token' }
}, {
    method  : 'GET'
  , path    : '/api/urls'
  , handler : url.search
  , config  : { auth : 'token' }
}, {
    method  : 'GET'
  , path    : '/api/queries'
  , handler : url.queries
  , config  : { auth : 'token' }
}, {
    method  : 'POST'
  , path    : '/api/urls'
  , handler : url.save
  , config  : { auth : 'token' }
}, {
    method  : 'DELETE'
  , path    : '/api/urls/{id}'
  , handler : url.remove
  , config  : { auth : 'token' }
}, {
    method  : 'GET'
  , path    : '/api/tags'
  , handler : tags
}];
