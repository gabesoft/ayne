'use strict';

var fs     = require('fs')
  , util   = require('util')
  , mkdirp = require('mkdirp')
  , path   = require('path')
  , Writer = require('broccoli-writer');

util.inherits(Touch, Writer);

function Touch (files) {
    if (!(this instanceof Touch)) {
        return new Touch(files);
    }
    this.files = Array.isArray(files) ? files : [ files ];
}

Touch.prototype.write = function (readTree, destDir) {
    this.files.forEach(function (file) {
        var full = path.join(destDir, file)
          , dest = path.dirname(full);

        mkdirp.sync(dest);
        fs.writeFileSync(full, '', { flag: 'wx' });
    });
};

module.exports = Touch;
