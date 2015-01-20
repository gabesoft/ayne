export default Ember.Route.extend({
    beforeModel: function () {
        if (!ayne.locals.error) {
            this.auth.login(ayne.locals.data);
            this.intermediateTransitionTo('application');
            this.controllerFor('application').get('target').send('invalidateModel');
            this.transitionTo('profile.edit.password');
        }
    }
  , model: function () {
        return ayne.locals;
    }
});
