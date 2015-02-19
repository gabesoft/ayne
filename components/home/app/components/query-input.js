export default Ember.Component.extend({
    tagName           : 'div'
  , classNames        : [ 'row', 'collapse' ]
  , attributeBindings : ['type', 'data-role', 'value', 'tags', 'enterAction']
  , enterAction       : null
  , value             : null
  , placeholder       : null
  , multiple          : true
  , layoutName        : 'query-input'
  , inputSelector     : 'input.query-input'

  , init: function () {
        this._super();
    }

  , keyUp: function () {
        this.set('value', this.$(this.inputSelector).val());
    }

  , sendEnterAction: function () {
        var action = this.get('enterAction');
        if (action) {
            this.get('parentView').get('controller').send(action);
        }
    }

  , keyDown: function (e) {
        if (e.keyCode === 13) {
            this.sendEnterAction();
        }
    }

  , didInsertElement: function () {
        this.get('tags').then(function (response) {
            var $input = this.$(this.inputSelector)
              , tags   = response.data;

            $input.textcomplete([{
                match  : /\B#([\-\w]*)$/
              , search : function (term, callback) {
                    callback($.map(tags, function (tag) {
                        return tag.indexOf(term.toLowerCase()) === 0 ? tag : null;
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
            Ember.run.later(this.sendEnterAction.bind(this), 100);
        }
    }
});
