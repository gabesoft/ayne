export default Ember.Component.extend({
    tagName: 'div',
    classNames: ['query-input', 'row', 'collapse'],
    attributeBindings: ['type', 'data-role', 'value', 'tags', 'pending', 'error'],
    value: null,
    error: null,
    pending: false,
    placeholder: null,
    multiple: true,
    layoutName: 'query-input',

    _value: Ember.computed({
        get: function () {
            return this.$('input').val();
        },
        set: function (key, value) {
            this.$('input').val(value);
            return value;
        }
    }),

    init: function () {
        this._super();
        this.addObserver('value', this, function () {
            this.set('_value', this.get('value'));
        });
    },

    keyDown: function (e) {
        if (e.keyCode === 13) {
            this.sendEnterAction();
        }
    },

    sendEnterAction: function () {
        this.sendAction('action', this.get('_value'));
    },

    sendClearAction: function () {
        this.sendAction('clear');
    },

    didInsertElement: function () {
        // TODO: rename tags to keywords
        if (!this.get('tags')) {
            return;
        }

        this.get('tags').then(function (response) {
            var $input = this.$('input'),
                tags = response.data;

            $input.textcomplete([{
                match: this.get('triggerRegex'),
                search: function (term, callback) {
                    callback($.map(tags, function (tag) {
                        var matches = tag.indexOf(term.toLowerCase()) !== -1,
                            contains = matches && (tag.length > term.length);
                        return contains ? tag : null;
                    }));
                },
                template: this.matchTemplate,
                replace: this.matchReplace,
                index: 1
            }], {
                placement: ''
            });
        }.bind(this));
    },

    actions: {
        clearSearch: function () {
            this.set('value', '');
            this.set('_value', '');
            this.sendEnterAction();
            this.sendClearAction();
        },
        runSearch: function () {
            this.sendEnterAction();
        }
    }
});