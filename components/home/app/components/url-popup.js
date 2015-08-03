export default Ember.Component.extend({
    zeroClient: null,
    layoutName: 'url-popup',
    copyClass: 'fa-copy',
    copyTitle: 'Copy url to clipboard',
    privacyChanged: false,
    editOn: false,
    disableCopy: true,
    userEnteredLink: function () {
        var url = this.get('model.userEntered') || '';
        return url.match(/^https?:/) ? url : 'http://' + url;
    }.property('model.userEntered'),
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
        removeTag: function (tag) {
            this.sendAction('removeTag', tag);
        },
        deleteUrl: function () {
            this.sendAction('deleteUrl', this.get('model'));
        },
        close: function () {
            this.sendAction('popupOff');
        }
    },
    didInsertElement: function () {
        Ember.run.later(function () {
            var $popup = this.$('.url-popup');
            if ($popup) {
                $popup.removeAttr('hidden');
            }
        }.bind(this), 200);

        var button = document.getElementById('copy-url-button'),
            client = new ZeroClipboard(button);

        client.on('ready', function () {
            this.set('disableCopy', false);
        }.bind(this));

        client.on('aftercopy', function () {
            this.set('copyTitle', 'Copied');
            this.set('copyClass', 'fa-check-square-o');
            this.set('disableCopy', true);
        }.bind(this));

        client.on('error', function (e) {
            console.log('copy failed', e);
            client.destroy();
        });

        this.set('zeroClient', client);

        this.$().on('click', 'a.original-link', function () {
            this.sendAction('urlClick');
        }.bind(this));
    },
    willDestroyElement: function () {
        var client = this.get('zeroClient');

        if (client) {
            client.destroy();
        }

        this.sendAction('saveUrl', this.get('model'));
    }
});