import App from 'app';
import Validator from '../../mixins/validator';
import Gravatar from '../../mixins/gravatar';

export default Ember.ObjectController.extend(Gravatar, Validator, {
    savePending      : false
  , profilePhotoSize : 200
  , legendText       : 'Name and Details'
  , legendClass      : ''
  , legendIcon       : ''
  , model            : {}
  , needs            : [ 'application' ]

  , init: function () {
        this._super();
        this.alphaNumericField('displayName');
    }

  , disableSubmit : function () {
        return this.get('invalid');
    }.property('invalid')

  , alert : function (msg, type, timeout) {
        if (this.alertRun) {
            Ember.run.cancel(this.alertRun);
            this.alertRun = null;
        }

        if (timeout) {
            this.alertRun = Ember.run.later(this, function () {
                this.alert('Name and Details', '');
            }, timeout);
        }

        this.set('legendClass', type);
        this.set('legendText', msg);
        if (type === 'success') {
            this.set('legendIcon', 'fa-check-square-o');
        } else if (type === 'error') {
            this.set('legendIcon', 'fa-exclamation-circle');
        } else {
            this.set('legendIcon', '');
        }
    }

  , actions: {
        save: function () {
            this.api.saveProfile(this.get('model'))
               .then(function (response) {
                    this.set('model', response.data);
                    this.get('controllers.application').set('model', response.data);
                    this.alert('Settings Updated', 'success', 5000);
                }.bind(this))
               .catch(function (response) {
                    var json = response.json;
                    if (json.statusCode === 409) {
                        this.alert(json.message, 'error');
                    } else {
                        this.alert('Failed to Update Settings', 'error');
                    }
                }.bind(this));
        }
      , cancel : function () {
            this.api.getProfile()
               .then(function (response) {
                    this.set('model', response.data);
                    this.get('controllers.application').set('model', response.data);
                }.bind(this))
               .catch(function (response) {
                    this.alert(response.json.message || 'Unknown Error', 'error');
                }.bind(this));
        }
    }
});
