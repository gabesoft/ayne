export default Ember.Object.extend({
    init: function () {
        var auth = this.auth;

        Ember.$.ajaxSetup({
            beforeSend: function (xhr) {
                var token = auth.get('token');

                if (token) {
                    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
                }
            }
        });
    }

  , run: function (opts) {
        return new Ember.RSVP.Promise(function (resolve, reject) {
            if (opts && opts.type !== 'GET') {
                opts.headers = { 'Content-type': 'application/json' };
                opts.data = JSON.stringify(opts.data || {});
            }
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
