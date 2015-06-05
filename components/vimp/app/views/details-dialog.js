export default Ember.View.extend({
    templateName : 'details-dialog'
  , didInsertElement : function () {
        if (this.get('controller.model.hasReadme')) {
            this.set('controller.showDoc', false);
        } else if (this.get('controller.model.hasDoc')) {
            this.set('controller.showDoc', true);
        }
    }
});
