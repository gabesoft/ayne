'use strict';

var pickFiles = require('broccoli-static-compiler')
  , compileSass = require('broccoli-sass')
  , trees = {
        app   : 'app'
      , bower : '../../bower_components'
    };

trees.vendor = pickFiles(trees.bower, {
    srcDir  : '/foundation/scss'
  , destDir : '/foundation'
});

trees.lib = pickFiles(trees.app, {
    srcDir  : '/styles'
  , destDir : '/styles'
});

trees.compiled = compileSass([ trees.vendor, trees.lib ]
  , '/styles/app.scss'
  , '/app.css'
  , {
        sourceMap      : true
      , outputStyle    : 'compressed'
      , sourceComments : 'map'
    });

trees.output = pickFiles(trees.compiled, {
    srcDir  : '/'
  , destDir : '/assets/auth/css/'
  , files   : [ 'app.css', 'app.css.map' ]
});

module.exports = trees.output;
