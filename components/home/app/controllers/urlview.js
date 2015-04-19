export default Ember.Controller.extend({
    tagsData: function () {
        return this.get('parentController.tagsData');
    }.property('parentController.tagsData')
  , actions: {
        urlClick: function () {
            this.incrementProperty('model.clickCount');
            this.api.saveUrl(this.get('model'));
        }
    }
});
