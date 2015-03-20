export default Ember.Object.extend({
    init: function () {
        this.set('credentials', this.local.get('credentials'));
        this.addObserver('credentials', this, function () {
            this.local.set('credentials', this.get('credentials'));
        });
    }

  , user: function () {
        return this.get('credentials.user');
    }.property('credentials')

  , token: function () {
        return this.get('credentials.token');
    }.property('credentials')

  , noVerify : function () {
        return this.get('credentials.noVerify');
    }.property('credentials')

  , loggedIn : function () {
        return Boolean(this.get('credentials'));
    }.property('credentials')

  , login: function (data) {
        this.set('credentials', data);
    }

  , logout: function () {
        this.set('credentials', null);
    }
});
