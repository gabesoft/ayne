import Validator from 'mixins/validator-new';
import Legend from 'mixins/legend';

export default Ember.ObjectController.extend(Validator, Legend, {
    createUserPending : false
  , legendDefault     : 'Create an account'
  , needs             : ['application']
  , appCtrl           : Ember.computed.alias('controllers.application')

  , init: function () {
        this._super();
        this.emailField('email');
        this.requiredField('email');
        this.minLengthField('password', 8, 'passwords');
        this.passwordFields('password', 'passwordVerify', 'passwords');
        this.legendResetFields('email', 'password', 'passwordVerify');
    }

  , disableSubmit : function () {
        return this.get('invalid') || this.get('createUserPending');
    }.property('invalid', 'createUserPending')

  , actions : {
        createUser: function () {
            this.validate().then(function (valid) {
                if (!valid) { return; }

                this.set('createUserPending', true);
                this.api.signup(this.get('model'))
                   .then(function () {
                        return this.api.login(this.get('model'));
                    }.bind(this))
                   .then(function (response) {
                        this.local.set('credentials', response.data);
                        this.get('appCtrl').set('loggedIn', true);
                        this.get('appCtrl').target.send('invalidateModel');
                        this.transitionToRoute('profile.view');
                    }.bind(this))
                   .catch(function (response) {
                        var json = response.json;

                        if (json.statusCode === 409) {
                            this.legend(json.message, 'error');
                        } else {
                            this.legend('An unknown error occurred', 'error');
                        }
                    }.bind(this))
                   .finally(function () {
                        this.set('createUserPending', false);
                    }.bind(this));
            }.bind(this));
        }

      , redirectToLogin: function () {
            this.transitionToRoute('login');
        }

      , updateKey : function (keyCode) {
            if (keyCode === 13) {
                this.send('createUser');
            }
        }
    }
});
