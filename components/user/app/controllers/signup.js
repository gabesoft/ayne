import App from 'app';
import Validator from '../mixins/validator';

App.SignupController = Ember.Controller.extend(Validator, {
    error: {}
  , createUserPending: false

  , init: function () {
        this.requiredField('email');
        this.emailField('email');
        this.invalidate('form');
    }

  , disableSubmit : function () {
        return this.get('invalid') || this.get('createUserPending');
    }.property('invalid', 'createUserPending')

  , onModelChanged: function () {
        this.set('error.form', null);
    }.observes('model.password', 'model.email')

  , actions : {
        createUser: function () {
            var self = this;
            console.log(this.get('model'));

            self.set('createUserPending', true);
            setTimeout(function () {
                self.set('error.form', 'An error occurred');
                self.set('createUserPending', false);
            }, 4000);
        }
    }
});
