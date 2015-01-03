import App from 'app';
import Gravatar from '../mixins/gravatar';

App.ProfileViewController = Ember.ObjectController.extend(Gravatar, {
    profilePhotoSize : 200
  , model            : {}
});
