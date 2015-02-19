export default Ember.ObjectController.extend({
    model       : {}
  , copyClass   : 'fa-copy'
  , copyTitle   : "Copy url to clipboard"
  , editOn      : false
  , disableCopy : true
  , tagsData    : function () {
        return this.get('parentController.tagsData');
    }.property('parentController.tagsData')
  , actions: {
        toggleEdit: function () {
            this.toggleProperty('editOn');
        }
      , saveUrl: function () {
            if (this.get('editOn')) {
                this.api.saveUrl(this.get('model')).catch(function (response) {
                    console.log(response);
                });
            }
        }
      , deleteUrl: function () {
            this.api.deleteUrl(this.get('model'))
               .then(function () {
                    this.get('target').send('urlDeleted', this.get('model'));
                }.bind(this))
               .catch(function (response) {
                    console.log(response);
                });
        }
    }
});
