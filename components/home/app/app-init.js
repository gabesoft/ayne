import 'core/app/setup-app';
import 'core/app/setup-objects';
import Api from 'home/app/services/api';

export default function() {
    Ember.Application.initializer({
        name: 'services',
        initialize: function (app) {
            app.register('services:api', Api);
            app.inject('route', 'api', 'services:api');
            app.inject('controller', 'api', 'services:api');
        }
    });
}
