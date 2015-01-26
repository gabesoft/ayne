import Auth from 'core/app/security/auth';
import Local from 'core/app/stores/local';
import Api from 'user/app/services/api';

export default Ember.Object.create({
    run: function () {
        Ember.Application.initializer({
            name       : 'services'
          , initialize : function (container, app) {
                app.register('stores:local', Local);
                app.register('services:api', Api);
                app.register('security:auth', Auth);

                app.inject('route', 'local', 'stores:local');
                app.inject('controller', 'local', 'stores:local');
                app.inject('security', 'local', 'stores:local');
                app.inject('services', 'local', 'stores:local');

                app.inject('route', 'auth', 'security:auth');
                app.inject('controller', 'auth', 'security:auth');
                app.inject('services', 'auth', 'security:auth');

                app.inject('route', 'api', 'services:api');
                app.inject('controller', 'api', 'services:api');
            }
        });
    }
});
