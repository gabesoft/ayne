import Base from 'core/app/components/query-input-base';
import Keys from 'core/app/mixins/keys';

export default Base.extend(Keys, {
    triggerRegex: /\b(\w{2,})$/,
    init: function () {
        this._super();
    },
    matchTemplate: function (value) {
        return value;
    },
    matchReplace: function (value) {
        return value + ' ';
    },

    _value: Ember.computed({
        get: function () {
            return this.$('input').val();
        },
        set: function (key, value) {
            this.$('input').val(value);
            return value;
        }
    }),

    didInsertElement: function () {
        if (!this.get('tags')) {
            return;
        }

        this.get('tags').then(function (response) {
            var $input = this.$('input'),
                keywords = response.data,
                engine = null;

            engine = new Bloodhound({
                value: 'keywords',
                datumTokenizer: Bloodhound.tokenizers.obj.nonword('name'),
                queryTokenizer: Bloodhound.tokenizers.nonword,
                local: keywords,
                limit: 15,
                sorter: function (a, b) {
                    if (a.value < b.value) {
                        return -1;
                    } else if (a.value > b.value) {
                        return 1;
                    } else {
                        return 0;
                    }
                }
            });

            engine.initialize();

            $input.typeahead({
                highlight: true,
                hint: true,
                minLength: 1,
                autoselect: false
            }, {
                source: engine.ttAdapter(),
                value: 'keywords',
                display: 'name',
                valueKey: 'name',
                templates: {
                    suggestion: function (data) {
                        var view = this.container.lookup('component:dropdown-suggestion');

                        view.set('model', data);
                        view.createElement();

                        return view.element.outerHTML;
                    }.bind(this)
                }
            }).on('keydown', function (e) {
                var keyCode = e.keyCode || e.which;

                if (keyCode === this.get('keys.ENTER')) {
                    $input.typeahead('close');
                }
            }.bind(this));
        }.bind(this));
    },

    willDestroyElement: function () {
        this.$('input').typeahead('destroy');
    }
});
