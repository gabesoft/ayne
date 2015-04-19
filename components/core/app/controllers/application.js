import Gravatar from 'core/app/mixins/gravatar';

export default Ember.Controller.extend(Gravatar, {
    headerIcon: 'fa-wrench'
  , profilePhotoSize : 64
  , gravatarEmail    : function () {
        return this.get('model.profile.gravatarEmail');
    }.property('model.profile.gravatarEmail')
  , loggedIn: function () {
        return this.auth.get('loggedIn');
    }.property('auth.loggedIn')
});
