import App from 'app';

App.SignupRoute = Ember.Route.extend({
    model: function () {
        return Ember.copy(ayne.user || {}, true);
    }
});

export default App.LoginRoute;
