import App from 'app';
import Api from '../mixins/api';

App.ProfileEditController = Ember.Controller.extend(Api, {
    savePending      : false
  , profilePhotoSize : 200
  , legendText       : 'Name and Details'
  , legendClass      : ''
  , legendIcon       : ''
  , model            : {}

  , gravatarUrl : function () {
        var email = this.get('model.gravatarEmail')
          , size  = this.get('profilePhotoSize')
          , base  = 'http://www.gravatar.com/avatar/' + md5(email)
          , query = 's=' + size + '&d=retro';

        return base + '?' + query;
    }.property('model.gravatarEmail', 'profilePhotoSize')

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
            this.apiSaveProfile()
               .then(function (data, status, jqXHR) {
                    this.set('model', data);
                    this.alert('Settings Updated', 'success', 5000);
                })
               .fail(function (jqXHR, status, error) {
                    var response = jqXHR.responseJSON;
                    if (response.statusCode === 409) {
                        this.alert(response.message, 'error')
                    } else {
                        this.alert('Failed to Update Settings', 'error');
                    }
                });
        }
      , cancel : function () {
            this.apiGet('/api/profile')
               .then(function (data, status, jqXHR) {
                    this.set('model', data);
                })
               .fail(function (jqXHR, status, error) {
                    this.alert('Unknown Error', 'error');
                });
        }
    }
});
