export default Ember.Controller.extend(Ember.Evented, {
    model         : {}
  , pendingMeta   : false
  , pendingSave   : false
  , pendingDelete : false
  , displayHref   : ''
  , needs         : ['application']

  , tagsData: function () {
        return this.api.getTags().catch(function () { return []; });
    }.property()

  , disableSubmit : function () {
        return !this.get('displayHref') || this.get('pendingAction');
    }.property('displayHref', 'pendingAction')

  , pendingAction: function () {
        return this.get('pendingSave') || this.get('pendingDelete');
    }.property('pendingSave', 'pendingDelete')

  , showDelete : function () {
        return this.get('model.id');
    }.property('model.id')

  , updateUrlMeta : function () {
        var href = this.get('displayHref');

        if (!href) {
            this.set('model', {});
            return;
        }

        if (this.get('pendingAction')) {
            return;
        }

        this.set('pendingMeta', true);
        this.api.urlMeta(href).then(function (response) {
            if (response.data.href !== this.get('href') && href === this.get('displayHref')) {
                this.set('model', response.data);
            }
        }.bind(this)).catch(function (response) {
            console.log(response.error);
        }).finally(function () {
            this.set('pendingMeta', false);
        }.bind(this));
    }

  , urlActionDone: function (data, action) {
        this.get('target').send(action, data);
        this.set('model', {});
        this.set('displayHref', null);
        this.trigger(action.toLowerCase(), data);
    }

  , actions: {
        save: function () {
            this.set('pendingSave', true);
            this.set('model.userEntered', this.get('displayHref'));
            this.api.saveUrl(this.get('model'))
               .then(function (response) {
                    this.urlActionDone(response.data, 'urlUpdated');
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
            this.set('pendingDelete', true);
            this.api.deleteUrl(this.get('model'))
               .then(function () {
                    this.urlActionDone(this.get('model'), 'urlDeleted');
                }.bind(this))
               .catch(function (response) {
                    console.log(response);
                }.bind(this))
               .finally(function () {
                    this.set('pendingDelete', false);
                }.bind(this));
        }

      , getUrlMeta: function () {
            this.updateUrlMeta();
        }

      , getUrlMetaSlow: function () {
            Ember.run.debounce(this, this.updateUrlMeta, 300);
        }

      , removeTag: function (tag) {
            this.api.deleteTag(tag);
        }
    }
});
