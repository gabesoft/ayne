import App from 'app';

App.LoginRoute = Ember.Route.extend({
    model: function () {
        return {
            email: 'test@gmail.com'
        };
    }
});

export default App.LoginRoute;
