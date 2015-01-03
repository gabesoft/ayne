import App from 'app';
import Gravatar from '../mixins/gravatar';

App.ProfileViewController = Ember.Controller.extend(Gravatar, {
    profilePhotoSize : 200
  , model            : {}
});
