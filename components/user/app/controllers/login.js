import App from 'app';
import Validator from '../mixins/validator';
import Api from '../mixins/api';

App.LoginController = Ember.Controller.extend(Validator, Api, {
    authenticatePending: false
  , needs : ['application']

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
            if (!this.validate()) { return; }

            this.set('authenticatePending', true);
            this.apiLogin()
               .then(function (data, status, jqXHR) {
                    localStorage.jwt = data.token;
                    this.get('controllers.application').set('loggedIn', true);
                })
               .fail(function (jqXHR, status, error) {
                    var response = jqXHR.responseJSON;

                    if (jqXHR.status === 401) {
                        this.set('error.server', 'Invalid credentials');
                    } else {
                        this.set('error.server', response.message);
                    }
                })
               .always(function () {
                    this.set('authenticatePending', false);
                });
        }

      , redirectToSignup: function () {
            this.transitionToRoute('signup');
        }
    }
});
