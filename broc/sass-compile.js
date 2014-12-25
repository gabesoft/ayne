'use strict';

var pickFiles   = require('broccoli-static-compiler')
  , path        = require('path')
  , glob        = require('glob')
  , touch       = require('./touch')
  , compileSass = require('broccoli-sass')
  , mergeTrees  = require('broccoli-merge-trees');

module.exports = function (opts) {
    function hasSass () {
        return glob.sync(path.join(opts.name, 'styles', 'app.scss'), {
            nomount : false
          , cwd     : opts.root
          , root    : opts.root
        }).length > 0;
    }

    function processSass () {
        if (!hasSass()) {
            return touch(path.join(opts.name, 'css', 'app.css'));
        }

        var foundation = pickFiles(opts.bower, {
                srcDir  : '/foundation/scss'
              , destDir : '/foundation'
            })
          , fontAwesome = pickFiles(opts.bower, {
                srcDir  : '/font-awesome/scss'
              , destDir : '/font-awesome'
            })
          , compiled = compileSass([ foundation, fontAwesome, opts.root ]
              , path.join(opts.name, 'styles', 'app.scss')
              , '/app.css'
              , {
                    sourceMap      : true
                  , sourceComments : 'map'
                  , outputStyle    : opts.minify ? 'compressed' : 'inline'
                });

        return pickFiles(compiled, {
            srcDir  : '/'
          , destDir : path.join(opts.name, 'css')
          , files   : [ 'app.css', 'app.css.map' ]
        });
    }

    function processFonts () {
        return pickFiles(opts.bower, {
            srcDir  : '/font-awesome/fonts'
          , destDir : path.join(opts.name, '/fonts')
        });
    }

    return mergeTrees([ processSass(), processFonts() ]);
};
