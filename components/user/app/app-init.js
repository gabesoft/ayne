import Api from 'user/app/services/api';

export default function () {
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
            app.register('services:api', Api);
            app.inject('route', 'api', 'services:api');
            app.inject('controller', 'api', 'services:api');
        }
    });
}
