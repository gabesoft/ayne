export default Ember.View.extend({
    showPopup : function () {
        return this.get('hover');
    }.property('hover', 'altKey')
  , mouseEnter: function () {
        this.set('hover', true);
    }
  , mouseLeave: function () {
        this.set('hover', false);
    }
  , didInsertElement: function () {
        this.$('a.url-title').on('click', function () {
            this.get('controller').send('urlClick');
        }.bind(this));
    }
  , willDestroyElement: function () {
        this.$('a.url-title').off();
    }
});
