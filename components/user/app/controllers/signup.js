import App from 'app';
import Validator from '../mixins/validator';
import Api from '../mixins/api';

App.SignupController = Ember.Controller.extend(Validator, Api, {
    error: {}
  , createUserPending: false

  , init: function () {
        this._super();
        this.requiredField('email');
        this.emailField('email');
        this.passwordFields('password', 'passwordVerify');
        this.invalidate('server');
    }

  , disableSubmit : function () {
        return this.get('invalid') || this.get('createUserPending');
    }.property('invalid', 'createUserPending')

  , onModelChanged: function () {
        this.set('error.server', null);
    }.observes('model.email', 'model.password', 'model.passwordVerify')

  , actions : {
        createUser: function () {
            this.validate();
            if (this.get('invalid')) {
                return;
            }

            this.set('createUserPending', true);
            this.apiSignup()
               .then(function (data, status, jqXHR) {
                    return this.apiLogin();
                })
               .then(function (data, status, jqXHR) {
                    console.log('signup succeeded', data);
                })
               .fail(function (jqXHR, status, error) {
                    var response = jqXHR.responseJSON;

                    if (jqXHR.status === 409) {
                        this.set('error.server', response.message);
                    } else {
                        this.set('error.server', 'An unknown error occurred');
                    }
                })
               .always(function () {
                    this.set('createUserPending', false);
                });
        }
    }
});
