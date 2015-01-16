export default Ember.Route.extend({
    model: function () {
        return this.controllerFor('login').get('model') || {};
    }
  , setupController : function (controller, model) {
        controller.setup(model);
    }
});
