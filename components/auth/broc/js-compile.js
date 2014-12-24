'use strict';

var pickFiles        = require('broccoli-static-compiler')
  , templateCompiler = require('broccoli-ember-hbs-template-compiler')
  , path             = require('path')
  , moduleCompiler   = require('broccoli-es6-module-transpiler')
  , concatenate      = require('broccoli-concat')
  , uglifyJs         = require('broccoli-uglify-js')
  , mergeTrees       = require('broccoli-merge-trees');

module.exports = function (opts) {
    var trees = {
            app   : opts.app
          , bower : opts.bower
        };

    function run (tree, fns) {
        return fns.reduce(function (tree, fn) {
            return fn(tree);
        }, tree);
    }

    function pickTemplates (tree) {
        return pickFiles(tree, {
            srcDir  : '/templates'
          , destDir : '/templates'
        });
    }

    function concatenateTemplates (tree) {
        return concatenate(tree, {
            inputFiles : [ 'templates/*.js' ]
          , outputFile : '/app-templates.js'
        });
    }

    function pickJsFiles (tree) {
        return pickFiles(tree, {
            srcDir  : '/'
          , destDir : '/'
          , files   : [ '**/*.js' ]
        });
    }

    function compileModules (tree) {
        return moduleCompiler(tree, {
            formatter : 'bundle'
          , output    : '/app-compiled.js'
        });
    }

    function concatenateJsLib (tree) {
        return concatenate(tree, {
            inputFiles     : [ 'app-templates.js', 'app-compiled.js' ]
          , outputFile     : '/app-all.js'
          , header         : '// Generated on ' + (new Date()).toString()
          , wrapInFunction : true
        });
    }

    function concatenateJsVendor (tree) {
        return concatenate(tree, {
            inputFiles : [
                'jquery/dist/jquery.js'
              , 'fastclick/lib/fastclick.js'
              , 'foundation/js/foundation.js'
              , 'handlebars/handlebars.js'
              , 'ember/ember.js'
            ]
          , outputFile : '/vendor-all.js'
        });
    }

    function pickSourceMap (tree) {
        return pickFiles(tree, {
            srcDir  : '/'
          , destDir : '/'
          , files   : [ 'app-compiled.js.map' ]
        });
    }

    function copyToAssetsDir (tree) {
        return pickFiles(tree, {
            srcDir  : '/'
          , destDir : path.join(opts.dest, 'js')
        });
    }

    function uglifyAndCompress (tree) {
        return opts.prod ? uglifyJs(tree, { compress: true }) : tree;
    }

    trees.templates = run(trees.app, [
        pickTemplates
      , templateCompiler
      , concatenateTemplates
    ]);

    trees.jsLibCompiled = run(trees.app, [
        pickJsFiles
      , compileModules
    ]);

    trees.jsLibSourceMap = pickSourceMap(trees.jsLibCompiled);

    trees.jsLibCombined = run([ trees.templates, trees.jsLibCompiled ], [
        mergeTrees
      , concatenateJsLib
    ]);

    trees.jsVendorCombined = run(trees.bower, [
        pickJsFiles
      , concatenateJsVendor
    ]);

    trees.jsLibOutput = uglifyAndCompress(trees.jsLibCombined);
    trees.jsVendorOutput = uglifyAndCompress(trees.jsVendorCombined);

    return run([
        trees.jsLibOutput
      , trees.jsVendorOutput
      , trees.jsLibSourceMap ], [
        mergeTrees
      , copyToAssetsDir
    ]);
};
