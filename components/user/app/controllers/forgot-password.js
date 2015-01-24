import Validator from 'mixins/validator';
import Legend from 'mixins/legend';

export default Ember.ObjectController.extend(Validator, Legend, {
    resetPending  : false
  , legendDefault : 'Forgot password'
  , onEnterAction : 'reset'
  , alertText     : ''

  , init: function () {
        this._super();
        this.requiredField('email');
        this.emailField('email');
        this.alert();
    }

  , disableSubmit: function () {
        return this.get('invalid') || this.get('resetPending');
    }.property('invalid', 'resetPending')

  , alert: function (msg, cls) {
        msg = msg || 'Enter your email address and we\'ll send you a password reset email.';
        this.set('alertClass', cls === 'error' ? 'alert' : cls);
        this.set('alertText', msg);
    }

  , setup: function (model) {
        this.resetErrors();
        this.alert();
        this.set('model', model);
    }

  , alertSuccess: function () {
        this.alert([
            'We found an account that matches',
            '<b>' + this.get('model').email + '</b>,',
            'you should receive an email with instructions',
            'on how to reset your password shortly.'
        ].join(' '), 'success');
    }

  , alertFailed: function (response) {
        if (response && response.json.statusCode === 404) {
            this.alert('No account matches <b>' + this.get('model').email + '</b>', 'error');
        } else {
            this.alert('Failed to send a reset password email', 'error');
        }
    }

  , actions:{
        reset: function () {
            if (this.get('resetPending')) { return; }

            this.set('resetPending', true);
            this.validate()
               .thenIf(function (valid) {
                    return this.api.resetPassword(this.get('model'));
                }.bind(this))
               .thenIf(function (response) {
                    var email = Ember.get(response, 'data.email');
                    if (email && email === this.get('email')) {
                        this.alertSuccess();
                    }
                }.bind(this))
               .catch(function (response) {
                    this.alertFailed(response);
                }.bind(this))
               .finally(function () {
                    this.set('resetPending', false);
                }.bind(this));
        }

      , redirectToLogin: function () {
            this.transitionToRoute('login');
        }
    }
});
