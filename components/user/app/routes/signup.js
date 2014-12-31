import App from 'app';

App.SignupRoute = Ember.Route.extend({
    model: function () {
        return this.controllerFor('login').get('model') || {};
    }
  , setupController : function (controller, model) {
        controller.resetErrors();
        controller.set('model', model);
    }
});

export default App.LoginRoute;
