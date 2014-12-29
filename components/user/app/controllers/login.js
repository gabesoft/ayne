import App from 'app';
import Validator from '../mixins/validator';

App.LoginController = Ember.Controller.extend(Validator, {
    authenticatePending: false

  , init : function () {
        this._super();
        this.requiredField('email');
        this.emailField('email');
        this.invalidate('server');
    }

  , disableSubmit : function () {
        return this.get('invalid') || this.get('authenticatePending');
    }.property('invalid', 'authenticatePending')

  , onModelChanged: function () {
        this.set('error.server', null);
    }.observes('model.password', 'model.email')

  , actions : {
        authenticate: function () {
            this.validate();
            if (this.get('invalid')) {
                return;
            }

            this.set('authenticatePending', true);
            Ember.$.ajax({
                url     : '/api/login'
              , type    : 'POST'
              , data    : this.get('model')
              , context : this
            }).then(function (data, status, jqXHR) {
                console.log('login succeeded', data);
            }, function (jqXHR, status, error) {
                console.log(jqXHR.responseJSON);

                var response = jqXHR.responseJSON;
                if (jqXHR.status === 401) {
                    this.set('error.server', 'Invalid credentials');
                } else {
                    this.set('error.server', response.message);
                }
            }).always(function () {
                this.set('authenticatePending', false);
            });
        }
      , redirectToSignup: function () {
            ayne.user = this.get('model');
            this.transitionToRoute('signup');
        }
    }
});
