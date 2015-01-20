export default Ember.Route.extend({
    model: function () {
        var loggedIn = this.auth.get('loggedIn');
        if (loggedIn) {
            return this.api.getProfile()
               .then(function (response) {
                    return {
                        profile : response.data
                      , user    : this.auth.get('user')
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
                this.auth.logout();
                this.transitionTo('login');
            }.bind(this));
        }
      , invalidateModel: function () {
            this.refresh();
        }
    }
});
