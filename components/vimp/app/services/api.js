import Api from 'core/app/services/api';

export default Api.extend({
    getVplugs: function (query) {
        var fields = [
            'author',
            'description',
            'githubStarCount',
            'githubHtmlUrl',
            'githubCreatedAt',
            'githubPushedAt',
            'githubCloneUrl',
            'name',
            'hasDoc',
            'hasReadme',
            'isPlugin'
        ];

        query = Ember.$.extend({}, {
            sort: 'githubStarCount:desc',
            limit: 80,
            isPlugin: '0.25',
            fields: fields.join('~')
        }, query);

        return this.runGet('/api/vplugs', query);
    },
    getLastUpdated: function () {
        return this.getVplugs({ limit: 30, sort: 'githubPushedAt:desc' });
    },
    getMostStarred: function () {
        return this.getVplugs({ limit: 30 });
    },
    getVplug: function (id) {
        return this.runGet('/api/vplugs/' + id);
    },
    getVplugKeywords: function () {
        return this.runGet('/api/vplugkeywords');
    }
});