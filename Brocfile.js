'use strict';

var mergeTrees = require('broccoli-merge-trees'),
    broccoliSource = require('broccoli-source'),
    UnwatchedDir = broccoliSource.UnwatchedDir,
    minify = process.env.NODE_ENV === 'production' || process.env.BROCCOLI_ENV === 'production',
    path = require('path'),
    glob = require('glob'),
    buildJS = require('./broc/js-compile'),
    buildSASS = require('./broc/sass-compile'),
    components = path.join(__dirname, 'components'),
    bower = new UnwatchedDir(path.join(__dirname, 'bower_components')),
    node = new UnwatchedDir(path.join(__dirname, 'node_modules')),
    dirs = glob.sync(components + '/*'),
    trees = [];

dirs.forEach(function (dir) {
    var opts = {
        minify: minify,
        name: path.basename(dir),
        path: dir,
        root: components,
        bower: bower,
        node: node
    };

    trees.push(mergeTrees([
        buildJS(opts),
        buildSASS(opts)
    ]));
});

module.exports = mergeTrees(trees);