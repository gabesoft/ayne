export default Ember.Route.extend({
    beforeModel: function () {
        if (!ayne.locals.error) {
            this.local.set('credentials', ayne.locals.data);
            this.controllerFor('application').set('loggedIn', true);

            this.intermediateTransitionTo('application');
            this.controllerFor('application').get('target').send('invalidateModel');
            this.transitionTo('profile.edit.password');
        }
    }
  , model: function () {
        return ayne.locals;
    }
});
