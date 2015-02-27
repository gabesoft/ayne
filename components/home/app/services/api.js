import Api from 'core/app/services/api';

export default Api.extend({
    urlMeta: function (href) {
        return this.runGet('/api/urlmeta/' + encodeURIComponent(href || ''), {});
    }
  , saveUrl: function (data) {
        return this.runPost('/api/urls', data);
    }
  , deleteUrl: function (data) {
        return this.runDelete('/api/urls/' + data.id);
    }
  , getTags: function () {
        return this.runGet('/api/tags');
    }
  , getUrls: function (query) {
        query = Ember.$.extend({}
          , { sort: 'clickCount:desc updatedAtdesc', limit: 50 }
          , query);
        return this.runGet('/api/urls', query);
    }
  , getQueries: function (query) {
        return this.runGet('/api/queries', query);
    }
});
