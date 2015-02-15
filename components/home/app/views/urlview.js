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
});
