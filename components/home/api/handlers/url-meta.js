var req     = require('request')
  , api     = require('../../../core/lib/api')
  , crypto  = require('crypto')
  , URI     = require('URIjs')
  , cheerio = require('cheerio');

function fixUrl (href) {
    if (!href) { return null; }

    if (href.match(/^http|ftp/)) {
        return href;
    } else {
        return 'http://' + href.replace(/^\/+/, '');
    }
}

function getPageUri (href, actualUri) {
    var uri = new URI(href);

    uri.hostname(actualUri.hostname() || uri.hostname());
    uri.protocol(actualUri.protocol() || uri.protocol());

    return uri;
}

function getFaviconUri (pageUri, $) {
    var href1 = $('link[rel=icon]').attr('href')
      , href2 = $('link[rel="shortcut icon"]').attr('href')
      , uri   = new URI(href1 || href2 || '');

    uri.hostname(uri.hostname() || pageUri.hostname());
    uri.protocol(uri.protocol() || pageUri.protocol());

    if (!uri.path() || uri.path() === '/') {
        uri.path('favicon.ico');
    }

    return uri;
}

function meta (pageUri, faviconUri, title) {
    return {
        title   : title || null
      , href    : pageUri ? pageUri.toString() : null
      , favicon : faviconUri ? faviconUri.toString() : null
      , tags    : []
      , private : false
      , notes   : null
    };
}

function makeUrlId (href, userId) {
    return crypto.createHash('md5').update(userId + href).digest('hex');
}

function buildMeta (pageUri, body) {
    var $          = cheerio.load(body)
      , faviconUri = getFaviconUri(pageUri, $)
      , title      = $('title').text();
    return meta(pageUri, faviconUri, title);
}

function getExisting (href, userId, cb) {
    api.get(['/users', userId, 'urls', makeUrlId(href, userId) ], cb);
}

function requestOptions (href) {
    return {
        url: href
      , rejectUnauthorized : false
      , method             : 'GET'
      , headers            : {
            'User-Agent'      : 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:35.0) Gecko/20100101 Firefox/35.0'
          , 'Accept'          : 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
          , 'Accept-Language' : 'en-US,en;q=0.5'
        }
    }
}

function getMetadata (request, reply) {
    var href   = fixUrl(request.params.href)
      , userId = request.auth.credentials.id
      , opts   = requestOptions(href);

    if (!href) { return reply(meta()); }

    req(opts, function (err, response, body) {
        if (err || !body) {
            reply(meta(href));
        } else {
            var resolvedUri = new URI(response.request.uri.href)
              , pageUri     = getPageUri(href, resolvedUri);

            getExisting(pageUri.toString(), userId, function (err, res, data) {
                if (!err && data) {
                    reply(data);
                } else {
                    reply(buildMeta(pageUri, body));
                }
            });
        }
    });
}

module.exports = getMetadata;
