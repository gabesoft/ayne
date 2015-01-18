'use strict';

var google       = require('googleapis')
  , gmail        = google.gmail('v1')
  , OAuth2Client = google.auth.OAuth2
  , path         = require('path')
  , configFile   = path.join(process.cwd(), 'gmail.json');

/**
 * Creates a new GmailApi object that can be used to
 * interact with the gmail api
 * @param {object} options - Object options
 * @param {string} options.configFile - Config file path
 */
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
    this.refreshToken = this.conf.get('refreshToken');

    this.oauth2Client = new OAuth2Client(
        this.clientId
      , this.clientSecret
      , this.redirectUrl
    );
}

/**
 * Creates a token url that can be used to get a refresh token
 * @param {Function} callback - Callback to return the results
 */
GmailApi.prototype.getTokenUrl = function (cb) {
    cb(null, this.oauth2Client.generateAuthUrl({
        access_type : 'offline'
      , scope       : this.scopes
    }));
};

/**
 * Gets the oauth access token and stores it in config
 * @param {Function} callback - Callback to return the results
 */
GmailApi.prototype.getAccessToken = function (cb) {
    this.oauth2Client.getToken(this.refreshToken, function (err, token) {
        if (err) { return cb(err); }

        this.conf.set('accesToken', token);
        this.conf.save();
        cb(null, token);
    }.bind(this));
};

/**
* Refreshes the access token
* @param {Function} callback - Callback to return the results
*/
GmailApi.prototype.refreshAccessToken = function (cb) {
    this.oauth2Client.refreshToken(function (err, token) {
        if (err) { return cb(err); }

        token.refresh_token = token.refresh_token || this.oauth2Client.credentials.refresh_token;
        this.conf.set('accessToken', token);
        this.conf.save();
        cb(null, token);
    });
};

/**
 * Sends an email
 * @param {object} options - Email options
 * @param {string} options.to - Destination email
 * @param {string} options.subject - Email subject
 * @param {string} options.contentType - Email content type (text/plain or text/html)
 * @param {string} options.body - Email body
 */
GmailApi.prototype.sendEmail = function (options, cb) {
    var message   = this.createMessage(options)
      , message64 = this.encodeMessage(message)
      , data      = {
            userId   : 'me'
          , format   : 'RAW'
          , resource : { raw: message64 }
        };

    if (this.conf.get('accessToken')) {
        this._sendEmail(data, cb);
    } else {
        this.getAccessToken(function (err) {
            if (err) {
                return cb(err);
            } else {
                this._sendEmail(data, cb);
            }
        }.bind(this));
    }
};

GmailApi.prototype._sendEmail = function  (data, cb) {
    this.oauth2Client.setCredentials(this.conf.get('accessToken'));
    data.auth = this.oauth2Client;
    gmail.users.messages.send(data, function (err, body, response) {
        if (err && err.code === 401) {
            this.refreshAccessToken(function (err) {
                if (err) {
                    return cb(err)
                } else {
                    this._sendEmail(data, cb);
                }
            }.bind(this));
        }  else {
            cb(err, body, response);
        }
    }.bind(this));
};

GmailApi.prototype.createMessage = function (data) {
    var lines = [];

    if (!data.to) {
        throw new Error('No email address specified');
    }

    lines.push('From: ' + '"me"');
    lines.push('To: ' + data.to);
    lines.push('Subject: ' + (data.subject || ''));
    lines.push('Content-Type: ' + (data.contentType || 'text/html; charset=utf-8'));
    lines.push('');
    lines.push(data.body || '');

    return lines.join('\r\n');
};

GmailApi.prototype.encodeMessage = function (message) {
    return (new Buffer(message))
       .toString('base64')
       .replace(/\//g, '_')
       .replace(/\+/g, '-');
};

module.exports.GmailApi = GmailApi;
