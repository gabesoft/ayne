import App from 'app';
import Api from '../mixins/api';

App.ProfileIndexRoute = Ember.Route.extend({
    beforeModel: function () {
        this.transitionTo('profile.view');
    }
});

App.ProfileEditRoute = Ember.Route.extend(Api, {
    beforeModel : function (transition) {
        if (!this.controllerFor('application').get('loggedIn')) {
            this.controllerFor('login').set('prevTransition', transition);
            this.transitionTo('login');
        }
    }
  , model : function () {
        return this.apiGet('/api/profile')
           .then(function (response) { return response.data; })
           .catch(function (response) {
                if (response.json.statusCode === 401) {
                    this.transitionTo('login');
                }
            }.bind(this));
    }
});

App.ProfileViewRoute = Ember.Route.extend(Api, {
    beforeModel : function (transition) {
        if (!this.controllerFor('application').get('loggedIn')) {
            this.controllerFor('login').set('prevTransition', transition);
            this.transitionTo('login');
        }
    }
  , model : function () {
        return this.apiGet('/api/profile')
           .then(function (response) { return response.data; })
           .catch(function (response) {
                if (response.json.statusCode === 401) {
                    this.transitionTo('login');
                } else {
                    throw response.json;
                }
            }.bind(this));
    }
});

export default App.ProfileRoute;
