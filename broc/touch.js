'use strict';

var fs = require('fs'),
    util = require('util'),
    mkdirp = require('mkdirp'),
    path = require('path'),
    Plugin = require('broccoli-plugin');

util.inherits(Touch, Plugin);

function Touch(files, options) {
    if (!(this instanceof Touch)) {
        return new Touch(files, options);
    }
    this.options = options || {};
    this.files = util.isArray(files) ? files : [files];
    Plugin.call(this, []);
}

Touch.prototype.build = function () {
    var destDir = this.outputPath;

    this.files.forEach(function (file) {
        var filePath = path.join(destDir, file),
            fileName = path.basename(filePath),
            fileData = this.options[file] || this.options[fileName] || '';

        mkdirp.sync(path.dirname(filePath));
        fs.writeFileSync(filePath, fileData, { flag: 'wx' });
    }.bind(this));
};

module.exports = Touch;