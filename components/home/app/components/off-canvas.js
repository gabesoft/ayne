export default Ember.Component.extend({
    classNames: ['height-full'],
    layoutName: 'off-canvas',
    toggleKey: 113, // F2
    toggleLinkSelector: '.left-off-canvas-toggle-link',
    toggleOffCanvas: function () {
        this.$('.off-canvas-wrap').foundation('offcanvas', 'toggle', 'move-right');
    },
    didInsertElement: function () {
        Ember.$(document).on('keydown', function (e) {
            if (e.keyCode === +this.get('toggleKey')) {
                this.toggleOffCanvas();
            }
        }.bind(this));

        $(this.toggleLinkSelector).on('click', function () {
            this.toggleOffCanvas();
        }.bind(this));
    },
    willDestroyElement: function () {
        Ember.$(document).off('keydown');
        this.$().off('open.fndtn.offcanvas');
        this.$().off('close.fndtn.offcanvas');
        this.$(this.toggleLinkSelector).off('click');
    }
});