import InitVendor from 'core/app/mixins/init-vendor';
export default Ember.View.extend(InitVendor, {
    classNames: [ 'height-full' ]

  , didInsertElement: function () {
        $(document).on('open.fndtn.offcanvas', '[data-offcanvas]', function () {
            this.get('childViews')
               .findBy('viewName', 'urlinput')
               .send('focusUrlInput');
        }.bind(this));

        $(document).on('keydown', function (e) {
            if (e.keyCode === 113) {   // F2
                $('.off-canvas-wrap').foundation('offcanvas', 'toggle', 'move-right');
            }
        }.bind(this));
    }

  , willDestroyElement: function () {
        $(document).off('keydown');
        $(document).off('open.fndtn.offcanvas');
    }
});
