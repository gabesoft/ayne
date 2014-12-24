'use strict';

var pickFiles   = require('broccoli-static-compiler')
  , compileSass = require('broccoli-sass')
  , mergeTrees  = require('broccoli-merge-trees')
  , trees       = {
        app   : 'app'
      , bower : '../../bower_components'
    };

trees.vendor = pickFiles(trees.bower, {
    srcDir  : '/foundation/scss'
  , destDir : '/foundation'
});

trees.fonts = pickFiles(trees.bower, {
    srcDir  : '/font-awesome/scss'
  , destDir : '/font-awesome'
});

trees.lib = pickFiles(trees.app, {
    srcDir  : '/styles'
  , destDir : '/styles'
});

trees.compiled = compileSass([ trees.vendor, trees.fonts, trees.lib ]
  , '/styles/app.scss'
  , '/app.css'
  , {
        sourceMap      : true
      //, outputStyle    : 'compressed'
      , sourceComments : 'map'
    });

trees.fontsDir = pickFiles(trees.bower, {
    srcDir  : '/font-awesome/fonts'
  , destDir : '/assets/auth/fonts'
});

trees.output = pickFiles(trees.compiled, {
    srcDir  : '/'
  , destDir : '/assets/auth/css/'
  , files   : [ 'app.css', 'app.css.map' ]
});

module.exports = mergeTrees([ trees.output, trees.fontsDir ]);
