import Validator from 'mixins/validator';

export default Ember.ObjectController.extend(Validator, {
    authenticatePending : false
  , prevTransition      : null
  , needs               : ['application']
  , appCtrl             : Ember.computed.alias('controllers.application')

  , init : function () {
        this._super();
        this.emailField('email');
        this.requiredField('email');
        this.invalidate('server');
    }

  , disableSubmit : function () {
        return this.get('invalid') || this.get('authenticatePending');
    }.property('invalid', 'authenticatePending')

  , onModelChanged: function () {
        this.set('error.server', null);
    }.observes('password', 'email')

  , actions : {
        authenticate: function () {
            if (!this.validate()) { return; }

            this.set('authenticatePending', true);
            this.api.login(this.get('model'))
               .then(function (response) {
                    var prev = this.get('prevTransition');

                    localStorage.jwt = response.data.token;
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
                        this.set('error.server', 'Invalid credentials');
                    } else {
                        this.set('error.server', json.message);
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
