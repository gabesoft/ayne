export default Ember.ArrayController.extend({
    actions: {
        urlUpdated: function (data) {
            console.log('url-updated-controller', data);
        }
      , urlDeleted: function (data) {
            // TODO: findBy doesn't work - fix
            //       add a copy url to clipboard button on the url-popup
            console.log('deleted', data.id, this.get('model').findBy('id', data.id));
            if (data.id) {
                var urls = this.get('model')
                  , url  = urls.findBy('id', data.id);
                urls.removeObject(url);
            }
        }
    }
});
