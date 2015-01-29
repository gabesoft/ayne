import Gravatar from 'core/app/mixins/gravatar';

export default Ember.ObjectController.extend(Gravatar, {
    headerIcon: 'fa-user'
  , profilePhotoSize : 64
  , gravatarEmail    : function () {
        return this.get('profile.gravatarEmail');
    }.property('profile.gravatarEmail')
  , loggedIn: function () {
        return this.auth.get('loggedIn');
    }.property('auth.loggedIn')
});
