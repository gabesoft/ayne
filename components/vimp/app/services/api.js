import Api from 'core/app/services/api';

export default Api.extend({
    getVplugs : function (query) {
        var fields = [
                'author'
              , 'description'
              , 'githubStarCount'
              , 'githubHtmlUrl'
              , 'githubCreatedAt'
              , 'githubPushedAt'
              , 'name'
              , 'hasDoc'
              , 'hasReadme'
              , 'isPlugin'
            ];

        query = Ember.$.extend({}
          , {
                sort   : 'githubStarCount:desc'
              , limit  : 100
              , hasDoc : true
              , fields : fields.join('~')
            }
          , query);

        return this.runGet('/api/vplugs', query);
    }
  , getVplug : function (id) {
        return this.runGet('/api/vplugs/' + id);
    }
  , getVplugKeywords : function () {
        return this.runGet('/api/vplugkeywords');
    }
});
