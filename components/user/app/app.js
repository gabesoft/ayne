import Api from 'services/api';
//import Resolver from 'ember/resolver';
import Resolver from 'shim';

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

var App = Ember.Application.extend({
        Resolver     : Resolver
      , modulePrefix : 'app'
    });

//App.register('services:api', Api);

//App.inject('route', 'api', 'services:api');
//App.inject('controller', 'api', 'services:api');

export default App;
