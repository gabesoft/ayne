import App from 'app';

App.LoginRoute = Ember.Route.extend({
    model: function () {
        return {};
    }
  , setupController : function (controller, model) {
        controller.resetErrors();
        controller.set('model', model);
    }
});

export default App.LoginRoute;
