import Auth from 'services/auth';
import Api from 'services/api';
import LocalStore from 'services/local';

/**
* Contine the promise chain only if the value returned from the
* last then call is a non falsy value
* @param {function} onFulfillment
* @param {function} onRejection
* @param {string} label - optional string for labeling the promise
*/
Ember.RSVP.Promise.prototype.thenIf = function (onFulfillment, onRejection, label) {
    return this.then(function (value) {
        if (value) {
            return onFulfillment(value);
        } else {
            return false;
        }
    }, onRejection, label);
};

Ember.TextField.reopen({
    attributeBindings: [ 'aria-label' ]
});

Ember.RSVP.configure('onerror', function (error) {
    if (error instanceof Error) {
        Ember.Logger.assert(false, error);
        Ember.Logger.error(error.stack);
    }
});

Ember.Route.reopen({
    activate: function () {
        var name  = this.get('routeName')
          , text  = Ember.String.classify(name.replace(/-/g, '.'))
          , title = 'User - ' + text.replace(/\./g, ' ');
        Ember.$(document).attr('title', title);
    }
});

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

Ember.Application.initializer({
    name       : 'services'
  , initialize : function (container, app) {
        app.register('services:local', LocalStore);
        app.inject('route', 'local', 'services:local');
        app.inject('controller', 'local', 'services:local');

        app.register('services:api', Api);
        app.inject('route', 'api', 'services:api');
        app.inject('controller', 'api', 'services:api');

        app.register('services:auth', Auth);
        app.inject('route', 'auth', 'services:auth');
        app.inject('controller', 'auth', 'services:auth');

        app.inject('services:api', 'auth', 'services:auth');
        app.inject('services:auth', 'local', 'services:local');
    }
});
