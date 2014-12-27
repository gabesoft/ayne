import App from 'app';

App.SignupRoute = Ember.Route.extend({
    model: function () {
        return Ember.copy(ayne.user || {}, true);
    }
  , setupController : function (controller, model) {
        controller.resetErrors();
        controller.set('model', model);
    }
});

export default App.LoginRoute;
