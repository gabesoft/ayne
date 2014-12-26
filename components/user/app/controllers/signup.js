import App from 'app';
import Validator from '../mixins/validator';

App.SignupController = Ember.Controller.extend(Validator, {
    error: {}
  , createUserPending: false

  , init: function () {
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
            var self = this;
            console.log(this.get('model'));

            this.validate();
            if (this.get('invalid')) {
                return;
            }

            self.set('createUserPending', true);
            setTimeout(function () {
                self.set('error.server', 'An error occurred');
                self.set('createUserPending', false);
            }, 4000);
        }
    }
});
