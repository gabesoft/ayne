import Auth from 'core/app/security/auth';
import Local from 'core/app/stores/local';
import Api from 'core/app/services/api';

export default function () {
    Ember.Application.initializer({
        name       : 'services'
      , initialize : function (container, app) {
            app.register('services:api', Api);
            app.inject('route', 'api', 'services:api');
            app.inject('controller', 'api', 'services:api');
        }
    });
}
