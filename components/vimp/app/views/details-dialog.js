export default Ember.View.extend({
    templateName : 'details-dialog'
  , readme       : function () {
        return marked(this.get('controller.model.readme') || '');
    }.property()
});
