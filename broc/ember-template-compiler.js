'use strict';

var util     = require('util')
  , compiler = require('../bower_components/ember/ember-template-compiler')
  , Filter   = require('broccoli-filter');

util.inherits(TemplateCompiler, Filter);

function TemplateCompiler (inputTree, options) {
    if (!(this instanceof TemplateCompiler)) {
        return new TemplateCompiler(inputTree, options);
    }
    this.inputTree = inputTree;
    this.options = options || {};
}

TemplateCompiler.prototype.extensions = [ 'hbs', 'handlebars' ];
TemplateCompiler.prototype.targetExtension = '.js';

TemplateCompiler.prototype.getTemplateNameFromPath = function (templatePath) {
    var splitPath                = templatePath.split("/")
      , filenameWithExtension    = splitPath[splitPath.length - 1]
      , lastDotIndex             = filenameWithExtension.lastIndexOf(".")
      , filenameWithoutExtension = filenameWithExtension.substring(0, lastDotIndex)
      , folderPath               = ''
      , i;

    for (i = splitPath.length - 2; i >= 0; i--) {
        if ( splitPath[i] === 'templates' ) { break; }
        folderPath = splitPath[i] + '/' + folderPath;
    }

    return folderPath + filenameWithoutExtension;
};

TemplateCompiler.prototype.processString = function (input, relativePath) {
    var template = compiler.precompile(input, false)
      , name     = this.getTemplateNameFromPath(relativePath);
    return 'Ember.TEMPLATES["' + name + '"] = Ember.HTMLBars.template(' + template + ');';
};

module.exports = TemplateCompiler;
