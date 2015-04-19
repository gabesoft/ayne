export default Ember.Controller.extend({
    queryParams : ['code']
  , code        : null
  , disableCopy : true
  , copyLabel   : 'Copy to clipboard'
  , copyClass   : 'fa-clipboard'
});
