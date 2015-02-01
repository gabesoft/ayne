var urlMeta = require('./handlers/url-meta');

module.exports = [{
    method: 'GET'
  , path: '/api/urlmeta/{href}'
  , handler: urlMeta
}];
