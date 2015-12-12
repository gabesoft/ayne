'use strict';

var fs = require('fs'),
    util = require('util'),
    path = require('path'),
    Plugin = require('broccoli-plugin');

util.inherits(FileRenamer, Plugin);

function FileRenamer(inputTree, options) {
    this.fileMap = options || {};
    Plugin.call(this, util.isArray(inputTree) ? inputTree : [inputTree], options);
}

FileRenamer.prototype.build = function () {
    var srcDir = this.inputPaths[0],
        destDir = this.outputPath;

    Object.keys(this.fileMap).forEach(function (p) {
        var oldPath = path.join(srcDir, p),
            newPath = path.join(destDir, this.fileMap[p]);
      fs.createReadStream(oldPath).pipe(fs.createWriteStream(newPath));
    }.bind(this));
};

module.exports = FileRenamer;
