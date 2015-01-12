import Legend from 'mixins/legend';
import Validator from 'mixins/validator-new';
import Gravatar from 'mixins/gravatar';

export default Ember.ObjectController.extend(Gravatar, Validator, Legend, {
    savePending      : false
  , profilePhotoSize : 200
  , legendDefault    : 'Name and Details'
  , model            : {}
  , needs            : [ 'application' ]
  , appCtrl          : Ember.computed.alias('controllers.application')

  , init: function () {
        this._super();
        this.addObserver('model', function () {
            this.set('_model', Ember.copy(this.get('model')));
        });

        this.alphaNumericField('displayName');
        this.setValidator('uniqueDisplayName', 'displayName', 'displayName', function () {
            var value    = this.get('displayName')
              , orig     = this.get('_model.displayName');

            if (!value || !orig || value === orig) {
                return null;
            }

            return this.api.checkDisplayName(value)
               .then(function (response) {
                    return response.data.exists ? 'display name not available' : null;
                });
        }, 300);
    }

  , disableSubmit : function () {
        return this.get('invalid');
    }.property('invalid')

  , actions: {
        save: function () {
            this.api.saveProfile(this.get('model'))
               .then(function (response) {
                    this.set('model', response.data);
                    this.get('appCtrl').get('target').send('invalidateModel');
                    this.legend('Settings Updated', 'success', 5000);
                }.bind(this))
               .catch(function (response) {
                    var json = response.json;
                    if (json.statusCode === 409) {
                        this.legend(json.message, 'error');
                    } else {
                        this.legend('Failed to Update Settings', 'error');
                    }
                }.bind(this));
        }
      , cancel : function () {
            this.api.getProfile()
               .then(function (response) {
                    this.set('model', response.data);
                    this.get('appCtrl').get('target').send('invalidateModel');
                }.bind(this))
               .catch(function (response) {
                    this.legend(response.json.message || 'Unknown Error', 'error');
                }.bind(this));
        }
    }
});
