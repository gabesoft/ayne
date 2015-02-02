import Api from 'core/app/services/api';

export default Api.extend({
    urlMeta: function (href) {
        return this.runGet('/api/urlmeta/' + encodeURIComponent(href || ''), {});
    }
  , saveUrl: function (data) {
        return this.runPost('/api/urls', data);
    }
});
