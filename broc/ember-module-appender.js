'use strict';

var fs = require('fs'),
    util = require('util'),
    ember = require('./ember-utils'),
    glob = require('glob'),
    path = require('path'),
    Plugin = require('broccoli-plugin');

util.inherits(EmberModuleAppender, Plugin);

function EmberModuleAppender(inputNode, options) {
    if (!(this instanceof EmberModuleAppender)) {
        return new EmberModuleAppender(inputNode, options);
    }
    Plugin.call(this, util.isArray(inputNode) ? inputNode : [inputNode], options);
    this.app = options.app || 'app';
    this.root = options.root || '';
    this.destFile = options.destFile || 'app-module-append.js';
    this.types = options.types || {
        controllers: {
            postfix: 'Controller',
            dir: 'controllers'
        },
        views: {
            postfix: 'View',
            dir: 'views'
        },
        routes: {
            postfix: 'Route',
            dir: 'routes'
        },
        components: {
            postfix: 'Component',
            dir: 'components'
        },
        router: {
            postfix: '',
            dir: '',
            files: 'router.js'
        }
    };
}

EmberModuleAppender.prototype.build = function () {
    var srcDir = this.inputPaths[0],
        destDir = this.outputPath;

    var imports = [],
        statements = [],
        text = null;

    imports.push('import _App from \'' + path.join(this.root, this.app) + '\';');
    imports.push('import appInit from \'' + path.join(this.root, 'app-init') + '\';');
    statements.push('var App = _App.create({});');
    statements.push('appInit(App);');

    Object.keys(this.types).forEach(function (type) {
        this.appendModules(this.types[type], srcDir, imports, statements);
    }.bind(this));

    text = imports.join('\n');
    text = text + '\n' + statements.join('\n');

    fs.writeFileSync(path.join(destDir, this.destFile), text);
};

EmberModuleAppender.prototype.appendModules = function (type, dir, imports, statements) {
    var gopts = {
        nomount: true,
        cwd: dir,
        root: dir
    };

    var files = glob.sync(path.join(this.root, type.dir, type.files || '**/*.js'), gopts),
        names = files.map(function (file) {
            var name = file
                    .replace(this.root, '')
                    .replace(new RegExp(type.dir + '/'), '')
                    .replace(/\.js$/, '')
                    .replace(/\//g, '-');
            return {
                file: file.replace(/\.js$/, ''),
                name: ember.string.classify(name) + type.postfix
            };
        }.bind(this));

    names.forEach(function (x) {
        imports.push('import ' + x.name + ' from \'' + x.file + '\';');
        statements.push('App.' + x.name + ' = ' + x.name + ';');
    }.bind(this));
};

module.exports = EmberModuleAppender;