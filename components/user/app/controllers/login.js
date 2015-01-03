import App from 'app';
import Validator from '../mixins/validator';
import Api from '../mixins/api';

App.LoginController = Ember.ObjectController.extend(Validator, Api, {
    authenticatePending: false
  , needs : ['application']

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
    }.observes('password', 'email')

  , actions : {
        authenticate: function () {
            if (!this.validate()) { return; }

            this.set('authenticatePending', true);
            this.apiLogin()
               .then(function (response) {
                    localStorage.jwt = response.data.token;
                    this.get('controllers.application').set('loggedIn', true);

                    // TODO: use this.router.get('application').send('invalidateModel');
                    this.get('controllers.application').target.send('invalidateModel');

                    var prev = this.get('prevTransition');
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
