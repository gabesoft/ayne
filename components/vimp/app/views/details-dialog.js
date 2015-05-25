export default Ember.View.extend({
    templateName : 'details-dialog'
  , readme       : function () {
        return this.get('controller.model.readme') || '';
    }.property()
});
