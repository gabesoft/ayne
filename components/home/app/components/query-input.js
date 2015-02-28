export default Ember.Component.extend({
    tagName           : 'div'
  , classNames        : [ 'query-input', 'row', 'collapse' ]
  , attributeBindings : [ 'type', 'data-role', 'value', 'tags', 'pending' ]
  , value             : null
  , pending           : false
  , placeholder       : null
  , multiple          : true
  , layoutName        : 'query-input'
  , inputSelector     : 'input'

  , init: function () {
        this._super();
        this.addObserver('value', this, function () {
            this.set('_value', this.get('value'));
        });
    }

  , _value: function (key, value) {
        if (arguments.length > 1) {
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
        this.sendAction('action', this.get('_value'));
    }

  , didInsertElement: function () {
        this.get('tags').then(function (response) {
            var $input = this.$(this.inputSelector)
              , tags   = response.data;

            $input.textcomplete([{
                match  : /\B#([\-\w]*)$/
              , search : function (term, callback) {
                    callback($.map(tags, function (tag) {
                        var matches  = tag.indexOf(term.toLowerCase()) !== -1
                          , contains = matches && (tag.length > term.length);
                        return contains ? tag : null;
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
            this.set('value', '');
            this.set('_value', '');
            this.sendEnterAction();
        }
      , runSearch: function () {
            this.sendEnterAction();
        }
    }
});
