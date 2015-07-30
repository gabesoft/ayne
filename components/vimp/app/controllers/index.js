export default Ember.Controller.extend({
    searchPending: false,
    queryError: null,
    queryParams: ['search'],
    search: null,
    application: Ember.inject.controller(),
    keywords: function () {
        return this.api.getVplugKeywords().catch(function () {
            return [];
        });
    }.property(),
    makeLocalKey: function (name) {
        var id = this.auth.get('user.id') || '';
        return id + '-' + name;
    },
    saveLocalValue: function (name, value) {
        if (this.auth.get('loggedIn')) {
            this.local.set(this.makeLocalKey(name), value);
        }
    },
    sidebarActive: function (name, defVal) {
        if (!this.auth.get('loggedIn')) {
            return defVal;
        }

        var key = this.makeLocalKey(name);

        if (this.local.has(key)) {
            return this.local.get(key);
        } else {
            return defVal;
        }
    },
    lastUpdatedActive: function () {
        return this.sidebarActive('last-updated', true);
    }.property(),
    mostStarredActive: function () {
        return this.sidebarActive('most-starred', false);
    }.property('lastUpdatedActive'),
    searchHelp: function () {
        return [
            'Multiple words are ORed.',
            'Enclose the words in quotes to AND them.',
            'For phrase search enclose the entire phrase in quotes',
            'To exclude a word prefix it by -'
        ].join(' ');
    }.property(),
    actions: {
        searchPlugs: function (query) {
            this.set('searchPending', true);
            this.set('queryError', null);
            this.api.getVplugs({
                search: query
            })
                .then(function (response) {
                    this.set('model.plugins', response.data);
                    this.set('search', query);
                }.bind(this))
                .catch(function (response) {
                    this.set('queryError', (response.json || {}).message);
                }.bind(this))
                .finally(function () {
                    this.set('searchPending', false);
                }.bind(this));
        },
        updateMostStarred: function (active) {
            this.saveLocalValue('most-starred', active);
        },
        updateLastUpdated: function (active) {
            this.saveLocalValue('last-updated', active);
        }
    }
});