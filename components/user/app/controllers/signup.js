import App from 'app';
import Validator from '../mixins/validator';
import Api from '../mixins/api';

App.SignupController = Ember.ObjectController.extend(Validator, Api, {
    error: {}
  , createUserPending: false
  , needs : ['application']

  , init: function () {
        this._super();
        this.emailField('email');
        this.requiredField('email');
        this.passwordFields('password', 'passwordVerify');
        this.invalidate('server');
    }

  , disableSubmit : function () {
        return this.get('invalid') || this.get('createUserPending');
    }.property('invalid', 'createUserPending')

  , onModelChanged: function () {
        this.set('error.server', null);
    }.observes('email', 'password', 'passwordVerify')

  , actions : {
        createUser: function () {
            if (!this.validate()) { return; }

            this.set('createUserPending', true);
            this.apiSignup()
               .then(function (data, status, jqXHR) {
                    return this.apiLogin();
                })
               .then(function (data, status, jqXHR) {
                    localStorage.jwt = data.token;
                    this.get('controllers.application').set('loggedIn', true);
                    this.get('controllers.application').target.send('invalidateModel');
                    this.transitionToRoute('profile.view');
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
