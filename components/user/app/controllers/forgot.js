import Validator from 'mixins/validator-new';
import Legend from 'mixins/legend';

export default Ember.ObjectController.extend(Validator, Legend, {
    resetPending  : false
  , legendDefault : 'Forgot password'

  , init: function () {
        this._super();
        this.requiredField('email');
        this.emailField('email');
    }

  , disableSubmit: function () {
        return this.get('invalid') || this.get('resetPending');
    }.property('invalid', 'resetPending')

  , actions:{
        reset: function () {
            console.log('TODO: implement', this.get('model'));
        }
      , redirectToLogin: function () {
            this.transitionToRoute('login');
        }
    }
});
