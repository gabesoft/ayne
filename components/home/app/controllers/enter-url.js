import Validator from 'core/app/mixins/validator';
import Legend from 'user/app/mixins/legend';

export default Ember.ObjectController.extend(Validator, Legend, {
    model: {}
  , init: function () {
        this._super();
        this.addObserver('model.href', this, function () {
            Ember.run.debounce(this, this.updateUrlMeta, 300);
        });
    }

  , updateUrlMeta : function () {
        var href = this.get('model.href');

        if (!href) { return; }

        this.api.urlMeta(href).then(function (response) {
            this.set('model.title', response.data.title);
        }.bind(this)).catch(function (response) {
            console.log(response.error);
        });
    }

  , favicon: function () {
        var href = this.get('model.href');
        return 'http://www.google.com/s2/favicons?domain_url=' + encodeURIComponent(href);
    }.property('model.href')

  , name: function (key, value) {
        var title = this.get('model.title');
        return (title || '')
           .toLowerCase()
           .replace(/ /g, '-')
           .replace(/[^\w-]+/g, '')
           .replace(/-+/g, '-');
    }.property('model.title')

  , actions: {
        save: function () {
            console.log(this.get('model'));
        }
    }
});
