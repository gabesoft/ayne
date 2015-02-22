export default Ember.ObjectController.extend({
    needs    : ['application']
  , search   : ''
  , tagsData : function () {
        return this.api.getTags().catch(function () { return []; });
    }.property()
  , init   : function () {
        this._super();
        this.get('controllers.application').on('url-updated', function (data) {
            this.send('urlUpdated', data);
        }.bind(this));
        this.get('controllers.application').on('url-deleted', function (data) {
            this.send('urlDeleted', data);
        }.bind(this));
    }
  , actions: {
        urlUpdated: function (data) {
            if (data.id) {
                var urls = this.get('model')
                  , url  = urls.findBy('id', data.id);
                if (url) {
                    urls.removeObject(url);
                }
                urls.unshiftObject(data);
            }
        }
      , urlDeleted: function (data) {
            if (data.id) {
                var urls = this.get('model')
                  , url  = urls.findBy('id', data.id);
                urls.removeObject(url);
            }
        }
      , searchUrls: function (queryValue) {
            console.log('SEARCH', queryValue);
            this.api.getUrls({ search: queryValue, sort: "updatedAt:desc" })
               .then(function (response) {
                    this.set('model.urls', response.data);
                }.bind(this))
               .catch(function (err) {
                    console.log(err);
                });
        }
      , runQuery: function (query) {
            this.set('search', query.expression);
        }
    }
});
