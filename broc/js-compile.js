'use strict';

var pickFiles        = require('broccoli-static-compiler')
  , templateCompiler = require('broccoli-ember-hbs-template-compiler')
  , path             = require('path')
  , glob             = require('glob')
  , touch            = require('./touch')
  , moduleCompiler   = require('broccoli-es6-module-transpiler')
  , concatenate      = require('broccoli-concat')
  , uglifyJs         = require('broccoli-uglify-js')
  , mergeTrees       = require('broccoli-merge-trees');

module.exports = function (opts) {
    function hasTemplates () {
        return glob.sync(path.join(opts.name, '**/*.hbs'), {
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
            });

        return concatenate(templateCompiler(templ), {
            inputFiles : [ 'templates/*.js' ]
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

        return moduleCompiler(modules, {
            formatter : 'bundle'
          , output    : '/app-compiled.js'
        });
    }

    function compileJsVendor () {
        return concatenate(opts.bower, {
            outputFile : '/vendor.js'
          , inputFiles : [
                'jquery/dist/jquery.js'
              , 'fastclick/lib/fastclick.js'
              , 'foundation/js/foundation.js'
              , 'handlebars/handlebars.js'
              , 'ember/ember.js'
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
            })
          , combined = mergeTrees([ vendor, lib ]);

        if (opts.minify) {
            return uglifyJs(combined, { compress: true });
        } else {
            return mergeTrees([ combined, map ]);
        }
    }

    return pickFiles(combineJsAssets(), {
        srcDir  : '/'
      , destDir : path.join(opts.name, 'js')
    })
};
