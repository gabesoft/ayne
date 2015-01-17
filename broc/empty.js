'use strict';

var fs     = require('fs')
  , util   = require('util')
  , mkdirp = require('mkdirp')
  , path   = require('path')
  , Writer = require('broccoli-writer');

util.inherits(Empty, Writer);

function Empty () {
    if (!(this instanceof Empty)) {
        return new Empty();
    }
}

Empty.prototype.write = function (readTree, destDir) {};

module.exports = Empty;
