import App from 'app';

App.LoginRoute = Ember.Route.extend({
    setupController : function (controller, model) {
        controller.set('model', model);
    },
    model: function () {
        return {
            email: 'test@gmail.com'
        };
    }
});

export default App.LoginRoute;
