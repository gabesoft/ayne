export default Ember.Mixin.create({
    gravatarUrl : function () {
        var email = this.get('gravatarEmail')
          , size  = this.get('profilePhotoSize')
          , base  = 'http://www.gravatar.com/avatar/' + md5(email)
          , query = 's=' + size + '&d=retro';

        return base + '?' + query;
    }.property('gravatarEmail', 'profilePhotoSize')
});
