export default Ember.Mixin.create({
    getHeaders : function () {
        var fp    = new Fingerprint({ canvas: true, screen_resolution : true })
          , token = 'todo-get-the-real-token-2';

        return {
            'Browser-Fingerprint' : fp.get()
          , 'Authorization'       : 'Bearer ' + token
        }
    }

  , apiPost: function (path, data) {
        console.log(this.getHeaders());
        return Ember.$.ajax({
            url     : path
          , type    : 'POST'
          , data    : data
          , context : this
          , headers : this.getHeaders()
        });
    }

  , apiGet: function (path, query) {
        return Ember.$.ajax({
            url     : path
          , type    : 'GET'
          , qs      : query || {}
          , context : this
          , headers : this.getHeaders()
        });
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
