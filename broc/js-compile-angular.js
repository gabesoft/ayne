'use strict';

var browserify  = require('broccoli-fast-browserify')
  , concatenate = require('broccoli-concat')
  , path        = require('path')
  , uglifyJs    = require('broccoli-uglify-sourcemap')
  , pickFiles   = require('broccoli-static-compiler')
  , mergeTrees  = require('broccoli-merge-trees');


module.exports = function (opts) {
    function compileVendor () {
        var ext = opts.minify ? '.min.js' : '.js';

        return concatenate(opts.bower, {
            outputFile : '/vendor.js'
          , inputFiles : [
                'angular/angular' + ext
              , 'angular-animate/angular-animate' + ext
              , 'angular-aria/angular-aria' + ext
              , 'angular-material/angular-material' + ext
              , 'angular-ui-router/release/angular-ui-router' + ext
            ]
        });
    }

    function compileSource () {
        return browserify(path.join(opts.root, opts.name), {
            bundles    : { 'app.js': { entryPoints: [ 'app/app.js' ] } }
          , browserify : {
                fullPaths : true
              , basedir   : path.join(opts.root, opts.name)
              , debug     : !opts.minify
            }
        });
    }

    function compileAssets () {
        return mergeTrees([ compileVendor(), compileSource() ]);
    }


    return pickFiles(compileAssets(), {
        srcDir  : '/'
      , destDir : path.join(opts.name, 'js')
    });
};
