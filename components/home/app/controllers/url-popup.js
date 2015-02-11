export default Ember.ObjectController.extend({
    model    : {}
  , editOn   : false
  , tagsData : function () {
        return this.api.getTags().catch(function () { return []; });
    }.property()
  , actions: {
        setEditOn: function () {
            this.set('editOn', true);
        }
      , save: function () {
            if (this.get('editOn')) {
                this.api.saveUrl(this.get('model'));
            }
        }
    }
});
