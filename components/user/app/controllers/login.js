import Validator from 'mixins/validator';
import Legend from 'mixins/legend';

export default Ember.ObjectController.extend(Validator, Legend, {
    authenticatePending : false
  , legendDefault       : 'Enter your credentials'
  , onEnterAction       : 'authenticate'
  , prevTransition      : null
  , needs               : ['application']
  , appCtrl             : Ember.computed.alias('controllers.application')

  , init : function () {
        this._super();
        this.emailField('email');
        this.requiredField('email');
        this.legendResetFields('email', 'password');
    }

  , setup: function (model) {
        this.resetErrors();
        this.legend();
        this.set('model', model);
    }

  , disableSubmit : function () {
        return this.get('invalid') || this.get('authenticatePending');
    }.property('invalid', 'authenticatePending')

  , actions : {
        authenticate: function () {
            this.set('authenticatePending', true);
            this.validate()
               .then(function (valid) {
                    if (valid) {
                        this.local.remove('credentials');
                        return this.api.login(this.get('model'));
                    }
                }.bind(this))
               .then(function (response) {
                    if (!response) { return; }

                    var prev = this.get('prevTransition');

                    this.local.set('credentials', response.data);
                    this.get('appCtrl').set('loggedIn', true);
                    this.get('appCtrl').get('target').send('invalidateModel');

                    if (prev) {
                        this.set('prevTransition', null);
                        prev.retry();
                    } else {
                        this.transitionToRoute('profile.view');
                    }
                }.bind(this))
               .catch(function (response) {
                    var json = response.json || response;

                    if (json.statusCode === 401 || json.statusCode === 404) {
                        this.legend('Invalid credentials', 'error');
                    } else {
                        this.legend(json.message, 'error');
                    }
                }.bind(this))
               .finally(function () {
                    this.set('authenticatePending', false);
                }.bind(this));
        }

      , redirectToSignup: function () {
            this.transitionToRoute('signup');
        }
    }
});
