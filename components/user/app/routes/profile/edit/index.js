export default Ember.Route.extend({
    beforeModel: function () {
        this.transitionTo('profile.edit.details');
    }
});
