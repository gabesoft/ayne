'use strict';

var mergeTrees       = require('broccoli-merge-trees')
  , minify           = process.env.NODE_ENV === 'production' || process.env.BROCCOLI_ENV === 'production'
  , path             = require('path')
  , unwatchedTree    = require('broccoli-unwatched-tree')
  , glob             = require('glob')
  , buildJSAngular   = require('./broc/js-compile-angular')
  , buildJS          = require('./broc/js-compile')
  , buildSASS        = require('./broc/sass-compile')
  , buildSASSAngular = require('./broc/sass-compile-angular')
  , components       = path.join(__dirname, 'components')
  , bower            = path.join(__dirname, 'bower_components')
  , dirs             = glob.sync(components + '/*')
  , trees            = []
  , compilers        = { vimp : [ buildJSAngular, buildSASSAngular ] };

dirs.forEach(function (dir) {
    var name = path.basename(dir)
      , comp = compilers[name] || [ buildJS, buildSASS ]
      , opts = {
            minify : minify
          , name   : name
          , path   : dir
          , root   : components
          , bower  : unwatchedTree(bower)
        };

    trees.push(mergeTrees(comp.map(function (c) { return c(opts); })));

    // TODO: use a config
    // if (dir === '/work/ayne/components/vimp') {
        // trees.push(mergeTrees([
            // buildJSAngular(opts)
          // , buildSASSAngular(opts)
        // ]));
    // } else {
        // trees.push(mergeTrees([
            // buildJS(opts)
          // , buildSASS(opts)
        // ]));
    // }
});

module.exports = mergeTrees(trees);
