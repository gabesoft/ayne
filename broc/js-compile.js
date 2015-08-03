'use strict';

var pickFiles = require('broccoli-static-compiler'),
    templateCompiler = require('./ember-template-compiler'),
    path = require('path'),
    glob = require('glob'),
    touch = require('./touch'),
    jshintTree = require('broccoli-jshint'),
    moduleAppender = require('./ember-module-appender'),
    moduleCompiler = require('broccoli-es6-module-transpiler'),
    concatenate = require('broccoli-concat'),
    uglifyJs = require('broccoli-uglify-sourcemap'),
    empty = require('./empty'),
    mergeTrees = require('broccoli-merge-trees');

module.exports = function (opts) {
    function hasTemplates() {
        return glob.sync(path.join(opts.name, 'app', '**/*.hbs'), {
            nomount: false,
            cwd: opts.root,
            root: opts.root
        }).length > 0;
    }

    function hasModules() {
        return glob.sync(path.join(opts.name, 'app', '**/*.js'), {
            nomount: false,
            cwd: opts.root,
            root: opts.root
        }).length > 0;
    }

    function jshintModules() {
        if (!hasModules() || opts.minify) {
            return empty();
        }

        var modules = pickFiles(opts.root, {
            srcDir: path.join(opts.name, 'app'),
            destDir: '/'
        });

        return jshintTree(modules, {
            log: true,
            disableTestGenerator: true
        });
    }

    function compileVendorJs() {
        var ext = opts.minify ? '.min.js' : '.js',
            emberExt = opts.minify ? '.prod.js' : '.debug.js',
            flash = pickFiles(opts.bower, {
                srcDir: 'zeroclipboard/dist',
                destDir: '/',
                files: ['*.swf']
            }),
            bower = concatenate(opts.bower, {
                outputFile: '/vendor.js',
                inputFiles: [
                    'jquery/dist/jquery' + ext
                    , 'blueimp-md5/js/md5' + ext
                    , 'fastclick/lib/fastclick.js'
                    , 'modernizr/modernizr.js'
                    , 'moment/min/moment.min.js'
                    , 'foundation/js/foundation' + ext
                    , 'ember/ember' + emberExt
                    , 'typeahead.js/dist/typeahead.bundle' + ext
                    , 'jquery-textcomplete/dist/jquery.textcomplete' + ext
                    , 'bootstrap-tagsinput/dist/bootstrap-tagsinput' + ext
                    , 'zeroclipboard/dist/ZeroClipboard' + ext
                ]
            });

        return mergeTrees([flash, bower]);
    }

    function compileTemplates() {
        if (!hasTemplates()) {
            return touch('/templates/app-templates.js');
        }

        var core = pickFiles(opts.root, {
            srcDir: '/',
            destDir: '/templates',
            files: ['core/app/partials/**/*.hbs', 'core/app/templates/**/*.hbs']
        });
        var templ = pickFiles(opts.root, {
            srcDir: path.join(opts.name, 'app'),
            destDir: '/templates',
            files: ['**/*.hbs']
        });
        var compiled = templateCompiler(mergeTrees([core, templ]));

        return pickFiles(compiled, {
            srcDir: '/templates',
            destDir: '/',
            files: ['**/*.js']
        });
    }

    function compileJsModules() {
        if (!hasModules()) {
            return touch(['/app-compiled.js', '/app-compiled.js.map']);
        }

        var core = pickFiles(opts.root, {
            srcDir: '/',
            destDir: '/',
            files: ['core/app/**/*.js', path.join('core', 'app', '.jshintrc')]
        });
        var modules = pickFiles(opts.root, {
            srcDir: '/',
            destDir: '/',
            files: [
                path.join(opts.name, 'app/**/*.js'),
                path.join(opts.name, 'app', '.jshintrc')
            ]
        });
        var moduleSetup = moduleAppender(modules, {
            root: path.join(opts.name, 'app'),
            destFile: 'app-module-setup.js'
        });
        var all = [modules, moduleSetup];

        if (opts.name !== 'core') {
            all.unshift(core);
        }

        return moduleCompiler(mergeTrees(all), {
            formatter: 'bundle',
            output: '/app-compiled.js'
        });
    }

    function combineAssetsJs() {
        var templates = compileTemplates(),
            modules = compileJsModules(),
            jshint = jshintModules(),
            vendor = compileVendorJs(),
            libMerged = mergeTrees([templates, modules]),
            lib = concatenate(libMerged, {
                inputFiles: ['*/**/*.js', '**/*.js'],
                outputFile: '/app.js'
            }),
            map = pickFiles(modules, {
                srcDir: '/',
                destDir: '/',
                files: ['**/*.map']
            });

        if (opts.minify) {
            lib = uglifyJs(lib, {
                mangle: true,
                compress: {
                    sequences: true,
                    dead_code: true,
                    conditionals: true,
                    booleans: true,
                    unused: true,
                    if_return: true,
                    join_vars: true,
                    drop_console: true,
                    drop_debugger: true
                },
                sourceMapConfig: {
                    enabled: !opts.minify,
                    extensions: ['js']
                }
            });

            vendor = uglifyJs(vendor, {
                mangle: false,
                compress: false,
                sourceMapConfig: {
                    enabled: !opts.minify,
                    extensions: ['js']
                }
            });
        }

        return mergeTrees([vendor, lib, map, jshint]);
    }

    return pickFiles(combineAssetsJs(), {
        srcDir: '/',
        destDir: path.join(opts.name, 'js')
    });
};