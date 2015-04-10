'use strict';

var mergeTrees     = require('broccoli-merge-trees')
  , minify         = process.env.NODE_ENV === 'production' || process.env.BROCCOLI_ENV === 'production'
  , path           = require('path')
  , unwatchedTree  = require('broccoli-unwatched-tree')
  , glob           = require('glob')
  , buildJSAngular = require('./broc/js-compile-angular')
  , buildJS        = require('./broc/js-compile')
  , buildSASS      = require('./broc/sass-compile')
  , components     = path.join(__dirname, 'components')
  , bower          = path.join(__dirname, 'bower_components')
  , dirs           = glob.sync(components + '/*')
  , trees          = [];

dirs.forEach(function (dir) {
    var opts = {
            minify : minify
          , name   : path.basename(dir)
          , path   : dir
          , root   : components
          , bower  : unwatchedTree(bower)
        };

    // TODO: use a config
    if (dir === '/work/ayne/components/vimp') {
        trees.push(mergeTrees([
            buildJSAngular(opts)
          , buildSASS(opts)
        ]));
    } else {
        trees.push(mergeTrees([
            buildJS(opts)
          , buildSASS(opts)
        ]));
    }
});

module.exports = mergeTrees(trees);
