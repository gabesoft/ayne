import Auth from 'core/app/security/auth';
import Local from 'core/app/stores/local';
import Api from 'user/app/services/api';

export default Ember.Object.create({
    run: function () {
        Ember.Route.reopen({
            activate: function () {
                var name  = this.get('routeName')
                  , text  = Ember.String.classify(name.replace(/-/g, '.'))
                  , title = 'User - ' + text.replace(/\./g, ' ');
                Ember.$(document).attr('title', title);
            }
        });

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
