import App from 'app';

App.SignupRoute = Ember.Route.extend({
    setupController : function (controller, model) {
        controller.set('model', model);
    },
    model: function () {
        return {};
    }
});

export default App.LoginRoute;
