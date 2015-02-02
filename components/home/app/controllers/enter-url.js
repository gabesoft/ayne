import Validator from 'core/app/mixins/validator';
import Legend from 'user/app/mixins/legend';

export default Ember.ObjectController.extend(Validator, Legend, {
    model       : {}
  , pendingMeta : false
  , pendingSave : false
  , recentUrls  : []
  , init        : function () {
        this._super();
        this.addObserver('model.href', this, function () {
            Ember.run.debounce(this, this.updateUrlMeta, 300);
        });
    }

  , updateUrlMeta : function () {
        var href  = this.get('model.href')
          , title = this.get('model.title');

        if (!href || title) { return; }

        this.set('pendingMeta', true);
        this.api.urlMeta(href).then(function (response) {
            this.set('model.title', response.data.title);
        }.bind(this)).catch(function (response) {
            console.log(response.error);
        }).finally(function () {
            this.set('pendingMeta', false);
        }.bind(this));
    }

  , favicon: function () {
        var href = this.get('model.href')
          , icon = 'http://www.google.com/s2/favicons?domain_url=';
        return icon + encodeURIComponent(href);
    }.property('model.href')

  , actions: {
        save: function () {
            this.set('pendingSave', false);
            this.api.createUrl(this.get('model'))
               .then(function (response) {
                    this.get('recentUrls').pushObject(response.data);
                    this.set('model', {});
                }.bind(this))
               .catch(function (response) {
                    console.log('failed to save url', response.json);
                }.bind(this))
               .finally(function () {
                    this.set('pendingSave', false);
                }.bind(this));
        }
    }
});
