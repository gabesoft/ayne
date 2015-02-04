import Validator from 'core/app/mixins/validator';
import Legend from 'user/app/mixins/legend';

export default Ember.ObjectController.extend(Validator, Legend, {
    model         : {}
  , pendingMeta   : false
  , pendingSave   : false
  , displayHref   : ''
  , recentUrls    : []
  , recentUrlsIds : {}

  , updateUrlMeta : function () {
        var href = this.get('displayHref');

        if (!href) { return; }

        this.set('pendingMeta', true);
        this.api.urlMeta(href).then(function (response) {
            if (response.data.href !== this.get('href')) {
                this.set('model', response.data);
            }
        }.bind(this)).catch(function (response) {
            console.log(response.error);
        }).finally(function () {
            this.set('pendingMeta', false);
        }.bind(this));
    }

  , addToRecentUrls: function (data) {
        var id   = data.id
          , urls = this.get('recentUrls')
          , ids  = this.get('recentUrlsIds');

        if (ids[id]) {
            urls.removeObject(ids[id]);
        }

        ids[id] = data;
        urls.unshiftObject(data);
    }

  , actions: {
        save: function () {
            this.set('pendingSave', false);
            this.set('model.userEntered', this.get('displayHref'));
            this.api.saveUrl(this.get('model'))
               .then(function (response) {
                    this.addToRecentUrls(response.data);
                    this.set('model', {});
                    this.set('displayHref', null);
                }.bind(this))
               .catch(function (response) {
                    console.log(response);
                    console.log('failed to save url', response.json);
                }.bind(this))
               .finally(function () {
                    this.set('pendingSave', false);
                }.bind(this));
        },
        getUrlMeta: function () {
            Ember.run.debounce(this, this.updateUrlMeta, 300);
        }
    }
});
