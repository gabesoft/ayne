var urlMeta = require('./handlers/url-meta')
  , url     = require('./handlers/url')
  , tag     = require('./handlers/tag');

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
  , handler : tag.get
  , config  : { auth : 'token' }
}, {
    method  : 'DELETE'
  , path    : '/api/tags/{tag}'
  , handler : tag.remove
  , config  : { auth : 'token' }
}];
