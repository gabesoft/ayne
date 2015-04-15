'use strict';

var pickFiles   = require('broccoli-static-compiler')
  , path        = require('path')
  , renameFile  = require('./file-renamer')
  , compileSass = require('broccoli-sass')
  , mergeTrees  = require('broccoli-merge-trees');

module.exports = function (opts) {
    var angularMaterial = pickFiles(opts.bower, {
            srcDir  : '/angular-material'
          , destDir : '/'
          , files   : [ 'angular-material.css' ]
        })
      , angularCSP = pickFiles(opts.bower, {
            srcDir  : '/angular'
          , destDir : '/'
          , files   : [ 'angular-csp.css' ]
        })
      , vendor   = mergeTrees([ angularMaterial, angularCSP ])
      , material = renameFile(vendor, { 'angular-material.css' : '_angular-material.scss' })
      , csp      = renameFile(vendor, { 'angular-csp.css' : '_angular-csp.scss' })
      , compiled = compileSass([ material, csp, opts.root ]
          , path.join(opts.name, 'styles', 'app.scss')
          , '/app.css', {
                sourceMap      : !opts.minify
              , sourceComments : opts.minify ? 'false' : 'map'
              , outputStyle    : opts.minify ? 'compressed' : 'inline'
            });

    return pickFiles(compiled, {
        srcDir  : '/'
      , destDir : path.join(opts.name, 'css')
    });
};
