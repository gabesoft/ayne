import Validator from 'mixins/validator';
import Legend from 'mixins/legend';

export default Ember.ObjectController.extend(Validator, Legend, {
    savePending        : false
  , legendDefault      : 'Change Password'
  , requireOldPassword : true
  , onEnterAction      : 'save'
  , nextRoute          : null
  , model              : {}

  , init: function () {
        this._super();
        this.legendResetFields('password', 'passwordVerify');
        this.minLengthField('password', 8, 'passwords');
        this.uncommonPasswordField('password', 'passwords');
        this.passwordFields('password', 'passwordVerify', 'passwords');
    }

  , updateRequireOldPasswordFlag: function () {
        this.set('requireOldPassword', !this.auth.get('noVerify'));
    }

  , disableSubmit : function () {
        return this.get('invalid') || this.get('savePending');
    }.property('invalid', 'createUserPending')

  , actions: {
        save: function () {
            this.set('savePending', true);

            this.validate()
               .then(function (valid) {
                    return valid ? this.api.setPassword(this.get('model')) : false;
                }.bind(this))
               .then(function (response) {
                    if (!response) { return false; }

                    var user = this.auth.get('user') || {};

                    this.auth.logout();
                    return this.api.login({
                        email    : user.email
                      , password : this.get('password')
                    });
                }.bind(this))
               .then(function (response) {
                    if (response) {
                        this.auth.login(response.data);
                        this.legend('Password Updated', 'success', 5000);
                    }

                    var nextRoute = this.get('nextRoute');
                    if (nextRoute) {
                        this.set('redirectTo', null);
                        this.transitionToRoute(nextRoute);
                    }
                }.bind(this))
               .catch(function (response) {
                    this.legend(response.json.message || 'Failed to update password', 'error');
                }.bind(this))
               .finally(function () {
                    this.set('savePending', false);
                }.bind(this));
        }

      , updateKey : function (keyCode) {
            if (keyCode === 13) {
                this.send('save');
            }
        }
    }
});
