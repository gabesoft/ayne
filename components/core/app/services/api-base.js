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
        var qs = query ? '?' + Ember.$.param(query) : '';
        return this.run({ url: path + qs, type: 'GET' });
    }

  , runDelete: function (path) {
        return this.run({ url: path, type: 'DELETE' });
    }
});
