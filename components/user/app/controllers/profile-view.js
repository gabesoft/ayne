import App from 'app';
import Api from '../mixins/api';

App.ProfileViewController = Ember.Controller.extend(Api, {
    profilePhotoSize : 200
  , model            : {}

  , gravatarUrl : function () {
        var email = this.get('model.gravatarEmail')
          , size  = this.get('profilePhotoSize')
          , base  = 'http://www.gravatar.com/avatar/' + md5(email)
          , query = 's=' + size + '&d=retro';

        return base + '?' + query;
    }.property('model.gravatarEmail', 'profilePhotoSize')
});
