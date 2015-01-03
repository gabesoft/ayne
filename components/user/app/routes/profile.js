import App from 'app';

App.ProfileIndexRoute = Ember.Route.extend({
    beforeModel: function () {
        this.transitionTo('profile.view');
    }
});
