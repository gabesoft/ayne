export default Ember.View.extend({
    classNames: [ 'height-full' ]
  , toggleLinkSelector: '.left-off-canvas-toggle-link'

  , toggleOffCanvas: function () {
        $('.off-canvas-wrap').foundation('offcanvas', 'toggle', 'move-right');
    }

  , didInsertElement: function () {
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
