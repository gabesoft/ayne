'use strict';

var pickFiles   = require('broccoli-static-compiler')
  , path        = require('path')
  , glob        = require('glob')
  , touch       = require('./touch')
  , renameFile  = require('./file-renamer')
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
          , roboto = pickFiles(opts.bower, {
                srcDir  : '/roboto-fontface'
              , destDir : '/roboto-fontface'
            })
          , bootstrapTagsinput = pickFiles(opts.bower, {
                srcDir  : '/bootstrap-tagsinput/dist'
              , destDir : '/'
              , files   : [ 'bootstrap-tagsinput.css' ]
            })
          , tagsInput = renameFile(bootstrapTagsinput, {
                'bootstrap-tagsinput.css' : '_bootstrap-tagsinput.scss'
            })
          , compiled = compileSass([ foundation, fontAwesome, roboto, tagsInput, opts.root ]
              , path.join(opts.name, 'styles', 'app.scss')
              , '/app.css'
              , {
                    sourceMap      : !opts.minify
                  , sourceComments : opts.minify ? false : 'map'
                  , outputStyle    : opts.minify ? 'compressed' : 'inline'
                });

        return pickFiles(compiled, {
            srcDir  : '/'
          , destDir : path.join(opts.name, 'css')
        });
    }

    function processFonts () {
        var fontAwesome = pickFiles(opts.bower, {
                srcDir  : '/font-awesome/fonts'
              , destDir : path.join(opts.name, '/css/fonts')
            })
          , roboto = pickFiles(opts.bower, {
                srcDir  : '/roboto-fontface/fonts'
              , destDir : path.join(opts.name, '/css/fonts')
            });

        return mergeTrees([ fontAwesome, roboto ]);
    }

    return mergeTrees([ processSass(), processFonts() ]);
};
