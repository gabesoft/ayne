'use strict';

function userHandler (request, reply) {
    return reply.view('auth/templates/index.jade', {
        title   : 'user'
      , $locals : { context: 'context data goes here' }
    });
}

module.exports = {
    method  : 'GET'
  , path    : '/user'
  , handler : userHandler
};
