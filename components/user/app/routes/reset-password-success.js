export default Ember.Route.extend({
    actions: {
        redirectToProfile: function () {
            this.transitionTo('profile.view');
        }
    }
});
