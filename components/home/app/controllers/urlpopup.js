export default Ember.ObjectController.extend({
    model       : {}
  , copyClass   : 'fa-copy'
  , copyTitle   : "Copy url to clipboard"
  , editOn      : false
  , disableCopy : true
  , tagsData    : function () {
        return this.api.getTags().catch(function () { return []; });
    }.property()
  , actions: {
        setEditOn: function () {
            this.set('editOn', true);
        }
      , saveUrl: function () {
            if (this.get('editOn')) {
                this.api.saveUrl(this.get('model'));
            }
        }
      , deleteUrl: function () {
            this.api.deleteUrl(this.get('model')).then(function () {
                this.get('target').send('urlDeleted', this.get('model'));
            }.bind(this));
        }
    }
});
