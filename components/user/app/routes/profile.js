import App from 'app';
import Api from '../mixins/api';

App.ProfileIndexRoute = Ember.Route.extend({
    beforeModel: function () {
        this.transitionTo('profile.view');
    }
});

App.ProfileRoute = Ember.Route.extend(Api, {
    beforeModel : function (transition) {
        if (!this.controllerFor('application').get('loggedIn')) {
            console.log('not logged in');
            this.controllerFor('login').set('prevTransition', transition);
            this.transitionTo('login');
        }
    }
  , model : function () {
        return this.apiGet('/api/profile')
           .fail(function (jqXHR, status, error) {
                if (jqXHR.status === 401) {
                    this.transitionTo('login');
                }
            });
    }
});

export default App.ProfileRoute;
