export default Ember.Route.extend({
    beforeModel: function (transition) {
        this.controllerFor('application').set('loggedIn', this.local.has('credentials'));
    }
  , model: function () {
        var loggedIn = this.controllerFor('application').get('loggedIn');
        if (loggedIn) {
            return this.api.getProfile()
               .then(function (response) {
                    var cred = this.local.getDefaultValue('credentials', { user: {} });
                    return {
                        profile : response.data
                      , user    : cred.user
                    };
                }.bind(this))
               .catch(function () { return {}; });
        } else {
            return {};
        }
    }
  , actions : {
        logout: function () {
            this.api.logout().finally(function () {
                this.local.remove('credentials');
                this.controllerFor('application').set('loggedIn', false);
                this.transitionTo('login');
            }.bind(this));
        }
      , invalidateModel: function () {
            this.refresh();
        }
    }
});
