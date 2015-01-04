import App from 'app';

App.ApplicationRoute = Ember.Route.extend({
    beforeModel: function (transition) {
        this.controllerFor('application').set('loggedIn', Boolean(localStorage.jwt));
    }
  , model: function () {
        var loggedIn = this.controllerFor('application').get('loggedIn');
        if (loggedIn) {
            return this.api.getProfile()
               .then(function (response) { return response.data; })
               .catch(function () { return {}; });
        } else {
            return {};
        }
    }
  , actions : {
        logout: function () {
            this.api.logout().finally(function () {
                delete localStorage.jwt;
                this.controllerFor('application').set('loggedIn', false);
                this.transitionTo('login');
            }.bind(this));
        }
      , invalidateModel: function () {
            this.refresh();
        }
    }
});

export default App.ApplicationRoute;
