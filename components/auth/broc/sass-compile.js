'use strict';

var pickFiles   = require('broccoli-static-compiler')
  , path        = require('path')
  , compileSass = require('broccoli-sass')
  , mergeTrees  = require('broccoli-merge-trees')

  module.exports = function (opts) {
      var trees = {
              app   : opts.app
            , bower : opts.bower
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
        , destDir : path.join(opts.dest, 'fonts')
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
            , outputStyle    : opts.prod ? 'compressed' : 'inline'
            , sourceComments : 'map'
          });

      trees.outputCss = pickFiles(trees.compiled, {
          srcDir  : '/'
        , destDir : path.join(opts.dest, 'css')
        , files   : [ 'app.css', 'app.css.map' ]
      });

      return mergeTrees([ trees.outputCss, trees.fontsDir ]);
  };
