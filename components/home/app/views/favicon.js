export default Ember.View.extend({
    tagName: 'img'
  , attributeBindings: ['src']
  , classNames: ['favicon']
  , srcChanged: function () {
        if (!this.get('src')) {
            this.set('src', this.defaultSrc());
        }
    }.observes('src')

  , defaultSrc :function () {
        var src   = this.get('src') || 'http://' + Date.now()
          , url   = 'http://www.gravatar.com/avatar/' + md5(src || '')
          , query = 's=30&d=retro';
        return url + '?' + query;
    }

  , didInsertElement: function () {
        this.$().on('error', function () {
            this.$().attr('src', this.defaultSrc());
        }.bind(this));

        if (!this.get('src')) {
            this.set('src', this.defaultSrc());
        }
    }
});