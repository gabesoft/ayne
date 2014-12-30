export default Ember.Mixin.create({
    apiPost: function (path, data) {
        var fp = new Fingerprint({ canvas: true, screen_resolution : true });

        return Ember.$.ajax({
            url     : path
          , type    : 'POST'
          , data    : data
          , context : this
          , headers : {
                'browser-fingerprint': fp.get()
              //, 'jwt-token' : store.get()
            }
        });
    },

    apiGet: function (path, query) {
        return Ember.$.ajax({
            url     : path
          , type    : 'GET'
          , qs      : query
          , context : this
        })
    },

    apiLogin: function (data) {
        return this.apiPost('/api/login', data || this.get('model'));
    },

    apiSignup : function (data) {
        return this.apiPost('/api/signup', data || this.get('model'));
    }
});
