var urlMeta = require('./handlers/url-meta')
  , url     = require('./handlers/url');

module.exports = [{
    method: 'GET'
  , path: '/api/urlmeta/{href}'
  , handler: urlMeta
  , config  : { auth : 'token' }
}, {
    method  : 'POST'
  , path    : '/api/urls'
  , handler : url.save
  , config  : { auth : 'token' }
}];
