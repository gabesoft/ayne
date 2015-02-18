export default Ember.Component.extend({
    tagName           : 'input'
  , attributeBindings : ['type', 'data-role', 'value', 'tags', 'enterAction']
  , enterAction       : null
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

  , keyDown: function (e) {
        var action = this.get('enterAction');
        if (e.keyCode === 13 && action) {
            this.get('parentView').get('controller').send(action, e);
        }
    }

  , didInsertElement: function () {
        this.get('tags').then(function (response) {
            var $input = this.$()
              , tags   = response.data;

            $input.textcomplete([{
                match  : /\B#([\-\w]*)$/
              , search : function (term, callback) {
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
