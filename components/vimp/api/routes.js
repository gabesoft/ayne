var api = require('../../core/lib/api');

function getVplugs (request, reply) {
    api.get('/vplugs', null, function (err, response, body) {
        return err ? reply.boom(err) : reply(body);
    });
}

module.exports = [{
    method  : 'GET'
  , path    : '/api/vplugs'
  , handler : getVplugs
}];
