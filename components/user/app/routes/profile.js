import App from 'app';
import Api from '../mixins/api';

App.ProfileIndexRoute = Ember.Route.extend({
    beforeModel: function () {
        this.transitionTo('profile.view');
    }
});

App.ProfileEditRoute = Ember.Route.extend(Api, {
    model : function () {
        return this.apiGet('/api/profile');
    }
});

export default App.ProfileRoute;
