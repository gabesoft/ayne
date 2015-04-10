import Validator from 'core/app/mixins/validator';
import Legend from 'core/app/mixins/legend';

export default Ember.ObjectController.extend(Validator, Legend, {
    model         : {}
  , pendingMeta   : false
  , pendingSave   : false
  , pendingDelete   : false
  , displayHref   : ''
  , recentUrls    : []
  , recentUrlsIds : {}

  , tagsData: function () {
        return this.api.getTags().catch(function () { return []; });
    }.property()

  , disableSubmit : function () {
        return !this.get('displayHref') || this.get('pendingSave') || this.get('pendingDelete');
    }.property('displayHref', 'pendingSave', 'pendingDelete')

  , showDelete : function () {
        return this.get('model.id');
    }.property('model.id')

  , updateUrlMeta : function () {
        var href = this.get('displayHref');

        if (this.get('pendingSave') || this.get('pendingDelete')) {
            return;
        }

        if (!href) {
            this.set('model', {});
            return;
        }

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

  , removeRecentUrl: function (model) {
        var id   = model.id
          , urls = this.get('recentUrls')
          , ids  = this.get('recentUrlsIds')
          , data = urls.findBy('id', id);

        delete ids[id];
        urls.removeObject(data);
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
        }
      , remove: function () {
            this.set('pendingSave', false);
            this.set('pendingDelete', false);
            this.api.deleteUrl(this.get('model'))
               .then(function () {
                    this.removeRecentUrl(this.get('model'));
                    this.set('model', {});
                    this.set('displayHref', null);
                }.bind(this))
               .catch(function (response) {
                    console.log(response);
                }.bind(this))
               .finally(function () {
                    this.set('pendingSave', false);
                    this.set('pendingDelete', false);
                }.bind(this));
        }

      , getUrlMeta: function () {
            Ember.run.debounce(this, this.updateUrlMeta, 300);
        }
    }
});
