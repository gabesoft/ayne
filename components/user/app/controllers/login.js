import App from 'app';
import Validator from '../mixins/validator';

App.LoginController = Ember.Controller.extend(Validator, {
    authenticatePending: false

  , init : function () {
        this.requiredField('email');
        this.emailField('email');
        this.invalidate('form');
    }

  , disableSubmit : function () {
        return this.get('invalid') || this.get('authenticatePending');
    }.property('invalid', 'authenticatePending')

  , onModelChanged: function () {
        this.set('error.form', null);
    }.observes('model.password', 'model.email')

  , actions : {
        authenticate: function () {
            var self = this;
            console.log(this.get('model'));

            self.set('authenticatePending', true);
            setTimeout(function () {
                self.set('error.form', 'Invalid credentials');
                self.set('authenticatePending', false);
            }, 4000);
        }
    }
});
