import Validator from 'mixins/validator';

export default Ember.ObjectController.extend(Validator, {
    savePending : false
  , legendText  : 'Change Password'
  , legendClass : ''
  , legendIcon  : ''
  , model       : {}

  , init: function () {
        this._super();
        this.passwordFields('password', 'passwordVerify');
    }

  , disableSubmit : function () {
        return this.get('invalid') || this.get('savePending');
    }.property('invalid', 'createUserPending')

  , actions: {
        save: function () {
            this.api.setPassword(this.get('model'))
               .then(function (response) {
                    return this.api.login(this.get('model'));
                })
               .then(function (response) {
                    console.log('change password succeeded');
                })
               .catch(function (response) {
                    console.log('change password failed');
                });
        }
    }
});
