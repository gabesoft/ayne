'use strict';

var Funnel = require('broccoli-funnel'),
    TemplateCompiler = require('./ember-template-compiler'),
    path = require('path'),
    glob = require('glob'),
    Touch = require('./touch'),
    jshintTree = require('broccoli-jshint'),
    ModuleAppender = require('./ember-module-appender'),
    Babel = require('broccoli-babel-transpiler'),
    Concat = require('broccoli-sourcemap-concat'),
    uglifyJs = require('broccoli-uglify-sourcemap'),
    empty = require('./empty'),
    MergeTrees = require('broccoli-merge-trees');

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

        var modules = new Funnel(opts.root, {
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
            flash = new Funnel(opts.bower, {
                srcDir: 'zeroclipboard/dist',
                destDir: '/',
                include: ['*.swf']
            }),
            loaderPath = path.dirname(require.resolve('loader.js')),
            loaderNode = new Funnel(loaderPath, {
                include: ['loader.js'],
                destDir: '/'
            }),
            vendorNode = new MergeTrees([ opts.bower, loaderNode ]),
            vendor = new Concat(vendorNode, {
                outputFile: '/vendor.js',
                inputFiles: [
                    'loader.js',
                    'jquery/dist/jquery' + ext,
                    'blueimp-md5/js/md5' + ext,
                    'fastclick/lib/fastclick.js',
                    'modernizr/modernizr.js',
                    'moment/min/moment.min.js',
                    'foundation/js/foundation' + ext,
                    'ember/ember' + emberExt,
                    'typeahead.js/dist/typeahead.bundle' + ext,
                    'jquery-textcomplete/dist/jquery.textcomplete' + ext,
                    'bootstrap-tagsinput/dist/bootstrap-tagsinput' + ext,
                    'zeroclipboard/dist/ZeroClipboard' + ext
                ]
            });

        return new MergeTrees([vendor, flash]);
    }

    function compileTemplates() {
        if (!hasTemplates()) {
            return new Touch('/templates/app-templates.js');
        }

        var core = new Funnel(opts.root, {
            srcDir: '/',
            destDir: '/templates',
            include: ['core/app/partials/**/*.hbs', 'core/app/templates/**/*.hbs']
        });
        var templ = new Funnel(opts.root, {
            srcDir: path.join(opts.name, 'app'),
            destDir: '/templates',
            include: ['**/*.hbs']
        });
        var compiled = new TemplateCompiler(new MergeTrees([core, templ]));

        return new Funnel(compiled, {
            srcDir: '/templates',
            destDir: '/',
            include: ['**/*.js']
        });
    }

    function compileJsModules() {
        if (!hasModules()) {
            return new Touch(['/app-compiled.js', '/app-compiled.js.map']);
        }

        var core = new Funnel(opts.root, {
            srcDir: '/',
            destDir: '/',
            include: ['core/app/**/*.js', path.join('core', 'app', '.jshintrc')],
            exclude: [ '.#*' ]
        });
        var modules = new Funnel(opts.root, {
            srcDir: '/',
            destDir: '/',
            include: [
                path.join(opts.name, 'app/**/*.js'),
                path.join(opts.name, 'app', '.jshintrc')
            ],
            exclude: [ '.#*' ]
        });
        var moduleSetup = new ModuleAppender(modules, {
            root: path.join(opts.name, 'app'),
            destFile: 'app-module-setup.js'
        });

        var appRun = new Touch('app-module-setup-run.js', {
            'app-module-setup-run.js': 'require("app-module-setup", []);'
        });

        var allModules = [modules, moduleSetup];

        if (opts.name !== 'core') {
            allModules.unshift(core);
        }

        var compiled = new Babel(new MergeTrees(allModules), {
            stage: 0,
            moduleIds: true,
            modules: 'amd',
            highlightCode: false
        });

        return new Concat(new MergeTrees([ compiled, appRun ]), {
            inputFiles: ['**/*.js'],
            footerFiles: [ 'app-module-setup-run.js' ],
            outputFile: '/app-compiled.js'
        });
    }

    function combineAssetsJs() {
        var templates = compileTemplates(),
            modules = compileJsModules(),
            jshint = jshintModules(),
            vendor = compileVendorJs(),
            libMerged = new MergeTrees([templates, modules]),
            lib = new Concat(libMerged, {
                inputFiles: ['*/**/*.js', '**/*.js'],
                outputFile: '/app.js'
            }),
            map = new Funnel(modules, {
                srcDir: '/',
                destDir: '/',
                include: ['**/*.map']
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

        return new MergeTrees([vendor, lib, map, jshint]);
    }

    return new Funnel(combineAssetsJs(), {
        srcDir: '/',
        destDir: path.join(opts.name, 'js')
    });
};
