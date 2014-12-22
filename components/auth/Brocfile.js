'use strict';

var mergeTrees = require('broccoli-merge-trees')
  , js = require('./broc/js-compile')
  , sass = require('./broc/sass-compile.js');

module.exports = mergeTrees([ js, sass ]);
