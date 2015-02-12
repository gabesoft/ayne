export default Ember.View.extend({
    mouseEnter: function () {
        this.set('hover', true);
    }
  , mouseLeave: function () {
        this.set('hover', false);
    }
});
