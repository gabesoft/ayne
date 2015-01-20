export default Ember.Object.extend({
    init: function () {
        var auth = this.auth;

        Ember.$.ajaxSetup({
            beforeSend: function (xhr) {
                var fp          = new Fingerprint({ canvas: true, screen_resolution : true })
                  , token       = auth.get('token')
                  , fingerprint = !auth.get('noFingerprint');

                if (fingerprint) {
                    xhr.setRequestHeader('Browser-Fingerprint', fp.get());
                }
                if (token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                }
            }
        });
    }

  , run: function (opts) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
            Ember.$
               .ajax(opts)
               .then(function (data, status, jqXHR) {
                    resolve({
                        data   : data
                      , status : status
                      , jqXHR  : jqXHR
                      , json   : jqXHR.responseJSON || {}
                    });
                }, function (jqXHR, status, error) {
                    reject({
                        error  : error
                      , status : status
                      , jqXHR  : jqXHR
                      , json   : jqXHR.responseJSON || {}
                    });
                });
        });
    }

  , runPost: function (path, data) {
        return this.run({ url: path , type: 'POST' , data: data });
    }

  , runGet: function (path, query) {
        return this.run({ url: path, type: 'GET', qs: query });
    }

  , resetPassword: function (data) {
        return this.runPost('/api/email/reset-password', data);
    }

  , saveProfile: function (data) {
        return this.runPost('/api/profile', data);
    }

  , setPassword: function (data) {
        return this.runPost('/api/password', data);
    }

  , getProfile: function () {
        return this.runGet('/api/profile');
    }

  , logout: function () {
        return this.runPost('/api/logout');
    }

  , login: function (data) {
        return this.runPost('/api/login', data);
    }

  , signup : function (data) {
        return this.runPost('/api/signup', data);
    }

  , checkDisplayName: function (name) {
        return this.runGet('/api/username/check/' + encodeURIComponent(name));
    }
});
