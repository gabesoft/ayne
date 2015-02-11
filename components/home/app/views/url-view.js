export default Ember.View.extend({
    templateName  : 'url-view'
  , mouseEnter: function () {
        this.set('hover', true);
    }
  , mouseLeave: function () {
        this.set('hover', false);
    }
});
