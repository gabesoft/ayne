import Gravatar from 'mixins/gravatar';

export default Ember.ObjectController.extend(Gravatar, {
    init: function () {
        this._super();
        this.addObserver('loggedIn', this, function () {
            if (this.get('loggedIn')) {
                this.get('target').send('invalidateModel');
            }
        });
    }
  , headerIcon: 'fa-user'
  , profilePhotoSize : 64
  , gravatarEmail    : function () {
        return this.get('profile.gravatarEmail');
    }.property('profile.gravatarEmail')
  , loggedIn: function () {
        return this.auth.get('loggedIn');
    }.property('auth.loggedIn')
});
