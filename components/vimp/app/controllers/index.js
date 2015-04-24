export default Ember.Controller.extend({
    needs         : ['application']
  , searchPending : false
  , queryError    : null
  , keywords      : function () {
        return this.api.getVplugKeywords()
           .then(function (response) {
                var data = response.data.map(function (keyword) {
                    return keyword.name;
                });
                return { data : data };
            })
           .catch(function () { return []; });
    }.property()

  , actions : {
        searchPlugs : function (query) {
            this.set('searchPending', true);
            this.set('queryError', null);
            this.api.getVplugs({ search : query })
               .then(function (response) {
                    this.set('model', response.data);
                }.bind(this))
               .catch(function (response) {
                    this.set('queryError', (response.json || {}).message);
                }.bind(this))
               .finally(function () {
                    this.set('searchPending', false);
                }.bind(this))
        }
    }
});
