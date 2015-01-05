export default Ember.Route.extend({
    model: function () {
        return {};
    }
  , setupController : function (controller, model) {
        controller.resetErrors();
        controller.set('model', model);
    }
});
