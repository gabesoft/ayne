import App from 'app';

App.ProfileEditRoute = Ember.Route.extend({
    beforeModel : function (transition) {
        if (!this.controllerFor('application').get('loggedIn')) {
            this.controllerFor('login').set('prevTransition', transition);
            this.transitionTo('login');
        }
    }
  , model : function () {
        return this.api.getProfile()
           .then(function (response) { return response.data; })
           .catch(function (response) {
                if (response.json.statusCode === 401) {
                    this.transitionTo('login');
                }
            }.bind(this));
    }
});