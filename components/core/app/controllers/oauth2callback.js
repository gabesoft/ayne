export default Ember.ObjectController.extend({
    queryParams : ['code']
  , code        : null
  , disableCopy : true
  , copyLabel   : 'Copy to clipboard'
  , copyClass   : 'fa-clipboard'
});
