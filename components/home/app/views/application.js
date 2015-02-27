import InitVendor from 'core/app/mixins/init-vendor';
export default Ember.View.extend(InitVendor, {
    classNames: [ 'height-full' ]
  , toggleLinkSelector: '.left-off-canvas-toggle-link'

  , toggleOffCanvas: function () {
        $('.off-canvas-wrap').foundation('offcanvas', 'toggle', 'move-right');
    }

  , didInsertElement: function () {
        $(document).on('open.fndtn.offcanvas', '[data-offcanvas]', function () {
            this.get('childViews')
               .findBy('viewName', 'urlinput')
               .send('focusUrlInput');
        }.bind(this));

        $(document).on('close.fndtn.offcanvas', '[data-offcanvas]', function () {
            this.get('childViews')
               .findBy('viewName', 'urlinput')
               .send('blurUrlInput');
        }.bind(this));

        $(document).on('keydown', function (e) {
            if (e.keyCode === 113) {   // F2
                this.toggleOffCanvas();
            }
        }.bind(this));

        $(this.toggleLinkSelector).on('click', function () {
            this.toggleOffCanvas();
        }.bind(this));
    }

  , willDestroyElement: function () {
        $(document).off('keydown');
        $(document).off('open.fndtn.offcanvas');
        $(document).off('close.fndtn.offcanvas');
        $(this.toggleLinkSelector).off('click');
    }
});
