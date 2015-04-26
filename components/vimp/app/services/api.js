import Api from 'core/app/services/api';

export default Api.extend({
    getVplugs : function (query) {
        query = Ember.$.extend({}
          , { sort : 'githubStarCount:desc', limit : 1000 }
          , query);
        return this.runGet('/api/vplugs', query);
    }
  , getVplugKeywords : function () {
        return this.runGet('/api/vplugkeywords');
    }
});
