import Api from 'core/app/services/api';

export default Api.extend({
    getVplugs : function (query) {
        var fields = [ 'author', 'description', 'githubStarCount', 'githubUrl', 'name', 'hasDoc', 'hasReadme' ];

        query = Ember.$.extend({}
          , {
                sort   : 'githubStarCount:desc'
              , limit  : 50
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
