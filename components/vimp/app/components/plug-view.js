export default Ember.Component.extend({
    layoutName: 'plug-view',
    zeroClient: null,
    copyCloneUrlClass: 'fa-copy',
    copyCloneUrlTitle: 'Copy github clone url to clipboard',
    enabledCloneUrlCopy: false,

    author: function () {
        return this.get('model.author.name') || this.get('model.author.login') || this.get('model.author');
    }.property('model'),
    createdAt: function () {
        return moment(this.get('model.githubCreatedAt')).fromNow();
    }.property('model.githubCreatedAt'),
    pushedAt: function () {
        return moment(this.get('model.githubPushedAt')).fromNow();
    }.property('model.githubPushedAt'),

    actions: {
        showModal: function () {
            this.sendAction('showModal', 'details-dialog', this.get('model'));
        }
    },

    didInsertElement: function () {
        var id = this.get('model.id') + '-copy-clone-url-button',
            button = this.$('[data-id=' + id + ']'),
            client = new ZeroClipboard(button.first());

        client.on('ready', function () {
            this.set('enabledCloneUrlCopy', true);
        }.bind(this));

        client.on('aftercopy', function () {
            this.set('copyCloneUrlTitle', 'Copied');
            this.set('copyCloneUrlClass', 'fa-check-square-o');

            Ember.run.later(function () {
                this.set('copyCloneUrlClass', 'fa-copy');
                this.set('copyCloneUrlTitle', 'Copy github clone url to clipboard');
            }.bind(this), 1000);
        }.bind(this));

        this.set('zeroClient', client);
    },

    willDestroyElement: function () {
        var client = this.get('zeroClient');

        if (client) {
            client.destroy();
        }
    }
});