export default Ember.View.extend({
    urlInput: function () {
        return this.$('input[name=url]');
    }.property().volatile()

  , actions: {
        focusUrlInput: function () {
            Ember.run.scheduleOnce('afterRender', this, function () {
                this.get('urlInput').focus();
            }.bind(this));
        }
      , blurUrlInput: function () {
            Ember.run.scheduleOnce('afterRender', this, function () {
                this.get('urlInput').blur();
            }.bind(this));
        }
    }

  , didInsertElement: function () {
        this.get('controller').on('urlupdated', function () {
            this.send('focusUrlInput');
        }.bind(this));
    }

  , willDestroyElement: function () {
        this.get('controller').off('urlUpdated');
    }
});
