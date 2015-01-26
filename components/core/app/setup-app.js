Ember.Application.initializer({
    name       : 'setup'
  , initialize : function (container, app) {
        var ayne = window.ayne || {};

        app.LOG_TRANSITIONS          = ayne.env !== 'production';
        app.LOG_MODULE_RESOLVER      = ayne.env !== 'production';
        app.LOG_VIEW_LOOKUPS         = ayne.env !== 'production';
        app.LOG_ACTIVE_GENERATION    = ayne.env !== 'production';
        app.MODEL_FACTORY_INJECTIONS = true;
    }
});
