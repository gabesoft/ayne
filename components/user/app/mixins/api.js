export default Ember.Mixin.create({
    apiRun: function (opts) {
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

  , apiPost: function (path, data) {
        return this.apiRun({ url: path , type: 'POST' , data: data });
    }

  , apiGet: function (path, query) {
        return this.apiRun({ url: path, type: 'GET', qs: query });
    }

  , apiSaveProfile: function (data) {
        return this.apiPost('/api/profile', data || this.get('model'));
    }

  , apiGetProfile: function () {
        return this.apiGet('/api/profile');
    }

  , apiLogout: function (data) {
        return this.apiPost('/api/logout');
    }

  , apiLogin: function (data) {
        return this.apiPost('/api/login', data || this.get('model'));
    }

  , apiSignup : function (data) {
        return this.apiPost('/api/signup', data || this.get('model'));
    }
});
