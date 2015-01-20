export default Ember.Route.extend({
    actions: {
        redirectToForgot: function () {
            this.transitionTo('forgot-password');
        }
    }
});
