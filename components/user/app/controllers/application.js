import Gravatar from 'mixins/gravatar';

export default Ember.ObjectController.extend(Gravatar, {
    profilePhotoSize: 64
  , loggedIn: false
});
