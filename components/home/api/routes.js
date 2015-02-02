var urlMeta = require('./handlers/url-meta')
  , url     = require('./handlers/url');

module.exports = [{
    method: 'GET'
  , path: '/api/urlmeta/{href}'
  , handler: urlMeta
}, {
    method  : 'POST'
  , path    : '/api/urls'
  , handler : url.create
  , config  : { auth : 'token' }
}];
