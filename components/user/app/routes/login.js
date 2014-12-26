import App from 'app';

App.LoginRoute = Ember.Route.extend({
    model: function () {
        return ayne.user || {};
    }
});

export default App.LoginRoute;
