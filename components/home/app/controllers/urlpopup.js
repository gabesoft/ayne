export default Ember.Controller.extend({
    model: {},
    copyClass: 'fa-copy',
    copyTitle: 'Copy url to clipboard',
    privacyChanged: false,
    editOn: false,
    disableCopy: true,
    userEnteredLink: function () {
        var url = this.get('model.userEntered') || '';
        return url.match(/^https?:/) ? url : 'http://' + url;
    }.property('model.userEntered'),
    tagsData: function () {
        return this.get('parentController.tagsData');
    }.property('parentController.tagsData'),
    privacyTitle: function () {
        return this.get('model.private') ? 'Private' : 'Public';
    }.property('model.private'),
    actions: {
        toggleEdit: function () {
            this.toggleProperty('editOn');
        },
        togglePrivacy: function () {
            this.toggleProperty('model.private');
            this.set('privacyChanged', true);
        },
        saveUrl: function () {
            if (this.get('editOn') || this.get('privacyChanged')) {
                this.api.saveUrl(this.get('model')).catch(function (response) {
                    console.log(response);
                });
            }
        },
        urlClick: function () {
            this.incrementProperty('model.clickCount');
            this.api.saveUrl(this.get('model'));
        },
        deleteUrl: function () {
            this.api.deleteUrl(this.get('model'))
                .then(function () {
                    this.get('target').send('urlDeleted', this.get('model'));
                }.bind(this))
                .catch(function (response) {
                    console.log(response);
                });
        },
        removeTag: function (tag) {
            this.api.deleteTag(tag);
        }
    }
});