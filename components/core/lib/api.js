'use strict';

var request = require('request')
  , conf    = require('../../../config/store')
  , baseUrl = conf.get('api:url');

function partsToUrlPath (parts) {
    parts = parts || [];
    return '/' + parts
       .map(function (p) {
            return p.replace(/^\/|\/$/g, '');
        })
       .join('/');
}

function options (path, method, data) {
    var opts = {
            uri    : baseUrl + path
          , method : method
          , json   : true
        };

    if (method !== 'GET') {
        opts.body = data;
    } else {
        opts.qs = toQuery(data);
    }

    return opts;
}

function toQuery (data) {
    return Object.keys(data || {}).reduce(function (acc, k) {
        var value = data[k];
        if (typeof value === 'string') {
            acc[k] = value;
        } else if (typeof value !== 'undefined') {
            acc[k] = JSON.stringify(data[k]);
        }
        return acc;
    }, {});
}

function makeRequest(path, method, data, cb) {
    if (typeof data === 'function') {
        cb   = data;
        data = {};
    }
    if (Array.isArray(path)) {
        path = partsToUrlPath(path);
    }
    request(options(path, method, data), function (err, response, body) {
        if (body.statusCode && +body.statusCode >= 400) {
            cb(err || body, response, null);
        } else {
            cb(err, response, body);
        }
    });
}

module.exports = {
    post  : function (path, data, cb) { makeRequest(path, 'POST', data, cb); }
  , put   : function (path, data, cb) { makeRequest(path, 'PUT', data, cb); }
  , get   : function (path, data, cb) { makeRequest(path, 'GET', data, cb); }
  , del   : function (path, data, cb) { makeRequest(path, 'DELETE', data, cb); }
  , patch : function (path, data, cb) { makeRequest(path, 'PATCH', data, cb); }
};
