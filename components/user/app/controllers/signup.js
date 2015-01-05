import Validator from 'mixins/validator';

export default Ember.ObjectController.extend(Validator, {
    error             : {}
  , createUserPending : false
  , needs             : ['application']
  , appCtrl           : Ember.computed.alias('controllers.application')

  , init: function () {
        this._super();
        this.emailField('email');
        this.requiredField('email');
        this.passwordFields('password', 'passwordVerify');
        this.invalidate('server');
    }

  , disableSubmit : function () {
        return this.get('invalid') || this.get('createUserPending');
    }.property('invalid', 'createUserPending')

  , onModelChanged: function () {
        this.set('error.server', null);
    }.observes('email', 'password', 'passwordVerify')

  , actions : {
        createUser: function () {
            if (!this.validate()) { return; }

            this.set('createUserPending', true);
            this.api.signup(this.get('model'))
               .then(function () {
                    return this.api.login(this.get('model'));
                }.bind(this))
               .then(function (response) {
                    localStorage.jwt = response.data.token;
                    this.get('appCtrl').set('loggedIn', true);
                    this.get('appCtrl').target.send('invalidateModel');
                    this.transitionToRoute('profile.view');
                }.bind(this))
               .catch(function (response) {
                    var json = response.json;

                    if (json.statusCode === 409) {
                        this.set('error.server', json.message);
                    } else {
                        this.set('error.server', 'An unknown error occurred');
                    }
                }.bind(this))
               .finally(function () {
                    this.set('createUserPending', false);
                }.bind(this));
        }

      , updateKey : function (keyCode) {
            if (keyCode === 13) {
                this.send('createUser');
            }
        }
    }
});
