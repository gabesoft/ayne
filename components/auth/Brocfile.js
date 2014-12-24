'use strict';

var mergeTrees = require('broccoli-merge-trees')
  , prod       = process.env.BRCOCCOLI_ENV === 'production'
  , dest       = '/auth'
  , opts       = {
        prod  : prod
      , dest  : dest
      , app   : 'app'
      , bower : '../../bower_components'
    };

module.exports = mergeTrees([
    require('./broc/js-compile')(opts)
  , require('./broc/sass-compile.js')(opts)
]);
