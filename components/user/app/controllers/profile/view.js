import Gravatar from 'core/app/mixins/gravatar';

export default Ember.Controller.extend(Gravatar, {
    profilePhotoSize : 400
  , model            : {}
  , gravatarEmail : function () {
        return this.get('model.gravatarEmail');
    }.property('model.gravatarEmail')
});
