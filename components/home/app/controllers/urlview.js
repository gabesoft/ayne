export default Ember.ObjectController.extend({
    tagsData: function () {
        return this.get('parentController.tagsData');
    }.property('parentController.tagsData')
});
