'use strict';

function  oauth2handler(request, reply) {
    return reply.view('core/templates/oauth2callback.jade', {
        code: request.query.code
    });
}

var path     = require('path')
  , moment   = require('moment')
  , routes   = []
  , favicons = [
        "/android-icon-192x192.png"
      , "/apple-icon-114x114.png"
      , "/apple-icon-120x120.png"
      , "/apple-icon-144x144.png"
      , "/apple-icon-152x152.png"
      , "/apple-icon-180x180.png"
      , "/apple-icon-57x57.png"
      , "/apple-icon-60x60.png"
      , "/apple-icon-72x72.png"
      , "/apple-icon-76x76.png"
      , "/favicon-16x16.png"
      , "/favicon-32x32.png"
      , "/favicon-96x96.png"
      , "/manifest.json"
      , "/ms-icon-144x144.png"
    ];

favicons.forEach(function (f) {
    routes.push({
        method  : 'GET'
      , path    : f
      , handler : { file: path.join('.', 'favicon', f) }
      , config  : {
            cache : {
                expiresIn : moment.duration(24, 'hours').asMilliseconds()
              , privacy   : 'public'
            }
        }
    });
});

routes.push([{
    method  : 'GET'
  , path    : '/oauth2callback'
  , handler : oauth2handler
}]);

module.exports = routes;
