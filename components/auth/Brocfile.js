'use strict';

var pickFiles = require('broccoli-static-compiler')
  , templateCompiler = require('broccoli-ember-hbs-template-compiler')
  , moduleCompiler = require('broccoli-es6-module-transpiler')
  , concatenate = require('broccoli-concat')
    //, uglifyJs = require('broccoli-uglify-js')
  , mergeTrees = require('broccoli-merge-trees');

var templ = templateCompiler(pickFiles('app', {
        srcDir  : '/templates'
      , destDir : '/templates'
    }));
var templCombined = concatenate(templ, {
        inputFiles: [ 'templates/*.js' ]
      , outputFile: '/app-templates.js'
    });
var jsFiles = pickFiles('app', {
        srcDir  : '.'
      , files   : ['**/*.js']
      , destDir : '.'
    });
var jsCombined = moduleCompiler(jsFiles, {
        formatter : 'bundle'
      , output    : '/app-combined.js'
    });
var allCombined = mergeTrees([ templCombined, jsCombined ]);
var allJs = concatenate(allCombined, {
        inputFiles     : [ 'app-templates.js', 'app-combined.js' ]
      , outputFile     : '/app-all.js'
      , wrapInFunction : true
      , separator      : '\n'
      , header         : '// Created at ' + Date.now()
    });
var sourceMapJs = pickFiles(allCombined, {
        srcDir  : '.'
      , files   : [ 'app-combined.js.map' ]
      , destDir : '.'
    });

// TODO: uglify only for prod
//var uglify = uglifyJs(allJs, { compress: true });
//var outJs = uglify;

//var outJs = allJs;

module.exports = mergeTrees([ allJs, sourceMapJs ]);

//module.exports = mergeTrees([ compileTemplates(), concatJs() ]);
