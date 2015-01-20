export default Ember.Route.extend({
    beforeModel: function () {
        if (ayne.locals.resetPasswordError) {
            this.transitionTo('reset-password-failure');
        } else if (ayne.locals.resetPasswordCredentials) {
            this.auth.login(ayne.locals.resetPasswordCredentials);
            this.intermediateTransitionTo('application');
            this.controllerFor('application').get('target').send('invalidateModel');
            this.controllerFor('profile.edit.password').set('nextRoute', 'reset-password-success');
            this.transitionTo('profile.edit.password');
        } else {
            this.transitionTo('profile.view');
        }
    }
});
