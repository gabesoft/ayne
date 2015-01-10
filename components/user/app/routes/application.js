export default Ember.Route.extend({
    beforeModel: function (transition) {
        this.controllerFor('application').set('loggedIn', Boolean(localStorage.jwt));
    }
  , model: function () {
        var loggedIn = this.controllerFor('application').get('loggedIn');
        if (loggedIn) {
            return this.api.getProfile()
               .then(function (response) {
                    return {
                        profile : response.data
                      , user    : localStorage.user ? JSON.parse(localStorage.user) : null
                    }
                })
               .catch(function () { return {}; });
        } else {
            return {};
        }
    }
  , actions : {
        logout: function () {
            this.api.logout().finally(function () {
                delete localStorage.jwt;
                delete localStorage.user;
                this.controllerFor('application').set('loggedIn', false);
                this.transitionTo('login');
            }.bind(this));
        }
      , invalidateModel: function () {
            this.refresh();
        }
    }
});
