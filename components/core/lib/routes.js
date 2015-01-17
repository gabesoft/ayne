'use strict';

function  oauth2handler(request, reply) {
    return reply.view('core/templates/oauth2callback.jade', {
        code: request.query.code
    });
}

module.exports = [{
    method  : 'GET'
  , path    : '/oauth2callback'
  , handler : oauth2handler
} ];
