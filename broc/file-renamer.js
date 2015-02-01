'use strict';

var fs     = require('fs')
  , util   = require('util')
  , glob   = require('glob')
  , path   = require('path')
  , Writer = require('broccoli-writer');

util.inherits(FileRenamer, Writer);

function FileRenamer (inputTree, options) {
    if (!(this instanceof FileRenamer)) {
        return new FileRenamer(inputTree, options);
    }
    this.fileMap = options || {};
    this.inputTree = inputTree;
}

FileRenamer.prototype.write = function (readTree, destDir) {
    return readTree(this.inputTree)
       .then(function (srcDir) {
            Object.keys(this.fileMap).forEach(function (p) {
                var oldPath = path.join(srcDir, p)
                  , newPath = path.join(destDir, this.fileMap[p]);
                fs.renameSync(oldPath, newPath);
            }.bind(this));
        }.bind(this));
};

module.exports = FileRenamer;
