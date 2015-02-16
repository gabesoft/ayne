export default Ember.Component.extend({
    tagName           : 'input'
  , attributeBindings : ['type', 'data-role', 'value', 'tags']
  , type              : 'text'
  , value             : null
  , className         : 'query-input'
  , placeholder       : null
  , multiple          : true

  , init: function () {
        this._super();
    }

  , keyUp: function () {
        this.set('value', this.$().val());
    }

  , didInsertElement: function () {
        this.get('tags').then(function (response) {
            var $input = this.$()
              , tags   = response.data;

            $input.textcomplete([{
                match  : /\B#([\-\w]*)$/
              , search : function (term, callback) {
                    // TODO: use Bloodhound here (if necessary)
                    callback($.map(tags, function (tag) {
                        return tag.indexOf(term) === 0 ? tag : null;
                    }));
                }
              , template: function (value) {
                    return value;
                }
              , replace : function (value) {
                    return '#' + value;
                }
              , index : 1
            }]);
        }.bind(this));
    }
});
