export default Ember.Controller.extend({
    needs         : ['application']
  , searchPending : false
  , queryError    : null

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
