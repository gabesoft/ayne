'use strict';

var pickFiles        = require('broccoli-static-compiler')
  , templateCompiler = require('broccoli-ember-hbs-template-compiler')
  , path             = require('path')
  , glob             = require('glob')
  , touch            = require('./touch')
  , jshintTree       = require('broccoli-jshint')
  , moduleAppender   = require('./ember-module-appender')
  , moduleCompiler   = require('broccoli-es6-module-transpiler')
  , concatenate      = require('broccoli-concat')
  , uglifyJs         = require('broccoli-uglify-sourcemap')
  , empty            = require('./empty')
  , mergeTrees       = require('broccoli-merge-trees');

module.exports = function (opts) {
    function hasTemplates () {
        return glob.sync(path.join(opts.name, 'app', '**/*.hbs'), {
            nomount : false
          , cwd     : opts.root
          , root    : opts.root
        }).length > 0;
    }

    function hasModules () {
        return glob.sync(path.join(opts.name, 'app', '**/*.js'), {
            nomount : false
          , cwd     : opts.root
          , root    : opts.root
        }).length > 0;
    }

    function compileTemplates () {
        if (!hasTemplates()) {
            return touch('/templates/app-templates.js');
        }

        var templ = pickFiles(opts.root, {
                srcDir  : path.join(opts.name, 'app', 'templates')
              , destDir : '/templates'
              , files   : [ '**/*.hbs' ]
            });

        return concatenate(templateCompiler(templ), {
            inputFiles : [ 'templates/**/*.js' ]
          , outputFile : '/app-templates.js'
        });
    }

    function jshintModules () {
        if (!hasModules() || opts.minify) { return empty(); }

        var modules = pickFiles(opts.root, {
                srcDir  : path.join(opts.name, 'app')
              , destDir : '/'
            });

        return jshintTree(modules, { log: true, disableTestGenerator: true })
    }

    function compileJsModules () {
        if (!hasModules()) {
            return touch([ '/app-compiled.js', '/app-compiled.js.map' ]);
        }

        var modules = pickFiles(opts.root, {
                srcDir  : path.join(opts.name, 'app')
              , destDir : '/'
              , files   : [ '**/*.js', '.jshintrc' ]
            })
          , moduleSetup = moduleAppender(modules, {
                destFile: 'app-module-setup.js'
            })
          , all = mergeTrees([ modules, moduleSetup ]);

        return moduleCompiler(all, {
            formatter : 'bundle'
          , output    : '/app-compiled.js'
        });
    }

    function compileJsVendor () {
        var ext = opts.minify ? '.min.js' : '.js';

        return concatenate(opts.bower, {
            outputFile : '/vendor.js'
          , inputFiles : [
                'jquery/dist/jquery' + ext
              , 'blueimp-md5/js/md5' + ext
              , 'fingerprint/fingerprint.js'
              , 'fastclick/lib/fastclick.js'
              , 'modernizr/modernizr.js'
              , 'foundation/js/foundation' + ext
              , 'handlebars/handlebars' + ext
              , 'ember/ember' + ext
            ]
        });
    }

    function combineJsAssets () {
        var templ   = compileTemplates()
          , modules = compileJsModules()
          , jshint  = jshintModules()
          , vendor  = compileJsVendor()
          , lib     = concatenate(mergeTrees([ templ, modules ]), {
                inputFiles : [ '**/*.js' ]
              , outputFile : '/app.js'
            })
          , map = pickFiles(modules, {
                srcDir  : '/'
              , destDir : '/'
              , files   : [ '**/*.map' ]
            });

        if (opts.minify) {
            lib = uglifyJs(lib, {
                mangle   : true
              , compress : {
                    sequences     : true
                  , dead_code     : true
                  , conditionals  : true
                  , booleans      : true
                  , unused        : true
                  , if_return     : true
                  , join_vars     : true
                  , drop_console  : true
                  , drop_debugger : true
                }
              , sourceMapConfig : {
                    enabled    : !opts.minify
                  , extensions : ['js']
                }
            });

            vendor = uglifyJs(vendor, {
                mangle   : false
              , compress : false
              , sourceMapConfig: {
                    enabled    : !opts.minify
                  , extensions : ['js']
                }
            });
        }

        return mergeTrees([ vendor, lib, map, jshint ]);
    }

    return pickFiles(combineJsAssets(), {
        srcDir  : '/'
      , destDir : path.join(opts.name, 'js')
    });
};
