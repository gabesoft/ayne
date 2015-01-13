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
            this.api.setPassword(this.get('model'))
               .then(function (response) {
                    return this.api.login({
                        // TODO  : centralize localStorage ops
                        email    : JSON.parse(localStorage.user).email
                      , password : this.get('password')
                    });
                }.bind(this))
               .then(function (response) {
                    this.legend('Password Updated', 'success', 5000);
                }.bind(this))
               .catch(function (response) {
                    this.legend('Failed to update password', 'error');
                }.bind(this));
        }

      , updateKey : function (keyCode) {
            if (keyCode === 13) {
                this.send('save');
            }
        }
    }
});
