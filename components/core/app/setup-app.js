import Auth from 'core/app/security/auth';
import Local from 'core/app/stores/local';

Ember.Application.initializer({
    name       : 'global-setup',
    initialize : function (app) {
        var ayne = window.ayne || {};

        app.LOG_TRANSITIONS          = ayne.env !== 'production';
        app.LOG_MODULE_RESOLVER      = ayne.env !== 'production';
        app.LOG_VIEW_LOOKUPS         = ayne.env !== 'production';
        app.LOG_ACTIVE_GENERATION    = ayne.env !== 'production';
        app.MODEL_FACTORY_INJECTIONS = true;

        app.register('stores:local', Local);
        app.register('security:auth', Auth);

        app.inject('route', 'local', 'stores:local');
        app.inject('controller', 'local', 'stores:local');
        app.inject('security', 'local', 'stores:local');
        app.inject('services', 'local', 'stores:local');

        app.inject('route', 'auth', 'security:auth');
        app.inject('controller', 'auth', 'security:auth');
        app.inject('services', 'auth', 'security:auth');
    }
});
