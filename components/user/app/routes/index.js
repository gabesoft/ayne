export default Ember.Route.extend({
    beforeModel: function () {
        var loggedIn = this.auth.get('loggedIn');
        if (loggedIn) {
            this.transitionTo('profile.view');
        } else {
            this.transitionTo('login');
        }
    }
});
