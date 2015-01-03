import App from 'app';
import Api from '../mixins/api';

App.ApplicationRoute = Ember.Route.extend(Api, {
    beforeModel: function (transition) {
        this.controllerFor('application').set('loggedIn', Boolean(localStorage.jwt));
    }
  , model: function () {
        var self = this;
        return new Ember.RSVP.Promise(function (resolve, reject) {
            self.apiGet('/api/profile')
               .then(function (data) { resolve(data); })
               .fail(function () { resolve({}); });
        });
    }
  , actions : {
        logout: function () {
            this.apiLogout().always(function () {
                delete localStorage.jwt;
                this.controllerFor('application').set('loggedIn', false);
                this.transitionTo('login');
            });
        }
      , invalidateModel: function () {
            this.refresh();
        }
    }
});

export default App.ApplicationRoute;
