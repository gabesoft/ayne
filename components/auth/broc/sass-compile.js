'use strict';

var pickFiles = require('broccoli-static-compiler')
  , compileSass = require('broccoli-sass')
  , path = require('path')
  , trees = {
        app   : 'app'
      , bower : '../../bower_components'
    };

trees.vendor = pickFiles(trees.bower, {
    srcDir  : '/foundation'
  , destDir : '/foundation'
  , files   : [ '**/*.scss' ]
});

trees.lib = pickFiles(trees.app, {
    srcDir  : '/styles'
  , destDir : '/styles'
  , files   : [ '**/*.scss' ]
})

trees.compiled = compileSass([ trees.vendor, trees.lib ]
  , '/styles/app.scss'
  , '/app.css'
  , {
        options: { includePaths: '/foundation' }
    });

trees.output = pickFiles(trees.compiled, {
    srcDir  : '/'
  , destDir : '/assets/auth/css/'
  , files   : [ 'app.css' ]
})

module.exports = trees.output;
