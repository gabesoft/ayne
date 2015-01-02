'use strict';

var mergeTrees = require('broccoli-merge-trees')
  , minify     = process.env.BROCCOLI_ENV === 'production'
  , path       = require('path')
  , async      = require('async')
  , glob       = require('glob')
  , buildJS    = require('./broc/js-compile')
  , buildSASS  = require('./broc/sass-compile')
  , components = path.join(__dirname, 'components')
  , bower      = path.join(__dirname, 'bower_components')
  , dirs       = glob.sync(components + '/*')
  , trees      = [];

dirs.forEach(function (dir) {
    var opts = {
            minify : minify
          , name   : path.basename(dir)
          , path   : dir
          , root   : components
          , bower  : bower
        };

    trees.push(mergeTrees([
        buildJS(opts)
      , buildSASS(opts)
    ]));
})

module.exports = mergeTrees(trees);