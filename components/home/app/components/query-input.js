export default Ember.Component.extend({
    tagName           : 'div'
  , classNames        : [ 'query-input', 'row', 'collapse' ]
  , attributeBindings : [ 'type', 'data-role', 'value', 'tags', 'enterAction' ]
  , enterAction       : null
  , value             : null
  , placeholder       : null
  , multiple          : true
  , layoutName        : 'query-input'
  , inputSelector     : 'input.query-input'

  , init: function () {
        this._super();
        this.addObserver('value', this, function () {
            this.set('queryValue', this.get('value'));
            this.sendEnterAction();
        });
    }

  , queryValue: function (key, value) {
        if (value) {
            this.$(this.inputSelector).val(value);
        } else {
            return this.$(this.inputSelector).val();
        }
    }.property().volatile()

  , keyDown: function (e) {
        if (e.keyCode === 13) {
            this.sendEnterAction();
        }
    }

  , sendEnterAction: function () {
        this.sendAction('action', this.get('queryValue'));
    }

  , didInsertElement: function () {
        this.get('tags').then(function (response) {
            var $input = this.$(this.inputSelector)
              , tags   = response.data;

            $input.textcomplete([{
                match  : /\B#([\-\w]*)$/
              , search : function (term, callback) {
                    callback($.map(tags, function (tag) {
                        return tag.indexOf(term.toLowerCase()) !== -1 ? tag : null;
                    }));
                }
              , template: function (value) {
                    return value;
                }
              , replace : function (value) {
                    return '#' + value;
                }
              , index : 1
            }], { placement: '' });
        }.bind(this));
    }

  , actions: {
        clearSearch: function () {
            this.set('queryValue', '');
            this.sendEnterAction();
        }
      , runSearch: function () {
            this.sendEnterAction();
        }
    }
});
