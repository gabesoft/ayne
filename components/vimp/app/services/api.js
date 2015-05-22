import Api from 'core/app/services/api';

export default Api.extend({
    getVplugs : function (query) {
        var fields = [ 'author', 'description', 'githubStarCount', 'githubUrl', 'name', 'isPlugin' ];

        query = Ember.$.extend({}
          , {
                sort     : 'githubStarCount:desc'
              , limit    : 1000
              , isPlugin : true
              , fields   : fields.join('~')
            }
          , query);

        return this.runGet('/api/vplugs', query);
    }
  , getVplugKeywords : function () {
        return this.runGet('/api/vplugkeywords');
    }
});
