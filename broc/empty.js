'use strict';

var util   = require('util')
  , Writer = require('broccoli-writer');

util.inherits(Empty, Writer);

function Empty () {
    if (!(this instanceof Empty)) {
        return new Empty();
    }
}

Empty.prototype.write = function () {};

module.exports = Empty;
