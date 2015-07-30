export default Ember.Component.extend({
    layoutName: 'accordion-item',
    accordionId: 'not-set',
    open: false,
    tagName: 'li',
    classNames: [ 'accordion-navigation' ],
    classNameBindings: [ 'open:active' ],
    openBinding: 'open',

    didInsertElement: function () {
        this.$().closest('[data-accordion]').on('click', function (e) {
            var target = this.$(e.target).get(0).closest('[data-id]'),
                id = this.$(target).data('id');

            if (id === this.get('accordionId')) {
                this.toggleProperty('open');
            } else {
                this.set('open', false);
            }

            this.sendAction('toggleAction', this.get('open'));
        }.bind(this));
    },

    willDestroyElement: function () {
        this.$().closest('[data-accordion]').off('click');
    }
});