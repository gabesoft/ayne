export default Ember.Mixin.create({
    beforeModel : function (transition) {
        if (!this.controllerFor('application').get('loggedIn')) {
            this.controllerFor('login').set('prevTransition', transition);
            this.transitionTo('login');
        }
    }
});
