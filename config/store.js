var nconf = require('nconf');

nconf.overrides({
    path: { root: process.cwd() }
});

nconf.env();
nconf.argv();
nconf.file('./' + (nconf.get('NODE_ENV') || 'development') + '.json');
nconf.file('./default.json')

module.exports = nconf;
