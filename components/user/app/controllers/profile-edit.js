import App from 'app';
import Api from '../mixins/api';

App.ProfileEditController = Ember.Controller.extend(Api, {
    savePending: false
  , profilePhotoSize: 200
  , model: {}

  , gravatarUrl : function () {
        var email = this.get('model.gravatarEmail')
          , size  = this.get('profilePhotoSize');

        return 'http://www.gravatar.com/avatar/' + md5(email) + '?s=' + size;
    }.property('model.gravatarEmail', 'profilePhotoSize')

  , actions: {
        save: function () {
            this.apiSaveProfile()
               .then(function (data, status, jqXHR) {
                    console.log('save succeeded', data);
                })
               .fail(function (jqXHR, status, error) {
                    console.log('save failed', error);
                });
        }
    }
});
