import Gravatar from 'mixins/gravatar';

export default Ember.ObjectController.extend(Gravatar, {
    profilePhotoSize : 200
  , model            : {}
});
