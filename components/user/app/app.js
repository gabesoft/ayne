Ember.TextField.reopen({
    attributeBindings: [ 'aria-label' ]
});

Ember.RSVP.configure('oneerror', function (error) {
    if (error instanceof Error) {
        Ember.Logger.assert(false, error);
        Ember.Logger.error(error.stack);
    }
});

Ember.Application.initializer({
    name       : 'setup'
  , initialize : function (container, app) {
        app.LOG_TRANSITIONS       = ayne.env !== 'production';
        app.LOG_MODULE_RESOLVER   = ayne.env !== 'production';
        app.LOG_VIEW_LOOKUPS      = ayne.env !== 'production';
        app.LOG_ACTIVE_GENERATION = ayne.env !== 'production';
    }
});

Ember.Application.initializer({
    name       : 'ayne'
  , initialize : function (container, app) {
       // TODO: initialize the ayne object here
    }
});

export default Ember.Application.create({});
