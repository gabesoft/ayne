import Gravatar from 'core/app/mixins/gravatar';

export default Ember.ObjectController.extend(Gravatar, {
    profilePhotoSize : 200
  , model            : {}
});
