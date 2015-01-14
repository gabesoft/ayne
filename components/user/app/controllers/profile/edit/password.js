import Validator from 'mixins/validator-new';
import Legend from 'mixins/legend';

export default Ember.ObjectController.extend(Validator, Legend, {
    savePending   : false
  , legendDefault : 'Change Password'
  , model         : {}

  , init: function () {
        this._super();
        this.legendResetFields('password', 'passwordVerify');
        this.minLengthField('password', 8, 'passwords');
        this.uncommonPasswordField('password', 'passwords');
        this.passwordFields('password', 'passwordVerify', 'passwords');
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

                    var cred = this.local.get('credentials') || { user: {} };
                    return this.api.login({
                        email    : cred.user.email
                      , password : this.get('password')
                    });
                }.bind(this))
               .then(function (response) {
                    if (response) {
                        this.legend('Password Updated', 'success', 5000);
                    }
                }.bind(this))
               .catch(function (response) {
                    this.legend('Failed to update password', 'error');
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
