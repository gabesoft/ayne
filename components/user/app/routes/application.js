import App from 'app';
import Api from '../mixins/api';

App.ApplicationRoute = Ember.Route.extend(Api, {
    beforeModel: function (transition) {
        this.controllerFor('application').set('loggedIn', Boolean(localStorage.jwt));
    }
  , actions : {
        logout: function () {
            this.apiLogout().always(function () {
                delete localStorage.jwt;
                this.controllerFor('application').set('loggedIn', false);
                this.transitionTo('login');
            });
        }
    }
});

export default App.ApplicationRoute;
