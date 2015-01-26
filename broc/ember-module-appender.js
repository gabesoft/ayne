'use strict';

var fs     = require('fs')
  , util   = require('util')
  , ember  = require('./ember-utils')
  , glob   = require('glob')
  , path   = require('path')
  , Writer = require('broccoli-writer');

util.inherits(EmberModuleAppender, Writer);

function EmberModuleAppender (inputTree, options) {
    if (!(this instanceof EmberModuleAppender)) {
        return new EmberModuleAppender(inputTree, options);
    }
    this.inputTree = inputTree;
    this.app       = options.app || 'app';
    this.appObj    = 'Application';
    this.root      = options.root || '';
    this.destFile  = options.destFile || 'app-module-append.js';
    this.types     = options.types || {
        controllers : { postfix: 'Controller', dir: 'controllers' }
      , views       : { postfix: 'View', dir: 'views' }
      , routes      : { postfix: 'Route', dir: 'routes' }
      , router      : { postfix: '', dir: '', files: 'router.js' }
    };
}

EmberModuleAppender.prototype.write = function (readTree, destDir) {
    return readTree(this.inputTree)
       .then(function (srcDir) {
            var imports    = []
              , statements = []
              , text       = null;

            imports.push('import App from \'' + path.join(this.root, this.app) + '\';');
            imports.push('import AppInit from \'' + path.join(this.root, 'app-init') + '\';');
            statements.push('var ' + this.appObj + ' = App.create({});');
            statements.push('AppInit.run(' + this.appObj + ');');

            Object.keys(this.types).forEach(function (type) {
                this.appendModules(this.types[type], srcDir, imports, statements);
            }.bind(this));

            text = imports.join('\n');
            text = text + '\n' + statements.join('\n');

            fs.writeFileSync(path.join(destDir, this.destFile), text);
        }.bind(this));
};

EmberModuleAppender.prototype.appendModules = function (type, dir, imports, statements) {
    var gopts = {
            nomount : true
          , cwd     : dir
          , root    : dir
        }
      , files = glob.sync(path.join(this.root, type.dir, type.files || '**/*.js'), gopts)
      , names = files.map(function (file) {
            var name = file
                   .replace(this.root, '')
                   .replace(new RegExp(type.dir + '/'), '')
                   .replace(/\.js$/, '')
                   .replace(/\//g, '-');
            return {
                file: file
              , name: ember.string.classify(name) + type.postfix
            };
        }.bind(this));

    names.forEach(function (x) {
        imports.push('import ' + x.name + ' from \'' + x.file + '\';');
        statements.push(this.appObj + '.' + x.name + ' = ' + x.name + ';');
    }.bind(this));
};

module.exports = EmberModuleAppender;
