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
            var self = this;

            console.log(this.get('model'));

            this.validate();
            if (this.get('invalid')) {
                return;
            }

            self.set('authenticatePending', true);
            setTimeout(function () {
                self.set('error.server', 'Invalid credentials');
                self.set('authenticatePending', false);
            }, 4000);
        }
      , redirectToSignup: function () {
            ayne.user = this.get('model');
            this.transitionToRoute('signup');
        }
    }
});
