export default Ember.Mixin.create({
    apiPost: function (path, data) {
        return Ember.$.ajax({
            url     : path
          , type    : 'POST'
          , data    : data
          , context : this
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
