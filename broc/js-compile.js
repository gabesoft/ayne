'use strict';

var pickFiles        = require('broccoli-static-compiler')
  , templateCompiler = require('broccoli-ember-hbs-template-compiler')
  , path             = require('path')
  , glob             = require('glob')
  , touch            = require('./touch')
  , moduleCompiler   = require('broccoli-es6-module-transpiler')
  , AMDFormatter     = require('es6-module-transpiler-amd-formatter')
  , concatenate      = require('broccoli-concat')
  , uglifyJs         = require('broccoli-uglify-js')
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

    function compileJsModules () {
        if (!hasModules()) {
            return touch([ '/app-compiled.js', '/app-compiled.js.map' ]);
        }

        var modules = pickFiles(opts.root, {
                srcDir  : path.join(opts.name, 'app')
              , destDir : '/'
              , files   : [ '**/*.js' ]
            });

        var amd = moduleCompiler(modules, {
                //formatter : 'bundle'
                formatter : new AMDFormatter()
                //, output    : '/app-compiled.js'
            });

        var js = concatenate(amd, {
                outputFile : '/app-compiled.js'
              , inputFiles : [ '**/*.js' ]
            });

        var map = pickFiles(amd, {
                srcDir  : '/'
              , destDir : '/'
              , files   : [ '**/*.map' ]
            });

        return mergeTrees([ js, map ]);
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
              , 'loader.js/loader.js'
              , 'ember/ember' + ext
              , 'ember-resolver/dist/ember-resolver' + ext
            ]
        });
    }

    function combineJsAssets () {
        var templ   = compileTemplates()
          , modules = compileJsModules()
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
            });

            vendor = uglifyJs(vendor, {
                mangle   : false
              , compress : false
            });
        }

        return mergeTrees([ vendor, lib, map ]);
        //return mergeTrees([ vendor, lib ]);
    }

    return pickFiles(combineJsAssets(), {
        srcDir  : '/'
      , destDir : path.join(opts.name, 'js')
    });
};
