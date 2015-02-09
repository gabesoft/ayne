var req       = require('request')
  , api       = require('../../../core/lib/api')
  , crypto    = require('crypto')
  , URI       = require('URIjs')
  , cheerio   = require('cheerio')
  , browserUA = {
        chrome  : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/40.0.2214.94 Safari/537.36"
      , firefox : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.10; rv:35.0) Gecko/20100101 Firefox/35.0"
    };

function fixUrl (href) {
    if (!href) { return null; }

    if (href.match(/^http|ftp/)) {
        return href;
    } else {
        return 'http://' + href.replace(/^\/+/, '');
    }
}

function getFaviconUri (pageUri, $) {
    var href1       = $('link[rel=icon]').attr('href')
      , href2       = $('link[rel="shortcut icon"]').attr('href')
      , faviconPath = href1 || href2 || ''
      , uri         = new URI(faviconPath);

    if (!uri.hostname() && !faviconPath.match(/^\//)) {
        uri.path(pageUri.path());
        uri.segment(faviconPath);
        uri.normalizePathname();
    }

    uri.hostname(uri.hostname() || pageUri.hostname());
    uri.protocol(uri.protocol() || pageUri.protocol());

    if (faviconPath.length === 0) {
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
            'User-Agent'      : browserUA.firefox
          , 'Accept'          : '*/*'
          , 'Accept-Language' : 'en-US,en;q=0.5'
          , 'Host'            : new URI(href).host()
        }
    };
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
            var resolvedUri = new URI(response.request.uri.href);

            getExisting(resolvedUri.toString(), userId, function (err, res, data) {
                if (!err && data) {
                    reply(data);
                } else {
                    reply(buildMeta(resolvedUri, body));
                }
            });
        }
    });
}

module.exports = getMetadata;
