export default Ember.Controller.extend({
    needs         : ['application']
  , searchPending : false
  , queryError    : null
  , queryParams   : [ 'search' ]
  , search        : null
  , keywords      : function () {
        return this.api.getVplugKeywords().catch(function () { return []; });
    }.property()

  , searchHelp : function () {
        return [
            'Multiple words are ORed.',
            'Enclose the words in quotes to AND them.',
            'For phrase search enclose the entire phrase in quotes',
            'To exclude a word prefix it by -'
        ].join(' ');
    }.property()

  , actions : {
        searchPlugs : function (query) {
            this.set('searchPending', true);
            this.set('queryError', null);
            this.api.getVplugs({ search : query })
               .then(function (response) {
                    this.set('model', response.data);
                    this.set('lastQuery', query + ' ' + response.data.length);
                }.bind(this))
               .catch(function (response) {
                    this.set('queryError', (response.json || {}).message);
                }.bind(this))
               .finally(function () {
                    this.set('searchPending', false);
                }.bind(this));
        }
    }
});
