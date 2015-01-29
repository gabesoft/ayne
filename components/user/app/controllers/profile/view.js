import Gravatar from 'core/app/mixins/gravatar';

export default Ember.ObjectController.extend(Gravatar, {
    profilePhotoSize : 400
  , model            : {}
});
