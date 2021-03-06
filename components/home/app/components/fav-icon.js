export default Ember.Component.extend({
    tagName: 'img',
    attributeBindings: ['src', 'style', 'clearOnClick'],
    clearOnClick: false,
    style: 'visibility:hidden',
    classNames: ['favicon'],
    srcChanged: function () {
        if (!this.get('src')) {
            this.set('src', this.defaultSrc());
        }
    }.observes('src'),

    defaultSrc: function () {
        var src = this.get('src') || 'http://' + Date.now(),
            url = 'http://www.gravatar.com/avatar/' + md5(src || ''),
            query = 's=30&d=retro';
        return url + '?' + query;
    },

    beforeRender: function () {
        if (!this.get('src')) {
            this.set('src', this.defaultSrc());
        }
    },

    didInsertElement: function () {
        this.$().on('load', function () {
            if (this.$()) {
                this.$().css('visibility', 'visible').hide().fadeIn();
            }
        }.bind(this));

        this.$().on('error', function () {
            if (this.$()) {
                this.$().attr('src', this.defaultSrc());
            }
        }.bind(this));

        if (this.get('clearOnClick')) {
            this.$().on('click', function () {
                this.set('src', this.defaultSrc());
            }.bind(this));
        }
    },

    willDestroyElement: function () {
        this.$().off();
    }
});