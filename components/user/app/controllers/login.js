import Validator from 'mixins/validator';
import Legend from 'mixins/legend';

export default Ember.ObjectController.extend(Validator, Legend, {
    authenticatePending : false
  , legendDefault       : 'Enter your credentials'
  , prevTransition      : null
  , needs               : ['application']
  , appCtrl             : Ember.computed.alias('controllers.application')

  , init : function () {
        this._super();
        this.emailField('email');
        this.requiredField('email');
        this.legendResetFields('email', 'password');
    }

  , disableSubmit : function () {
        return this.get('invalid') || this.get('authenticatePending');
    }.property('invalid', 'authenticatePending')

  , actions : {
        authenticate: function () {
            if (!this.validate()) { return; }

            this.set('authenticatePending', true);
            this.api.login(this.get('model'))
               .then(function (response) {
                    var prev = this.get('prevTransition');

                    localStorage.jwt = response.data.token;
                    localStorage.user = JSON.stringify(response.data.user);
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
                    var json = response.json;

                    if (json.statusCode === 401) {
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

      , updateKey : function (keyCode) {
            if (keyCode === 13) {
                this.send('authenticate');
            }
        }
    }
});
