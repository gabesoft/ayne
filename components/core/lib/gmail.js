'use strict';

var google       = require('googleapis')
  , gmail        = google.gmail('v1')
  , OAuth2Client = google.auth.OAuth2
  , path         = require('path')
  , configFile   = path.join(process.cwd(), 'gmail.json');

function GmailApi (options) {
    if (!(this instanceof GmailApi)) {
        return new GmailApi(options);
    }

    var nconf = require('nconf');

    this.options    = options || {};
    this.configFile = this.options.configFile || configFile;

    nconf.file('gmail', this.configFile);

    this.conf         = nconf;
    this.clientId     = this.conf.get('clientId');
    this.clientSecret = this.conf.get('clientSecret');
    this.redirectUrl  = this.conf.get('redirectUrl');
    this.scopes       = this.conf.get('scopes');

    this.oauth2Client = new OAuth2Client(
        this.clientId
      , this.clientSecret
      , this.redirectUrl
    );
}

GmailApi.prototype.tokenUrl = function (cb) {
    cb(null, this.oauth2Client.generateAuthUrl({
        access_type : 'offline'
      , scope       : this.scopes
    }));
};

GmailApi.prototype.getTokens = function (cb) {
    this.refreshToken = this.refreshToken || this.conf.get('refreshToken');
    this.oauth2Client.getToken(this.refreshToken, function (err, tokens) {
        if (err) { return cb(err); }

        this.conf.set('tokens', tokens);
        this.conf.save();
        cb(null, tokens);
    });
};

GmailApi.prototype.sendEmail = function (options, cb) {
    var message   = this.createMessage(options)
      , message64 = this.encodeMessage(message);

    this.oauth2Client.setCredentials(this.conf.get('tokens'));
    gmail.users.messages.send({
        userId: 'me'
      , auth: this.oauth2Client
      , format: 'RAW'
      , resource: { raw: message64 }
    }, cb);
};

GmailApi.prototype.createMessage = function (data) {
    var lines = [];

    lines.push('From: ' + '"me"');
    lines.push('To: ' + data.to);
    lines.push('Subject: ' + data.subject);
    lines.push('Content-Type: ' + (data.contentType || 'text/html; charset=utf-8'));
    lines.push('');
    lines.push(data.body);

    return lines.join('\r\n');
};

GmailApi.prototype.encodeMessage = function (message) {
    return (new Buffer(message))
       .toString('base64')
       .replace(/\//g, '_')
       .replace(/\+/g, '-');
};

module.exports.GmailApi = GmailApi;
