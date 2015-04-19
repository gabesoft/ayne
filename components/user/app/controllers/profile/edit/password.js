import Validator from 'core/app/mixins/validator';
import Legend from 'user/app/mixins/legend';

export default Ember.Controller.extend(Validator, Legend, {
    savePending        : false
  , legendDefault      : 'Change Password'
  , requireOldPassword : true
  , onEnterAction      : 'save'
  , nextRoute          : null
  , model              : {}

  , init: function () {
        this._super();
        this.legendResetFields('model.password', 'model.passwordVerify', 'model.oldPassword');
        this.minLengthField('model.password', 8, 'passwords');
        this.uncommonPasswordField('model.password', 'passwords');
        this.passwordFields('model.password', 'model.passwordVerify', 'passwords');
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
               .thenIf(function () {
                    return this.api.setPassword(this.get('model'));
                }.bind(this))
               .thenIf(function () {
                    var user = this.auth.get('user') || {};

                    return this.api.login({
                        email    : user.email
                      , password : this.get('model.password')
                    });
                }.bind(this))
               .thenIf(function (response) {
                    this.auth.login(response.data);
                    this.legend('Password Updated', 'success', 5000);

                    var nextRoute = this.get('nextRoute');
                    if (nextRoute) {
                        this.set('nextRoute', null);
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
