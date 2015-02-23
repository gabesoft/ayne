export default Ember.ArrayController.extend({
    needs    : ['application']
  , tagsData : function () {
        return this.api.getTags().catch(function () { return []; });
    }.property()
});
