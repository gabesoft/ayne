'use strict';

var util   = require('util')
  , Plugin = require('broccoli-plugin');

util.inherits(Empty, Plugin);

function Empty () {
    if (!(this instanceof Empty)) {
        return new Empty();
    }
    Plugin.call(this, []);
}

Empty.prototype.build = function () {};

module.exports = Empty;
