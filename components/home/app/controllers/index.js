export default Ember.Controller.extend({
  application: Ember.inject.controller(),
  search: '',
  searchPending: false,
  queryError: null,
  tagsData: function () {
    return this.api.getTags().catch(function () {
      return [];
    });
  }.property(),
  init: function () {
    this._super();
    this.get('application').on('url-updated', function (data) {
      this.send('urlUpdated', data);
    }.bind(this));
    this.get('application').on('url-deleted', function (data) {
      this.send('urlDeleted', data);
    }.bind(this));
  },
  actions: {
    urlUpdated: function (data) {
      if (data.id) {
        var urls = this.get('model.urls'),
            url = urls.findBy('id', data.id);
        if (url) {
          urls.removeObject(url);
        }
        urls.unshiftObject(data);
      }
    },
    urlDeleted: function (data) {
      if (data.id) {
        var urls = this.get('model.urls'),
            url = urls.findBy('id', data.id);
        urls.removeObject(url);
      }
    },
    searchUrls: function (queryValue) {
      this.set('searchPending', true);
      this.set('queryError', null);
      this.api.getUrls({
        search: queryValue
      })
        .then(function (response) {
          this.set('model.urls', response.data);
        }.bind(this))
        .catch(function (response) {
          this.set('queryError', (response.json || {}).message);
        }.bind(this))
        .finally(function () {
          this.set('searchPending', false);
        }.bind(this));
      this.api.getQueries({
        limit: 50
      }).then(function (response) {
        this.set('model.queries', response.data);
      }.bind(this));
    },
    runQuery: function (query) {
      this.set('search', query.expression);
      this.send('searchUrls', query.expression);
    }
  }
});
