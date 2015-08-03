export default Ember.Controller.extend({
    tagsData: function () {
        return this.api.getTags().catch(function () { return []; });
    }.property('parentController.tagsData'),
    actions: {
        urlClick: function (url) {
            this.incrementProperty('model.clickCount');
            this.api.saveUrl(url);
        },
        removeTag: function (tag) {
            this.api.deleteTag(tag);
        },
        saveUrl: function (url) {
            this.api.saveUrl(url).catch(function (response) {
                console.log(response);
            });
        },
        deleteUrl: function (url) {
            this.api.deleteUrl(url)
                .then(function () {
                    this.get('target').send('urlDeleted', this.get('model'));
                }.bind(this))
                .catch(function (response) {
                    console.log(response);
                });
        },
        popupInfoOn: function () {
            this.set('showPopup', true);
            this.set('popupEditOn', false);
        },
        popupOff: function () {
            this.set('showPopup', false);
        },
        toggleEditPopup: function () {
            this.toggleProperty('showPopup');
            this.set('popupEditOn', this.get('showPopup'));
        }
    }
});