export default Ember.ObjectController.extend({
    queryParams : ['code']
  , code        : null
  , disableCopy : true
  , copyLabel   : 'Copy to clipboard'
  , codeParam   : function () {
        return 'text=' + this.get('code');
    }.property('code')
});
