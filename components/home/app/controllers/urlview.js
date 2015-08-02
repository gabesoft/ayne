export default Ember.Controller.extend({
    tagsData: function () {
        return this.api.getTags().catch(function () { return []; });
    }.property('parentController.tagsData'),
    actions: {
        urlClick: function () {
            this.incrementProperty('model.clickCount');
            this.api.saveUrl(this.get('model'));
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
        }
    }
});