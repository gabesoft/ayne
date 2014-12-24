'use strict';

// TODO: set paths and env in one place

var pickFiles   = require('broccoli-static-compiler')
  , compileSass = require('broccoli-sass')
  , prod = process.env.BRCOCCOLI_ENV === 'production'
  , mergeTrees  = require('broccoli-merge-trees')
  , trees       = {
        app   : 'app'
      , bower : '../../bower_components'
    };

trees.vendorSass = pickFiles(trees.bower, {
    srcDir  : '/foundation/scss'
  , destDir : '/foundation'
});

trees.fontsSass = pickFiles(trees.bower, {
    srcDir  : '/font-awesome/scss'
  , destDir : '/font-awesome'
});

trees.fontsDir = pickFiles(trees.bower, {
    srcDir  : '/font-awesome/fonts'
  , destDir : '/assets/auth/fonts'
});

trees.appSass = pickFiles(trees.app, {
    srcDir  : '/styles'
  , destDir : '/styles'
});

trees.compiled = compileSass([ trees.vendorSass, trees.fontsSass, trees.appSass ]
  , '/styles/app.scss'
  , '/app.css'
  , {
        sourceMap      : true
      , outputStyle    : prod ? 'compressed' : 'inline'
      , sourceComments : 'map'
    });

trees.outputCss = pickFiles(trees.compiled, {
    srcDir  : '/'
  , destDir : '/assets/auth/css/'
  , files   : [ 'app.css', 'app.css.map' ]
});

module.exports = mergeTrees([ trees.outputCss, trees.fontsDir ]);
