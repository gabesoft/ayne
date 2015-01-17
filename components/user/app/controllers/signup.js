import Validator from 'mixins/validator-new';
import Legend from 'mixins/legend';

export default Ember.ObjectController.extend(Validator, Legend, {
    createUserPending : false
  , legendDefault     : 'Create an account'
  , onEnterAction     : 'createUser'
  , needs             : ['application']
  , appCtrl           : Ember.computed.alias('controllers.application')

  , init: function () {
        this._super();
        this.emailField('email');
        this.requiredField('email');
        this.minLengthField('password', 8, 'passwords');
        this.uncommonPasswordField('password', 'passwords');
        this.passwordFields('password', 'passwordVerify', 'passwords');
        this.legendResetFields('email', 'password', 'passwordVerify');
    }

  , setup: function (model) {
        this.resetErrors();
        this.legend();
        this.set('model', model);
    }

  , disableSubmit : function () {
        return this.get('invalid') || this.get('createUserPending');
    }.property('invalid', 'createUserPending')

  , actions : {
        createUser: function () {
            this.set('createUserPending', true);
            this.validate()
               .then(function (valid) {
                    return valid ? this.api.signup(this.get('model')) : false;
                }.bind(this))
               .then(function (response) {
                    return response ? this.api.login(this.get('model')) : false;
                }.bind(this))
               .then(function (response) {
                    if (!response) { return; }

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
        }

      , redirectToLogin: function () {
            this.transitionToRoute('login');
        }
    }
});
