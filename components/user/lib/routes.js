'use strict';

function userHandler (request, reply) {
    return reply.view('user/templates/index.jade', {
        title   : 'user'
      , $locals : { data: 'page data goes here' }
    });
}

module.exports = {
    method  : 'GET'
  , path    : '/user'
  , handler : userHandler
};
