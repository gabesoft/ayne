import Api from 'services/api';
import LocalStore from 'services/local';

Ember.TextField.reopen({
    attributeBindings: [ 'aria-label' ]
});

Ember.RSVP.configure('onerror', function (error) {
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
    name       : 'services'
  , initialize : function (container, app) {
        app.register('services:local', LocalStore);
        app.inject('route', 'local', 'services:local');
        app.inject('controller', 'local', 'services:local');

        app.register('services:api', Api);
        app.inject('route', 'api', 'services:api');
        app.inject('controller', 'api', 'services:api');
    }
});
