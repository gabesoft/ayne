export default Ember.Route.extend({
    model: function () {
        return this.controllerFor('signup').get('model') || {};
    }
  , setupController : function (controller, model) {
        controller.resetErrors();
        controller.set('model', model);
    }
});
