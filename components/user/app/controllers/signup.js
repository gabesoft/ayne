import App from 'app';
import Validator from '../mixins/validator';

App.SignupController = Ember.Controller.extend(Validator, {
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
            Ember.$.ajax({
                url     : '/api/signup'
              , type    : 'POST'
              , data    : this.get('model')
              , context : this
            }).then(function (data, status, jqXHR) {
                console.log('signup succeeded', data);
            }, function (jqXHR, status, error) {
                this.set('error.server', 'An error occurred');
                console.log('signup failed', error);
            }).always(function () {
                this.set('createUserPending', false);
            });
        }
    }
});
