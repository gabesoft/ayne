'use strict';

var pickFiles = require('broccoli-static-compiler')
  , templateCompiler = require('broccoli-ember-hbs-template-compiler')
  , concatenate = require('broccoli-concat')
  , mergeTrees = require('broccoli-merge-trees');

var templ = templateCompiler(pickFiles('app', {
        srcDir  : '/templates'
      , destDir : '/templates'
    }));
//var js = concatenate('app', {
//inputFiles : ['public/templates/*.js', '**/*.js']
//, outputFile : '/app-combined.js'
//, header     : '//TODO: add date or hash here'
//});
//var alljs = concatenate(templ

var templCombined = concatenate(templ, {
        inputFiles: [ 'templates/*.js' ]
      , outputFile: '/app-templates.js'
    });
var jsCombined = concatenate('app', {
        inputFiles : ['**/*.js']
      , outputFile : '/app-combined.js'
    });
var allCombined = mergeTrees([ templCombined, jsCombined ]);
var allJs = concatenate(allCombined, {
        inputFiles: [ 'app-templates.js', 'app-combined.js' ]
      , outputFile: '/app-combined.js'
    });

function compileTemplates () {
    var templates = pickFiles('app', {
            srcDir  : '/templates'
          , destDir : '/templates'
        });
    return templateCompiler(templates);
}

function concatJs () {
    return concatenate('app', {
        inputFiles : ['**/*.js']
      , outputFile : '/app-combined.js'
    });
}

module.exports = mergeTrees([ allJs ]);

//module.exports = mergeTrees([ compileTemplates(), concatJs() ]);
