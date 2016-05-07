'use strict';

var Funnel = require('broccoli-funnel'),
    path = require('path'),
    glob = require('glob'),
    touch = require('./touch'),
    RenameFile = require('./file-renamer'),
    CompileSass = require('broccoli-sass'),
    MergeTrees = require('broccoli-merge-trees');

module.exports = function (opts) {
    function hasSass() {
        return glob.sync(path.join(opts.name, 'styles', 'app.scss'), {
            nomount: false,
            cwd: opts.root,
            root: opts.root
        }).length > 0;
    }

    function processSass() {
        if (!hasSass()) {
            return touch(path.join(opts.name, 'css', 'app.css'));
        }

        var foundation = new Funnel(opts.bower, {
            srcDir: '/foundation/scss',
            destDir: '/foundation'
        });
        var fontAwesome = new Funnel(opts.bower, {
            srcDir: '/font-awesome/scss',
            destDir: '/font-awesome'
        });
        var roboto = new Funnel(opts.bower, {
            srcDir: '/roboto-fontface',
            destDir: '/roboto-fontface',
            include:  ['**/*.scss']
        });
        var hljs = new Funnel(opts.node, {
            srcDir: '/highlight.js/styles',
            destDir: '/',
            include: ['foundation.css']
        });
        var hljsSass = new RenameFile(hljs, {
            'foundation.css': '_hljs-foundation.scss'
        });
        var tagsInput = new Funnel(opts.bower, {
            srcDir: '/bootstrap-tagsinput/dist',
            destDir: '/',
            include: ['bootstrap-tagsinput.css']
        });
        var tagsInputSass = new RenameFile(tagsInput, {
            'bootstrap-tagsinput.css': '_bootstrap-tagsinput.scss'
        });

        var root = new Funnel(opts.root, {
            srcDir: '/',
            destDir: '/',
            include: ['**/*.scss']
        });

        var compiled = new CompileSass(
            [root, foundation, fontAwesome, roboto, hljsSass, tagsInputSass],
            path.join(opts.name, 'styles', 'app.scss'),
            '/app.css', {
                sourceMap: !opts.minify,
                sourceComments: opts.minify ? false : 'map',
                outputStyle: opts.minify ? 'compressed' : 'inline'
            });

        return new Funnel(compiled, {
            srcDir: '/',
            destDir: path.join(opts.name, 'css')
        });
    }

    function processFonts() {
        var fontAwesome = new Funnel(opts.bower, {
            srcDir: '/font-awesome/fonts',
            destDir: path.join(opts.name, '/css/fonts')
        });
        var roboto = new Funnel(opts.bower, {
            srcDir: '/roboto-fontface/fonts',
            destDir: path.join(opts.name, '/css/fonts')
        });

        return new MergeTrees([fontAwesome, roboto]);
    }

    return new MergeTrees([processSass(), processFonts()]);
};
