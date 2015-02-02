var req     = require('request')
  , api     = require('../../../core/lib/api')
  , crypto  = require('crypto')
  , cheerio = require('cheerio')
  , URI     = require('URIjs');

function fixUrl (href) {
    if (!href) { return null; }

    var uri = URI(href || '');
    uri.protocol(uri.protocol() || 'http');
    return uri.toString();
}

function meta (href, title) {
    return {
        title   : title || null
      , href    : href
      , tags    : []
      , private : false
      , notes   : null
    };
}

function makeUrlId (userId, href) {
    return crypto.createHash('md5').update(userId + href).digest('hex');
}

function getMetadata (request, reply) {
    var href = fixUrl(request.params.href);

    req(href, function (err, res, body) {
        if (err || !body) {
            reply(meta(href));
        } else {
            reply(meta(href, cheerio.load(body)('title').text()));
        }
    });
}

function urlMetadata (request, reply) {
    var href   = fixUrl(request.params.href)
      , userId = request.auth.credentials.id
      , urlId  = makeUrlId(userId, href);

    if (!href) { return reply(meta()); }

    api.get(['/users', userId, 'urls', urlId ], function (err, response, body) {
        if (err || !body) {
            getMetadata(request, reply);
        } else {
            reply(body);
        }
    });
}

module.exports = urlMetadata;
